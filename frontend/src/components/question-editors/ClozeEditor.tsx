import React, { useState } from 'react'
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragEndEvent,
  DragStartEvent,
  DragOverlay
} from '@dnd-kit/core'
import { 
  SortableContext, 
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates 
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ClozeQuestion } from '../../types/form'
import { toast } from 'react-hot-toast'
import { Trash2, GripVertical } from 'lucide-react'

interface ClozeEditorProps {
  question: ClozeQuestion
  onUpdate: (question: ClozeQuestion) => void
}

// Sortable Blank Item Component
const SortableBlankItem = ({ 
  blank, 
  index, 
  onBlankChange, 
  onRemoveBlank 
}: { 
  blank: string, 
  index: number, 
  onBlankChange: (index: number, value: string) => void,
  onRemoveBlank: (index: number) => void
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: `blank-${index}` })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`flex items-center space-x-2 ${isDragging ? 'shadow-lg' : ''}`}
    >
      <div 
        {...attributes} 
        {...listeners} 
        className="cursor-move text-gray-500 touch-none"
      >
        <GripVertical size={20} />
      </div>
      <input
        type="text"
        value={blank}
        onChange={(e) => onBlankChange(index, e.target.value)}
        className="flex-grow p-2 border rounded focus:ring-2 focus:ring-blue-300 transition-all"
        placeholder={`Blank ${index + 1}`}
      />
      <button
        type="button"
        onClick={() => onRemoveBlank(index)}
        className="text-red-500 hover:text-red-700 transition-colors"
        title="Remove Blank"
      >
        <Trash2 size={20} />
      </button>
    </div>
  )
}

const ClozeEditor: React.FC<ClozeEditorProps> = ({ question, onUpdate }) => {
  const [localBlanks, setLocalBlanks] = useState(question.blanks)
  const [activeId, setActiveId] = useState<string | null>(null)

  // Sensor configuration for improved drag experience
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Slight movement required to start dragging
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({
      ...question,
      text: e.target.value,
    })
  }

  const handleBlankChange = (index: number, value: string) => {
    const newBlanks = [...localBlanks]
    newBlanks[index] = value
    setLocalBlanks(newBlanks)
    onUpdate({
      ...question,
      blanks: newBlanks,
    })
  }

  const addBlank = () => {
    const placeholderCount = (question.text.match(/\[\.\.\.\]/g) || []).length
    
    if (placeholderCount <= localBlanks.length) {
      toast.error('Please add more [...] placeholders in the text before adding new blanks.')
      return
    }
// console.log("placeholderCount: ", placeholderCount)
// console.log("localBlanks: ", localBlanks.length)
    const newBlanks = [...localBlanks, '']
    setLocalBlanks(newBlanks)
    onUpdate({
      ...question,
      blanks: newBlanks,
    })
  }

  const removeBlank = (indexToRemove: number) => {
    const newBlanks = localBlanks.filter((_, index) => index !== indexToRemove)
    setLocalBlanks(newBlanks)
    onUpdate({
      ...question,
      blanks: newBlanks,
    })
    toast.success('Blank removed successfully')
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (active.id !== over?.id) {
      setLocalBlanks((items) => {
        const oldIndex = items.findIndex(item => `blank-${items.indexOf(item)}` === active.id)
        const newIndex = items.findIndex(item => `blank-${items.indexOf(item)}` === over?.id)
        
        const reorderedItems = arrayMove(items, oldIndex, newIndex)
        onUpdate({
          ...question,
          blanks: reorderedItems,
        })
        return reorderedItems
      })
    }
    
    setActiveId(null)
  }

  const validateBlanks = () => {
    const placeholderCount = (question.text.match(/\[\.\.\.\]/g) || []).length
    const blankCount = localBlanks.length

    if (placeholderCount !== blankCount) {
      toast.error(`Number of blanks (${blankCount}) does not match placeholders (${placeholderCount}) in the text.`)
      return false
    }

    const hasEmptyBlanks = localBlanks.some(blank => blank.trim() === '')
    if (hasEmptyBlanks) {
      toast.error('Please fill in all blanks before proceeding.')
      return false
    }

    return true
  }

  return (
    <div className="space-y-4">
      <textarea
        value={question.text}
        onChange={handleTextChange}
        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 transition-all"
        rows={4}
        placeholder="Enter cloze text (use [...] for blanks)"
      />
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium">Blanks</h4>
          <button
            type="button"
            onClick={addBlank}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
          >
            Add Blank
          </button>
        </div>

        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={localBlanks.map((_, index) => `blank-${index}`)} 
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {localBlanks.map((blank, index) => (
                <SortableBlankItem
                  key={`blank-${index}`}
                  blank={blank}
                  index={index}
                  onBlankChange={handleBlankChange}
                  onRemoveBlank={removeBlank}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeId ? (
              <div className="bg-white border rounded shadow-lg p-2">
                <input
                  type="text"
                  value={localBlanks[Number(activeId.split('-')[1])]}
                  readOnly
                  className="w-full p-2 border rounded"
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <div className="text-sm text-gray-600 mt-2">
        <strong>Tips:</strong>
        <ul className="list-disc list-inside">
          <li>Drag and drop blanks to reorder them</li>
          <li>Click trash icon to remove a blank</li>
          <li>Ensure number of [...] matches number of blanks</li>
        </ul>
      </div>
    </div>
  )
}

export default ClozeEditor
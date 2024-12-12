import React, { useState } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CategorizeQuestion } from '../../types/form'

interface CategorizePreviewProps {
  question: CategorizeQuestion
  answer: Record<string, string[]> | undefined;
  onAnswerChange: (answer: Record<string, string[]>) => void
  error?: string
}

const SortableItem = ({ id, item }: { id: string; item: string }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-2 mb-2 rounded shadow cursor-move"
    >
      {item}
    </li>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CategorizePreview: React.FC<CategorizePreviewProps> = ({ question, answer, onAnswerChange, error }) => {
  const [items, setItems] = useState(question.items)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.text === active.id)
      const newIndex = items.findIndex((item) => item.text === over.id)
      const newItems = [...items]
      const [movedItem] = newItems.splice(oldIndex, 1)
      newItems.splice(newIndex, 0, movedItem)
      setItems(newItems)

      const newAnswer = question.categories.reduce((acc, category) => {
        acc[category] = newItems.filter((item) => item.category === category).map((item) => item.text)
        return acc
      }, {} as Record<string, string[]>)
      onAnswerChange(newAnswer)
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex flex-wrap -mx-2">
          {question.categories.map((category) => (
            <div key={category} className="w-full sm:w-1/2 md:w-1/3 px-2 mb-4">
              <h4 className="font-medium mb-2">{category}</h4>
              <SortableContext items={items.filter((item) => item.category === category).map((item) => item.text)} strategy={verticalListSortingStrategy}>
                <ul className="min-h-[100px] bg-gray-100 p-2 rounded">
                  {items
                    .filter((item) => item.category === category)
                    .map((item) => (
                      <SortableItem key={item.text} id={item.text} item={item.text} />
                    ))}
                </ul>
              </SortableContext>
            </div>
          ))}
        </div>
      </DndContext>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  )
}

export default CategorizePreview


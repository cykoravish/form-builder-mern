
import React, { useState, useCallback, useMemo } from 'react'

import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 

  DragOverlay,

} from '@dnd-kit/core'
import { 
  SortableContext, 
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates 
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'


const DraggableOption = ({ id, children, isDragging }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }

  return (
    <span
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={`
        bg-blue-100 px-2 py-1 rounded cursor-move inline-block m-1
        ${isDragging ? 'opacity-50' : ''}
        max-w-[200px]
      `}
    >
      {children}
    </span>
  );
};

const ClozePreview = ({ 
  question, 
  answer, 
  onAnswerChange, 
  error 
}) => {
  // Initialize state with options from the question
  const [blanks, setBlanks] = useState(
    answer || question.blanks.map(() => '')
  );
  
  // Track used options separately
  const [usedOptions, setUsedOptions] = useState([]);

  // Compute available options
  const availableOptions = useMemo(() => {
    return question.blanks.filter(option => !usedOptions.includes(option));
  }, [question.blanks, usedOptions]);

  const [activeId, setActiveId] = useState(null);

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Callback to handle answer changes
  const handleAnswerChange = useCallback((newBlanks) => {
    onAnswerChange(newBlanks);
  }, [onAnswerChange]);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    const draggedOption = active.id;

    if (over) {
      const blankIndex = blanks.findIndex(blank => blank === '');
      const existingIndex = blanks.findIndex(blank => blank === draggedOption);
      
      if (blankIndex !== -1 && existingIndex === -1) {
        // Update blanks
        const newBlanks = [...blanks];
        newBlanks[blankIndex] = draggedOption;
        setBlanks(newBlanks);

        // Track used options
        setUsedOptions(prev => [...prev, draggedOption]);

        // Trigger parent component update
        handleAnswerChange(newBlanks);
      }
    }

    setActiveId(null);
  };

  // New method to handle rearranging filled blanks
  const handleBlankDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeIndex = blanks.findIndex(item => item === active.id);
      const overIndex = blanks.findIndex(item => item === over.id);

      if (activeIndex !== -1 && overIndex !== -1) {
        const newBlanks = arrayMove(blanks, activeIndex, overIndex);
        setBlanks(newBlanks);
        handleAnswerChange(newBlanks);
      }
    }
  };

  const renderClozeText = () => {
    const parts = question.text.split(/\[\.\.\.]/g);
    return (
      <div>
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            {part}
            {index < blanks.length && (
              <span
                className="border-b-2 border-gray-300 inline-block min-w-[100px] min-h-[30px] align-bottom mx-1"
              >
                {blanks[index] ? (
                  <DraggableOption 
                    key={blanks[index]} 
                    id={blanks[index]}
                  >
                    {blanks[index]}
                  </DraggableOption>
                ) : null}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCenter} 
      onDragStart={handleDragStart} 
      onDragEnd={(event) => {
        // Determine which drag end handler to use
        if (blanks.includes(event.active.id)) {
          handleBlankDragEnd(event);
        } else {
          handleDragEnd(event);
        }
      }}
    >
      <div>
        <div className="mb-4 text-lg leading-relaxed">
          {renderClozeText()}
        </div>
        
        <div className="mt-4">
          <h4 className="font-medium mb-2">Options:</h4>
          <SortableContext items={availableOptions}>
            <div className="flex flex-wrap gap-2">
              {availableOptions.map((option) => (
                <DraggableOption 
                  key={option} 
                  id={option}
                  isDragging={activeId === option}
                >
                  {option}
                </DraggableOption>
              ))}
            </div>
          </SortableContext>
        </div>

        <DragOverlay>
          {activeId ? (
            <span 
              className="bg-blue-100 px-2 py-1 rounded cursor-move inline-block m-1"
              style={{
                whiteSpace: 'nowrap',
                maxWidth: '200px',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {activeId}
            </span>
          ) : null}
        </DragOverlay>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </DndContext>
  );
};

export default ClozePreview;
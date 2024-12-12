import React, { useState, useEffect } from 'react'
import { ClozeQuestion } from '../../types/form'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragOverlay } from '@dnd-kit/core'
import { SortableContext, useSortable, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface ClozePreviewProps {
  question: ClozeQuestion
  answer: string[]
  onAnswerChange: (answer: string[]) => void
  error?: string
}

const DraggableOption: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
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
  };

  return (
    <span
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="bg-blue-100 px-2 py-1 rounded cursor-move inline-block m-1"
    >
      {children}
    </span>
  );
};

const ClozePreview: React.FC<ClozePreviewProps> = ({ question, answer, onAnswerChange, error }) => {
  const [blanks, setBlanks] = useState<string[]>(answer || question.blanks.map(() => ''));
  const [options, setOptions] = useState<string[]>(question.options || []);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (JSON.stringify(blanks) !== JSON.stringify(answer)) {
      onAnswerChange(blanks);
    }
  }, [blanks, answer, onAnswerChange]);

  const handleDragStart = (event: DragEndEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeIndex = options.indexOf(active.id as string);
      const overIndex = blanks.findIndex(blank => blank === over.id);

      if (activeIndex !== -1 && overIndex !== -1) {
        setBlanks(prev => {
          const newBlanks = [...prev];
          newBlanks[overIndex] = active.id as string;
          return newBlanks;
        });

        setOptions(prev => prev.filter(option => option !== active.id));
      }
    }
    setActiveId(null);
  };

  const renderClozeText = () => {
    const parts = question.text.split(/\[\.\.\.]/g);
    return (
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <SortableContext items={blanks}>
          {parts.map((part, index) => (
            <React.Fragment key={index}>
              {part}
              {index < blanks.length && (
                <span
                  className="border-b-2 border-gray-300 inline-block min-w-[100px] min-h-[30px] align-bottom mx-1"
                >
                  {blanks[index] ? (
                    <DraggableOption id={blanks[index]}>{blanks[index]}</DraggableOption>
                  ) : null}
                </span>
              )}
            </React.Fragment>
          ))}
        </SortableContext>
        <DragOverlay>
          {activeId ? (
            <span className="bg-blue-100 px-2 py-1 rounded cursor-move inline-block m-1">
              {activeId}
            </span>
          ) : null}
        </DragOverlay>
      </DndContext>
    );
  };

  return (
    <div>
      <div className="mb-4 text-lg leading-relaxed">{renderClozeText()}</div>
      <div className="mt-4">
        <h4 className="font-medium mb-2">Options:</h4>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <SortableContext items={options}>
            {options.map((option) => (
              <DraggableOption key={option} id={option}>
                {option}
              </DraggableOption>
            ))}
          </SortableContext>
          <DragOverlay>
            {activeId ? (
              <span className="bg-blue-100 px-2 py-1 rounded cursor-move inline-block m-1">
                {activeId}
              </span>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default ClozePreview;


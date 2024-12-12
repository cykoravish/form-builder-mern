import React, { useState, useEffect, useMemo } from 'react'
import { CategorizeQuestion } from '../../types/form'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragOverlay } from '@dnd-kit/core'
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { SortableItem } from './SortableItem'
import { useDroppable } from '@dnd-kit/core'

interface CategorizePreviewProps {
  question: CategorizeQuestion
  answer: Record<string, string[]>
  onAnswerChange: (answer: Record<string, string[]>) => void
  error?: string
}

const Droppable: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className="min-h-[100px]">
      {children}
    </div>
  );
};

const CategorizePreview: React.FC<CategorizePreviewProps> = ({
  question,
  answer,
  onAnswerChange,
  error
}) => {
  const [categories, setCategories] = useState<Record<string, string[]>>(() => {
    const initialCategories = question.categories.reduce((acc, category) => ({ ...acc, [category]: [] }), {});
    return { ...initialCategories, uncategorized: question.items.map(item => item.text || item) };
  });
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (Object.keys(answer).length > 0) {
      setCategories(answer);
    }
  }, [answer]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragEndEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setCategories((prev) => {
        const activeCategory = Object.keys(prev).find(
          (key) => prev[key].includes(active.id as string)
        );
        const overCategory = over.id as string;

        if (activeCategory && overCategory in prev) {
          const newCategories = { ...prev };
          newCategories[activeCategory] = prev[activeCategory].filter(item => item !== active.id);
          newCategories[overCategory] = [...prev[overCategory], active.id as string];

          onAnswerChange(newCategories);
          return newCategories;
        }
        return prev;
      });
    }
    setActiveId(null);
  };

  const allItems = useMemo(() => Object.values(categories).flat(), [categories]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCenter} 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(categories).map(([category, items]) => (
            <div key={category} className="bg-gray-100 p-4 rounded-lg">
              <h4 className="font-medium mb-2">{category}</h4>
              <Droppable id={category}>
                <SortableContext items={items} strategy={verticalListSortingStrategy}>
                  <ul className="space-y-2">
                    {items.map((item) => (
                      <SortableItem key={item} id={item}>
                        {item}
                      </SortableItem>
                    ))}
                  </ul>
                </SortableContext>
              </Droppable>
            </div>
          ))}
        </div>
        <DragOverlay>
          {activeId ? (
            <div className="bg-white p-2 rounded shadow cursor-move">
              {activeId}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  )
}

export default CategorizePreview


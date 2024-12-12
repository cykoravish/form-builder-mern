import React, { useState, useEffect, useMemo } from "react";
import { CategorizeQuestion } from "../../types/form";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import { useDroppable } from "@dnd-kit/core";

interface CategorizePreviewProps {
  question: CategorizeQuestion;
  answer: Record<string, string[]>;
  onAnswerChange: (answer: Record<string, string[]>) => void;
  error?: string;
}

const Droppable: React.FC<{ id: string; children: React.ReactNode }> = ({
  id,
  children,
}) => {
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
  error,
}) => {
  // Initialize categories with all items in uncategorized
  const [categories, setCategories] = useState<Record<string, string[]>>(() => {
    const initialCategories = question.categories.reduce(
      (acc, category) => ({ ...acc, [category]: [] }),
      {}
    );
    return {
      ...initialCategories,
      uncategorized: question.items.map((item) => item.text || item),
    };
  });

  const [activeId, setActiveId] = useState<string | null>(null);

  // Update categories when answer prop changes
  useEffect(() => {
    if (Object.keys(answer).length > 0) {
      setCategories(answer);
    }
  }, [answer]);

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
  };

  // Handle drag end (drop)
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setCategories((prevCategories) => {
        // Create a deep copy of the current categories
        const newCategories = JSON.parse(JSON.stringify(prevCategories));

        // Find the source category of the dragged item
        const sourceCategory = Object.keys(newCategories).find(category => 
          newCategories[category].includes(active.id as string)
        );

        // Find the destination category
        const destinationCategory = Object.keys(newCategories).find(category => 
          category === over.id || newCategories[category].includes(over.id as string)
        );

        if (sourceCategory && destinationCategory) {
          // Remove item from source category
          newCategories[sourceCategory] = newCategories[sourceCategory].filter(
            item => item !== active.id
          );

          // Add item to destination category if not already there
          if (!newCategories[destinationCategory].includes(active.id as string)) {
            newCategories[destinationCategory].push(active.id as string);
          }

          // Trigger answer change
          onAnswerChange(newCategories);

          return newCategories;
        }

        return prevCategories;
      });
    }

    // Reset active id
    setActiveId(null);
  };

  // Handle drag over to support cross-category dragging
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setCategories((prevCategories) => {
        // Create a deep copy of the current categories
        const newCategories = JSON.parse(JSON.stringify(prevCategories));

        // Find the source category of the dragged item
        const sourceCategory = Object.keys(newCategories).find(category => 
          newCategories[category].includes(active.id as string)
        );

        // Find the destination category
        const destinationCategory = Object.keys(newCategories).find(category => 
          category === over.id || newCategories[category].includes(over.id as string)
        );

        if (sourceCategory && destinationCategory) {
          // Remove item from source category
          newCategories[sourceCategory] = newCategories[sourceCategory].filter(
            item => item !== active.id
          );

          // Add item to destination category if not already there
          if (!newCategories[destinationCategory].includes(active.id as string)) {
            newCategories[destinationCategory].push(active.id as string);
          }

          return newCategories;
        }

        return prevCategories;
      });
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(categories).map(([category, items]) => (
            <div key={category} className="bg-gray-100 p-4 rounded-lg">
              <h4 className="font-medium mb-2">{category}</h4>
              <Droppable id={category}>
                <SortableContext
                  items={items}
                  strategy={verticalListSortingStrategy}
                >
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
  );
};

export default CategorizePreview;
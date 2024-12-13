import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import { useDroppable } from "@dnd-kit/core";


// Move Droppable component before the main component
const Droppable = ({ id, children }) => {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className="min-h-[100px]">
      {children}
    </div>
  );
};


const CategorizePreview = ({ question, answer, onAnswerChange, error }) => {
 
  const [categories, setCategories] = useState(() => {
    const initialCategories = question.categories.reduce(
      (acc, category) => ({ ...acc, [category]: [] }),
      {}
    );
    return {
      ...initialCategories,
      uncategorized: question.items.map((item) => item.text || item),
    };
  });

  const [activeId, setActiveId] = useState(null);
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

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setCategories((prevCategories) => {
        const newCategories = JSON.parse(JSON.stringify(prevCategories));

        const sourceCategory = Object.keys(newCategories).find((category) =>
          newCategories[category].includes(active.id)
        );

        const destinationCategory = Object.keys(newCategories).find(
          (category) =>
            category === over.id || newCategories[category].includes(over.id)
        );

        if (sourceCategory && destinationCategory) {
          newCategories[sourceCategory] = newCategories[sourceCategory].filter(
            (item) => item !== active.id
          );

          if (!newCategories[destinationCategory].includes(active.id)) {
            newCategories[destinationCategory].push(active.id);
          }

          onAnswerChange(newCategories);

          return newCategories;
        }

        return prevCategories;
      });
    }

    setActiveId(null);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setCategories((prevCategories) => {
        const newCategories = JSON.parse(JSON.stringify(prevCategories));

        const sourceCategory = Object.keys(newCategories).find((category) =>
          newCategories[category].includes(active.id)
        );

        const destinationCategory = Object.keys(newCategories).find(
          (category) =>
            category === over.id || newCategories[category].includes(over.id)
        );

        if (sourceCategory && destinationCategory) {
          newCategories[sourceCategory] = newCategories[sourceCategory].filter(
            (item) => item !== active.id
          );

          if (!newCategories[destinationCategory].includes(active.id)) {
            newCategories[destinationCategory].push(active.id);
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

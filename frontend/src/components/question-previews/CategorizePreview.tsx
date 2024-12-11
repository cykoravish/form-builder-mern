import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { CategorizeQuestion } from '../../types/form'

interface CategorizePreviewProps {
  question: CategorizeQuestion
  answer: Record<string, string[]>
  onAnswerChange: (answer: Record<string, string[]>) => void
}

const CategorizePreview: React.FC<CategorizePreviewProps> = ({ question, answer, onAnswerChange }) => {
  const [items, setItems] = useState(question.items)

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const newItems = Array.from(items)
    const [reorderedItem] = newItems.splice(result.source.index, 1)
    newItems.splice(result.destination.index, 0, reorderedItem)

    setItems(newItems)
    const newAnswer = question.categories.reduce((acc, category) => {
      acc[category] = newItems.filter((item) => item.category === category).map((item) => item.text)
      return acc
    }, {} as Record<string, string[]>)
    onAnswerChange(newAnswer)
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-wrap -mx-2">
          {question.categories.map((category) => (
            <div key={category} className="w-full sm:w-1/2 md:w-1/3 px-2 mb-4">
              <h4 className="font-medium mb-2">{category}</h4>
              <Droppable droppableId={category}>
                {(provided) => (
                  <ul
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[100px] bg-gray-100 p-2 rounded"
                  >
                    {items
                      .filter((item) => item.category === category)
                      .map((item, index) => (
                        <Draggable key={item.text} draggableId={item.text} index={index}>
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-white p-2 mb-2 rounded shadow"
                            >
                              {item.text}
                            </li>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}

export default CategorizePreview


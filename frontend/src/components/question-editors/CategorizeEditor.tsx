import React from 'react'
import { CategorizeQuestion } from '../../types/form'
import { toast } from 'react-hot-toast'

interface CategorizeEditorProps {
  question: CategorizeQuestion
  onUpdate: (question: CategorizeQuestion) => void
}

const CategorizeEditor: React.FC<CategorizeEditorProps> = ({ question, onUpdate }) => {
  const addCategory = () => {
    onUpdate({
      ...question,
      categories: [...question.categories, ''],
    })
  }

  const updateCategory = (index: number, value: string) => {
    const newCategories = [...question.categories]
    newCategories[index] = value
    onUpdate({
      ...question,
      categories: newCategories,
    })
  }

  const addItem = () => {
    if (question.categories.length === 0) {
      toast.error('Please add at least one category before adding items.')
      return
    }
    onUpdate({
      ...question,
      items: [...question.items, { text: '', category: question.categories[0] }],
    })
  }

  const updateItem = (index: number, field: 'text' | 'category', value: string) => {
    const newItems = [...question.items]
    newItems[index] = { ...newItems[index], [field]: value }
    onUpdate({
      ...question,
      items: newItems,
    })
  }

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={question.question}
        onChange={(e) => onUpdate({ ...question, question: e.target.value })}
        className="w-full p-2 border rounded"
        placeholder="Enter categorize question"
      />
      <div>
        <h4 className="font-medium mb-2">Categories</h4>
        {question.categories.map((category, index) => (
          <input
            key={index}
            type="text"
            value={category}
            onChange={(e) => updateCategory(index, e.target.value)}
            className="w-full p-2 border rounded mb-2"
            placeholder={`Category ${index + 1}`}
          />
        ))}
        <button
          type="button"
          onClick={addCategory}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Add Category
        </button>
      </div>
      <div>
        <h4 className="font-medium mb-2">Items</h4>
        {question.items.map((item, index) => (
          <div key={index} className="flex space-x-2 mb-2">
            <input
              type="text"
              value={item.text}
              onChange={(e) => updateItem(index, 'text', e.target.value)}
              className="flex-grow p-2 border rounded"
              placeholder={`Item ${index + 1}`}
            />
            <select
              value={item.category}
              onChange={(e) => updateItem(index, 'category', e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">Select Category</option>
              {question.categories.map((category, catIndex) => (
                <option key={catIndex} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
        >
          Add Item
        </button>
      </div>
    </div>
  )
}

export default CategorizeEditor


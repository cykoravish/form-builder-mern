import React from 'react'
import { FormField } from '../types/form'

interface QuestionEditorProps {
  question: FormField
  onUpdate: (question: FormField) => void
  onRemove: () => void
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({ question, onUpdate, onRemove }) => {
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ ...question, content: { ...question.content, text: e.target.value } })
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold capitalize">{question.type} Question</h3>
        <button
          onClick={onRemove}
          className="text-red-600 hover:text-red-800 transition-colors"
        >
          Remove
        </button>
      </div>
      <textarea
        value={question.content.text || ''}
        onChange={handleContentChange}
        className="w-full p-2 border rounded"
        rows={4}
        placeholder={`Enter ${question.type} question content...`}
      />
      {/* Add more specific fields based on question type */}
    </div>
  )
}

export default QuestionEditor


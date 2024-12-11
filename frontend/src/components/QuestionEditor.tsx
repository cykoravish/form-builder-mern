import React from 'react'
import { FormField } from '../types/form'
import CategorizeEditor from './question-editors/CategorizeEditor'
import ClozeEditor from './question-editors/ClozeEditor'
import ComprehensionEditor from './question-editors/ComprehensionEditor'
interface QuestionEditorProps {
  question: FormField
  onUpdate: (question: FormField) => void
  onRemove: () => void
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({ question, onUpdate, onRemove }) => {
  const renderEditor = () => {
    switch (question.type) {
      case 'categorize':
        return <CategorizeEditor question={question} onUpdate={onUpdate} />
      case 'cloze':
        return <ClozeEditor question={question} onUpdate={onUpdate} />
      case 'comprehension':
        return <ComprehensionEditor question={question} onUpdate={onUpdate} />
      default:
        return null
    }
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
      {renderEditor()}
    </div>
  )
}

export default QuestionEditor


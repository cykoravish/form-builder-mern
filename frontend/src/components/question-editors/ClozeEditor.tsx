import React from 'react'
import { ClozeQuestion } from '../../types/form'

interface ClozeEditorProps {
  question: ClozeQuestion
  onUpdate: (question: ClozeQuestion) => void
}

const ClozeEditor: React.FC<ClozeEditorProps> = ({ question, onUpdate }) => {
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({
      ...question,
      text: e.target.value,
    })
  }

  const handleBlankChange = (index: number, value: string) => {
    const newBlanks = [...question.blanks]
    newBlanks[index] = value
    onUpdate({
      ...question,
      blanks: newBlanks,
    })
  }

  const addBlank = () => {
    onUpdate({
      ...question,
      blanks: [...question.blanks, ''],
    })
  }

  return (
    <div className="space-y-4">
      <textarea
        value={question.text}
        onChange={handleTextChange}
        className="w-full p-2 border rounded"
        rows={4}
        placeholder="Enter cloze text (use [...] for blanks)"
      />
      <div>
        <h4 className="font-medium mb-2">Blanks</h4>
        {question.blanks.map((blank, index) => (
          <input
            key={index}
            type="text"
            value={blank}
            onChange={(e) => handleBlankChange(index, e.target.value)}
            className="w-full p-2 border rounded mb-2"
            placeholder={`Blank ${index + 1}`}
          />
        ))}
        <button
          type="button"
          onClick={addBlank}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Add Blank
        </button>
      </div>
    </div>
  )
}

export default ClozeEditor


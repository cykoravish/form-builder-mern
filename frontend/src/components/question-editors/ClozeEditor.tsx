import React from 'react'
import { ClozeQuestion } from '../../types/form'
import { toast } from 'react-hot-toast'

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
    if (question.text.split('[...]').length <= question.blanks.length + 1) {
      toast.error('Please add more [...] placeholders in the text before adding new blanks.')
      return
    }
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
            onChange={(e) => handleBlankChange(index, e.target.value.trimStart())}
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


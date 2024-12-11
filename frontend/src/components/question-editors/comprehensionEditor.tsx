import React from 'react'
import { ComprehensionQuestion } from '../../types/form'
import { toast } from 'react-hot-toast'

interface ComprehensionEditorProps {
  question: ComprehensionQuestion
  onUpdate: (question: ComprehensionQuestion) => void
}

const ComprehensionEditor: React.FC<ComprehensionEditorProps> = ({ question, onUpdate }) => {
  const handlePassageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({
      ...question,
      passage: e.target.value,
    })
  }

  const addQuestion = () => {
    if (!question.passage.trim()) {
      toast.error('Please add a passage before adding questions.')
      return
    }
    onUpdate({
      ...question,
      questions: [...question.questions, { question: '', options: ['', '', '', ''], correctAnswer: '' }],
    })
  }

  const updateQuestion = (index: number, field: string, value: string) => {
    const newQuestions = [...question.questions]
    newQuestions[index] = { ...newQuestions[index], [field]: value }
    onUpdate({
      ...question,
      questions: newQuestions,
    })
  }

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...question.questions]
    newQuestions[questionIndex].options[optionIndex] = value
    onUpdate({
      ...question,
      questions: newQuestions,
    })
  }

  return (
    <div className="space-y-4">
      <textarea
        value={question.passage}
        onChange={handlePassageChange}
        className="w-full p-2 border rounded"
        rows={6}
        placeholder="Enter comprehension passage"
      />
      <div>
        <h4 className="font-medium mb-2">Questions</h4>
        {question.questions.map((q, qIndex) => (
          <div key={qIndex} className="mb-4 p-4 border rounded">
            <input
              type="text"
              value={q.question}
              onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
              className="w-full p-2 border rounded mb-2"
              placeholder={`Question ${qIndex + 1}`}
            />
            {q.options.map((option, oIndex) => (
              <input
                key={oIndex}
                type="text"
                value={option}
                onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                className="w-full p-2 border rounded mb-2"
                placeholder={`Option ${oIndex + 1}`}
              />
            ))}
            <select
              value={q.correctAnswer}
              onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Correct Answer</option>
              {q.options.map((option, oIndex) => (
                <option key={oIndex} value={option}>
                  {option || `Option ${oIndex + 1}`}
                </option>
              ))}
            </select>
          </div>
        ))}
        <button
          type="button"
          onClick={addQuestion}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Add Question
        </button>
      </div>
    </div>
  )
}

export default ComprehensionEditor


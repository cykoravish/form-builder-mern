import React, { useState, useEffect } from 'react'
import { ComprehensionQuestion } from '../../types/form'

interface ComprehensionPreviewProps {
  question: ComprehensionQuestion
  answer: Record<number, string>
  onAnswerChange: (answer: Record<number, string>) => void
  error?: string
}

const ComprehensionPreview: React.FC<ComprehensionPreviewProps> = ({ question, answer, onAnswerChange, error }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>(answer || {})

  useEffect(() => {
    onAnswerChange(selectedAnswers)
  }, [selectedAnswers, onAnswerChange])

  const handleAnswerChange = (questionIndex: number, selectedOption: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: selectedOption,
    }))
  }

  return (
    <div>
      <p className="mb-6 text-lg leading-relaxed">{question.passage}</p>
      {question.questions.map((q, index) => (
        <div key={index} className="mb-6">
          <p className="font-medium mb-3 text-lg">{q.question}</p>
          <div className="space-y-3">
            {q.options.map((option, optionIndex) => (
              <label key={optionIndex} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-100 transition-colors duration-200">
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={option}
                  checked={selectedAnswers[index] === option}
                  onChange={() => handleAnswerChange(index, option)}
                  className="form-radio h-5 w-5 text-blue-600"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  )
}

export default ComprehensionPreview


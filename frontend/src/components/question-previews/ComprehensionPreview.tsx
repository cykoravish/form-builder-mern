import React, { useState, useEffect } from 'react'
import { ComprehensionQuestion } from '../../types/form'

interface ComprehensionPreviewProps {
  question: ComprehensionQuestion
  answer: Record<number, string>
  onAnswerChange: (answer: Record<number, string>) => void
}

const ComprehensionPreview: React.FC<ComprehensionPreviewProps> = ({ question, answer, onAnswerChange }) => {
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
      <p className="mb-4">{question.passage}</p>
      {question.questions.map((q, index) => (
        <div key={index} className="mb-4">
          <p className="font-medium mb-2">{q.question}</p>
          <div className="space-y-2">
            {q.options.map((option, optionIndex) => (
              <label key={optionIndex} className="flex items-center">
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={option}
                  checked={selectedAnswers[index] === option}
                  onChange={() => handleAnswerChange(index, option)}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ComprehensionPreview


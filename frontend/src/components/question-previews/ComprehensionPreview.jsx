import React, { useState, useEffect, useCallback } from 'react'



const ComprehensionPreview= ({ 
  question, 
  answer, 
  onAnswerChange, 
  error 
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState(answer || {})

  const handleAnswerChange = useCallback((questionIndex, selectedOption) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: selectedOption,
    }))
  }, [])

  useEffect(() => {
    if (JSON.stringify(selectedAnswers) !== JSON.stringify(answer)) {
      onAnswerChange(selectedAnswers)
    }
  }, [selectedAnswers, answer, onAnswerChange])

  return (
    <div className="space-y-6">
      <p className="mb-6 text-lg leading-relaxed">{question.passage}</p>
      {question.questions.map((q, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow">
          <p className="font-medium mb-3 text-lg">{q.question}</p>
          <div className="space-y-3">
            {q.options.map((option, optionIndex) => (
              <label 
                key={optionIndex} 
                className="flex items-center space-x-3 p-2 rounded hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
              >
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


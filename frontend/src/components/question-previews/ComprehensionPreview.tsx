import React, { useState, useEffect, useCallback } from 'react'
import { ComprehensionQuestion } from '../../types/form'

// interface ComprehensionPreviewProps {
//   question: ComprehensionQuestion
//   answer?: Record<number, string>
//   onAnswerChange: (answer: Record<number, string>) => void
//   error?: string
// }
interface ComprehensionPreviewProps {
  question: ComprehensionQuestion;
  answer?: Record<number, string> | string[];
  onAnswerChange: (answer: Record<number, string> | string[]) => void;
  error?: string;
}


const ComprehensionPreview: React.FC<ComprehensionPreviewProps> = ({ 
  question, 
  answer = {}, 
  onAnswerChange, 
  error 
}) => {
  // Use a memoized state initialization to prevent unnecessary re-renders
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>(answer);

  // Use useCallback to memoize the answer change handler
  const handleAnswerChange = useCallback((questionIndex: number, selectedOption: string) => {
    setSelectedAnswers((prev) => {
      const newAnswers = {
        ...prev,
        [questionIndex]: selectedOption,
      };
      return newAnswers;
    });
  }, []);

  // Use useCallback for onAnswerChange to stabilize the dependency
  const updateParentAnswers = useCallback(() => {
    onAnswerChange(selectedAnswers);
  }, [selectedAnswers, onAnswerChange]);

  // Use useEffect with a stable dependency array
  useEffect(() => {
    updateParentAnswers();
  }, [selectedAnswers, updateParentAnswers]);

  // Ensure questions exist and have length
  const safeQuestions = question.questions || [];

  // If no questions, return a placeholder
  if (safeQuestions.length === 0) {
    return (
      <div>
        <p className="text-gray-500">No questions available for this passage.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-6 text-lg leading-relaxed">{question.passage}</p>
      {safeQuestions.map((q, index) => (
        <div key={index} className="mb-6">
          <p className="font-medium mb-3 text-lg">{q.question}</p>
          <div className="space-y-3">
            {q.options.map((option, optionIndex) => (
              <label 
                key={optionIndex} 
                className="flex items-center space-x-3 p-2 rounded hover:bg-gray-100 transition-colors duration-200"
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

export default ComprehensionPreview;
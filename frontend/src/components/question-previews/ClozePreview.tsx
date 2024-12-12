import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { ClozeQuestion } from '../../types/form'

interface ClozePreviewProps {
  question: ClozeQuestion
  answer: string[] | undefined
  onAnswerChange: (answer: string[]) => void
  error?: string
}


const ClozePreview: React.FC<ClozePreviewProps> = ({ question, answer, onAnswerChange, error }) => {
  const [blanks, setBlanks] = useState<string[]>(answer || question.blanks.map(() => ''))

  useEffect(() => {
    if (JSON.stringify(blanks) !== JSON.stringify(answer)) {
      onAnswerChange(blanks);
    }
  }, [blanks, answer, onAnswerChange])

  const handleBlankChange = useCallback((index: number, value: string) => {
    setBlanks(prevBlanks => {
      const newBlanks = [...prevBlanks];
      newBlanks[index] = value;
      return newBlanks;
    });
  }, []);

  const renderClozeText = useMemo(() => {
    const parts = question.text.split(/\[\.\.\.]/g);
    return () => parts.map((part, index) => (
      <React.Fragment key={index}>
        {part}
        {index < blanks.length && (
          <input
            type="text"
            value={blanks[index]}
            onChange={(e) => handleBlankChange(index, e.target.value)}
            className="border-b-2 border-gray-300 focus:border-blue-500 outline-none px-1 mx-1 w-24 transition-colors duration-200"
          />
        )}
      </React.Fragment>
    ));
  }, [question.text, blanks, handleBlankChange]);

  return (
    <div>
      <p className="mb-4 text-lg leading-relaxed">{renderClozeText()}</p>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  )
}

export default ClozePreview


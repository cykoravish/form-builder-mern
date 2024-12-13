import React, { useCallback } from "react";
import { ComprehensionQuestion, FormField } from "../../types/form";
import { toast } from "react-hot-toast";

interface ComprehensionEditorProps {
  question: ComprehensionQuestion;
  onUpdate: (question: ComprehensionQuestion) => void;
}

export const ComprehensionEditor: React.FC<ComprehensionEditorProps> = ({
  question,
  onUpdate,
}) => {
  const handlePassageChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      console.log("Passage change triggered: ", e.target.value);

      // Ensure type compatibility
      const updatedQuestion: FormField = {
        ...question,
        passage: e.target.value,
      };

      onUpdate(updatedQuestion);
    },
    [question, onUpdate]
  );

  const addQuestion = useCallback(() => {
    console.log("Add question triggered");
    if (!question.passage?.trim()) {
      toast.error("Please add a passage before adding questions.");
      return;
    }

    // Ensure type compatibility
    const updatedQuestion: FormField = {
      ...question,
      questions: [
        ...(question.questions || []),
        {
          question: "",
          options: ["", "", "", ""],
          correctAnswer: "",
        },
      ],
    };

    onUpdate(updatedQuestion);
  }, [question, onUpdate]);

  const updateQuestion = useCallback(
    (questionIndex: number, field: string, value: string) => {
      console.log(
        `Updating question ${questionIndex}, field: ${field}, value: ${value}`
      );

      const newQuestions = [...(question.questions || [])];

      newQuestions[questionIndex] = {
        ...newQuestions[questionIndex],
        [field]: value,
      };

      const updatedQuestion: FormField = {
        ...question,
        questions: newQuestions,
      };

      onUpdate(updatedQuestion);
    },
    [question, onUpdate]
  );

  // Update a specific option within a question
  const updateOption = useCallback(
    (questionIndex: number, optionIndex: number, value: string) => {
      console.log(
        `Updating option for question ${questionIndex}, option ${optionIndex}, value: ${value}`
      );

      const newQuestions = [...(question.questions || [])];

      if (!newQuestions[questionIndex]) {
        newQuestions[questionIndex] = {
          question: "",
          options: ["", "", "", ""],
          correctAnswer: "",
        };
      }

      newQuestions[questionIndex].options[optionIndex] = value;

      const updatedQuestion: FormField = {
        ...question,
        questions: newQuestions,
      };

      onUpdate(updatedQuestion);
    },
    [question, onUpdate]
  );

  return (
    <div className="space-y-4">
      <textarea
        value={question.passage || ""}
        onChange={handlePassageChange}
        className="w-full p-2 border rounded"
        rows={6}
        placeholder="Enter comprehension passage"
      />
      <div>
        <h4 className="font-medium mb-2">Questions</h4>
        {(question.questions || []).map((q, qIndex) => (
          <div key={qIndex} className="mb-4 p-4 border rounded">
            <input
              type="text"
              value={q.question}
              onChange={(e) =>
                updateQuestion(qIndex, "question", e.target.value)
              }
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
              onChange={(e) =>
                updateQuestion(qIndex, "correctAnswer", e.target.value)
              }
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
          Add Questionnn
        </button>
      </div>
    </div>
  );
};


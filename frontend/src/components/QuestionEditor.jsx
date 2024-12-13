import React from "react";

import CategorizeEditor from "./question-editors/CategorizeEditor";
import ClozeEditor from "./question-editors/ClozeEditor";
import { ComprehensionEditor } from "./question-editors/ComprehensionEditor";



const QuestionEditor= ({
  question,
  onUpdate,
  onRemove,
}) => {

  const isValidQuestionType = (type) =>
    ["categorize", "cloze", "comprehension"].includes(type);

  const renderEditor = () => {
    if (!isValidQuestionType(question.type)) {
      console.error(`Invalid question type: ${question.type}`);
      return null;
    }

    // Explicitly type the onUpdate prop
    const handleUpdate = (updatedQuestion) => {
      onUpdate(updatedQuestion);
    };

    switch (question.type) {
      case "categorize":
        return <CategorizeEditor question={question} onUpdate={handleUpdate} />;
      case "cloze":
        return <ClozeEditor question={question} onUpdate={handleUpdate} />;
      case "comprehension":
        console.log("Comprehension Question Details:", question);
        return (
          <ComprehensionEditor question={question} onUpdate={handleUpdate} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold capitalize">
          {question.type} Question
        </h3>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            console.log("remove button clicked");
            onRemove();
          }}
          className="text-red-600 hover:text-red-800 transition-colors"
        >
          Remove
        </button>
      </div>
      {renderEditor()}
    </div>
  );
};

export default QuestionEditor;

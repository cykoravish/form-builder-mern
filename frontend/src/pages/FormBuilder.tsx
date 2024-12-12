import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import defaultImage from "../assets/defaultImage.jpg";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useFormStore } from "../store/formStore";
import { createForm } from "../services/formService";
import { QuestionType, FormField } from "../types/form";
import QuestionEditor from "../components/QuestionEditor";

interface SortableQuestionProps {
  id: string;
  question: FormField;
  index: number;
  onUpdate: (updatedQuestion: FormField) => void;
  onRemove: () => void;
}

const SortableQuestion: React.FC<SortableQuestionProps> = ({
  id,
  question,
  index,
  onUpdate,
  onRemove,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <>
      {/* <div ref={setNodeRef} style={style} {...attributes} {...listeners}> */}
      <div ref={setNodeRef} style={style} {...attributes}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <QuestionEditor
            question={question}
            onUpdate={onUpdate}
            onRemove={onRemove}
          />
        </motion.div>
      </div>
    </>
  );
};

const FormBuilder: React.FC = () => {
  const navigate = useNavigate();
  const {
    form,
    setForm,
    addQuestion,
    updateQuestion,
    removeQuestion,
    reorderQuestions,
  } = useFormStore();

  const [currentStep, setCurrentStep] = useState(1);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddQuestion = (type: QuestionType) => {
    let newQuestion: FormField;
    switch (type) {
      case "categorize":
        newQuestion = { type, question: "", categories: [], items: [] };
        break;
      case "cloze":
        newQuestion = { type, text: "", blanks: [] };
        break;
      case "comprehension":
        newQuestion = { type, passage: "", questions: [] };
        break;
      default:
        return; // Don't add if type is invalid
    }

    addQuestion(newQuestion);
    toast.success(`New ${type} question added. Please fill in the details.`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) {
      toast.error("Please enter a form title.");
      return;
    }
    if (form.questions.length === 0) {
      toast.error("Please add at least one question to the form.");
      return;
    }
    try {
      const createdForm = await createForm(form);
      toast.success("Form created successfully!");
      navigate(`/preview/${createdForm._id}`);
    } catch (error) {
      console.log("error: ", error);
      toast.error("Failed to create form");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = parseInt(active.id.split("-")[1]);
      const newIndex = parseInt(over.id.split("-")[1]);
      reorderQuestions(oldIndex, newIndex);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Form Builder</h1>
      <div className="mb-8">
        <ol className="flex items-center w-full p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 sm:text-base dark:bg-gray-800 dark:border-gray-700 sm:p-4 sm:space-x-4">
          <li
            className={`flex items-center ${
              currentStep >= 1 ? "text-blue-600 dark:text-blue-500" : ""
            }`}
          >
            <span className="flex items-center justify-center w-5 h-5 mr-2 text-xs border border-blue-600 rounded-full shrink-0 dark:border-blue-500">
              1
            </span>
            Form Details
          </li>
          <li
            className={`flex items-center ${
              currentStep >= 2 ? "text-blue-600 dark:text-blue-500" : ""
            }`}
          >
            <span className="flex items-center justify-center w-5 h-5 mr-2 text-xs border border-blue-600 rounded-full shrink-0 dark:border-blue-500">
              2
            </span>
            Add Questions
          </li>
          <li
            className={`flex items-center ${
              currentStep >= 3 ? "text-blue-600 dark:text-blue-500" : ""
            }`}
          >
            <span className="flex items-center justify-center w-5 h-5 mr-2 text-xs border border-blue-600 rounded-full shrink-0 dark:border-blue-500">
              3
            </span>
            Preview
          </li>
        </ol>
      </div>
      {currentStep === 1 && (
        <div className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Form Title
            </label>
            <input
              type="text"
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label
              htmlFor="headerImage"
              className="block text-sm font-medium text-gray-700"
            >
              Header Image URL
            </label>
            <input
              type="url"
              id="headerImage"
              value={form.headerImage || ""}
              onChange={(e) =>
                setForm({ ...form, headerImage: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <button
            onClick={() => setCurrentStep(2)}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
          >
            Next: Add Questions
          </button>
        </div>
      )}
      {currentStep === 2 && (
        <div>
          <p className="mb-4 text-sm text-gray-600">
            Tip: You can drag and drop questions to reorder them. Click and hold
            on a question, then move it to the desired position.
          </p>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={form.questions.map((_, index) => `question-${index}`)}
              strategy={verticalListSortingStrategy}
            >
              {form.questions.map((question, index) => (
                <SortableQuestion
                  key={`question-${index}`}
                  id={`question-${index}`}
                  question={question}
                  index={index}
                  onUpdate={(updatedQuestion) =>
                    updateQuestion(index, updatedQuestion)
                  }
                  onRemove={() => removeQuestion(index)}
                />
              ))}
            </SortableContext>
          </DndContext>
          <div className="flex flex-wrap gap-4 mt-6">
            <button
              type="button"
              onClick={() => handleAddQuestion("categorize")}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              Add Categorize
            </button>
            <button
              type="button"
              onClick={() => handleAddQuestion("cloze")}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
            >
              Add Cloze
            </button>
            <button
              type="button"
              onClick={() => handleAddQuestion("comprehension")}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
            >
              Add Comprehension
            </button>
          </div>
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentStep(1)}
              className="bg-gray-300 text-gray-700 px-6 py-3 rounded hover:bg-gray-400 transition-colors"
            >
              Back: Form Details
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
            >
              Next: Preview
            </button>
          </div>
        </div>
      )}
      {currentStep === 3 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Form Preview</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">{form.title}</h3>
            {form.headerImage ? (
              <img
                src={form.headerImage}
                alt="header image"
                className="w-full max-w-sm mx-auto mb-6 rounded-lg shadow-sm object-cover"
              />
            ) : (
              <img
                src={defaultImage}
                alt="header image"
                className="w-full max-w-sm mx-auto mb-6 rounded-lg shadow-sm object-cover"
              />
            )}

            {form.questions.map((question, index) => (
              <div key={index} className="mb-6 p-4 bg-gray-50 rounded-md">
                <QuestionEditor
                  question={question}
                  onUpdate={(updatedQuestion) =>
                    updateQuestion(index, updatedQuestion)
                  }
                  onRemove={() => removeQuestion(index)}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentStep(2)}
              className="bg-gray-300 text-gray-700 px-6 py-3 rounded hover:bg-gray-400 transition-colors"
            >
              Back: Add Questions
            </button>
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition-colors"
            >
              Save Form
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormBuilder;

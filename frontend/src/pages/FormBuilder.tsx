import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useFormStore } from "../store/formStore";
import { createForm } from "../services/formService";
import { QuestionType } from "../types/form";
import QuestionEditor from "../components/QuestionEditor";

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

  const handleAddQuestion = (type: QuestionType) => {
    let newQuestion;
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
    }
    addQuestion(newQuestion);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createdForm = await createForm(form);
      toast.success("Form created successfully!");
      navigate(`/preview/${createdForm._id}`);
    } catch (error) {
      toast.error("Failed to create form");
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    reorderQuestions(result.source.index, result.destination.index);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Form Builder</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
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
            value={form.headerImage}
            onChange={(e) => setForm({ ...form, headerImage: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="questions">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {form.questions.map((question, index) => (
                  <Draggable
                    key={index}
                    draggableId={`question-${index}`}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <QuestionEditor
                            question={question}
                            onUpdate={(updatedQuestion) =>
                              updateQuestion(index, updatedQuestion)
                            }
                            onRemove={() => removeQuestion(index)}
                          />
                        </motion.div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <div className="flex space-x-4">
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
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
        >
          Save Form
        </button>
      </form>
    </div>
  );
};

export default FormBuilder;

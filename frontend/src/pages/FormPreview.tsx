/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getFormById, submitFormResponse } from "../services/formService";
import img from "../assets/defaultImage.jpg"

import {
  Form,
  FormResponse,
  CategorizeQuestion,
  ClozeQuestion,
  ComprehensionQuestion,
} from "../types/form";
import CategorizePreview from "../components/question-previews/CategorizePreview";
import ClozePreview from "../components/question-previews/ClozePreview";
import ComprehensionPreview from "../components/question-previews/ComprehensionPreview";

const FormPreview: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const [form, setForm] = useState<Form | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForm = async () => {
      if (!formId) {
        toast.error("Form ID is missing");
        return;
      }
      try {
        const fetchedForm = await getFormById(formId);
        setForm(fetchedForm);
        const initialAnswers = fetchedForm.questions.reduce((acc, q) => {
          if (q.type === "categorize") {
            const categories = q.categories.reduce(
              (catAcc, cat) => ({ ...catAcc, [cat]: [] }),
              {}
            );
            acc[q._id] = {
              ...categories,
              uncategorized: q.items.map((item) => item.text || item),
            };
          } else if (q.type === "cloze") {
            acc[q._id] = q.blanks.map(() => "");
          } else if (q.type === "comprehension") {
            acc[q._id] = {};
          }
          return acc;
        }, {} as Record<string, any>);
        setAnswers(initialAnswers);
      } catch (error) {
        toast.error("Failed to load form");
        console.error(error);
      }
    };
    fetchForm();
  }, [formId]);

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form) {
      toast.error("Form is not loaded");
      return;
    }

    const newErrors: Record<string, string> = {};
    form.questions.forEach((question) => {
      const answer = answers[question._id];
      if (question.type === "categorize") {
        const uncategorizedItems = answer.uncategorized?.length || 0;
        if (uncategorizedItems > 0) {
          newErrors[
            question._id
          ] = `Please categorize all items. ${uncategorizedItems} item(s) left.`;
        }
      } else if (question.type === "cloze") {
        if (answer.some((a: string) => a === "")) {
          newErrors[question._id] = "Please fill in all blanks";
        }
      } else if (question.type === "comprehension") {
        const answeredQuestions = Object.keys(answer).length;
        const totalQuestions = (question as ComprehensionQuestion).questions
          .length;
        if (answeredQuestions < totalQuestions) {
          newErrors[question._id] = `Please answer all questions. ${
            totalQuestions - answeredQuestions
          } question(s) left.`;
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // toast.error('Please answer all questions correctly');
      return;
    }

    try {
      const formResponse: FormResponse = {
        formId: formId!,
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          questionId,
          answer,
        })),
      };

      await submitFormResponse(formId!, formResponse);
      toast.success("Form submitted successfully!");
      navigate("/test-submitted");
    } catch (error) {
      console.error("Submission Error: ", error);
      toast.error("Failed to submit form");
    }
  };

  if (!form) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{form.title}</h1>
      {form.headerImage ? (
        <img
          src={form.headerImage}
          alt="Form Img"
          className="w-full mb-6 rounded-lg shadow-md"
        />
      ):(
        <img
          src={img}
          alt="Form Img"
          className="w-full mb-6 rounded-lg shadow-md"
        />
      )
      }
      <form onSubmit={handleSubmit} className="space-y-6">
        {form.questions.map((question) => (
          <div key={question._id} className="bg-white p-4 rounded shadow">
            {question.type === "categorize" && (
              <CategorizePreview
                question={question as CategorizeQuestion}
                answer={answers[question._id]}
                onAnswerChange={(answer) =>
                  handleAnswerChange(question._id, answer)
                }
                error={errors[question._id]}
              />
            )}
            {question.type === "cloze" && (
              <ClozePreview
                question={question as ClozeQuestion}
                answer={answers[question._id]}
                onAnswerChange={(answer) =>
                  handleAnswerChange(question._id, answer)
                }
                error={errors[question._id]}
              />
            )}
            {question.type === "comprehension" && (
              <ComprehensionPreview
                question={question as ComprehensionQuestion}
                answer={answers[question._id]}
                onAnswerChange={(answer) =>
                  handleAnswerChange(question._id, answer)
                }
                error={errors[question._id]}
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors w-full"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FormPreview;

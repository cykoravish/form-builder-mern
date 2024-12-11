import { create } from 'zustand'
import { Form, FormField } from '../types/form'

interface FormStore {
  form: Form
  setForm: (form: Form) => void
  addQuestion: (question: FormField) => void
  updateQuestion: (index: number, question: FormField) => void
  removeQuestion: (index: number) => void
  reorderQuestions: (startIndex: number, endIndex: number) => void
}

export const useFormStore = create<FormStore>((set) => ({
  form: { title: '', questions: [] },
  setForm: (form) => set({ form }),
  addQuestion: (question) =>
    set((state) => ({ form: { ...state.form, questions: [...state.form.questions, question] } })),
  updateQuestion: (index, question) =>
    set((state) => {
      const newQuestions = [...state.form.questions]
      newQuestions[index] = question
      return { form: { ...state.form, questions: newQuestions } }
    }),
  removeQuestion: (index) =>
    set((state) => ({
      form: { ...state.form, questions: state.form.questions.filter((_, i) => i !== index) },
    })),
  reorderQuestions: (startIndex, endIndex) =>
    set((state) => {
      const newQuestions = Array.from(state.form.questions)
      const [reorderedItem] = newQuestions.splice(startIndex, 1)
      newQuestions.splice(endIndex, 0, reorderedItem)
      return { form: { ...state.form, questions: newQuestions } }
    }),
}))


import { create } from 'zustand'

// Define the shape of your store without TypeScript types
const initialState = {
  form: { 
    title: '', 
    questions: [] 
  }
};

export const useFormStore = create((set) => ({
  ...initialState,
  
  setForm: (form) => set({ form }),
  
  addQuestion: (question) => 
    set((state) => ({ 
      form: { 
        ...state.form, 
        questions: [...state.form.questions, question] 
      } 
    })),
  
  updateQuestion: (index, question) => 
    set((state) => {
      console.log("update question triggered")
      const newQuestions = [...state.form.questions]
      newQuestions[index] = question
      return { 
        form: { 
          ...state.form, 
          questions: newQuestions 
        } 
      }
    }),
  
  removeQuestion: (index) => 
    set((state) => ({
      form: { 
        ...state.form, 
        questions: state.form.questions.filter((_, i) => i !== index) 
      }
    })),
  
  reorderQuestions: (startIndex, endIndex) => 
    set((state) => {
      const newQuestions = Array.from(state.form.questions)
      const [reorderedItem] = newQuestions.splice(startIndex, 1)
      newQuestions.splice(endIndex, 0, reorderedItem)
      return { 
        form: { 
          ...state.form, 
          questions: newQuestions 
        } 
      }
    }),
}));
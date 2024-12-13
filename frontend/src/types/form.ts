export type QuestionType = 'categorize' | 'cloze' | 'comprehension'

export interface CategorizeQuestion {
  _id: any
  type: 'categorize'
  question: string
  categories: string[]
  items: { text: string; category: string }[]
}

export interface ClozeQuestion {
  _id: any
  type: 'cloze'
  text: string
  blanks: string[]
}

export interface ComprehensionQuestion {
  _id: any
  type: 'comprehension'
  passage: string
  questions: { question: string; options: string[]; correctAnswer: string }[]
}

export type FormField = CategorizeQuestion | ClozeQuestion | ComprehensionQuestion

export interface Form {
  createdAt: string | number | Date
  _id?: string
  title: string
  headerImage?: string
  questions: FormField[]
}

export interface FormResponse {
  formId: string
  answers: Record<string, any>[]
}


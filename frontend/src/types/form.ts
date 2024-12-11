export type QuestionType = 'categorize' | 'cloze' | 'comprehension'

export interface CategorizeQuestion {
  type: 'categorize'
  question: string
  categories: string[]
  items: { text: string; category: string }[]
}

export interface ClozeQuestion {
  type: 'cloze'
  text: string
  blanks: string[]
}

export interface ComprehensionQuestion {
  type: 'comprehension'
  passage: string
  questions: { question: string; options: string[]; correctAnswer: string }[]
}

export type FormField = CategorizeQuestion | ClozeQuestion | ComprehensionQuestion

export interface Form {
  _id?: string
  title: string
  headerImage?: string
  questions: FormField[]
}

export interface FormResponse {
  formId: string
  answers: Record<string, any>[]
}


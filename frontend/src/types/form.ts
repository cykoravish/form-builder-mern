export type QuestionType = 'categorize' | 'cloze' | 'comprehension'

export interface FormField {
  type: QuestionType
  content: {
    text?: string
    // Add more specific fields for each question type
  }
}

export interface Form {
  _id?: string
  title: string
  headerImage?: string
  questions: FormField[]
}


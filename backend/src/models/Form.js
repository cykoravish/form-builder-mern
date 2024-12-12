import mongoose from 'mongoose'

const FormSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  headerImage: String,
  questions: [{
    type: {
      type: String,
      enum: ['categorize', 'cloze', 'comprehension'],
      required: true
    },
    question: String,
    categories: [String],
    items: [{
      text: String,
      category: String
    }],
    text: String,
    blanks: [String],
    passage: String,
    questions: [{
      question: String,
      options: [String],
      correctAnswer: String
    }]
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Form = mongoose.model('Form', FormSchema)
export default Form
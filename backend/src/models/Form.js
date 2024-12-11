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
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Form = mongoose.model('Form', FormSchema)

export default Form

console.log('Form model created')
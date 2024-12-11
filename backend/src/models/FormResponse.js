import mongoose from 'mongoose'

const FormResponseSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true
  },
  answers: [{
    type: mongoose.Schema.Types.Mixed,
    required: true
  }],
  submittedAt: {
    type: Date,
    default: Date.now
  }
})

const FormResponse = mongoose.model('FormResponse', FormResponseSchema)

export default FormResponse

console.log('FormResponse model created')


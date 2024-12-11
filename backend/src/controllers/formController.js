import Form from '../models/Form.js'

export const getForms = async (req, res) => {
  try {
    const forms = await Form.find().select('title createdAt')
    res.json(forms)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createForm = async (req, res) => {
  const form = new Form(req.body)
  try {
    const newForm = await form.save()
    res.status(201).json(newForm)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id)
    if (!form) {
      return res.status(404).json({ message: 'Form not found' })
    }
    res.json(form)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const submitFormResponse = async (req, res) => {
  try {
    const { formId, answers } = req.body
    const formResponse = new FormResponse({ formId, answers })
    await formResponse.save()
    res.status(201).json({ message: 'Form response submitted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

console.log('Form controller updated with submitFormResponse function')
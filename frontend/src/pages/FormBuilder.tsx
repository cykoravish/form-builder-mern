import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { createForm } from '../services/formService'
import { Form, FormField, QuestionType } from '../types/form'
import QuestionEditor from '../components/QuestionEditor'

const FormBuilder: React.FC = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState<Form>({ title: '', headerImage: '', questions: [] })

  const addQuestion = (type: QuestionType) => {
    setForm({
      ...form,
      questions: [...form.questions, { type, content: {} }],
    })
  }

  const updateQuestion = (index: number, question: FormField) => {
    const newQuestions = [...form.questions]
    newQuestions[index] = question
    setForm({ ...form, questions: newQuestions })
  }

  const removeQuestion = (index: number) => {
    const newQuestions = form.questions.filter((_, i) => i !== index)
    setForm({ ...form, questions: newQuestions })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createForm(form)
      toast.success('Form created successfully!')
      navigate('/')
    } catch (error) {
      toast.error('Failed to create form')
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Form Builder</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Form Title
          </label>
          <input
            type="text"
            id="title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="headerImage" className="block text-sm font-medium text-gray-700">
            Header Image URL
          </label>
          <input
            type="url"
            id="headerImage"
            value={form.headerImage}
            onChange={(e) => setForm({ ...form, headerImage: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div className="space-y-4">
          {form.questions.map((question, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <QuestionEditor
                question={question}
                onUpdate={(updatedQuestion) => updateQuestion(index, updatedQuestion)}
                onRemove={() => removeQuestion(index)}
              />
            </motion.div>
          ))}
        </div>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => addQuestion('categorize')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          >
            Add Categorize
          </button>
          <button
            type="button"
            onClick={() => addQuestion('cloze')}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
          >
            Add Cloze
          </button>
          <button
            type="button"
            onClick={() => addQuestion('comprehension')}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
          >
            Add Comprehension
          </button>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
        >
          Save Form
        </button>
      </form>
    </div>
  )
}

export default FormBuilder


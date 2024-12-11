import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { getFormById, submitFormResponse } from '../services/formService'
import { Form, FormResponse } from '../types/form'
import CategorizePreview from '../components/question-previews/CategorizePreview'
import ClozePreview from '../components/question-previews/ClozePreview'
import ComprehensionPreview from '../components/question-previews/ComprehensionPreview'

const FormPreview: React.FC = () => {
  const { formId } = useParams<{ formId: string }>()
  const [form, setForm] = useState<Form | null>(null)
  const [answers, setAnswers] = useState<Record<string, any>[]>([])
  const [errors, setErrors] = useState<Record<number, string>>({})

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const fetchedForm = await getFormById(formId!)
        setForm(fetchedForm)
        setAnswers(fetchedForm.questions.map(() => ({})))
      } catch (error) {
        toast.error('Failed to load form')
      }
    }
    fetchForm()
  }, [formId])

  const handleAnswerChange = (index: number, answer: any) => {
    const newAnswers = [...answers]
    newAnswers[index] = answer
    setAnswers(newAnswers)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<number, string> = {}

    form.questions.forEach((question, index) => {
      if (question.type === 'categorize' && (!answers[index] || Object.keys(answers[index]).length === 0)) {
        newErrors[index] = 'Please categorize all items'
      } else if (question.type === 'cloze' && (!answers[index] || answers[index].some((blank: string) => blank === ''))) {
        newErrors[index] = 'Please fill in all blanks'
      } else if (question.type === 'comprehension' && (!answers[index] || Object.keys(answers[index]).length !== question.questions.length)) {
        newErrors[index] = 'Please answer all questions'
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.error('Please fill in all required fields')
      return
    }

    try {
      await submitFormResponse(formId!, { formId: formId!, answers })
      toast.success('Form submitted successfully!')
    } catch (error) {
      toast.error('Failed to submit form')
    }
  }

  if (!form) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{form.title}</h1>
      {form.headerImage && (
        <img src={form.headerImage} alt="Form header" className="w-full mb-6 rounded-lg shadow-md" />
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {form.questions.map((question, index) => (
          <div key={index} className="bg-white p-4 rounded shadow">
            {question.type === 'categorize' && (
              <CategorizePreview
                question={question}
                answer={answers[index]}
                onAnswerChange={(answer) => handleAnswerChange(index, answer)}
                error={errors[index]}
              />
            )}
            {question.type === 'cloze' && (
              <ClozePreview
                question={question}
                answer={answers[index]}
                onAnswerChange={(answer) => handleAnswerChange(index, answer)}
                error={errors[index]}
              />
            )}
            {question.type === 'comprehension' && (
              <ComprehensionPreview
                question={question}
                answer={answers[index]}
                onAnswerChange={(answer) => handleAnswerChange(index, answer)}
                error={errors[index]}
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  )
}

export default FormPreview


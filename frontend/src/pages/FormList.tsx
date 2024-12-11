import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getFormList } from '../services/formService'
import { Form } from '../types/form'

const FormList: React.FC = () => {
  const [forms, setForms] = useState<Form[]>([])

  useEffect(() => {
    const fetchForms = async () => {
      const formList = await getFormList()
      setForms(formList)
    }
    fetchForms()
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Form List</h1>
      <motion.ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {forms.map((form) => (
          <motion.li
            key={form._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow"
          >
            <Link to={`/preview/${form._id}`} className="text-blue-600 hover:text-blue-800 text-lg font-semibold">
              {form.title}
            </Link>
          </motion.li>
        ))}
      </motion.ul>
      <Link
        to="/builder"
        className="mt-8 inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
      >
        Create New Form
      </Link>
    </div>
  )
}

export default FormList


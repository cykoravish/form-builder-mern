import axios from 'axios'
import { Form } from '../types/form'

const API_URL = '/api/forms'

export const getFormList = async (): Promise<Form[]> => {
  const response = await axios.get(API_URL)
  return response.data
}

export const createForm = async (form: Form): Promise<Form> => {
  const response = await axios.post(API_URL, form)
  return response.data
}

export const deleteForm = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`)
  return response.data
}

export const getFormById = async (id: string): Promise<Form> => {
  const response = await axios.get(`${API_URL}/${id}`)
  return response.data
}

export const submitFormResponse = async (formId: string, responses: any): Promise<void> => {
  await axios.post(`${API_URL}/${formId}/responses`, responses)
}


import axios from 'axios'

const API_URL = '/api/forms'

export const getFormList = async () => {
  const response = await axios.get(API_URL)
  return response.data
}

export const createForm = async (form) => {
  const response = await axios.post(API_URL, form)
  return response.data
}

export const deleteForm = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`)
  return response.data
}

export const getFormById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`)
  return response.data
}

export const submitFormResponse = async (formId, responses)=> {
  await axios.post(`${API_URL}/${formId}/responses`, responses)
}


import express from 'express'
import { getForms, createForm, getFormById, submitFormResponse, deleteForm } from '../controllers/formController.js'

const router = express.Router()

router.get('/', getForms)
router.post('/', createForm)
router.get('/:id', getFormById)
router.post('/:id/responses', submitFormResponse)
router.delete('/:id',deleteForm)

export default router

console.log('Form routes updated with submitFormResponse endpoint')


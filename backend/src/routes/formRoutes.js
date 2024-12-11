import express from 'express'
import { getForms, createForm, getFormById, submitFormResponse } from '../controllers/formController.js'

const router = express.Router()

router.get('/', getForms)
router.post('/', createForm)
router.get('/:id', getFormById)
router.post('/:id/responses', submitFormResponse)

export default router

console.log('Form routes updated with submitFormResponse endpoint')


import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import formRoutes from './routes/formRoutes.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGODB_URI, {
  // Remove useNewUrlParser and useUnifiedTopology
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err))

app.use('/api/forms', formRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

console.log('Backend server initialized')


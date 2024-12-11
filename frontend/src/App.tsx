import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import FormBuilder from './pages/FormBuilder'
import FormList from './pages/FormList'
import FormPreview from './pages/FormPreview'

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<FormList />} />
            <Route path="/builder" element={<FormBuilder />} />
            <Route path="/preview/:formId" element={<FormPreview />} />
          </Routes>
        </main>
        <Toaster position="bottom-right" />
      </div>
    </Router>
  )
}

export default App


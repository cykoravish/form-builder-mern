import React from 'react'
import { Link } from 'react-router-dom'

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-4 py-4">
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="text-blue-600 hover:text-blue-800 transition-colors">Form List</Link>
          </li>
          <li>
            <Link to="/builder" className="text-blue-600 hover:text-blue-800 transition-colors">Form Builder</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header


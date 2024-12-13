import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo Section */}
        <motion.div 
          className="text-blue-600 text-xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/">Logo</Link>
        </motion.div>

        {/* Navigation Links */}
        <motion.ul 
          className="flex space-x-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <li>
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-800 transition-colors relative group"
            >
              <span className="relative z-10">Form List</span>
              {/* Hover Animation */}
              <motion.span 
                className="absolute left-0 -bottom-1 h-1 w-0 bg-blue-600 transition-all group-hover:w-full"
                layout
              />
            </Link>
          </li>
          <li>
            <Link
              to="/builder"
              className="text-blue-600 hover:text-blue-800 transition-colors relative group"
            >
              <span className="relative z-10">Form Builder</span>
              {/* Hover Animation */}
              <motion.span 
                className="absolute left-0 -bottom-1 h-1 w-0 bg-blue-600 transition-all group-hover:w-full"
                layout
              />
            </Link>
          </li>
        </motion.ul>
      </nav>
    </header>
  );
};

export default Header;

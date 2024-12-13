
import { motion } from "framer-motion";
import React from "react";
import { useNavigate } from "react-router-dom";

const TestComplete = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/"); // Navigate to the home page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      {/* Animated Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="bg-white shadow-lg rounded-lg p-8 text-center max-w-md w-full mx-4"
      >
        {/* Checkmark Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut", delay: 0.3 }}
          className="text-blue-500 text-6xl mb-4"
        >
          ✓
        </motion.div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-blue-600 mb-4">
          Test Completed Successfully!
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          Thank you for completing the test. Your responses have been recorded.
        </p>

        {/* Animated Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGoHome}
          className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
        >
          Go Back to Home
        </motion.button>
      </motion.div>
    </div>
  );
};

export default TestComplete;

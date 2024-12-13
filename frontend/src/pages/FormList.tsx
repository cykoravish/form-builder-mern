import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Plus, Copy, Edit, Trash2 } from "lucide-react";
import { deleteForm, getFormList } from "../services/formService";
import { Form } from "../types/form";
import toast from "react-hot-toast";
import axios from "axios";

const FormList: React.FC = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [selectedForm, setSelectedForm] = useState<string | null>(null);

  const fetchForms = async () => {
    const formList = await getFormList();
    setForms(formList);
  };
  useEffect(() => {
    fetchForms();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  const handleActionClick = async (formId: string, action: string) => {
    setSelectedForm(formId);
    console.log(`${action} form with ID: ${formId}`);
    // toast.success(`${action} form with ID: ${formId}`);

    if (action === "delete") {
      try {
        const response = await deleteForm(formId);
        console.log(response);
        toast.success(
          response?.message || `Successfully deleted form with ID: ${formId}`
        );
        fetchForms();
      } catch (error: any) {
        console.error("Error deleting form:", error);
        toast.error(
          error.response?.data?.message ||
            "Failed to delete the form. Please try again."
        );
      }
    }
    if (action === "duplicate") {
      toast.success("duplicate functionality comming soon");
    }
    if (action === "edit") {
      toast.success("edit functionality comming soon");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 md:p-10">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold text-gray-800"
          >
            Your Forms
          </motion.h1>
          <Link to="/builder">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="mr-2" /> Create New Form
            </motion.button>
          </Link>
        </div>

        {forms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center bg-white rounded-xl shadow-lg p-10 text-center"
          >
            <FileText size={64} className="text-blue-500 mb-4" />
            <h2 className="text-2xl font-semibold mb-4">
              No Forms Created Yet
            </h2>
            <p className="text-gray-500 mb-6">
              Start by creating your first form
            </p>
            <Link to="/builder">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-6 py-3 rounded-full"
              >
                Create Form
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <motion.ul
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {forms.map((form) => (
              <motion.li
                key={form._id}
                variants={itemVariants}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <Link to={`/preview/${form._id}`} className="block mb-4">
                    <motion.h2
                      whileHover={{ scale: 1.02 }}
                      className="text-xl font-bold text-gray-800 hover:text-blue-600 truncate hover:underline"
                    >
                      {form.title}
                    </motion.h2>
                  </Link>
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-gray-500">
                      Created: {new Date(form.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleActionClick(form._id, "edit")}
                        className="text-blue-500 hover:bg-blue-50 p-2 rounded-full"
                      >
                        <Edit size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleActionClick(form._id, "duplicate")}
                        className="text-green-500 hover:bg-green-50 p-2 rounded-full"
                      >
                        <Copy size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleActionClick(form._id, "delete")}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-full"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </motion.div>
    </div>
  );
};

export default FormList;

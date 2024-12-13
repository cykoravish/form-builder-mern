import Form from "../models/Form.js";
import FormResponse from "../models/FormResponse.js";

export const getForms = async (req, res) => {
  try {
    const forms = await Form.find().select("title createdAt");
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createForm = async (req, res) => {
  try {
    // Validate input data before saving
    const { title, headerImage, questions } = req.body;

    // Ensure at least basic validation
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!questions || questions.length === 0) {
      return res.status(400).json({ message: "At least one question is required" });
    }

    // Validate each question type
    const validatedQuestions = questions.map(question => {
      switch(question.type) {
        case 'categorize':
          if (!question.question || !question.categories || !question.items) {
            throw new Error('Invalid categorize question structure');
          }
          break;
        case 'cloze':
          if (!question.text || !question.blanks) {
            throw new Error('Invalid cloze question structure');
          }
          break;
        case 'comprehension':
          if (!question.passage || !question.questions) {
            throw new Error('Invalid comprehension question structure');
          }
          break;
        default:
          throw new Error('Invalid question type');
      }
      return question;
    });

    const form = new Form({
      title,
      headerImage,
      questions: validatedQuestions
    });

    const newForm = await form.save();
    res.status(201).json(newForm);
  } catch (error) {
    console.error('Form creation error:', error);
    res.status(400).json({ 
      message: error.message || 'Error creating form',
      details: error.errors 
    });
  }
};

export const getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const submitFormResponse = async (req, res) => {
  try {
    const { formId, answers } = req.body;
    const formResponse = new FormResponse({ formId, answers });
    await formResponse.save();
    res.status(201).json({ message: "Form response submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteForm = async (req,res)=>{
  console.log("test 1")
  const { id } = req.params;
  try {
    const deletedForm = await Form.findByIdAndDelete(id);
    if (!deletedForm) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.status(200).json({ message: "Form deleted successfully", form: deletedForm });
  } catch (error) {
    console.error("Error deleting form:", error);
    res.status(500).json({ message: "Failed to delete form", error: error.message });
  }
}

console.log("Form controller updated with submitFormResponse function");

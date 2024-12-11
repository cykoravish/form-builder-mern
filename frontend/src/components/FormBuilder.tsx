import React, { useState } from 'react';

interface FormField {
  label: string;
  type: string;
  required: boolean;
  options?: string[];
}

const FormBuilder: React.FC = () => {
  const [formTitle, setFormTitle] = useState('');
  const [fields, setFields] = useState<FormField[]>([]);

  const addField = () => {
    setFields([...fields, { label: '', type: 'text', required: false }]);
  };

  return (
    <div>
      <h1>Form Builder</h1>
      <input
        type="text"
        value={formTitle}
        onChange={(e) => setFormTitle(e.target.value)}
        placeholder="Form Title"
      />
      {fields.map((field, index) => (
        <div key={index}>
          {/* Field editing UI will be implemented here */}
        </div>
      ))}
      <button onClick={addField}>Add Field</button>
      <button>Save Form</button>
    </div>
  );
}

export default FormBuilder;


import React from 'react';

function FileInput({ onFileUpload }) {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div>
      <h2>Upload Resume</h2>
      <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
    </div>
  );
}

export default FileInput;
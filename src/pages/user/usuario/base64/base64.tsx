import React, { useState, ChangeEvent } from 'react';

const FileUploader: React.FC = () => {
  const [base64String, setBase64String] = useState<string>('');

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setBase64String(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileInputChange} />
      <div>Base64 String: {base64String}</div>
    </div>
  );
};

export default FileUploader;

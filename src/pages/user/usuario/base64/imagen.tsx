import { useState } from 'react';

const FileUploadForm = () => {
  const [fileData, setFileData] = useState<string>('');
  const [fileId, setFileId] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setFileData(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: JSON.stringify({ fileData }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setFileId(data.id);
    } catch (error) {
      // Manejo de errores
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Subir archivo</button>
      {fileId && <p>ID del archivo: {fileId}</p>}
    </form>
  );
};

export default FileUploadForm;


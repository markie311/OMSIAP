import React, { useState, useEffect } from 'react';

import '../../styles/imageupload/imageupload.scss';

export default function ImageUpload() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
  
    // Fetch images on component mount
    useEffect(() => {
      fetchImages();
    }, []);
  
    const fetchImages = async () => {
      try {
        const response = await fetch('http://localhost:5000/images');
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };
  
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        setSelectedFile(file);
        // Create preview URL
        setPreviewUrl(URL.createObjectURL(file));
      }
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      if (!selectedFile) {
        setMessage('Please select an image first!');
        return;
      }
  
      setIsLoading(true);
      setMessage('');
  
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('name', selectedFile.name);
      formData.append('description', 'Uploaded image');
  
      try {
        const response = await fetch('http://localhost:5000/upload', {
          method: 'POST',
          body: formData,
        });
  
        if (response.ok) {
          setMessage('Image uploaded successfully!');
          setSelectedFile(null);
          setPreviewUrl('');
          fetchImages(); // Refresh image list
        } else {
          const error = await response.text();
          setMessage(`Upload failed: ${error}`);
        }
      } catch (error) {
        setMessage(`Error: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <div className="App">
        <h1>Image Upload System</h1>
        
        <div className="upload-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="image">Select Image:</label>
              <input 
                type="file" 
                id="image" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
            </div>
            
            {previewUrl && (
              <div className="preview">
                <h3>Preview:</h3>
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  style={{ maxWidth: '300px', maxHeight: '300px' }} 
                />
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={isLoading || !selectedFile}
            >
              {isLoading ? 'Uploading...' : 'Upload Image'}
            </button>
          </form>
          
          {message && <p className={message.includes('successfully') ? 'success' : 'error'}>{message}</p>}
        </div>
        
        <div className="gallery">
          <h2>Uploaded Images</h2>
          {images.length === 0 ? (
            <p>No images uploaded yet.</p>
          ) : (
            <div className="image-grid">
              {images.map((image) => (
                <div key={image._id} className="image-card">
                  <img 
                    src={`http://localhost:5000/images/${image._id}`} 
                    alt={image.name} 
                  />
                  <p>{image.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
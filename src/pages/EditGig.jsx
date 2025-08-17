import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Save, X, Upload } from 'lucide-react';

const EditGig = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    deliveryTime: '',
    category: 'graphics-design'
  });
  
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch gig data on component mount
  useEffect(() => {
    fetchGig();
  }, [id]);

  const fetchGig = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/gigs/${id}`);
      
      if (response.data.success) {
        const gig = response.data.data;
        setFormData({
          title: gig.title || '',
          description: gig.description || '',
          price: gig.price || '',
          deliveryTime: gig.deliveryTime || '',
          category: gig.category || 'graphics-design'
        });
        setExistingImages(gig.images || []);
      }
    } catch (error) {
      console.error('Error fetching gig:', error);
      setError('Failed to load gig data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 5) {
      setError('You can upload a maximum of 5 images');
      return;
    }

    const newPreviewImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setPreviewImages(newPreviewImages);
    setImages(files);
    setError('');
  };

  const removeNewImage = (index) => {
    const newImages = [...images];
    const newPreviewImages = [...previewImages];
    
    newImages.splice(index, 1);
    newPreviewImages.splice(index, 1);
    
    setImages(newImages);
    setPreviewImages(newPreviewImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      
      // Append form data
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      
      // Append new images if any
      images.forEach(image => {
        formDataToSend.append('images', image);
      });

      const response = await axios.put(`/gigs/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        navigate('/dashboard');
      } else {
        throw new Error(response.data.message || 'Failed to update gig');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update gig');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      previewImages.forEach(image => {
        URL.revokeObjectURL(image.preview);
      });
    };
  }, [previewImages]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">Loading gig data...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Gig</h1>
          
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded-md">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                maxLength="100"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                maxLength="1000"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="5"
                  step="5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Time (days)</label>
                <input
                  type="number"
                  name="deliveryTime"
                  value={formData.deliveryTime}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="graphics-design">Graphics & Design</option>
                <option value="digital-marketing">Digital Marketing</option>
                <option value="writing-translation">Writing & Translation</option>
                <option value="video-animation">Video & Animation</option>
                <option value="music-audio">Music & Audio</option>
                <option value="programming-tech">Programming & Tech</option>
                <option value="business">Business</option>
                <option value="lifestyle">Lifestyle</option>
              </select>
            </div>

            {/* Current Images */}
            {existingImages.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Images</label>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {existingImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={`http://localhost:5000${image}`}
                        alt={`Current image ${index + 1}`}
                        className="h-32 w-full object-cover rounded-md border border-gray-200"
                      />
                      <div className="absolute top-1 right-1 bg-gray-800 bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                        Current
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {existingImages.length > 0 ? 'Replace Images (Optional)' : 'Images (Max 5)'}
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                      <span>Upload files</span>
                      <input
                        type="file"
                        multiple
                        onChange={handleImageChange}
                        accept="image/*"
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                  {existingImages.length > 0 && (
                    <p className="text-xs text-gray-500">
                      Leave empty to keep current images
                    </p>
                  )}
                </div>
              </div>

              {previewImages.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">New Images Preview</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {previewImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image.preview}
                          alt={`New preview ${index + 1}`}
                          className="h-32 w-full object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                          New
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Updating...' : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update Gig
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditGig;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { getUserFavorites } from '../services/gigService';
import GigCard from '../components/GigCard'; // Import the GigCard component

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await getUserFavorites();
      if (response.data.success) {
        setFavorites(response.data.data || []);
      } else {
        throw new Error(response.data.message || 'Failed to fetch favorites');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch favorites');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (gigId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    try {
      // Find the gig in favorites
      const gigToAdd = favorites.find(gig => gig._id === gigId);
      if (!gigToAdd) {
        setError('Gig not found');
        return;
      }

      // Get existing cart from localStorage
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      // Check if gig already exists in cart
      const existingItem = existingCart.find(item => item._id === gigId);
      
      if (existingItem) {
        setError('This gig is already in your cart');
        return;
      }

      // Add gig to cart
      const updatedCart = [...existingCart, gigToAdd];
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      
      // Show success message
      setSuccessMessage('Added to cart successfully!');
      
      // Optionally navigate to cart page
      setTimeout(() => {
        navigate('/cart');
      }, 1000);
      
    } catch (err) {
      setError('Failed to add to cart');
    }
  };

  const toggleFavorite = async (gigId) => {
    try {
      // Implement your toggle favorite logic here
      // This should update the favorites list after toggling
      await fetchFavorites(); // Refetch favorites after toggling
    } catch (err) {
      setError('Failed to update favorites');
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    const baseUrl = 'http://localhost:5000';
    if (!imagePath.startsWith('/')) {
      imagePath = `/${imagePath}`;
    }
    return `${baseUrl}${imagePath}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600">
        <Heart className="w-16 h-16 mb-4" />
        <p className="text-xl">You have no favorite gigs yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Favorite Gigs</h1>
        
        {/* Success message */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
            {successMessage}
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((gig) => (
            <GigCard
              key={gig._id}
              gig={gig}
              isFavorite={true} // Since these are all favorites
              onToggleFavorite={() => toggleFavorite(gig._id)}
              onAddToCart={() => addToCart(gig._id)}
              onView={() => navigate(`/gig/${gig._id}`)} // Or your view logic
              getImageUrl={getImageUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
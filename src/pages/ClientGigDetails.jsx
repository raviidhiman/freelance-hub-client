import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Calendar, Eye } from 'lucide-react';
import { getPublicGig } from '../services/gigService';

const ClientGigDetails = ({ gigId, onBack }) => {
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGig = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getPublicGig(gigId);
        if (response.data.success) {
          setGig(response.data.data);
        } else {
          throw new Error(response.data.message || 'Failed to fetch gig');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch gig');
      } finally {
        setLoading(false);
      }
    };

    if (gigId) {
      fetchGig();
    }
  }, [gigId]);

  const addToCart = () => {
    if (!gig) return;
    const storedCart = localStorage.getItem('cart');
    let cart = storedCart ? JSON.parse(storedCart) : [];
    // Avoid duplicates
    if (!cart.find(item => item._id === gig._id)) {
      cart.push(gig);
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <button 
          onClick={onBack}
          className="mt-4 inline-flex items-center px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Gig Not Found</h2>
        <button 
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button 
        onClick={onBack}
        className="mb-6 inline-flex items-center px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Dashboard
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b">
          <h1 className="text-3xl font-bold">{gig.title}</h1>
          <div className="flex flex-wrap items-center mt-2 gap-4">
            <span className="flex items-center text-base">
              <Calendar className="w-5 h-5 mr-1" />
              {gig.deliveryTime} day{gig.deliveryTime !== 1 ? 's' : ''} delivery
            </span>
            <span className="flex items-center text-base">
              <Eye className="w-5 h-5 mr-1" />
              {gig.views} view{gig.views !== 1 ? 's' : ''}
            </span>
            <span className="flex items-center text-base">
              <Star className="w-5 h-5 text-yellow-500 mr-1" />
              {gig.rating?.toFixed(1) || '0.0'} ({gig.reviewCount || 0} review{gig.reviewCount !== 1 ? 's' : ''})
            </span>
          </div>
        </div>
        {/* Add more details about the gig here */}
        <div className="p-6">
          <button 
            onClick={addToCart}
            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientGigDetails;

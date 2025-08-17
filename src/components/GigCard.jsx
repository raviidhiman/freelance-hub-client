import React, { useState } from 'react';
import { Heart, ShoppingCart, User, Star, Clock, Image as ImageIcon } from 'lucide-react';

const GigCard = ({ gig, isFavorite, onToggleFavorite, onAddToCart, onView, getImageUrl }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageError(false);
    setImageLoading(false);
  };

  // Get the first image or fallback
  const imageUrl = getImageUrl(gig.images?.[0]);

  const handleViewClick = () => {
    onView(gig);
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 hover:border-white/30 group">
      {/* Image Container */}
      <div className="relative h-48 rounded-t-xl overflow-hidden bg-white/5">
        {imageError || !imageUrl ? (
          <div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
            <ImageIcon className="w-12 h-12" />
            <span className="text-sm mt-2">No Image</span>
          </div>
        ) : (
          <>
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              </div>
            )}
            <img
              src={imageUrl}
              alt={gig.title || 'Gig image'}
              className={`w-full h-full object-cover cursor-pointer transition-all duration-300 group-hover:scale-105 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onError={handleImageError}
              onLoad={handleImageLoad}
              onClick={handleViewClick}
            />
          </>
        )}
        
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(gig._id);
          }}
          className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 backdrop-blur-sm ${
            isFavorite 
              ? 'bg-red-500 text-white shadow-lg' 
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Seller Info */}
        <div className="flex items-center mb-2">
          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-300" />
          </div>
          <span className="ml-2 text-sm text-gray-300">
            {gig.seller?.name || gig.seller?.username || 'Anonymous'}
          </span>
        </div>

        {/* Title */}
        <h3 
          className="font-semibold text-white mb-2 line-clamp-2 cursor-pointer hover:text-blue-400 transition-colors"
          onClick={handleViewClick}
        >
          {gig.title || 'Untitled Gig'}
        </h3>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-medium text-white">
              {(gig.rating || 0).toFixed(1)}
            </span>
            <span className="ml-1 text-sm text-gray-300">
              ({gig.reviewCount || 0})
            </span>
          </div>
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm text-gray-300">Starting at</span>
            <span className="ml-1 text-lg font-bold text-white">
              ₹{gig.price || 0}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(gig._id);
            }}
            className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>

        {/* Delivery Time */}
        <div className="flex items-center mt-2 text-sm text-gray-300">
          <Clock className="w-4 h-4 mr-1" />
          {gig.deliveryTime || 0} days delivery
        </div>
      </div>
    </div>
  );
};

export default GigCard;
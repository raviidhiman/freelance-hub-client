import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  getPublicGigs, 
  getUserFavorites, 
  getUserOrders 
} from '../services/gigService';
import ClientSideNav from '../components/ClientSideNav';
import ClientGigDetails from './ClientGigDetails';
import { 
  Package, 
  Search, 
  Heart, 
  User, 
  Star, 
  Image as ImageIcon, 
  ShoppingCart, 
  Clock 
} from 'lucide-react';

const ClientDashboard = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedGig, setSelectedGig] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedGig) {
      fetchData();
    }
  }, [searchTerm, category, priceRange, sortBy, currentPage, selectedGig]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch gigs with search and filter parameters
      const gigsResponse = await getPublicGigs({
        search: searchTerm,
        category: category !== 'all' ? category : undefined,
        minPrice: priceRange === 'low' ? 0 : priceRange === 'mid' ? 51 : priceRange === 'high' ? 201 : undefined,
        maxPrice: priceRange === 'low' ? 50 : priceRange === 'mid' ? 200 : undefined,
        sortBy,
        page: currentPage,
        limit: 12
      });
      
      if (gigsResponse.data && gigsResponse.data.success) {
        setGigs(gigsResponse.data.data.gigs || []);
        setPagination(gigsResponse.data.data.pagination || {
          totalPages: 1,
          currentPage: 1,
          hasNext: false,
          hasPrev: false,
          totalCount: 0
        });
      } else {
        throw new Error(gigsResponse.data?.message || 'Failed to fetch gigs');
      }

      // Fetch user's favorites and orders (if authenticated)
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const [favoritesResponse, ordersResponse] = await Promise.all([
            getUserFavorites().catch(() => ({ data: { data: [] } })),
            getUserOrders().catch(() => ({ data: { data: [] } }))
          ]);
          
          setFavorites(favoritesResponse.data?.data || []);
          setOrders(ordersResponse.data?.data || []);
        } catch (err) {
          console.warn('Failed to fetch user data:', err);
        }
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch data');
      setGigs([]);
      setPagination({
        totalPages: 1,
        currentPage: 1,
        hasNext: false,
        hasPrev: false,
        totalCount: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchData();
  };

  const toggleFavorite = async (gigId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const isFavorite = favorites.some(fav => fav._id === gigId);
      
      if (isFavorite) {
        await axios.delete(`/user/favorites/${gigId}`);
        setFavorites(prev => prev.filter(fav => fav._id !== gigId));
      } else {
        await axios.post(`/user/favorites/${gigId}`);
        const gigToAdd = gigs.find(gig => gig._id === gigId);
        if (gigToAdd) {
          setFavorites(prev => [...prev, gigToAdd]);
        }
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
      setError('Failed to update favorites');
    }
  };

  const addToCart = (gigId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const gigToAdd = gigs.find(gig => gig._id === gigId);
    if (!gigToAdd) {
      setError('Gig not found');
      return;
    }

    try {
      let cart = [];
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        cart = JSON.parse(storedCart);
      }
      // Avoid duplicates
      if (!cart.some(item => item._id === gigId)) {
        cart.push(gigToAdd);
        localStorage.setItem('cart', JSON.stringify(cart));
      }
      navigate('/cart');
    } catch (err) {
      console.error('Failed to add to cart:', err);
      setError('Failed to add to cart');
    }
  };

  // Function to get the correct image URL for public folder images
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    // If it's already a full URL (starts with http/https), return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    // Prepend backend base URL for relative paths
    const baseUrl = 'http://localhost:5000';
    if (!imagePath.startsWith('/')) {
      imagePath = `/${imagePath}`;
    }

    return `${baseUrl}${imagePath}`;
  };

 
  if (selectedGig) {
    return <ClientGigDetails gigId={selectedGig._id} onBack={() => setSelectedGig(null)} />;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <ClientSideNav />
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white">Browse Gigs</h1>
                <p className="text-gray-300 mt-1">Find the perfect service for your needs</p>
              </div>
              <div>
                <button
                  onClick={() => navigate('/favorites')}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  View Favorites
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl mb-6 p-6 border border-white/20">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search for services..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white backdrop-blur-sm"
                >
                  <option value="all" className="bg-gray-800">All Categories</option>
                  <option value="web-development" className="bg-gray-800">Web Development</option>
                  <option value="graphics-design" className="bg-gray-800">Graphic Design</option>
                  <option value="digital-marketing" className="bg-gray-800">Digital Marketing</option>
                  <option value="writing-translation" className="bg-gray-800">Writing & Translation</option>
                  <option value="video-animation" className="bg-gray-800">Video & Animation</option>
                  <option value="music-audio" className="bg-gray-800">Music & Audio</option>
                  <option value="programming-tech" className="bg-gray-800">Programming & Tech</option>
                  <option value="business" className="bg-gray-800">Business</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Price Range</label>
                <select
                  value={priceRange}
                  onChange={(e) => {
                    setPriceRange(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white backdrop-blur-sm"
                >
                  <option value="all" className="bg-gray-800">All Prices</option>
                  <option value="low" className="bg-gray-800">₹0 - ₹50</option>
                  <option value="mid" className="bg-gray-800">₹50 - ₹200</option>
                  <option value="high" className="bg-gray-800">₹200+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white backdrop-blur-sm"
                >
                  <option value="newest" className="bg-gray-800">Newest First</option>
                  <option value="oldest" className="bg-gray-800">Oldest First</option>
                  <option value="price-low" className="bg-gray-800">Price: Low to High</option>
                  <option value="price-high" className="bg-gray-800">Price: High to Low</option>
                  <option value="rating" className="bg-gray-800">Best Rating</option>
                  <option value="popular" className="bg-gray-800">Most Popular</option>
                </select>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-400/50 rounded-md">
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {/* Gigs Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl animate-pulse border border-white/20">
                  <div className="h-48 bg-white/20 rounded-t-xl"></div>
                  <div className="p-4">
                    <div className="h-4 bg-white/20 rounded mb-2"></div>
                    <div className="h-3 bg-white/20 rounded mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-white/20 rounded w-16"></div>
                      <div className="h-4 bg-white/20 rounded w-12"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : gigs.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No gigs found</h3>
              <p className="text-gray-300">Try adjusting your search criteria or browse all categories.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {gigs.map((gig) => (
                <GigCard
                  key={gig._id}
                  gig={gig}
                  isFavorite={favorites.some(fav => fav._id === gig._id)}
                  onToggleFavorite={toggleFavorite}
                  onAddToCart={addToCart}
                  onView={() => setSelectedGig(gig)}
                  getImageUrl={getImageUrl}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center">
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md border border-white/20 text-sm font-medium text-gray-300 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                {[...Array(pagination.totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      currentPage === index + 1
                        ? 'bg-blue-600 text-white'
                        : 'border border-white/20 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="px-3 py-1 rounded-md border border-white/20 text-sm font-medium text-gray-300 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


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
              onClick={onView}
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
          onClick={onView}
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

export default ClientDashboard;
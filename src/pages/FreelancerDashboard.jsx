import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  getMyGigs, 
  getMyGigsStats, 
  deleteGig, 
  updateGigStatus 
} from '../services/gigService';
import FreelancerSideNav from '../components/FreelancerSideNav';
import FreelancerGigDetails from './FreelancerGigDetails';
import { 
  Package, 
  CheckCircle, 
  Clock, 
  Pause, 
  AlertCircle, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  Star, 
  TrendingUp, 
  Image as ImageIcon 
} from 'lucide-react';

const Dashboard = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [stats, setStats] = useState({
    totalGigs: 0,
    activeGigs: 0,
    pendingGigs: 0,
    pausedGigs: 0,
    draftGigs: 0,
    rejectedGigs: 0,
    totalViews: 0,
    totalOrders: 0
  });
  const [selectedGig, setSelectedGig] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedGig) {
      fetchGigs();
      fetchStats();
    }
  }, [filter, currentPage, selectedGig]);

  const fetchGigs = async () => {
    try {
      setLoading(true);
      const response = await getMyGigs({
        status: filter,
        page: currentPage,
        limit: 10
      });
      
      if (response.data.success) {
        setGigs(response.data.data.gigs || []);
        setPagination(response.data.data.pagination || {
          totalPages: 1,
          currentPage: 1,
          hasNext: false,
          hasPrev: false,
          totalCount: 0
        });
      } else {
        throw new Error(response.data.message || 'Failed to fetch gigs');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch gigs');
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

  const fetchStats = async () => {
    try {
      const response = await getMyGigsStats();
      
      if (response.data.success) {
        setStats(response.data.data || {
          totalGigs: 0,
          activeGigs: 0,
          pendingGigs: 0,
          totalViews: 0,
          totalOrders: 0
        });
      } else {
        throw new Error(response.data.message || 'Failed to fetch stats');
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch statistics');
      setStats({
        totalGigs: 0,
        activeGigs: 0,
        pendingGigs: 0,
        totalViews: 0,
        totalOrders: 0
      });
    }
  };

  const handleDeleteGig = async (gigId) => {
    if (!window.confirm('Are you sure you want to delete this gig?')) return;
    
    try {
      await deleteGig(gigId);
      
      // Optimistic UI update
      setGigs(prevGigs => prevGigs.filter(gig => gig._id !== gigId));
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete gig');
      fetchGigs(); // Re-fetch if deletion failed
    }
  };

  const handleStatusChange = async (gigId, newStatus) => {
    try {
      await updateGigStatus(gigId, newStatus);
      
      // Optimistic UI update
      setGigs(prevGigs => 
        prevGigs.map(gig => 
          gig._id === gigId ? { ...gig, status: newStatus } : gig
        )
      );
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update status');
      fetchGigs(); // Re-fetch if update failed
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'paused': return 'text-gray-600 bg-gray-100';
      case 'draft': return 'text-blue-600 bg-blue-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'paused': return <Pause className="w-4 h-4" />;
      case 'rejected': return <AlertCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
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

  if (loading && gigs.length === 0) {
    return (
      <div className="flex h-screen">
                <FreelancerSideNav />
        <div className="flex-1 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      </div>
    );
  }

  if (selectedGig) {
    return <FreelancerGigDetails gigId={selectedGig._id} onBack={() => setSelectedGig(null)} />;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
              <FreelancerSideNav />
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white">Freelancer Dashboard</h1>
                <p className="text-gray-300 mt-1">Manage and track your gig performance</p>
              </div>
              <Link
                to="/create-gig"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create New Gig
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-6 border border-white/20">
              <div className="flex items-center">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Package className="w-6 h-6 text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-300">Total Gigs</p>
                  <p className="text-2xl font-bold text-white">{stats.totalGigs}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-6 border border-white/20">
              <div className="flex items-center">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-300">Active</p>
                  <p className="text-2xl font-bold text-white">{stats.activeGigs}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-6 border border-white/20">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-300">Pending</p>
                  <p className="text-2xl font-bold text-white">{stats.pendingGigs}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-6 border border-white/20">
              <div className="flex items-center">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Eye className="w-6 h-6 text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-300">Total Views</p>
                  <p className="text-2xl font-bold text-white">{stats.totalViews}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-6 border border-white/20">
              <div className="flex items-center">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-indigo-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-300">Total Orders</p>
                  <p className="text-2xl font-bold text-white">{stats.totalOrders}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl mb-6 border border-white/20">
            <div className="px-6 py-4 border-b border-white/20">
              <div className="flex space-x-4">
                {['all', 'active', 'pending', 'paused', 'draft', 'rejected'].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setFilter(status);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      filter === status
                        ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mx-6 mt-4 p-4 bg-red-500/20 border border-red-400/50 rounded-md">
                <p className="text-red-300">{error}</p>
              </div>
            )}

            {/* Gigs List */}
            <div className="divide-y divide-white/10">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
                  <p className="text-gray-300 mt-2">Loading gigs...</p>
                </div>
              ) : gigs.length === 0 ? (
                <div className="p-8 text-center">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300 text-lg">No gigs found</p>
                  <p className="text-gray-400 text-sm mb-4">
                    {filter === 'all' 
                      ? "You haven't created any gigs yet." 
                      : `No ${filter} gigs found.`
                    }
                  </p>
                  <Link
                    to="/create-gig"
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Gig
                  </Link>
                </div>
              ) : (
                gigs.map((gig) => (
                  <GigCard
                    key={gig._id}
                    gig={gig}
                    onDelete={handleDeleteGig}
                    onStatusChange={handleStatusChange}
                    onEdit={() => navigate(`/edit-gig/${gig._id}`)}
                    onView={() => setSelectedGig(gig)}
                    getStatusColor={getStatusColor}
                    getStatusIcon={getStatusIcon}
                  />
                ))
              )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-white/20">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-300">
                    Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, pagination.totalCount)} of {pagination.totalCount} gigs
                  </div>
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


const GigCard = ({ gig, onDelete, onStatusChange, onEdit, onView, getStatusColor, getStatusIcon }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.dropdown-container')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

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
    <div className="p-6 hover:bg-white/5 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-2">
            {/* Image Container */}
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center relative border border-white/20">
              {imageError || !imageUrl ? (
                <div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
                  <ImageIcon className="w-6 h-6" />
                  <span className="text-xs mt-1">No Image</span>
                </div>
              ) : (
                <>
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/10">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                    </div>
                  )}
                  <img
                    src={imageUrl}
                    alt={gig.title || 'Gig image'}
                    className={`w-full h-full object-cover transition-opacity ${
                      imageLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                  />
                </>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white truncate">
                {gig.title || 'Untitled Gig'}
              </h3>
              <p className="text-sm text-gray-300 truncate">
                {gig.description || 'No description available'}
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(gig.status)}`}>
                  {getStatusIcon(gig.status)}
                  <span className="ml-1">{gig.status?.charAt(0).toUpperCase() + gig.status?.slice(1) || 'Unknown'}</span>
                </span>
                <div className="flex items-center text-sm text-gray-300">
                  <span className="mr-1">₹</span>
                  {gig.price || 0}
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <Calendar className="w-4 h-4 mr-1" />
                  {gig.deliveryTime || 0} days
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 ml-4">
          <div className="text-right">
            <div className="flex items-center text-sm text-gray-300 mb-1">
              <Eye className="w-4 h-4 mr-1" />
              {gig.views || 0} views
            </div>
            <div className="flex items-center text-sm text-gray-300">
              <Star className="w-4 h-4 mr-1" />
              {(gig.rating || 0).toFixed(1)} ({gig.reviewCount || 0})
            </div>
          </div>

          <div className="relative dropdown-container">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Gig options"
            >
              <MoreVertical className="w-5 h-5 text-gray-300" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800/95 backdrop-blur-md rounded-md shadow-lg z-10 border border-white/20">
                <div className="py-1">
                  <button
                    onClick={() => {
                      onView();
                      setShowDropdown(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-white/10"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Gig
                  </button>
                  <button
                    onClick={() => {
                      onEdit();
                      setShowDropdown(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-white/10"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                  
                  {gig.status === 'active' && (
                    <button
                      onClick={() => {
                        onStatusChange(gig._id, 'paused');
                        setShowDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-white/10"
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </button>
                  )}
                  
                  {gig.status === 'paused' && (
                    <button
                      onClick={() => {
                        onStatusChange(gig._id, 'active');
                        setShowDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-white/10"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Activate
                    </button>
                  )}
                  {(gig.status === 'pending' || gig.status === 'draft' || gig.status === 'rejected') && (
                    <button
                      onClick={() => {
                        onStatusChange(gig._id, 'active');
                        setShowDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-white/10"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Activate
                    </button>
                  )}
                  
                  {gig.status !== 'pending' && (
                    <button
                      onClick={() => {
                        onStatusChange(gig._id, 'pending');
                        setShowDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-white/10"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Set Pending
                    </button>
                  )}
                  
                  {gig.status !== 'draft' && (
                    <button
                      onClick={() => {
                        onStatusChange(gig._id, 'draft');
                        setShowDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-white/10"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Set Draft
                    </button>
                  )}
                  
                  {gig.status !== 'rejected' && (
                    <button
                      onClick={() => {
                        onStatusChange(gig._id, 'rejected');
                        setShowDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-white/10"
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Set Rejected
                    </button>
                  )}
                  
                  <hr className="my-1 border-white/20" />
                  <button
                    onClick={() => {
                      onDelete(gig._id);
                      setShowDropdown(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
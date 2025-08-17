import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Save, Edit } from 'lucide-react';
import SideNav from '../components/FreelancerSideNav';

const FreelancerProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/user/profile');
      if (response.data.success) {
        setProfile({
          name: response.data.data.name || '',
          email: response.data.data.email || '',
          password: ''
        });
      } else {
        setError('Failed to load profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const updateData = { name: profile.name, email: profile.email };
      if (profile.password) {
        updateData.password = profile.password;
      }
      const response = await axios.put('/user/profile', updateData);
      if (response.data.success) {
        setSuccess('Profile updated successfully');
        setProfile({ ...profile, password: '' });
      } else {
        setError('Failed to update profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <SideNav />
        <div className="flex-1 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <SideNav />
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Freelancer Profile</h1>
            <p className="text-gray-300 mt-1">Manage your account information</p>
          </div>

          {/* Profile Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl border border-white/20">
            <div className="p-6">
              {/* Profile Header */}
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold text-white">
                    {profile.name || 'Your Name'}
                  </h2>
                  <p className="text-gray-300">{profile.email}</p>
                </div>
                <div className="ml-auto">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Edit className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
              </div>

              {/* Alert Messages */}
              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-400/50 rounded-lg">
                  <p className="text-red-300">{error}</p>
                </div>
              )}
              
              {success && (
                <div className="mb-6 p-4 bg-green-500/20 border border-green-400/50 rounded-lg">
                  <p className="text-green-300">{success}</p>
                </div>
              )}

              {/* Profile Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Lock className="w-4 h-4 inline mr-2" />
                    New Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={profile.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm"
                    placeholder="Leave blank to keep current password"
                  />
                  <p className="text-gray-400 text-sm mt-1">
                    Only fill this field if you want to change your password
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Update Profile
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setProfile({
                        name: '',
                        email: '',
                        password: ''
                      });
                      fetchProfile();
                    }}
                    className="px-6 py-3 bg-white/10 text-gray-300 font-semibold rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/20"
                  >
                    Reset Form
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Additional Profile Information */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Account Status */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-6 border border-white/20">
              <div className="flex items-center">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <User className="w-6 h-6 text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-300">Account Status</p>
                  <p className="text-lg font-bold text-white">Active</p>
                </div>
              </div>
            </div>

            {/* Member Since */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-6 border border-white/20">
              <div className="flex items-center">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Mail className="w-6 h-6 text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-300">Email Status</p>
                  <p className="text-lg font-bold text-white">Verified</p>
                </div>
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfile;
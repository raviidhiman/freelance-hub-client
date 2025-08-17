import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Update to your deployed server
});

// Add token to all requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Freelancer gigs APIs
export const createGig = (data) => API.post('/gigs', data);
export const getGigs = () => API.get('/gigs');
export const getGigById = (id) => API.get(`/gigs/${id}`);

export const getMyGigs = (params) => API.get('/gigs/user/my-gigs', { params });
export const getMyGigsStats = () => API.get('/gigs/user/my-gigs/stats');
export const deleteGig = (gigId) => API.delete(`/gigs/${gigId}`);
export const updateGigStatus = (gigId, status) => API.patch(`/gigs/${gigId}/status`, { status });

// Client gigs APIs
export const getPublicGigs = (params) => API.get('/gigs/public', { params });
export const getPublicGig = (id) => API.get(`/gigs/public/${id}`);
export const getUserFavorites = () => API.get('/user/favorites');
export const addUserFavorite = (gigId) => API.post(`/user/favorites/${gigId}`);
export const deleteUserFavorite = (gigId) => API.delete(`/user/favorites/${gigId}`);
export const getUserOrders = () => API.get('/orders/my-orders');
export const addOrder = (gigId) => API.post('/orders', { gigId });

// User profile APIs
export const getUserProfile = () => API.get('/user/profile');
export const updateUserProfile = (profileData) => API.put('/user/profile', profileData);

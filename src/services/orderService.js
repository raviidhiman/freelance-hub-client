import axios from 'axios';

export const getMyOrders = async () => {
  try {
    const response = await axios.get('/orders/my-orders');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getFreelancerOrders = async () => {
  try {
    const response = await axios.get('/orders/freelancer-orders');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.patch(`/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

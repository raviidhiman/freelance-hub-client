import axios from 'axios';

export const sendMessage = async (receiverId, content) => {
  try {
    const response = await axios.post('/messages', { receiverId, content });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getMessages = async (userId) => {
  try {
    const response = await axios.get(`/messages/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

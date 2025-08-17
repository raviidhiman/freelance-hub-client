import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SocketContext } from '../context/SocketContext';
import { sendOrderMessage, getOrderMessages } from '../services/chatService';
import { getOrderById } from '../services/orderService';

const OrderChat = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrderAndMessages();
  }, [orderId]);

  const fetchOrderAndMessages = async () => {
    try {
      setLoading(true);
      const [orderRes, messagesRes] = await Promise.all([
        getOrderById(orderId),
        getOrderMessages(orderId)
      ]);

      if (orderRes.success && messagesRes.success) {
        setOrder(orderRes.data);
        setMessages(messagesRes.data);
      } else {
        setError('Failed to load order or messages');
      }
    } catch (err) {
      setError(err.message || 'Failed to load order or messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    try {
      await sendOrderMessage(orderId, input.trim());
      setInput('');
      fetchOrderAndMessages();
    } catch (err) {
      setError('Failed to send message');
    }
  };

  const handleReturnToDashboard = () => {
    if (order?.client?._id === localStorage.getItem('userId')) {
      navigate('/client-dashboard');
    } else {
      navigate('/freelancer-dashboard');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Order Chat</h2>
          <p className="text-sm text-gray-600">
            {order?.gig?.title || 'Loading...'}
          </p>
        </div>
        <button
          onClick={handleReturnToDashboard}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Return to Dashboard
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender._id === localStorage.getItem('userId') ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.sender._id === localStorage.getItem('userId')
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-800'
                }`}
              >
                <p>{msg.content}</p>
                <p className="text-xs mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t p-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 border rounded px-3 py-2"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderChat;

import React, { useState, useEffect } from 'react';
import { getFreelancerOrders, updateOrderStatus } from '../services/orderService';
import { Link } from 'react-router-dom';

const FreelancerOrdersDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getFreelancerOrders();
      if (response.success) {
        setOrders(response.data);
      } else {
        setError('Failed to fetch orders');
      }
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await updateOrderStatus(orderId, newStatus);
      if (response.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        setError('Failed to update order status');
      }
    } catch (err) {
      setError('Failed to update order status');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Freelancer Orders</h1>
      <div className="mb-4">
        <Link to="/chat" className="text-blue-600 hover:underline">
          Go to Chat
        </Link>
      </div>
      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Gig</th>
              <th className="border border-gray-300 px-4 py-2">Client</th>
              <th className="border border-gray-300 px-4 py-2">Amount</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="text-center">
                <td className="border border-gray-300 px-4 py-2">{order.gig.title}</td>
                <td className="border border-gray-300 px-4 py-2">{order.client.name}</td>
                <td className="border border-gray-300 px-4 py-2">₹{order.amount}</td>
                <td className="border border-gray-300 px-4 py-2">{order.status}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FreelancerOrdersDashboard;

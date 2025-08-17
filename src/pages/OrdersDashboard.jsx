import React, { useState, useEffect } from 'react';
import { getMyOrders, updateOrderStatus } from '../services/orderService';
import { Link } from 'react-router-dom';
import ClientSideNav from '../components/ClientSideNav';

const OrdersDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getMyOrders();
      if (data.success) {
        setOrders(data.data);
      } else {
        setError('Failed to fetch orders');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const data = await updateOrderStatus(orderId, newStatus);
      if (data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        alert('Failed to update order status');
      }
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <ClientSideNav />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen">
        <ClientSideNav />
        <div className="flex-1 flex items-center justify-center text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <ClientSideNav />
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Gig</th>
                <th className="py-2 px-4 border-b">Client</th>
                <th className="py-2 px-4 border-b">Freelancer</th>
                <th className="py-2 px-4 border-b">Amount</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Created At</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="text-center">
                  <td className="py-2 px-4 border-b">{order.gig?.title || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{order.client?.name || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{order.freelancer?.name || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">₹{order.amount.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b capitalize">{order.status}</td>
                  <td className="py-2 px-4 border-b">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border-b">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      disabled={updatingOrderId === order._id}
                      className="border rounded px-2 py-1"
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
      </main>
    </div>
  );
};

export default OrdersDashboard;

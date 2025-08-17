import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import { SocketContext } from "./context/SocketContext";
import Splash from "./pages/Splash";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Forgot from "./pages/Forgot";
import Dashboard from "./pages/FreelancerDashboard";
import CreateGig from "./pages/CreateGig";
import EditGig from "./pages/EditGig";
import FreelancerGigDetails from "./pages/FreelancerGigDetails";
import ClientGigDetails from "./pages/ClientGigDetails";
import ClientDashboard from "./pages/ClientDashboard";
import ClientProfile from "./pages/ClientProfile";
import Favorites from "./pages/Favorites";
import FreelancerProfile from "./pages/FreelancerProfile";
import OrdersDashboard from "./pages/OrdersDashboard";
import FreelancerOrdersDashboard from "./pages/FreelancerOrdersDashboard";
import Cart from "./pages/Cart";
import ChatPage from "./pages/ChatPage";
import MyOrders from "./pages/MyOrders";

// Configure axios defaults
axios.defaults.baseURL = "http://localhost:5000/api"; // Adjust this to your backend URL
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const App = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const backendUrl = "http://localhost:5000";
    const newSocket = io(backendUrl, {
      withCredentials: true,
    });
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      <Router>
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<Splash />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot" element={<Forgot />} />
          
          {/* Freelancer Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-gig" element={<CreateGig />} />
          <Route path="/edit-gig/:id" element={<EditGig />} />
          <Route path="/freelancer-profile" element={<FreelancerProfile />} />
          
          {/* Gig Routes */}
          <Route
            path="/gig/:gigId"
            element={
              (() => {
                const userRole = localStorage.getItem('userRole');
                if (userRole === 'freelancer') {
                  return <FreelancerGigDetails />;
                } else if (userRole === 'client') {
                  return <ClientGigDetails />;
                } else {
                  return null;
                }
              })()
            }
          />
          
          
          {/* Client Routes */}
          <Route path="/client" element={<ClientDashboard />} />
          <Route path="/client-profile" element={<ClientProfile />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/my-orders" element={<MyOrders />} />
          
          {/* Orders Route */}
          <Route path="/orders" element={<OrdersDashboard />} />
          <Route path="/freelancer-orders-dashboard" element={<FreelancerOrdersDashboard />} />
          {/* Cart Route */}
          <Route path="/cart" element={<Cart />} />
          {/* Chat Route */}
          <Route path="/chat" element={<ChatPage userId={null} />} />
        </Routes>
      </Router>
    </SocketContext.Provider>
  );
};

export default App;

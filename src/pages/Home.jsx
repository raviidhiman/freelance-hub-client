// src/pages/Home.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaGoogle, FaFacebook, FaTwitter } from 'react-icons/fa'

const Home = () => {
  const navigate = useNavigate()

  return (
    <div
      className="h-screen w-full bg-cover bg-center relative flex items-center justify-center"
      style={{ backgroundImage: "url('/bg-home.jpg')" }} // ✅ Replace with your actual filename
    >
      {/* Glassmorphic Card */}
      <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-xl shadow-lg p-8 w-80 text-center text-white z-10">
        {/* App Name */}
        <h1 className="text-3xl font-bold mb-6">Freehub</h1>

        {/* Buttons */}
        <button
          onClick={() => navigate('/login')}
          className="w-full bg-white/20 text-white py-2 mb-3 rounded-md font-medium backdrop-blur-sm hover:bg-white/30 transition"
        >
          Login
        </button>

        <button
          onClick={() => navigate('/register')}
          className="w-full bg-white/20 text-white py-2 mb-6 rounded-md font-medium backdrop-blur-sm hover:bg-white/30 transition"
        >
          Register
        </button>

        
      </div>

      {/* Optional Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/40 z-0" />
    </div>
  )
}

export default Home

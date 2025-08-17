// src/pages/Splash.jsx
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Splash = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home')
    }, 5000) // 5 seconds
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div
      className="h-screen w-full bg-cover bg-center flex flex-col items-center justify-center relative"
      style={{ backgroundImage: "url('/hero-image.png')" }} // ✅ Your background image
    >
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      {/* Logo */}
      <img src="/logo.png" alt="Freehub Icon" className="w-20 h-20 z-10" />

      {/* App Name */}
      <h1 className="text-4xl font-bold text-white mt-4 z-10">Freehub</h1>

      {/* Slogan */}
      <p className="text-white mt-2 z-10 text-lg italic">Work Freely. Hire Smartly.</p>
    </div>
  )
}

export default Splash

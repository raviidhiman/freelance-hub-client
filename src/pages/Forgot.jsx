import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Forgot = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleDelete = async () => {
    if (!email) return alert("Please enter your email")
    try {
      const res = await fetch('http://localhost:5000/api/auth/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (res.ok) {
        setMessage('Account deleted. You can now register again.')
        setTimeout(() => navigate('/register'), 2000)
      } else {
        setMessage(data.msg)
      }
    } catch (err) {
      setMessage('Server error.')
    }
  }

  return (
    <div
      className="h-screen w-full bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: "url('/bg-home.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/40 z-0" />

      <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-xl shadow-lg p-8 w-80 text-white z-10">
        <h2 className="text-2xl font-bold mb-5 text-center">Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full px-3 py-2 mb-3 rounded bg-white/20 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button onClick={handleDelete} className="w-full bg-white/30 py-2 rounded hover:bg-white/40">
          Delete Account
        </button>

        {message && <p className="mt-3 text-center text-sm">{message}</p>}

        <p className="text-sm text-center mt-4">
          <span onClick={() => navigate('/login')} className="underline cursor-pointer text-blue-300">
            Back to Login
          </span>
        </p>
      </div>
    </div>
  )
}

export default Forgot

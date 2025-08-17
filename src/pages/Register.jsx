import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'client' })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (res.ok) {
        alert('Registration successful. Please log in.')
        navigate('/login')
      } else {
        alert(data.msg)
      }
    } catch (err) {
      alert('Registration failed')
    }
  }

  return (
    <div
      className="h-screen w-full bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: "url('/bg-home.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/40 z-0" />

      <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-xl shadow-lg p-8 w-80 text-white z-10">
        <h2 className="text-2xl font-bold mb-5 text-center">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-white/20 focus:outline-none"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-white/20 focus:outline-none"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-white/20 focus:outline-none"
            required
          />
          <select
            name="role"
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-white/20"
          >
            <option value="client">Client</option>
            <option value="freelancer">Freelancer</option>
          </select>
          <button className="w-full bg-white/30 py-2 rounded font-medium hover:bg-white/40">
            Register
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{' '}
          <span onClick={() => navigate('/login')} className="underline cursor-pointer text-blue-300">
            Login
          </span>
        </p>
      </div>
    </div>
  )
}

export default Register

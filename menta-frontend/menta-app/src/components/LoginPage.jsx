import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await fetch('http://127.0.0.1:8000/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (formData.rememberMe) {
          localStorage.setItem('token', data.access_token);
        } else {
          sessionStorage.setItem('token', data.access_token);
        }
        login(data.access_token);
        navigate('/feed');
      } else {
        setErrorMessage('Invalid email or password');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Error logging in');
    }
  };

  useEffect(() => {
    const container = document.getElementById('background-container');
    container.style.background = 'linear-gradient(to right, #0f0c29, #302b63, #24243e)'; // Initial space-themed background
    for (let i = 0; i < 100; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.animation = `twinkle ${Math.random() * 5 + 5}s linear ${Math.random() * 1 + 1}s infinite`;
      star.style.top = `${Math.random() * window.innerHeight}px`;
      star.style.left = `${Math.random() * window.innerWidth}px`;
      container.appendChild(star);
    }
  }, []);

  const handleMouseEnter = () => {
    const container = document.getElementById('background-container');
    container.style.background = 'linear-gradient(to right, #0f0c29, #302b63, #24243e)';
    container.style.backgroundSize = '200% 200%';
    container.style.backgroundPosition = 'right center';
    container.style.transition = 'background 0.3s ease-in-out, background-position 1s ease-in-out';
    
    const stars = document.getElementsByClassName('star');
    for (let star of stars) {
      star.style.top = `${Math.random() * window.innerHeight}px`;
      star.style.left = `${Math.random() * window.innerWidth}px`;
      star.style.transition = 'top 1s ease-in-out, left 1s ease-in-out';
    }
  };

  const handleMouseLeave = () => {
    const container = document.getElementById('background-container');
    container.style.background = 'linear-gradient(to right, #0f0c29, #302b63, #24243e)';
    container.style.backgroundSize = '200% 200%';
    container.style.backgroundPosition = 'left center';
    container.style.transition = 'background 0.3s ease-in-out, background-position 1.5s ease-in-out';
    
    const stars = document.getElementsByClassName('star');
    for (let star of stars) {
      star.style.top = `${Math.random() * window.innerHeight}px`;
      star.style.left = `${Math.random() * window.innerWidth}px`;
      star.style.transition = 'top 1.5s ease-in-out, left 1.5s ease-in-out';
    }

    setTimeout(() => {
      container.style.background = 'linear-gradient(to right, #0f0c29, #302b63, #24243e)'; // Retain the space-themed background
      container.style.backgroundSize = 'initial';
      container.style.backgroundPosition = 'initial';
    }, 1500); // Delay the background color reset to match the transition duration
  };

  return (
    <div
      id="background-container"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <style>
        {`
          .star {
            position: absolute;
            width: 2px;
            height: 2px;
            border-radius: 5px;
            background: rgba(255, 255, 255, 0);
          }
          @keyframes twinkle {
            0% {
              transform: scale(1, 1);
              background: rgba(255, 255, 255, 0);
              animation-timing-function: linear;
            }
            40% {
              transform: scale(0.8, 0.8);
              background: rgba(255, 255, 255, 1);
              animation-timing-function: ease-out;
            }
            80% {
              background: rgba(255, 255, 255, 0);
              transform: scale(1, 1);
            }
            100% {
              background: rgba(255, 255, 255, 0);
              transform: scale(1, 1);
            }
          }
        `}
      </style>
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center font-inter">Login</h2>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-gray-700">Remember me</label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-3xl hover:bg-blue-600"
          >
            Log In
          </button>
        </form>
        <div className="text-center mt-4">
          <Link to="/forgot-password" className="text-blue-500 hover:underline">Forgot Your Password?</Link> 
          <p className="mt-2">
            <Link to="/signup" className="text-blue-500 hover:underline">Create a New Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

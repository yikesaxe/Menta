import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import moonImage from '../assets/moon.png';

function HomePage() {
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

  return (
    <div id="background-container" className="min-h-screen flex items-center justify-center relative overflow-hidden">
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
      <div className="text-left z-20">
        <h1 className="text-8xl font-bold text-white font-inter mb-4">Track. Your.</h1>
        <h1 className="text-8xl font-bold text-white font-inter mb-4">
          Dreams. <span className="text-blue-300">Menta</span>.
        </h1>
        <h1 className="text-4xl font-bold text-white font-inter">Do what you love and share it with others today.</h1>
        <Link to="/signup">
          <button className="mt-6 bg-blue-500 text-white text-center text-2xl font-inter py-3 px-6 rounded-sm hover:bg-blue-600 transition duration-300">
            Get Started
          </button>
        </Link>
      </div>
      <div
        className="ml-8 relative group z-20"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img src={moonImage} alt="Moon" className="w-96 h-auto relative z-20" />
      </div>
    </div>
  );
}

export default HomePage;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const interestsList = [
  'Reading', 'Writing', 'Chess', 'Coding', 'Mathematics', 'Science', 'History', 'Philosophy', 'Debating', 'Public Speaking', 
  'Critical Thinking', 'Puzzles', 'Board Games', 'Music', 'Art', 'Photography', 'Creative Writing', 'Programming', 'Robotics', 
  'Astronomy', 'Physics', 'Chemistry', 'Biology', 'Engineering', 'Economics', 'Psychology', 'Sociology', 'Political Science', 
  'Linguistics', 'Computer Science', 'Artificial Intelligence', 'Machine Learning', 'Data Science'
];

function AccountCreation() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    dob: { month: '', day: '', year: '' },
    interests: []
  });

  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [otherErrorMessage, setOtherErrorMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'month' || name === 'day' || name === 'year') {
      if (/^\d*$/.test(value)) { // Only allow numbers
        setFormData((prevData) => ({
          ...prevData,
          dob: { ...prevData.dob, [name]: value },
        }));
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    setEmailErrorMessage('');
    setOtherErrorMessage('');

    try {
      const response = await fetch('http://127.0.0.1:8000/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      if (response.ok) {
        setCurrentStep(2);
      } else {
        const errorData = await response.json();
        if (errorData.detail === "Email already registered") {
          setEmailErrorMessage("This email address is already taken");
        } else {
          setOtherErrorMessage(errorData.detail || 'Error checking email');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setOtherErrorMessage('Error checking email');
    }
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setOtherErrorMessage('');
    setCurrentStep(currentStep + 1);
  };

  const handleBackStep = (e) => {
    e.preventDefault();
    setOtherErrorMessage('');
    setCurrentStep(currentStep - 1);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setEmailErrorMessage('');
    setOtherErrorMessage('');

    const userData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      password: formData.password,
      dob: `${formData.dob.month}-${formData.dob.day}-${formData.dob.year}`,
      interests: formData.interests
    };

    try {
      console.log('Submitting user data:', userData); // Log user data for debugging
      const response = await fetch('http://127.0.0.1:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        alert('Account created successfully');
        window.location.href = '/login';
      } else {
        const errorData = await response.json();
        console.error('Error creating account:', errorData); // Log error data for debugging
        setOtherErrorMessage(errorData.detail || 'Error creating account');
      }
    } catch (error) {
      console.error('Error:', error);
      setOtherErrorMessage('Error creating account');
    }
  };

  const handleInterestClick = (interest) => {
    setFormData((prevData) => {
      const newInterests = prevData.interests.includes(interest)
        ? prevData.interests.filter((i) => i !== interest)
        : [...prevData.interests, interest];
      return { ...prevData, interests: newInterests };
    });
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
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md relative mt-12">
        {currentStep > 1 && (
          <button onClick={handleBackStep} className="absolute top-4 left-4 bg-gray-200 p-2 rounded-full">
            <svg className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <h2 className="text-2xl font-bold mb-6 text-center font-inter pt-10">
          {currentStep === 1 ? 'Sign Up' : currentStep === 3 ? 'So what are you interested in...' : "Let's learn a little more about you..."}
        </h2>
        {otherErrorMessage && <p className="text-red-500 mb-4">{otherErrorMessage}</p>}
        <form onSubmit={currentStep === 1 ? handleInitialSubmit : handleFinalSubmit}>
          {currentStep === 1 && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded ${emailErrorMessage ? 'border-red-500' : ''}`}
                  required
                />
                {emailErrorMessage && <p className="text-red-500 mt-1">{emailErrorMessage}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-3xl hover:bg-blue-600"
              >
                Next
              </button>
              <p className="mt-4 text-center">
                Already have an account? <Link to="/login" className="text-blue-500">Log in</Link>
              </p>
            </>
          )}
          {currentStep === 2 && (
            <>
              <button onClick={handleBackStep} className="absolute top-4 left-4 bg-gray-200 p-2 rounded-full">
                <svg className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="mb-4">
                <label className="block text-gray-700">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Your Birthday</label>
                <div className="flex space-x-2">
                  <div className="flex flex-col w-1/3">
                    <label className="text-sm text-gray-700 mb-1">Month</label>
                    <input
                      type="text"
                      name="month"
                      value={formData.dob.month}
                      onChange={handleChange}
                      className="px-3 py-2 border rounded"
                      required
                      pattern="[0-9]*"
                      inputMode="numeric"
                    />
                  </div>
                  <div className="flex flex-col w-1/3">
                    <label className="text-sm text-gray-700 mb-1">Day</label>
                    <input
                      type="text"
                      name="day"
                      value={formData.dob.day}
                      onChange={handleChange}
                      className="px-3 py-2 border rounded"
                      required
                      pattern="[0-9]*"
                      inputMode="numeric"
                    />
                  </div>
                  <div className="flex flex-col w-1/3">
                    <label className="text-sm text-gray-700 mb-1">Year</label>
                    <input
                      type="text"
                      name="year"
                      value={formData.dob.year}
                      onChange={handleChange}
                      className="px-3 py-2 border rounded"
                      required
                      pattern="[0-9]*"
                      inputMode="numeric"
                    />
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full bg-blue-500 text-white py-2 rounded-3xl hover:bg-blue-600"
              >
                Next
              </button>
            </>
          )}
          {currentStep === 3 && (
            <>
              <button onClick={handleBackStep} className="absolute top-4 left-4 bg-gray-200 p-2 rounded-full">
                <svg className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="mb-4">
                <div className="flex flex-wrap mt-2">
                  {interestsList.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleInterestClick(interest)}
                      className={`m-1 px-4 py-2 rounded-full border ${
                        formData.interests.includes(interest)
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-700 border-gray-400'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className={`w-full py-2 rounded-3xl${
                  formData.interests.length >= 5 ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={formData.interests.length < 5}
              >
                Continue {formData.interests.length}/5
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default AccountCreation;

import React, { useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import ActivityCard from './ActivityCard'; // Make sure to adjust the import path as needed

function FeedPage() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login'); // Redirect to login if the user is not authenticated
    }
  }, [isLoggedIn, navigate]);

  if (!user) {
    return null; // or a loading indicator
  }

  const sampleActivity = {
    user: {
      profilePicture: 'https://via.placeholder.com/150',
      name: 'Axel Livias',
    },
    date: 'July 21, 2024 at 11:08 PM',
    location: 'New York, NY',
    title: 'Had so much fun at trivia!!',
    description: 'but like why is everyone so smart …',
    type: 'Trivia',
    time: '2h 5m',
    streak: '3wks',
    images: [
      'https://via.placeholder.com/300',
      'https://via.placeholder.com/300',
      'https://via.placeholder.com/300',
      'https://via.placeholder.com/300',
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-16 flex m-1">
      {/* Left Sidebar */}
      <div className="w-1/4 pr-2 pl-2 ml-1 mr-1">
        {/* Content for the left sidebar */}
      </div>

      {/* Main Content */}
      <div className="flex-grow pr-2 pl-2 overflow-y-auto ml-1 mr-1">
        {/* Place the ActivityCard here or any main content */}
        <ActivityCard activity={sampleActivity} />
        <ActivityCard activity={sampleActivity} />
      </div>

      {/* Right Sidebar */}
      <div className="w-1/4 pr-2 pl-2 ml-1 mr-1">
        {/* Content for the right sidebar */}
      </div>
    </div>
  );
}

export default FeedPage;

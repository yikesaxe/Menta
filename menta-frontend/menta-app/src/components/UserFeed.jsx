import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ActivityCard from './ActivityCard';

function UserFeed() {
  const { isLoggedIn, user, getToken } = useAuth();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login'); // Redirect to login if the user is not authenticated
    } else {
      fetchMyActivities();
    }
  }, [isLoggedIn, navigate]);

  const fetchMyActivities = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/activities/user/${user.id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  if (!user) {
    return null; // or a loading indicator
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-16 px-4 grid grid-cols-12 gap-4 mt-2">
      {/* Left Sidebar */}
      <div className="col-span-3">
        {/* Content for the left sidebar */}
      </div>

      {/* Main Content */}
      <div className="col-span-6 p-4 overflow-y-auto mx-8">
        {activities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>

      {/* Right Sidebar */}
      <div className="col-span-3 p-4">
        {/* Content for the right sidebar */}
      </div>
    </div>
  );
}

export default UserFeed;

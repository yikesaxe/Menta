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
      navigate('/login'); 
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
    return null; 
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-16 flex m-1">
      <div className="w-1/4 pr-2 pl-2 ml-1 mr-1">
      </div>

      <div className="flex-grow pr-2 pl-2 overflow-y-auto ml-1 mr-1">
        {activities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>

      <div className="w-1/4 pr-2 pl-2 ml-1 mr-1">
      </div>
    </div>
  );
}

export default UserFeed;

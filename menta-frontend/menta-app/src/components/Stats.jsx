import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const Stats = ({ category, userId }) => {
  const [details, setDetails] = useState(null);
  const { getToken } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = getToken();
        const response = await axios.get(`http://127.0.0.1:8000/progress/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const progressData = response.data;
        const categoryDetails = progressData.find(item => item.activity === category) || {
          streak: 0,
          total_time_spent: 0,
          notes: 'No data available',
          feelings: 'N/A'
        };
        setDetails(categoryDetails);
      } catch (error) {
        console.error('Error fetching progress:', error);
        setError(error);
      }
    };

    fetchProgress();
  }, [category, userId, getToken]);

  if (error) {
    return <div className="mt-4 p-4 border rounded bg-gray-100">Error loading data</div>;
  }

  if (!details) {
    return <div className="mt-4 p-4 border rounded bg-gray-100">Loading...</div>;
  }

  return (
    <div className="mt-4 p-4 border rounded bg-gray-100">
      <h2 className="text-xl font-semibold mb-2">{category} Progress</h2>
      <p><strong>Days:</strong> {details.streak || 0} days</p>
      <p><strong>Time:</strong> {details.total_time_spent || 0} minutes</p>
      <p><strong>Notes:</strong> {details.notes}</p>
      <p><strong>Feeling:</strong> {details.feelings}</p>
    </div>
  );
};

export default Stats;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWalking, faBiking, faSkating, faBook } from '@fortawesome/free-solid-svg-icons';

const activityIcons = {
  walking: faWalking,
  biking: faBiking,
  swimming: faSkating,
  reading: faBook
};

const ProgressTracker = ({ userId }) => {
  const { getToken } = useAuth();
  const [activities, setActivities] = useState([]);
  const [totalActivities, setTotalActivities] = useState(0);
  const [activityDurations, setActivityDurations] = useState({});
  const [calendarData, setCalendarData] = useState([]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = getToken();
        const response = await axios.get(`http://127.0.0.1:8000/progress/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const activitiesData = response.data;
        setActivities(activitiesData);

        const totalActivitiesCount = activitiesData.length;
        setTotalActivities(totalActivitiesCount);

        const durations = {};
        const calendar = {};

        activitiesData.forEach(activity => {
          const activityDate = new Date(activity.last_completed).toISOString().split('T')[0];
          calendar[activityDate] = (calendar[activityDate] || 0) + 1;

          if (!durations[activity.activity]) {
            durations[activity.activity] = 0;
          }
          durations[activity.activity] += activity.total_time_spent;
        });

        setActivityDurations(durations);
        setCalendarData(Object.keys(calendar).map(date => ({ date, count: calendar[date] })));
      } catch (error) {
        console.error('Error fetching progress data:', error);
      }
    };

    fetchProgress();
  }, [getToken, userId]);

  const renderCalendar = () => {
    const today = new Date();
    const days = [];
    for (let i = 0; i < 28; i++) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      const date = day.toISOString().split('T')[0];
      const activityCount = calendarData.find(d => d.date === date)?.count || 0;
      const isActive = activityCount > 0;
      days.push(
        <div key={date} className="relative w-6 h-6">
          <div 
            className={`w-full h-full rounded-full ${isActive ? 'bg-gray-800' : 'bg-gray-200'}`} 
            title={date}
          ></div>
          <div className={`absolute inset-0 flex items-center justify-center text-xs ${isActive ? 'text-transparent hover:text-white' : 'text-transparent hover:text-black'}`}>
            {day.getDate()}
          </div>
        </div>
      );
    }
    return days.reverse();
  };

  const renderActivityDurations = () => {
    return Object.keys(activityDurations).map(activity => (
      <div key={activity} className="flex items-center space-x-2">
        <FontAwesomeIcon icon={activityIcons[activity] || faBook} />
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-gray-800 h-2.5 rounded-full" style={{ width: `${activityDurations[activity] / 100}%` }}></div>
        </div>
        <span>{(activityDurations[activity] / 60).toFixed(2)}h</span>
      </div>
    ));
  };

  return (
    <div className="relative -top-16 w-2/3 flex space-x-10">
      <div className="text-center">
        <h3 className="font-bold">Last 4 Weeks</h3>
        <p className="text-4xl">{totalActivities}</p>
        <p className="text-sm text-gray-600">Total Activities</p>
      </div>
      <div className="w-1/3 grid grid-cols-7 gap-2">
        {renderCalendar()}
      </div>
      <div className="w-1/3 space-y-2">
        {renderActivityDurations()}
      </div>
    </div>
  );
};

export default ProgressTracker;

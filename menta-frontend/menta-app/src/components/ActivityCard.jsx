import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmile } from '@fortawesome/free-solid-svg-icons';

const ActivityCard = ({ activity }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md  mx-auto my-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <img
            src={activity.user.profilePicture}
            alt="Profile"
            className="w-12 h-12 rounded-full"
          />
          <div className="ml-4">
            <div className="font-bold">{activity.user.name}</div>
            <div className="text-gray-500">{activity.date}</div>
          </div>
        </div>
        <div className="text-gray-500">{activity.location}</div>
      </div>
      <div className="mt-4">
        <h3 className="text-xl font-bold">{activity.title}</h3>
        <p className="text-gray-700">{activity.description}</p>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="flex space-x-8">
          <div>
            <div className="text-gray-500">Activity</div>
            <div className="font-bold">{activity.type}</div>
          </div>
          <div>
            <div className="text-gray-500">Time</div>
            <div className="font-bold">{activity.time}</div>
          </div>
          <div>
            <div className="text-gray-500">Streak</div>
            <div className="font-bold">{activity.streak}</div>
          </div>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Join {activity.user.name} at {activity.type}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {activity.images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Activity ${index}`}
            className="w-full h-32 object-cover rounded-lg"
          />
        ))}
      </div>
    </div>
  );
};

export default ActivityCard;

import React from 'react';
import { Link } from 'react-router-dom';

function FeedNavBar() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-bold">Menta</Link>
        <div className="flex space-x-4">
          <Link to="/feed" className="text-white">Feed</Link>
          <button onClick={handleLogout} className="text-white">Logout</button>
        </div>
      </div>
    </nav>
  );
}

export default FeedNavBar;
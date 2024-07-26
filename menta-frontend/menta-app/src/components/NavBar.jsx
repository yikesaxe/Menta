import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-bold">Menta</Link>
        <div className="flex space-x-4">
          <Link to="/" className="text-white">Home</Link>
          <Link to="/signup" className="text-white">Sign Up</Link>
          <Link to="/login" className="text-white">Login</Link>
          <Link to="/feed" className="text-white">Feed</Link>
          <Link to="/profile" className="text-white">Profile</Link>
          <Link to="/settings" className="text-white">Settings</Link>
          <Link to="/Clubs" className="text-white">Clubs</Link>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
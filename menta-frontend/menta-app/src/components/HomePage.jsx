import React from 'react';
import NavBar from './NavBar';

function HomePage() {
  return (
    <div>
      <NavBar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-4xl font-bold">Welcome to Menta</h1>
      </div>
    </div>
  );
}

export default HomePage;
import React from 'react';
import FeedNavBar from './FeedNavBar';

function FeedPage() {
  return (
    <div>
      <FeedNavBar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Feed</h2>
          <p className="text-center">Welcome to your feed!</p>
          {/* Add feed content here */}
        </div>
      </div>
    </div>
  );
}

export default FeedPage;
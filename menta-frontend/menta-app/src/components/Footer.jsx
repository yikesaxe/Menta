import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-100 py-6">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-between">
          <div className="w-full sm:w-1/4 mb-6">
            <h5 className="uppercase mb-6 font-bold">About</h5>
            <ul className="list-reset mb-6">
              <li className="mt-2">
                <a href="#" className="no-underline hover:underline text-gray-600 hover:text-orange-600">About</a>
              </li>
              <li className="mt-2">
                <a href="#" className="no-underline hover:underline text-gray-600 hover:text-orange-600">Features</a>
              </li>
              <li className="mt-2">
                <a href="#" className="no-underline hover:underline text-gray-600 hover:text-orange-600">Mobile</a>
              </li>
              <li className="mt-2">
                <a href="#" className="no-underline hover:underline text-gray-600 hover:text-orange-600">Subscription</a>
              </li>
            </ul>
          </div>
          <div className="w-full sm:w-1/4 mb-6">
            <h5 className="uppercase mb-6 font-bold">Explore</h5>
            <ul className="list-reset mb-6">
              <li className="mt-2">
                <a href="#" className="no-underline hover:underline text-gray-600 hover:text-orange-600">Routes</a>
              </li>
            </ul>
          </div>
          <div className="w-full sm:w-1/4 mb-6">
            <h5 className="uppercase mb-6 font-bold">Follow</h5>
            <ul className="list-reset mb-6">
              <li className="mt-2">
                <a href="#" className="no-underline hover:underline text-gray-600 hover:text-orange-600">Facebook</a>
              </li>
              <li className="mt-2">
                <a href="#" className="no-underline hover:underline text-gray-600 hover:text-orange-600">Twitter</a>
              </li>
              <li className="mt-2">
                <a href="#" className="no-underline hover:underline text-gray-600 hover:text-orange-600">Instagram</a>
              </li>
              <li className="mt-2">
                <a href="#" className="no-underline hover:underline text-gray-600 hover:text-orange-600">YouTube</a>
              </li>
            </ul>
          </div>
          <div className="w-full sm:w-1/4 mb-6">
            <h5 className="uppercase mb-6 font-bold">Help</h5>
            <ul className="list-reset mb-6">
              <li className="mt-2">
                <a href="#" className="no-underline hover:underline text-gray-600 hover:text-orange-600">Strava Support</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center text-gray-500">
          <p>&copy; 2024 Strava</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

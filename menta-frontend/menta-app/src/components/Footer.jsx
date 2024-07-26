import React from 'react';

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] py-6">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-between">
          <div className="w-full sm:w-1/4 mb-6">
            <h5 className="uppercase mb-6 font-bold text-white">About</h5>
            <ul className="list-reset mb-6">
              <li className="mt-2">
                <a href="#" className="no-underline hover:underline text-white hover:text-orange-300">About</a>
              </li>
              <li className="mt-2">
                <a href="#" className="no-underline hover:underline text-white hover:text-orange-300">Features</a>
              </li>
              <li className="mt-2">
                <a href="#" className="no-underline hover:underline text-white hover:text-orange-300">Mobile</a>
              </li>
            </ul>
          </div>
          <div className="w-full sm:w-1/4 mb-6">
            <h5 className="uppercase mb-6 font-bold text-white">Explore</h5>
            <ul className="list-reset mb-6">
              <li className="mt-2">
                <a href="#" className="no-underline hover:underline text-white hover:text-orange-300">Clubs</a>
              </li>
            </ul>
          </div>
          <div className="w-full sm:w-1/4 mb-6">
            <h5 className="uppercase mb-6 font-bold text-white">Follow</h5>
            <ul className="list-reset mb-6">
              <li className="mt-2">
                <a href="#" className="no-underline hover:underline text-white hover:text-orange-300">Facebook</a>
              </li>
              <li className="mt-2">
                <a href="#" className="no-underline hover:underline text-white hover:text-orange-300">Twitter</a>
              </li>
              <li className="mt-2">
                <a href="#" className="no-underline hover:underline text-white hover:text-orange-300">Instagram</a>
              </li>
              <li className="mt-2">
                <a href="#" className="no-underline hover:underline text-white hover:text-orange-300">YouTube</a>
              </li>
            </ul>
          </div>
          <div className="w-full sm:w-1/4 mb-6">
            <h5 className="uppercase mb-6 font-bold text-white">Help</h5>
            <ul className="list-reset mb-6">
              <li className="mt-2">
                <a href="#" className="no-underline hover:underline text-white hover:text-orange-300">Menta Support</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center text-gray-200">
          <p>&copy; 2024 Menta</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, UserIcon, CogIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid';

const Sidebar = ({ toggleSidebar }) => {
  return (
    <div className="relative h-full">
      {/* Close Button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-4 p-2 bg-gray-600 text-white rounded-full shadow-md hover:bg-gray-700 transition duration-300 ease-in-out"
      >
        &times;
      </button>

      {/* Sidebar Content */}
      <div className="mt-2">
        <div className="p-6 text-xl font-bold">Dashboard</div>
        <nav>
          <ul>
            <li>
              <Link to="/dashboard" className="flex items-center p-4 hover:bg-gray-700">
                <HomeIcon className="w-6 h-6 text-gray-300 mr-3" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link to="/profile" className="flex items-center p-4 hover:bg-gray-700">
                <UserIcon className="w-6 h-6 text-gray-300 mr-3" />
                <span>Profile</span>
              </Link>
            </li>
            <li>
              <Link to="/settings" className="flex items-center p-4 hover:bg-gray-700">
                <CogIcon className="w-6 h-6 text-gray-300 mr-3" />
                <span>Settings</span>
              </Link>
            </li>
            <li>
              <Link to="/logout" className="flex items-center p-4 hover:bg-gray-700">
                <ArrowLeftOnRectangleIcon className="w-6 h-6 text-gray-300 mr-3" />
                <span>Logout</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;

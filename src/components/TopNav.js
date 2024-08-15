import React, { useEffect, useState } from 'react';
import { Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/solid'; // Import necessary icons

const TopNav = ({ toggleSidebar, isSidebarOpen }) => {
  const [username, setUsername] = useState(''); // Initialize state for username

  useEffect(() => {
    // Fetch the username from localStorage
    const storedUsername = localStorage.getItem('DealerUsername');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      setUsername('Guest'); // Fallback if username is not found
    }
  }, []); // Empty dependency array to run only on mount

  return (
    <div className="bg-teal-600 text-white p-4 fixed top-0 left-0 w-full shadow-lg flex items-center justify-between z-30 rounded-b-3xl">
      {/* Toggle Button */}
      {/* <button
        onClick={toggleSidebar}
        className="p-2 bg-teal-700 rounded-md hover:bg-teal-800 transition-transform transform hover:scale-110 duration-300 ease-in-out"
        aria-label="Toggle Sidebar"
      >
        {isSidebarOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <Bars3Icon className="w-6 h-6" />
        )}
      </button> */}

      {/* Logo Name */}
      <div className="text-2xl font-bold flex items-center space-x-2">
        <span className="hidden md:inline text-teal-200">Inventory Management System</span>
        <span className="md:hidden text-teal-200">IMS</span> {/* Short name for mobile view */}
      </div>

      {/* Welcome Username */}
      <div className="flex items-center space-x-4">
        <span className="text-lg font-medium">Welcome, {username}</span>
        <UserCircleIcon className="w-8 h-8 text-teal-200 transition-transform transform hover:scale-110 duration-300 ease-in-out" />
      </div>
    </div>
  );
};

export default TopNav;

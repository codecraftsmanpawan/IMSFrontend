import React from 'react';
import AdminNav from './AdminNav';
import { ChartBarIcon, KeyIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';
import { Link, useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any authentication tokens or session data
   
     localStorage.removeItem('adminToken');
     localStorage.removeItem('adminUsername');

    // Redirect to the login page
    navigate('/admin/login');
  };

  return (
    <div>
      <AdminNav />
      <div className="p-6 bg-gradient-to-r from-teal-200 to-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-6 mt-16 text-center">Settings</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* View Performance */}
          <Link to="/admin/view-performance" className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-teal-50 transition-colors duration-300">
            <ChartBarIcon className="w-8 h-8 text-teal-500" />
            <span className="text-lg font-semibold">View Performance</span>
          </Link>

          {/* Change Password */}
          <Link to="/admin/change-password" className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-teal-50 transition-colors duration-300">
            <KeyIcon className="w-8 h-8 text-teal-500" />
            <span className="text-lg font-semibold">Change Password</span>
          </Link>

          {/* Log Out */}
          <button
            onClick={handleLogout}
            className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4 hover:bg-teal-50 transition-colors duration-300 cursor-pointer"
          >
            <ArrowRightOnRectangleIcon className="w-8 h-8 text-teal-500" />
            <span className="text-lg font-semibold">Log Out</span>
          </button>

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

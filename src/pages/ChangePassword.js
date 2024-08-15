// src/pages/ChangePassword.js
import React, { useState } from 'react';
import { LockClosedIcon } from '@heroicons/react/24/solid';
import TopNav from '../components/TopNav';
import BottomNav from '../components/BottomNav';
import {useNavigate} from 'react-router-dom'
import config from '../config';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }
    // Add your password change logic here

    // On successful password change, redirect or show a success message
    navigate('/settings'); // Adjust the path as needed
  };

  return (
    <>
      <TopNav />
      <div className="min-h-screen bg-gradient-to-r from-teal-200 to-gray-100 p-6 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 mt-16">Change Password</h1>
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white shadow-lg rounded-lg p-6"
        >
          {error && <p className="text-red-600 mb-4">{error}</p>}
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="current-password">
              Current Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-teal-400 transition duration-300 ease-in-out">
              <LockClosedIcon className="w-6 h-6 text-teal-500 mx-3" />
              <input
                type="password"
                id="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-4 py-3 border-0 focus:outline-none placeholder-gray-500"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="new-password">
              New Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-teal-400 transition duration-300 ease-in-out">
              <LockClosedIcon className="w-6 h-6 text-teal-500 mx-3" />
              <input
                type="password"
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-3 border-0 focus:outline-none placeholder-gray-500"
                required
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm-password">
              Confirm New Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-teal-400 transition duration-300 ease-in-out">
              <LockClosedIcon className="w-6 h-6 text-teal-500 mx-3" />
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-4 py-3 border-0 focus:outline-none placeholder-gray-500"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="bg-teal-600 text-white p-2 rounded-md w-full hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
          >
            Change Password
          </button>
        </form>
      </div>
      <BottomNav />
    </>
  );
};

export default ChangePassword;

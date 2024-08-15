// src/pages/UserDetails.js
import React, { useState, useEffect } from 'react';
import AdminNav from './AdminNav';
import { UserIcon, BriefcaseIcon, TagIcon, ShoppingBagIcon } from '@heroicons/react/24/solid';

const UserDetails = () => {
  const [user, setUser] = useState(null);
  const [userStats, setUserStats] = useState({
    totalBrands: 0,
    totalCategories: 0,
    totalSales: 0,
    totalPurchases: 0,
  });

  useEffect(() => {
    const fetchedUser = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
    };
    setUser(fetchedUser);

    const fetchedStats = {
      totalBrands: 12,
      totalCategories: 8,
      totalSales: 150,
      totalPurchases: 90,
    };
    setUserStats(fetchedStats);
  }, []);

  return (
    <div>
      <AdminNav />
      <div className="p-6 bg-gradient-to-r from-teal-200 to-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-6 mt-16 text-center">User Details</h1>

        {/* User Information Card */}
        {user && (
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mb-6 flex flex-col items-center">
            <UserIcon className="w-16 h-16 text-teal-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">{user.name}</h2>
            <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
            <p className="text-gray-700"><strong>Role:</strong> {user.role}</p>
          </div>
        )}

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-teal-400 to-blue-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
            <UserIcon className="w-8 h-8 mb-2" />
            <h3 className="text-xl font-semibold">Total Brands</h3>
            <p className="text-3xl font-bold mt-2">{userStats.totalBrands}</p>
          </div>

          <div className="bg-gradient-to-r from-teal-400 to-blue-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
            <TagIcon className="w-8 h-8 mb-2" />
            <h3 className="text-xl font-semibold">Total Categories</h3>
            <p className="text-3xl font-bold mt-2">{userStats.totalCategories}</p>
          </div>

          <div className="bg-gradient-to-r from-teal-400 to-blue-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
            <ShoppingBagIcon className="w-8 h-8 mb-2" />
            <h3 className="text-xl font-semibold">Total Sales</h3>
            <p className="text-3xl font-bold mt-2">{userStats.totalSales}</p>
          </div>

          <div className="bg-gradient-to-r from-teal-400 to-blue-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
            <BriefcaseIcon className="w-8 h-8 mb-2" />
            <h3 className="text-xl font-semibold">Total Purchases</h3>
            <p className="text-3xl font-bold mt-2">{userStats.totalPurchases}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;

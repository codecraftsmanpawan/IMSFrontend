import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircleIcon, DocumentTextIcon } from '@heroicons/react/24/solid';
import TopNav from '../components/TopNav'; 
import BottomNav from '../components/BottomNav';  
import config from '../config';
const ManageBrands = () => {
  const [brandName, setBrandName] = useState('');
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [error, setError] = useState(''); // State for error message
  const [success, setSuccess] = useState(''); // State for success message
  const [username, setUsername] = useState(''); // State for username

  // Fetch username from local storage on component mount
  useEffect(() => {
    const storedUsername = localStorage.getItem('DealerUsername');
    setUsername(storedUsername || 'Guest'); 
  }, []);

  const handleAddBrand = async () => {
    if (brandName.trim()) {
      const dealerToken = localStorage.getItem('Dealertoken');
      if (!dealerToken) {
        setError('User not authenticated');
        return;
      }

      setLoading(true);
      setError('');
      setSuccess(''); 

      const data = JSON.stringify({ name: brandName.trim() });

      const config = {
        method: 'post',
        url: `${config.BASE_URL}/api/dealer/brands`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${dealerToken}`
        },
        data: data
      };

      try {
        const response = await axios.request(config);
        console.log(JSON.stringify(response.data));
        setBrandName(''); 
        setSuccess('Brand added successfully!'); 
      } catch (error) {
        console.error(error);
        setError('Failed to add brand');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <TopNav 
        toggleSidebar={() => {}} // No sidebar functionality in this example
        isSidebarOpen={false} // Not using sidebar in this example
        username={username} 
      />
      <div className="min-h-screen bg-gradient-to-r from-teal-200 to-gray-100 p-6 flex flex-col items-center mt-16">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Add Brands</h1>

        {/* Add Brand Form in a Card */}
        <div className="w-full max-w-md mb-6">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Add a New Brand</h2>
            <div className="flex items-center border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-teal-400 transition duration-300 ease-in-out">
              <DocumentTextIcon className="w-6 h-6 text-teal-500 mx-3" /> {/* Icon */}
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Enter Brand Name"
                className="w-full px-4 py-3 border-0 focus:outline-none placeholder-gray-500"
              />
              <button
                onClick={handleAddBrand}
                className="ml-2 bg-teal-600 text-white p-2 rounded-md flex items-center hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                disabled={loading} // Disable button while loading
              >
                {loading ? (
                  <span>Loading...</span>
                ) : (
                  <>
                    <PlusCircleIcon className="w-5 h-5 mr-1" /> {/* Icon */}
                    Add
                  </>
                )}
              </button>
            </div>
            {error && <p className="text-red-600 mt-4">{error}</p>} {/* Display error message */}
            {success && <p className="text-green-600 mt-4">{success}</p>} {/* Display success message */}
          </div>
        </div>

        <BottomNav className="mt-16" />
      </div>
    </>
  );
};

export default ManageBrands;

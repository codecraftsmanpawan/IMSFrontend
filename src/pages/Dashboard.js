import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import BottomNav from '../components/BottomNav';
import { ArrowTrendingUpIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid';
import config from '../config';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [totalQuantity, setTotalQuantity] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAddSales = () => {
    navigate('/add-sales');
  };

  const handleAddPurchase = () => {
    navigate('/add-purchase');
  };

  useEffect(() => {
    // Retrieve username from local storage
    const storedUsername = localStorage.getItem('DealerUsername');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const fetchStockSummary = async () => {
      try {
        // Retrieve token from local storage
        const token = localStorage.getItem('Dealertoken');

        // Check if the token exists
        if (!token) {
          throw new Error('Token not found');
        }

        // Fetch data using axios
        const response = await axios.get(`${config.BASE_URL}/api/dealer/summary`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        // Set state with the response data
        setTotalQuantity(response.data.totalQuantity);
        setTotalAmount(response.data.totalAmount);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStockSummary();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-teal-200 to-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-transform duration-300 ease-in-out transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64 z-40 md:w-80 lg:w-96`} // Ensure sidebar is responsive
      >
        <Sidebar toggleSidebar={toggleSidebar} />
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'ml-64 md:ml-80 lg:ml-96' : ''
        } flex flex-col`}
      >
        <TopNav toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} username={username} />
        <main className="flex-1 p-6 space-y-6 mt-16">

          {/* Top Brand of the Week Card */}
          {/* <div className="bg-white shadow-lg rounded-lg overflow-hidden  hover:shadow-xl duration-300">
            <div className="p-6 flex flex-col">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Top Brand of the Week</h3>
              <p className="text-2xl font-bold text-teal-600">BrandName</p>
              <p className="text-sm text-gray-500 mt-1">Top-selling brand this week based on sales data.</p>
            </div>
          </div> */}

          {/* Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Total Stock Quantity Card */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden flex items-center hover:shadow-xl duration-300">
              <div className="p-6 flex-1">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Stock Quantity</h3>
                <p className="text-3xl font-bold text-teal-600">{totalQuantity}</p>
              </div>
              <ArrowTrendingUpIcon className="w-16 h-16 text-teal-500 mr-4" /> {/* Icon for quantity */}
            </div>

            {/* Total Stock Amount Card */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden flex items-center hover:shadow-xl duration-300">
              <div className="p-6 flex-1">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Stock Amount</h3>
                <p className="text-3xl font-bold text-teal-600">₹ {totalAmount.toLocaleString()}</p>
              </div>
              <CurrencyDollarIcon className="w-16 h-16 text-teal-500 mr-4" /> {/* Icon for amount */}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              className="bg-teal-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-teal-700 transition-all duration-300 ease-in-out flex items-center space-x-2 transform hover:scale-105"
              onClick={handleAddSales}
            >
              <ArrowTrendingUpIcon className="w-5 h-5" />
              <span>Add Sales</span>
            </button>
            <button
              className="bg-teal-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-teal-700 transition-all duration-300 ease-in-out flex items-center space-x-2 transform hover:scale-105"
              onClick={handleAddPurchase}
            >
              <CurrencyDollarIcon className="w-5 h-5" />
              <span>Add Purchase</span>
            </button>
          </div>

        </main>
        <BottomNav /> {/* Add BottomNav component */}
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TopNav from '../components/TopNav';
import BottomNav from '../components/BottomNav';
import { ArrowTrendingUpIcon, CurrencyDollarIcon, TagIcon, CalendarIcon } from '@heroicons/react/24/solid';
import config from '../config';

const AddSales = () => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [brandId, setBrandId] = useState(''); 
  const [quantity, setQuantity] = useState('');
  const [modelId, setModelId] = useState(''); 
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true); // Start loading
      try {
        const token = localStorage.getItem('Dealertoken');
        const response = await axios.get(`${config.BASE_URL}/api/dealer/brands`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setBrands(response.data);
      } catch (error) {
        console.error('Error fetching brands:', error);
        setMessage('Error fetching brands.');
        setMessageType('error');
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    if (brandId) {
      const fetchModels = async () => {
        setLoading(true); // Start loading
        try {
          const token = localStorage.getItem('Dealertoken');
          const response = await axios.get(`${config.BASE_URL}/api/dealer/brands/${brandId}/models`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          setModels(response.data);
        } catch (error) {
          console.error('Error fetching models:', error);
          setMessage('Error fetching models.');
          setMessageType('error');
        } finally {
          setLoading(false); // End loading
        }
      };

      fetchModels();
    } else {
      setModels([]);
    }
  }, [brandId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!brandId || !modelId || !quantity || !date) {
      setMessage('Please fill in all fields.');
      setMessageType('error');
      return;
    }

    try {
      setLoading(true); // Start loading
      const token = localStorage.getItem('Dealertoken');
      const response = await axios.post(`${config.BASE_URL}/api/dealer/sell`, 
        {
          brandId,
          modelId,
          quantity,
          date: new Date(date).toISOString()
        },
        {
          headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.message) {
        setMessage(response.data.message);
        setMessageType(response.data.message === 'Insufficient stock' ? 'error' : 'success');
      } else {
        setMessage('Sale added successfully!');
        setMessageType('success');
      }

      // Reset form fields
      setBrandId('');
      setQuantity('');
      setModelId('');
      setDate('');
    } catch (error) {
      console.error('Error adding sale:', error);
      setMessage('Error adding sale.');
      setMessageType('error');
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-teal-200 to-gray-100">
      <TopNav />

      <main className="flex-1 flex justify-center items-center p-4 mt-0">
        {/* Show loading spinner when loading */}
        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent border-solid rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="w-full max-w-lg bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">Add Sale</h1>

              {/* Display Message */}
              {message && (
                <div
                  className={`p-4 mb-4 text-white ${messageType === 'success' ? 'bg-green-500' : 'bg-red-500'} rounded`}
                >
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Brand Dropdown */}
                <div className="flex flex-col">
                  <label htmlFor="brand" className="text-gray-700 mb-2 font-medium">
                    Choose Brand
                  </label>
                  <div className="relative">
                    <select
                      id="brand"
                      value={brandId}
                      onChange={(e) => setBrandId(e.target.value)}
                      className="w-full p-3 border border-teal-600 rounded-lg shadow-sm focus:ring-teal-400 focus:border-teal-600 transition duration-300 appearance-none"
                      required
                    >
                      <option value="">Select a brand</option>
                      {brands.map((b) => (
                        <option key={b._id} value={b._id}>{b.name}</option>
                      ))}
                    </select>
                    <ArrowTrendingUpIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-teal-600 pointer-events-none" />
                  </div>
                </div>

                {/* Model Dropdown */}
                <div className="flex flex-col">
                  <label htmlFor="model" className="text-gray-700 mb-2 font-medium">
                    Choose Model
                  </label>
                  <div className="relative">
                    <select
                      id="model"
                      value={modelId}
                      onChange={(e) => setModelId(e.target.value)}
                      className="w-full p-3 border border-teal-600 rounded-lg shadow-sm focus:ring-teal-400 focus:border-teal-600 transition duration-300 appearance-none"
                      required
                      disabled={!brandId} // Disable if no brand is selected
                    >
                      <option value="">Select a model</option>
                      {models.map((m) => (
                        <option key={m._id} value={m._id}>{m.name}</option>
                      ))}
                    </select>
                    <TagIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-teal-600 pointer-events-none" />
                  </div>
                </div>
                
                {/* Quantity Input */}
                <div className="flex items-center border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-teal-400 transition duration-300 ease-in-out">
                  <CurrencyDollarIcon className="w-6 h-6 text-teal-600 mx-3" />
                  <input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-4 py-3 border-0 focus:outline-none placeholder-gray-500"
                    placeholder="Enter Quantity"
                    required
                  />
                </div>

                {/* Date Input */}
                <div className="flex items-center border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-teal-400 transition duration-300 ease-in-out">
                  <CalendarIcon className="w-6 h-6 text-teal-600 mx-3" />
                  <input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 border-0 focus:outline-none placeholder-gray-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-teal-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-teal-700 transition duration-300 ease-in-out"
                >
                  Add Sale
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default AddSales;

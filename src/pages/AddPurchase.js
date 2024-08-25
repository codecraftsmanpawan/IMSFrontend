import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TopNav from '../components/TopNav';
import BottomNav from '../components/BottomNav';
import { ArrowTrendingUpIcon, CurrencyDollarIcon, TagIcon, CalendarIcon } from '@heroicons/react/24/solid';
import config from '../config';

const AddPurchase = () => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [model, setModel] = useState('');
  const [quantity, setQuantity] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  // Fetch brands on component mount
  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true); // Start loading
      const token = localStorage.getItem('Dealertoken');
      try {
        const response = await axios.get(`${config.BASE_URL}/api/dealer/brands`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.data && Array.isArray(response.data)) {
          setBrands(response.data);
        } else {
          setError('Unexpected response structure for brands.');
        }
      } catch (error) {
        console.error('Error fetching brands:', error);
        setError('Failed to load brands.');
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchBrands();
  }, []);

  // Fetch models when brand changes
  const handleBrandChange = async (e) => {
    const selectedBrand = e.target.value;
    setSelectedBrand(selectedBrand);
    setModel(''); // Clear model when brand changes

    if (selectedBrand) {
      setLoading(true); // Start loading
      try {
        const token = localStorage.getItem('Dealertoken');
        const response = await axios.get(`${config.BASE_URL}/api/dealer/brands/${selectedBrand}/models`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.data && Array.isArray(response.data)) {
          setModels(response.data);
        } else {
          setError('Unexpected response structure for models.');
        }
      } catch (error) {
        console.error('Error fetching models:', error);
        setError('Failed to load models.');
      } finally {
        setLoading(false); // End loading
      }
    } else {
      setModels([]); // Clear models if no brand is selected
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!selectedBrand || !model || !quantity || !date) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true); // Start loading
    try {
      const token = localStorage.getItem('Dealertoken');
      await axios.post(`${config.BASE_URL}/api/dealer/stock`, 
        {
          brandId: selectedBrand,
          modelId: model,
          quantity,
          date
        },
        {
          headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setSuccess('Purchase added successfully!');
      // Reset form fields
      setSelectedBrand('');
      setModel('');
      setQuantity('');
      setDate('');
    } catch (error) {
      console.error('Error adding purchase:', error);
      setError('Error adding purchase.');
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-teal-200 to-gray-100">
      <TopNav />

      <main className="flex-1 flex justify-center items-center p-4 mt-0">
        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent border-solid rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="w-full max-w-lg bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">Add Purchase</h1>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Brand Dropdown */}
                <div className="flex flex-col">
                  <label htmlFor="brand" className="text-gray-700 mb-2 font-medium">
                    Choose Brand
                  </label>
                  <div className="relative">
                    <select
                      id="brand"
                      value={selectedBrand}
                      onChange={handleBrandChange}
                      className="w-full p-3 border border-teal-600 rounded-lg shadow-sm focus:ring-teal-400 focus:border-teal-600 transition duration-300 appearance-none"
                      required
                    >
                      <option value="">Select a brand</option>
                      {brands.length > 0 ? (
                        brands.map((b) => (
                          <option key={b._id} value={b._id}>{b.name}</option>
                        ))
                      ) : (
                        <option disabled>No brands available</option>
                      )}
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
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full p-3 border border-teal-600 rounded-lg shadow-sm focus:ring-teal-400 focus:border-teal-600 transition duration-300 appearance-none"
                      required
                      disabled={!selectedBrand} // Disable if no brand is selected
                    >
                      <option value="">Select a model</option>
                      {models.length > 0 ? (
                        models.map((m) => (
                          <option key={m._id} value={m._id}>{m.name}</option>
                        ))
                      ) : (
                        <option disabled>No models available</option>
                      )}
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
                  Add Purchase
                </button>
              </form>
              {error && <p className="mt-4 text-red-500">{error}</p>}
              {success && <p className="mt-4 text-green-500">{success}</p>}
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default AddPurchase;

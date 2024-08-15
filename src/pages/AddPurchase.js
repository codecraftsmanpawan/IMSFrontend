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
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [quantity, setQuantity] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch brands on component mount
  useEffect(() => {
    const fetchBrands = async () => {
      const token = localStorage.getItem('Dealertoken');
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${config.BASE_URL}/api/dealer/brands`,
        headers: {  
          'Authorization': `Bearer ${token}`
        }
      };

      try {
        const response = await axios.request(config);
        console.log(JSON.stringify(response.data)); // Log the response for debugging
        if (response.data && Array.isArray(response.data)) {
          setBrands(response.data); // Set the brands in state
        } else {
          setError('Unexpected response structure for brands.');
        }
      } catch (error) {
        console.error('Error fetching brands:', error);
        setError('Failed to load brands.');
      }
    };

    fetchBrands();
  }, []);

 const handleBrandChange = async (e) => {
  const selectedBrand = e.target.value;
  setBrand(selectedBrand);
  setSelectedBrand(selectedBrand);

  // Fetch models based on selected brand
  try {
    const token = localStorage.getItem('Dealertoken');
    const response = await axios.get(`${config.BASE_URL}/api/dealer/brands/${selectedBrand}/models`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (response.data && Array.isArray(response.data)) {
      setModels(response.data); // Set the models in state
    } else {
      setError('Unexpected response structure for models.');
    }
  } catch (error) {
    console.error('Error fetching models:', error);
    setError('Failed to load models.');
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const data = JSON.stringify({
      brandId: brand,
      modelId: model,
      quantity,
      date
    });

    const token = localStorage.getItem('Dealertoken');

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${config.BASE_URL}/api/dealer/stock`,
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}`
      },
      data: data
    };

    try {
      const response = await axios.request(config);
      setSuccess('Purchase added successfully!');
      // Reset form fields
      setBrand('');
      setModel('');
      setQuantity('');
      setDate('');
    } catch (error) {
      setError('Error adding purchase.');
      console.error('Error submitting data:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-teal-200 to-gray-100">
      <TopNav />

      <main className="flex-1 flex justify-center items-center p-4 mt-0">
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
                    value={brand}
                    onChange={handleBrandChange}
                    className="w-full p-3 border border-teal-600 rounded-lg shadow-sm focus:ring-teal-400 focus:border-teal-600 transition duration-300 appearance-none"
                    required
                  >
                    <option value="">Select a brand</option>
                    {brands.length > 0 ? (
                      brands.map((b) => (
                        <option key={b._id} value={b._id}>{b.name}</option> // Adjust according to the API response structure
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
      </main>

      <BottomNav />
    </div>
  );
};

export default AddPurchase;

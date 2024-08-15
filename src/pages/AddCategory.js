import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog } from '@headlessui/react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TopNav from '../components/TopNav';  
import BottomNav from '../components/BottomNav';  
import config from '../config';

const BrandModels = () => {
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [models, setModels] = useState([]);
  const [newModelName, setNewModelName] = useState('');
  const [newModelPrice, setNewModelPrice] = useState('');
  const [isAddModelModalOpen, setAddModelModalOpen] = useState(false);
  const [username, setUsername] = useState(''); // State for username

  // Fetch username from local storage on component mount
  useEffect(() => {
    const storedUsername = localStorage.getItem('DealerUsername');
    setUsername(storedUsername || 'Guest'); 
  }, []);
  // Fetch brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const dealerToken = localStorage.getItem('Dealertoken');
        if (!dealerToken) {
          throw new Error('No token found');
        }

        const config = {
          method: 'get',
          url: `${config.BASE_URL}/api/dealer/brands`,
          headers: {
            'Authorization': `Bearer ${dealerToken}`
          }
        };

        const response = await axios.request(config);
        setBrands(response.data);
      } catch (error) {
        console.error('Error fetching brands:', error);
        toast.error('Error fetching brands');
      }
    };

    fetchBrands();
  }, []);

  // Fetch models for a selected brand
  useEffect(() => {
    if (!selectedBrand) return;

    const fetchModels = async () => {
      try {
        const dealerToken = localStorage.getItem('Dealertoken');
        if (!dealerToken) {
          throw new Error('No token found');
        }

        const config = {
          method: 'get',
          url: `${config.BASE_URL}/api/dealer/brands/${selectedBrand._id}/models`,
          headers: {
            'Authorization': `Bearer ${dealerToken}`
          }
        };

        const response = await axios.request(config);
        setModels(response.data);
      } catch (error) {
        console.error('Error fetching models:', error);
        toast.error('Error fetching models');
      }
    };

    fetchModels();
  }, [selectedBrand]);

  const handleAddModel = async () => {
    if (!selectedBrand || !newModelName || !newModelPrice) return;

    try {
      const dealerToken = localStorage.getItem('Dealertoken');
      if (!dealerToken) {
        throw new Error('No token found');
      }

      const data = JSON.stringify({
        name: newModelName,
        price: parseFloat(newModelPrice)
      });

      const config = {
        method: 'post',
        url: `${config.BASE_URL}/api/dealer/brands/${selectedBrand._id}/models`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${dealerToken}`
        },
        data: data
      };

      const response = await axios.request(config);
      setModels([...models, response.data]);
      setAddModelModalOpen(false);
      setNewModelName('');
      setNewModelPrice('');
      
      // Display success message
      toast.success('Model added successfully');
      
      // Reload the page after showing the success message
      setTimeout(() => {
        window.location.reload();
      }, 1000); // Adjust the timeout duration if needed
    } catch (error) {
      console.error('Error adding model:', error);
      toast.error('Error adding model');
    }
  };

  return (
  <>
         <TopNav 
        toggleSidebar={() => {}} // No sidebar functionality in this example
        isSidebarOpen={false} // Not using sidebar in this example
        username={username} 
      />
    <div className="p-6 bg-white shadow-md rounded-lg mt-16">
      <h1 className="text-2xl font-bold mb-4"> Add Category</h1>
      <div className="mb-4">
        {brands.length === 0 ? (
          <p>Loading...</p>
        ) : (
          <select
            onChange={(e) => {
              const brand = brands.find(b => b._id === e.target.value);
              setSelectedBrand(brand);
            }}
            className="border border-gray-300 p-2 rounded-md w-full"
          >
            <option value="">Select a brand</option>
            {brands.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {selectedBrand && (
        <div>
          <h2 className="text-xl font-bold mb-4">Category for {selectedBrand.name}</h2>
          <button
            onClick={() => setAddModelModalOpen(true)}
            className="px-4 py-2 bg-teal-600 text-white rounded-md mb-4"
          >
             Add Category
          </button>
<table className="w-full border-collapse bg-gray-100 rounded-lg">
  <thead>
    <tr className="bg-teal-600 text-white">
      <th className="p-3 border-b">#</th> {/* Serial Number Header */}
      <th className="p-3 border-b">Name</th>
      <th className="p-3 border-b">Price</th>
    </tr>
  </thead>
  <tbody className="text-center">
    {models.length === 0 ? (
      <tr>
        <td colSpan="3" className="p-3 text-center">No models available</td>
      </tr>
    ) : (
      models.map((model, index) => (
        <tr key={model._id} className="hover:bg-gray-200">
          <td className="p-3 border-b">{index + 1}</td> {/* Serial Number */}
          <td className="p-3 border-b">{model.name}</td>
          <td className="p-3 border-b">₹{(model.price ?? 0).toFixed(2)}</td>
        </tr>
      ))
    )}
  </tbody>
</table>


        </div>
      )}

      {/* Add Model Modal */}
      <Dialog open={isAddModelModalOpen} onClose={() => setAddModelModalOpen(false)}>
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg">
            <Dialog.Title className="text-lg font-semibold">Add New Model</Dialog.Title>
            <div className="mt-2">
              <input
                type="text"
                value={newModelName}
                onChange={(e) => setNewModelName(e.target.value)}
                className="border border-gray-300 p-2 rounded-md w-full mb-4"
                placeholder="Model Name"
              />
              <input
                type="number"
                step="0.01"
                value={newModelPrice}
                onChange={(e) => setNewModelPrice(e.target.value)}
                className="border border-gray-300 p-2 rounded-md w-full mb-4"
                placeholder="Model Price"
              />
            </div>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={() => setAddModelModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleAddModel}
                className="px-4 py-2 bg-teal-600 text-white rounded-md"
              >
                Add Model
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
      
    </div>
      <BottomNav className="mt-16" />
  </>
  );
};

export default BrandModels;

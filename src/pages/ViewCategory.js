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
  const [editingModel, setEditingModel] = useState(null);
  const [editModelName, setEditModelName] = useState('');
  const [editModelPrice, setEditModelPrice] = useState('');
  const [isAddModelModalOpen, setAddModelModalOpen] = useState(false);
  const [isEditModelModalOpen, setEditModelModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [modelToDelete, setModelToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        const token = localStorage.getItem('Dealertoken');
        if (!token) throw new Error('No token found');

        const response = await axios.get(`${config.BASE_URL}/api/dealer/brands`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        setBrands(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching brands');
        console.error(error);
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  // Fetch models for a selected brand
  useEffect(() => {
    if (!selectedBrand) return;

    const fetchModels = async () => {
      try {
        const token = localStorage.getItem('Dealertoken');
        if (!token) throw new Error('No token found');

        const response = await axios.get(`${config.BASE_URL}/api/dealer/brands/${selectedBrand}/models`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        setModels(response.data);
      } catch (error) {
        setError('Error fetching models');
        console.error(error);
      }
    };

    fetchModels();
  }, [selectedBrand]);

  // Add a new model
  const handleAddModel = async () => {
    if (!selectedBrand || !newModelName || !newModelPrice) return;

    try {
      const token = localStorage.getItem('Dealertoken');
      if (!token) throw new Error('No token found');

      const response = await axios.post(`${config.BASE_URL}/api/dealer/brands/${selectedBrand}/models`, {
        name: newModelName,
        price: parseFloat(newModelPrice)
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      setModels([...models, response.data]);
      setAddModelModalOpen(false);
      setNewModelName('');
      setNewModelPrice('');
      toast.success('Model added successfully');
    } catch (error) {
      console.error('Error adding model:', error);
      toast.error('Error adding model');
    }
  };

  // Edit a model
  const handleEditModel = async () => {
    if (!editingModel || !editModelName || !editModelPrice) return;

    try {
      const token = localStorage.getItem('Dealertoken');
      if (!token) throw new Error('No token found');

      await axios.put(`${config.BASE_URL}/api/dealer/brands/${selectedBrand}/models/${editingModel._id}`, {
        name: editModelName,
        price: parseFloat(editModelPrice)
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      setModels(models.map(model => model._id === editingModel._id
        ? { ...model, name: editModelName, price: parseFloat(editModelPrice) }
        : model
      ));
      setEditModelModalOpen(false);
      setEditingModel(null);
      setEditModelName('');
      setEditModelPrice('');
      toast.success('Model updated successfully');
    } catch (error) {
      console.error('Error editing model:', error);
      toast.error('Error editing model');
    }
  };

  // Delete a model // Delete a model
  const handleDeleteModel = async () => {
    if (!modelToDelete) return;

    try {
      const token = localStorage.getItem('Dealertoken');
      if (!token) throw new Error('No token found');

      await axios.delete(`${config.BASE_URL}/api/dealer/models/${modelToDelete}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setModels(models.filter(model => model._id !== modelToDelete));
      setDeleteConfirmationOpen(false);
      setModelToDelete(null);
      toast.success('Model deleted successfully');
    } catch (error) {
      console.error('Error deleting model:', error);
      toast.error('Error deleting model');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
 <>
   <TopNav 
        toggleSidebar={() => {}} // No sidebar functionality in this example
        isSidebarOpen={false} // Not using sidebar in this example
        username={username} 
      />
    <div className="p-6 bg-white shadow-md rounded-lg mt-16">
      <h1 className="text-2xl font-bold mb-4">Brands and Category</h1>

      <div className="mb-4">
        <select
          onChange={(e) => setSelectedBrand(e.target.value)}
          value={selectedBrand || ''}
          className="border border-gray-300 p-2 rounded-md w-full"
        >
          <option value="">Select a brand</option>
          {brands.map((brand) => (
            <option key={brand._id} value={brand._id}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>

      {selectedBrand && (
        <div className='mb-16'>
          <h2 className="text-xl font-bold mb-4">Models for Selected Brand</h2>
          <button
            onClick={() => setAddModelModalOpen(true)}
            className="px-4 py-2 bg-teal-600 text-white rounded-md mb-4"
          >
            Add Model
          </button>
          <table className="w-full border-collapse bg-gray-100 rounded-lg">
            <thead>
              <tr className="bg-teal-600 text-white">
                <th className="p-3 border-b">#</th>
                <th className="p-3 border-b">Name</th>
                <th className="p-3 border-b">Price</th>
                <th className="p-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {models.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-3 text-center">No models available</td>
                </tr>
              ) : (
                models.map((model, index) => (
                  <tr key={model._id} className="hover:bg-gray-200">
                    <td className="p-3 border-b">{index + 1}</td>
                    <td className="p-3 border-b">{model.name}</td>
                    <td className="p-3 border-b">₹{(model.price ?? 0).toFixed(2)}</td>
                    <td className="p-3 border-b">
                      <button
                        onClick={() => {
                          setEditingModel(model);
                          setEditModelName(model.name);
                          setEditModelPrice(model.price);
                          setEditModelModalOpen(true);
                        }}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-md mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setModelToDelete(model._id);
                          setDeleteConfirmationOpen(true);
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded-md"
                      >
                        Delete
                      </button>
                    </td>
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
              <div className="flex justify-end">
                <button
                  onClick={() => setAddModelModalOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddModel}
                  className="px-4 py-2 bg-teal-600 text-white rounded-md"
                >
                  Add
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Edit Model Modal */}
      <Dialog open={isEditModelModalOpen} onClose={() => setEditModelModalOpen(false)}>
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg">
            <Dialog.Title className="text-lg font-semibold">Edit Model</Dialog.Title>
            <div className="mt-2">
              <input
                type="text"
                value={editModelName}
                onChange={(e) => setEditModelName(e.target.value)}
                className="border border-gray-300 p-2 rounded-md w-full mb-4"
                placeholder="Model Name"
              />
              <input
                type="number"
                step="0.01"
                value={editModelPrice}
                onChange={(e) => setEditModelPrice(e.target.value)}
                className="border border-gray-300 p-2 rounded-md w-full mb-4"
                placeholder="Model Price"
              />
              <div className="flex justify-end">
                <button
                  onClick={() => setEditModelModalOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditModel}
                  className="px-4 py-2 bg-teal-600 text-white rounded-md"
                >
                  Save
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteConfirmationOpen} onClose={() => setDeleteConfirmationOpen(false)}>
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg">
            <Dialog.Title className="text-lg font-semibold">Confirm Deletion</Dialog.Title>
            <div className="mt-2">
              <p>Are you sure you want to delete this model?</p>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setDeleteConfirmationOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteModel}
                  className="px-4 py-2 bg-red-600 text-white rounded-md"
                >
                  Delete
                </button>
              </div>
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

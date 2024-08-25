import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid'; // Import icons
import { Dialog } from '@headlessui/react'; // Import Dialog for modals
import { toast } from 'react-toastify'; // Import toast for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles
import TopNav from '../components/TopNav';  
import BottomNav from '../components/BottomNav';  
import config from '../config';

const BrandsTable = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [newBrandName, setNewBrandName] = useState('');
  const [username, setUsername] = useState(''); // State for username

  // Fetch username from local storage on component mount
  useEffect(() => {
    const storedUsername = localStorage.getItem('DealerUsername');
    setUsername(storedUsername || 'Guest'); 
  }, []);

  // Fetch brands on component mount
  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      setError('');
      try {
        const dealerToken = localStorage.getItem('Dealertoken');
        if (!dealerToken) {
          throw new Error('No token found');
        }

        const response = await axios.get(`${config.BASE_URL}/api/dealer/brands`, {
          headers: {
            'Authorization': `Bearer ${dealerToken}`
          }
        });

        setBrands(response.data); // Directly set data since the response is an array
      } catch (error) {
        setError('Error fetching brands');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const handleEdit = async () => {
    if (!selectedBrand || !newBrandName) {
      toast.error('Please provide a brand name');
      return;
    }

    try {
      const dealerToken = localStorage.getItem('Dealertoken');
      if (!dealerToken) {
        throw new Error('No token found');
      }

      await axios.put(`${config.BASE_URL}/api/dealer/brands/${selectedBrand._id}`, 
        { name: newBrandName },
        {
          headers: {
            'Authorization': `Bearer ${dealerToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setBrands(brands.map(brand => 
        brand._id === selectedBrand._id ? { ...brand, name: newBrandName } : brand
      ));
      setEditModalOpen(false);
      toast.success('Brand updated successfully');
    } catch (error) {
      setError('Error updating brand');
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!selectedBrand) return;

    try {
      const dealerToken = localStorage.getItem('Dealertoken');
      if (!dealerToken) {
        throw new Error('No token found');
      }

      await axios.delete(`${config.BASE_URL}/api/dealer/brands/${selectedBrand._id}`, {
        headers: {
          'Authorization': `Bearer ${dealerToken}`
        }
      });

      setBrands(brands.filter(brand => brand._id !== selectedBrand._id));
      setDeleteModalOpen(false);
      toast.success('Brand deleted successfully');
    } catch (error) {
      setError('Error deleting brand');
      console.error(error);
    }
  };

  return (
    <>
      <TopNav 
        toggleSidebar={() => {}} 
        isSidebarOpen={false} 
        username={username} 
      />
      <div className="p-6 bg-white shadow-md rounded-lg mt-16">
        <h1 className="text-2xl font-bold mb-4">Brands List</h1>
        {loading ? (
  <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent border-solid rounded-full animate-spin"></div>
      </div>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <table className="w-full border-collapse bg-gray-100 rounded-lg">
            <thead>
              <tr className="bg-teal-600 text-white">
                <th className="p-3 border-b">Name</th>
                <th className="p-3 border-b">Created At</th>
                <th className="p-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody className='text-center'>
              {brands.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-3 text-center">No brands available</td>
                </tr>
              ) : (
                brands.map((brand) => (
                  <tr key={brand._id} className="hover:bg-gray-200">
                    <td className="p-3 border-b">{brand.name}</td>
                    <td className="p-3 border-b">{new Date(brand.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 border-b flex space-x-2 justify-center">
                      <button
                        onClick={() => {
                          setSelectedBrand(brand);
                          setNewBrandName(brand.name);
                          setEditModalOpen(true);
                        }}
                        className="text-blue-500 hover:text-blue-700 flex items-center"
                        aria-label="Edit"
                      >
                        <PencilIcon className="w-5 h-5" />
                        <span className="ml-1">Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedBrand(brand);
                          setDeleteModalOpen(true);
                        }}
                        className="text-red-500 hover:text-red-700 flex items-center"
                        aria-label="Delete"
                      >
                        <TrashIcon className="w-5 h-5" />
                        <span className="ml-1">Delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {/* Delete Confirmation Modal */}
        <Dialog open={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg">
              <Dialog.Title className="text-lg font-semibold">Confirm Delete</Dialog.Title>
              <Dialog.Description className="mt-2">Are you sure you want to delete this brand?</Dialog.Description>
              <div className="mt-4 flex justify-end space-x-4">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-md"
                >
                  Delete
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg">
              <Dialog.Title className="text-lg font-semibold">Edit Brand</Dialog.Title>
              <div className="mt-2">
                <input
                  type="text"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md w-full"
                  placeholder="Enter new brand name"
                />
              </div>
              <div className="mt-4 flex justify-end space-x-4">
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-teal-600 text-white rounded-md"
                >
                  Save
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

export default BrandsTable;

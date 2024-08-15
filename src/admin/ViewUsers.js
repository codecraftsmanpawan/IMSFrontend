import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import AdminNav from './AdminNav'

const DealersList = () => {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchDealers = async () => {
      try {
        const response = await axios.get(`${config.BASE_URL}/api/admin/dealers`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        setDealers(response.data);
      } catch (err) {
        setError('Failed to fetch dealers.');
      } finally {
        setLoading(false);
      }
    };

    fetchDealers();
  }, []);

  const handleUpdate = async () => {
    try {
      await axios.put(`${config.BASE_URL}/api/admin/dealers/${selectedDealer._id}`, selectedDealer, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      const response = await axios.get(`${config.BASE_URL}/api/admin/dealers`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      setDealers(response.data);
      setShowEditModal(false);
    } catch (err) {
      setError('Failed to update dealer.');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${config.BASE_URL}/api/admin/dealers/${selectedDealer._id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      setDealers(dealers.filter(dealer => dealer._id !== selectedDealer._id));
      setShowDeleteModal(false);
    } catch (err) {
      setError('Failed to delete dealer.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
 <>
 <AdminNav/>
    <div className="p-6 bg-gray-100 min-h-screen mt-16">
      <h1 className="text-3xl font-semibold mb-6">Dealers List</h1>
      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead className="bg-teal-500 text-white">
              <tr>
                <th className="py-3 px-6 border-b text-left">Name</th>
                <th className="py-3 px-6 border-b text-left">Username</th>
                <th className="py-3 px-6 border-b text-left">Created At</th>
                <th className="py-3 px-6 border-b text-left">Updated At</th>
                <th className="py-3 px-6 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dealers.map(dealer => (
                <tr key={dealer._id} className="border-b hover:bg-gray-100">
                  <td className="py-3 px-6">{dealer.name}</td>
                  <td className="py-3 px-6">{dealer.username}</td>
                  <td className="py-3 px-6">{formatDate(dealer.createdAt)}</td>
                  <td className="py-3 px-6">{formatDate(dealer.updatedAt)}</td>
                  <td className="py-3 px-6 flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedDealer(dealer);
                        setShowEditModal(true);
                      }}
                      className="bg-blue-500 text-white py-1 px-3 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setSelectedDealer(dealer);
                        setShowDeleteModal(true);
                      }}
                      className="bg-red-500 text-white py-1 px-3 rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">Edit Dealer</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
              <div className="mb-4">
                <label className="block mb-2">Name</label>
                <input
                  type="text"
                  value={selectedDealer.name}
                  onChange={(e) => setSelectedDealer({ ...selectedDealer, name: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Username</label>
                <input
                  type="text"
                  value={selectedDealer.username}
                  onChange={(e) => setSelectedDealer({ ...selectedDealer, username: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-500 text-white py-1 px-3 rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-500 text-white py-1 px-3 rounded-md shadow-sm hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-300"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete this dealer?</p>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-500 text-white py-1 px-3 rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white py-1 px-3 rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
 </>
  );
};

export default DealersList;

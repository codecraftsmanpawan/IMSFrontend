import React, { useState } from 'react';
import axios from 'axios';
import AdminNav from './AdminNav'; 
import config from '../config';
const AddUser = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(
        `${config.BASE_URL}/api/admin/dealer`,
        { name, username, password },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        }
      );

      setSuccess('User added successfully!');
      setName('');
      setUsername('');
      setPassword('');
    } catch (err) {
      setError('Username Already Exist.');
    }
  };

  return (
    <div>
      <AdminNav />
      <div className="p-6 bg-gradient-to-r from-teal-200 to-gray-100 min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6">Add New User</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-2 border border-teal-500 rounded-md w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 mb-2">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="p-2 border border-teal-500 rounded-md w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-2 border border-teal-500 rounded-md w-full"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-teal-500 text-white p-2 rounded-md hover:bg-teal-600 transition-colors duration-300 w-full"
            >
              Add User
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;

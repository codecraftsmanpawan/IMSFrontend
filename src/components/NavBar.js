// src/components/NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className="bg-teal-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-white text-xl font-semibold">Inventory Management System</h1>
        </div>
        <div>
     
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

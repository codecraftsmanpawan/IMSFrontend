import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { HomeIcon, MagnifyingGlassIcon, Cog8ToothIcon } from '@heroicons/react/24/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBatteryFull } from '@fortawesome/free-solid-svg-icons'; // Import FontAwesome battery icon

const BottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Home', icon: <HomeIcon className="w-6 h-6" />, path: '/dashboard' },
    { name: 'Search', icon: <MagnifyingGlassIcon className="w-6 h-6" />, path: '/search' },
    { name: 'Stocks', icon: <FontAwesomeIcon icon={faBatteryFull} className="w-6 h-6" />, path: '/stocks' },
    { name: 'Settings', icon: <Cog8ToothIcon className="w-6 h-6" />, path: '/settings' },
  ];

  return (
    <div className="bg-teal-600 text-white p-4 fixed bottom-0 left-0 w-full shadow-lg flex justify-around items-center space-x-6 rounded-t-3xl">
      {navItems.map(({ name, icon, path }) => (
        <Link
          key={name}
          to={path}
          className={`flex flex-col items-center group transition-transform transform ${location.pathname === path ? 'scale-110 text-teal-200' : 'hover:scale-110'}`}
        >
          {React.cloneElement(icon, { className: `w-6 h-6 ${location.pathname === path ? 'text-teal-200' : 'text-white'} group-hover:text-teal-200 transition-colors duration-300` })}
          <span className={`text-xs mt-1 ${location.pathname === path ? 'text-teal-200' : 'group-hover:text-teal-200'} transition-colors duration-300`}>
            {name}
          </span>
        </Link>
      ))}
    </div>
  );
};

export default BottomNav;

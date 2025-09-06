// sih-project/src/Components/Navbar/Navbar.jsx

import React from "react";
import { useNavigate } from 'react-router-dom';
import { FaBell, FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

const Navbar = ({ signOut, user, userRole }) => {
  const navigate = useNavigate();

  // Function to get dashboard title based on user role
  const getDashboardTitle = (role) => {
    const roleTitles = {
      'SuperAdmin': 'Admin Dashboard',
      'RoadsAdmin': 'Roads & Transportation Dashboard',
      'ElectricityAdmin': 'Electricity Dashboard',
      'SanitationAdmin': 'Sanitation Dashboard',
      'WaterAdmin': 'Water & Drainage Dashboard',
      'SafetyAdmin': 'Public Safety Dashboard',
      'ParksAdmin': 'Parks & Recreation Dashboard'
    };
    
    return roleTitles[role] || 'Dashboard';
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center">
          <a
            href="/"
            className="text-xl font-bold text-gray-800 hover:text-gray-900"
          >
            {getDashboardTitle(userRole)}
          </a>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button
            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <FaBell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-2 p-2 text-gray-600 rounded-lg">
            <FaUser className="w-5 h-5" />
            <span className="hidden md:inline font-medium">
              {user?.attributes?.email || 'Admin'}
            </span>
          </div>
          
          {/* Logout Button */}
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-2 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Log Out"
          >
            <FiLogOut className="w-5 h-5" />
            <span className="hidden md:inline font-medium">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

// import React from 'react';
// import { Bell, User } from 'react-icons/fa'; // Ensure you have react-icons installed

// const Navbar = () => {
//   return (
//     <nav className="bg-white shadow-sm border-b border-gray-200">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
//         {/* Logo */}
//         <div className="flex items-center">
//           <a href="/" className="text-xl font-bold text-gray-800 hover:text-gray-900">
//             Dashboard
//           </a>
//         </div>

//         {/* Actions */}
//         <div className="flex items-center space-x-4">
//           {/* Notifications */}
//           <button
//             className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
//             aria-label="Notifications"
//           >
//             <Bell className="w-5 h-5" />
//             <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//           </button>

//           {/* User Profile */}
//           <button
//             className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
//             aria-label="User Profile"
//           >
//             <User className="w-5 h-5" />
//             <span className="hidden md:inline font-medium">Admin</span>
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React from "react";
import { FaBell, FaUser } from "react-icons/fa"; // Correct icons

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center">
          <a
            href="/"
            className="text-xl font-bold text-gray-800 hover:text-gray-900"
          >
            Dashboard
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
          <button
            className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="User Profile"
          >
            <FaUser className="w-5 h-5" />
            <span className="hidden md:inline font-medium">Admin</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

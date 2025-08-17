import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HomeIcon, UserIcon, ClipboardDocumentListIcon, ChatBubbleLeftEllipsisIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

const FreelancerSideNav = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-2xl font-bold">Freelancer Panel</h2>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link 
              to="/dashboard" 
              className="flex items-center p-3 text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <HomeIcon className="h-5 w-5 mr-3" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/create-gig" 
              className="flex items-center p-3 text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <PlusCircleIcon className="h-5 w-5 mr-3" />
              Create Gig
            </Link>
          </li>
          <li>
            <Link 
              to="/freelancer-orders-dashboard" 
              className="flex items-center p-3 text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ClipboardDocumentListIcon className="h-5 w-5 mr-3" />
              Orders
            </Link>
          </li>
          <li>
            <Link 
              to="/chat" 
              className="flex items-center p-3 text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChatBubbleLeftEllipsisIcon className="h-5 w-5 mr-3" />
              Chat
            </Link>
          </li>
          <li>
            <Link 
              to="/freelancer-profile" 
              className="flex items-center p-3 text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <UserIcon className="h-5 w-5 mr-3" />
              Profile
            </Link>
          </li>
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default FreelancerSideNav;

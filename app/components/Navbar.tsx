'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { FiLogIn, FiLogOut, FiUserPlus, FiPlusCircle, FiGrid } from 'react-icons/fi';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 w-full bg-black/30 backdrop-blur-lg border-b border-purple-500/20 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-white tracking-wider">
              Rent<span className="text-purple-400">Pal</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/home">
                <span className="text-gray-300">Hi, {user?.name}</span>
                </Link>
                <Link href="/items/add" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors">
                  <FiPlusCircle className="mr-2" /> List Item
                </Link>
                <Link href="/items" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors">
                  <FiGrid className="mr-2" /> Browse Item
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  <FiLogOut className="mr-2" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                   <FiLogIn className="mr-2" /> Login
                </Link>
                <Link href="/register" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors">
                   <FiUserPlus className="mr-2" /> Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar
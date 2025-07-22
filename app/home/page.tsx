'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { FiArrowRight, FiPlusSquare, FiGrid } from 'react-icons/fi';

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If the user is not authenticated, redirect them to the login page
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Render a loading state or null while checking auth
  if (!isAuthenticated) {
    return null; 
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-950 to-black p-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-2">Welcome, {user?.name}!</h1>
        <p className="text-xl text-gray-400">What would you like to do today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Card for Listing an Item */}
        <Link href="/items/add" className="group block p-8 bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-purple-500/30 hover:border-purple-400 hover:bg-gray-800/70 transition-all duration-300 transform hover:-translate-y-1">
          <FiPlusSquare className="text-5xl text-purple-400 mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">List an Item</h2>
          <p className="text-gray-400 mb-4">Have something to lend? Earn money by listing your items for others to rent.</p>
          <span className="font-semibold text-purple-400 flex items-center">
            Get Started <FiArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>

        {/* Card for Browsing Items */}
        <Link href="/items" className="group block p-8 bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-purple-500/30 hover:border-purple-400 hover:bg-gray-800/70 transition-all duration-300 transform hover:-translate-y-1">
          <FiGrid className="text-5xl text-purple-400 mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Browse & Rent</h2>
          <p className="text-gray-400 mb-4">Need something for a short time? Find and rent items from peers on campus.</p>
          <span className="font-semibold text-purple-400 flex items-center">
            Explore Items <FiArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>
      </div>
    </div>
  );
}
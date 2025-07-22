'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AddItemPage() {
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [department, setDepartment] = useState('');
  const [duration, setDuration] = useState('Per Day'); // Default duration
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!title || !description || !price || !category || !department) {
      setError('Please fill out all fields.');
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Send the auth token!
        },
        body: JSON.stringify({
          title,
          description,
          price: parseInt(price), // Send price as a number
          imageUrl: '[https://placehold.co/600x400/1a1a2e/ffffff?text=Item+Image](https://placehold.co/600x400/1a1a2e/ffffff?text=Item+Image)', // Placeholder image for now
          category,
          department,
          duration
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create item');
      }

      setSuccess('Item listed successfully! Redirecting...');
      setTimeout(() => {
        router.push('/items'); // Redirect to the main items list
      }, 2000);

    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-950 to-black p-4">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-purple-500/30">
        <h1 className="text-3xl font-bold text-center text-white">List a New Item</h1>
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label htmlFor="title" className="text-sm font-bold text-gray-400 block">Title</label>
            <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-3 mt-1 text-gray-200 bg-gray-700/50 rounded-md border border-gray-600 focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50 transition" />
          </div>
          {/* ... Add similar inputs for description, price, category, department ... */}
          
          <div>
            <label htmlFor="description" className="text-sm font-bold text-gray-400 block">Description</label>
            <input id="description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full p-3 mt-1 text-gray-200 bg-gray-700/50 rounded-md border border-gray-600 focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50 transition" />
          </div>

          {/* Example for Price */}
           <div>
            <label htmlFor="price" className="text-sm font-bold text-gray-400 block">Price (per day)</label>
            <input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full p-3 mt-1 text-gray-200 bg-gray-700/50 rounded-md border border-gray-600 focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50 transition" />
          </div>

          <div>
            <label htmlFor="category" className="text-sm font-bold text-gray-400 block">Category</label>
            <input id="category" type="text" value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full p-3 mt-1 text-gray-200 bg-gray-700/50 rounded-md border border-gray-600 focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50 transition" />
          </div>

          <div>
            <label htmlFor="department" className="text-sm font-bold text-gray-400 block">Department</label>
            <input id="department" type="text" value={department} onChange={(e) => setDepartment(e.target.value)} required className="w-full p-3 mt-1 text-gray-200 bg-gray-700/50 rounded-md border border-gray-600 focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50 transition" />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          {success && <p className="text-green-400 text-sm text-center">{success}</p>}
          <button type="submit" className="w-full py-3 font-bold text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-all duration-300">
            List My Item
          </button>
        </form>
      </div>
    </div>
  );
}
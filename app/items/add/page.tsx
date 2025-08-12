'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { FiUploadCloud } from 'react-icons/fi';
import api from '../../lib/api';

export default function AddItemPage() {
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();
  
   const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      setError('Please select an image for your item.');
      return;
    }
    setError('');
    setSuccess('');
    setIsUploading(true);

    // Basic validation
    if (!title || !description || !price || !category || !department) {
      setError('Please fill out all fields.');
      setIsUploading(false);
      return;
    }

    try {
      if (!token) {
        throw new Error('Authentication required');
      }

      // Step 1: Upload image to Cloudinary
      setSuccess('Uploading image...');
      const uploadResult = await api.upload.image(imageFile, title, token);
      
      // Step 2: Create item with image URL
      setSuccess('Creating item...');
      const itemData = {
        title,
        description,
        price: parseFloat(price),
        category,
        department,
        duration,
        imageUrl: uploadResult.item.imageUrl // Handle different response formats
      };

      await api.items.create(itemData, token);
      setSuccess('Item listed successfully! Redirecting...');
      
      setTimeout(() => {
        router.push('/items'); // Redirect to the main items list
      }, 2000);
    } catch (err: any) {
      console.error('Error creating item:', err);
      setError(err.message || 'Failed to create item. Please try again.');
    } finally {
      setIsUploading(false);
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
          
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">Item Image</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {previewUrl ? (
                  <img src={previewUrl} alt="Item preview" className="mx-auto h-48 w-auto rounded-md" />
                ) : (
                  <FiUploadCloud className="mx-auto h-12 w-12 text-gray-500" />
                )}
                <div className="flex text-sm text-gray-400">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-purple-400 hover:text-purple-300 focus-within:outline-none p-1">
                    <span>{imageFile ? 'Change file' : 'Upload a file'}</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>


          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          {success && <p className="text-green-400 text-sm text-center">{success}</p>}
          <button 
            type="submit" 
            disabled={isUploading}
            className="w-full py-3 font-bold text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300"
          >
            {isUploading ? 'Uploading...' : 'List My Item'}
          </button>
        </form>
      </div>
    </div>
  );
}
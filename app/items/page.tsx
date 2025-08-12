'use client';

import { useEffect, useState } from 'react';
import api from '../lib/api';

interface Item {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  category: string;
  department: string;
  duration: string;
  owner: {
    name: string;
    email: string;
  };
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await api.items.getAll();
        setItems(data.items || data || []);
      } catch (error) {
        console.error('Failed to fetch items:', error);
        setItems([]);
      }
    };

    loadItems();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-black via-purple-950 to-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6 text-center">Available Items</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map(item => (
          <div
            key={item.id}
            className="bg-gray-800 rounded-2xl shadow-xl p-4 hover:scale-105 transition-transform duration-300"
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-40 object-cover rounded-xl mb-4"
            />
            <h2 className="text-xl font-semibold">{item.title}</h2>
            <p className="text-sm text-gray-300 mb-2">{item.description}</p>
            <div className="text-purple-400 font-bold mb-1">₹{item.price}</div>
            <div className="text-sm text-gray-400">
              {item.category} · {item.department} · {item.duration}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Lender: {item.owner.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow rounded p-6">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}</h1>
        <p className="text-gray-700">You are now logged in with: <strong>{user.email}</strong></p>

        <button
          onClick={() => {
            logout();
            router.push('/login');
          }}
          className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
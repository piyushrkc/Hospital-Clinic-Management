'use client';

import { useEffect, useState } from 'react';
import { getDoctors, deleteDoctor, addDoctor } from '@/services/adminService';
import { Doctor } from '@/types/doctor';
import AdminDoctorCard from '@/components/AdminDoctorCard';

export default function AdminDashboard() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');

  useEffect(() => {
    refreshList();
  }, []);

  const refreshList = async () => {
    const data = await getDoctors();
    setDoctors(data);
  };

  const handleDelete = async (id: string) => {
    await deleteDoctor(id);
    refreshList();
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoctor({ name, specialty });
    setName('');
    setSpecialty('');
    refreshList();
  };

  return (
    <div className="min-h-screen bg-white px-6 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Admin Dashboard</h1>

      {/* Add Doctor Form */}
      <form onSubmit={handleAdd} className="flex flex-wrap gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Doctor Name"
          className="border p-2 rounded flex-1 min-w-[200px] text-gray-800"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Specialty"
          className="border p-2 rounded flex-1 min-w-[200px] text-gray-800"
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
        >
          Add Doctor
        </button>
      </form>

      {/* Doctor List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {doctors.map((doc) => (
          <AdminDoctorCard key={doc.id} doctor={doc} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
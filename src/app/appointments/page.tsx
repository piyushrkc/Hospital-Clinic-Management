'use client';

import { useState, useEffect } from 'react';
import { getDoctors } from '@/services/doctorService';
import { Doctor } from '@/types/doctor';
import { createAppointment } from '@/services/appointmentService';

export default function AppointmentBookingPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    getDoctors().then(setDoctors);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createAppointment({
      doctorId: selectedDoctor,
      date,
      time,
    });
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Book an Appointment</h1>

      {submitted ? (
        <p className="text-green-600">Appointment successfully booked!</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select a doctor</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name} — {doc.specialty}
              </option>
            ))}
          </select>

          <input
            type="date"
            className="w-full border p-2 rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <input
            type="time"
            className="w-full border p-2 rounded"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            Book Appointment
          </button>
        </form>
      )}
    </div>
  );
}
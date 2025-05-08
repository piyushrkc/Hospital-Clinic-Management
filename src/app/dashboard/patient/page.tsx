'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function PatientDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      router.push('/login');
    }
    
    // Verify user is a patient
    if (!isLoading && user && user.role !== 'patient') {
      // If user is not a patient, redirect to appropriate dashboard
      if (user.role === 'doctor') {
        router.push('/dashboard/doctor');
      } else if (user.role === 'admin') {
        router.push('/dashboard/admin');
      }
    }
  }, [user, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Mock data for dashboard
  const appointments = [
    {
      id: 'appt1',
      doctorName: 'Dr. Sarah Johnson',
      department: 'Internal Medicine',
      date: '2025-04-30',
      time: '10:00 AM',
      status: 'upcoming'
    },
    {
      id: 'appt2',
      doctorName: 'Dr. James Wilson',
      department: 'Cardiology',
      date: '2025-05-15',
      time: '2:30 PM',
      status: 'upcoming'
    }
  ];

  const prescriptions = [
    {
      id: 'pres1',
      doctorName: 'Dr. Sarah Johnson',
      issuedDate: '2025-04-15',
      medications: ['Amoxicillin 500mg', 'Paracetamol 650mg']
    },
    {
      id: 'pres2',
      doctorName: 'Dr. James Wilson',
      issuedDate: '2025-03-20',
      medications: ['Atorvastatin 20mg', 'Aspirin 75mg']
    }
  ];

  const labResults = [
    {
      id: 'lab1',
      testName: 'Complete Blood Count',
      orderedDate: '2025-04-15',
      resultDate: '2025-04-17',
      status: 'completed'
    },
    {
      id: 'lab2',
      testName: 'Lipid Profile',
      orderedDate: '2025-04-15',
      resultDate: null,
      status: 'processing'
    }
  ];

  const medicalRecords = [
    {
      id: 'med1',
      title: 'Annual Checkup',
      type: 'Examination',
      date: '2025-04-15',
      doctorName: 'Dr. Sarah Johnson'
    },
    {
      id: 'med2',
      title: 'Chest X-Ray',
      type: 'Radiology',
      date: '2025-04-16',
      doctorName: 'Dr. Michael Brown'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Patient Dashboard</h1>
          <p className="text-gray-600">Welcome, {user.firstName} {user.lastName}</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Appointments Section */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Upcoming Appointments</h2>
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm">
                Book Appointment
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {appointments.map(appointment => (
                  <div key={appointment.id} className="border border-gray-200 rounded-md p-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{appointment.doctorName}</h3>
                        <p className="text-sm text-gray-500">{appointment.department}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {new Date(appointment.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
                        <p className="text-sm text-gray-500">{appointment.time}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 py-1 px-3 rounded text-xs">
                        View Details
                      </button>
                      <button className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 py-1 px-3 rounded text-xs">
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
                <div className="text-center mt-4">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View All Appointments
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Active Prescriptions Section */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Active Prescriptions</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {prescriptions.map(prescription => (
                  <div key={prescription.id} className="border border-gray-200 rounded-md p-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">Prescribed by {prescription.doctorName}</h3>
                        <p className="text-sm text-gray-500">
                          Issued on {new Date(prescription.issuedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Medications:</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 pl-2">
                        {prescription.medications.map((med, index) => (
                          <li key={index}>{med}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-3">
                      <button className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 py-1 px-3 rounded text-xs">
                        View Full Prescription
                      </button>
                    </div>
                  </div>
                ))}
                <div className="text-center mt-4">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View All Prescriptions
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Lab Results Section */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Recent Lab Results</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {labResults.map(result => (
                  <div key={result.id} className="border border-gray-200 rounded-md p-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{result.testName}</h3>
                        <p className="text-sm text-gray-500">
                          Ordered on {new Date(result.orderedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        {result.status === 'completed' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Completed
                          </span>
                        ) : result.status === 'processing' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Processing
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Ordered
                          </span>
                        )}
                      </div>
                    </div>
                    {result.resultDate && (
                      <p className="text-sm text-gray-600 mt-1">
                        Results available since {new Date(result.resultDate).toLocaleDateString()}
                      </p>
                    )}
                    <div className="mt-3">
                      {result.status === 'completed' ? (
                        <button className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 py-1 px-3 rounded text-xs">
                          View Results
                        </button>
                      ) : (
                        <button className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 py-1 px-3 rounded text-xs" disabled>
                          {result.status === 'processing' ? 'Processing' : 'Pending'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <div className="text-center mt-4">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View All Lab Results
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Medical Records Section */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Recent Medical Records</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {medicalRecords.map(record => (
                  <div key={record.id} className="border border-gray-200 rounded-md p-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{record.title}</h3>
                        <p className="text-sm text-gray-500">{record.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {new Date(record.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">{record.doctorName}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <button className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 py-1 px-3 rounded text-xs">
                        View Record
                      </button>
                    </div>
                  </div>
                ))}
                <div className="text-center mt-4">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View All Medical Records
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 justify-center mt-6">
          <Link href="/" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
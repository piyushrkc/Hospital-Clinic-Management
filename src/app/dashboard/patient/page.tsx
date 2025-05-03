// src/app/(dashboard)/patient/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import api from '@/lib/api';

// Mock data types
interface Appointment {
  id: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

interface Prescription {
  id: string;
  doctorName: string;
  issuedDate: string;
  medications: string[];
  status: 'active' | 'completed';
}

interface LabResult {
  id: string;
  testName: string;
  orderedDate: string;
  resultDate: string | null;
  status: 'ordered' | 'processing' | 'completed';
}

interface MedicalRecord {
  id: string;
  title: string;
  type: string;
  date: string;
  doctorName: string;
}

const PatientDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for patient data
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  
  // Fetch patient data
  useEffect(() => {
    const fetchPatientData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // In a real app, these would be API calls
        // const appointmentsResponse = await api.get('/appointments');
        // const prescriptionsResponse = await api.get('/prescriptions');
        // const labResultsResponse = await api.get('/lab-results');
        // const medicalRecordsResponse = await api.get('/medical-records');
        
        // For demo purposes, using mock data
        setTimeout(() => {
          setAppointments([
            {
              id: 'apt1',
              doctorName: 'Dr. Sarah Johnson',
              department: 'Internal Medicine',
              date: '2025-04-30',
              time: '10:00 AM',
              status: 'upcoming',
            },
            {
              id: 'apt2',
              doctorName: 'Dr. James Wilson',
              department: 'Cardiology',
              date: '2025-05-15',
              time: '2:30 PM',
              status: 'upcoming',
            },
            {
              id: 'apt3',
              doctorName: 'Dr. Sarah Johnson',
              department: 'Internal Medicine',
              date: '2025-04-15',
              time: '11:00 AM',
              status: 'completed',
            },
          ]);
          
          setPrescriptions([
            {
              id: 'pres1',
              doctorName: 'Dr. Sarah Johnson',
              issuedDate: '2025-04-15',
              medications: ['Amoxicillin 500mg', 'Paracetamol 650mg'],
              status: 'active',
            },
            {
              id: 'pres2',
              doctorName: 'Dr. James Wilson',
              issuedDate: '2025-03-20',
              medications: ['Atorvastatin 20mg', 'Aspirin 75mg'],
              status: 'active',
            },
          ]);
          
          setLabResults([
            {
              id: 'lab1',
              testName: 'Complete Blood Count',
              orderedDate: '2025-04-15',
              resultDate: '2025-04-17',
              status: 'completed',
            },
            {
              id: 'lab2',
              testName: 'Lipid Profile',
              orderedDate: '2025-04-15',
              resultDate: null,
              status: 'processing',
            },
          ]);
          
          setMedicalRecords([
            {
              id: 'rec1',
              title: 'Annual Checkup',
              type: 'Examination',
              date: '2025-04-15',
              doctorName: 'Dr. Sarah Johnson',
            },
            {
              id: 'rec2',
              title: 'Chest X-Ray',
              type: 'Radiology',
              date: '2025-04-16',
              doctorName: 'Dr. Michael Brown',
            },
          ]);
          
          setLoading(false);
        }, 1000);
    } catch (err) {
        console.error('Error fetching patient data:', err);
        setError('Failed to load your health information. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchPatientData();
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar
          role="patient"
          items={[
            { label: 'Dashboard', href: '/patient', active: true },
            { label: 'Appointments', href: '/patient/appointments' },
            { label: 'Medical Records', href: '/patient/records' },
            { label: 'Prescriptions', href: '/patient/prescriptions' },
            { label: 'Lab Results', href: '/patient/lab-results' },
            { label: 'Messages', href: '/patient/messages' },
            { label: 'Profile', href: '/patient/profile' },
          ]}
        />
        
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.firstName || 'Patient'}</h1>
            <p className="text-gray-600">Manage your health information and appointments</p>
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {loading ? (
            <div className="text-center py-12">
              <svg className="animate-spin h-8 w-8 text-primary-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-500">Loading your health information...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upcoming Appointments Section */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">Upcoming Appointments</h2>
                  <Link href="/patient/appointments/book">
                    <Button size="sm">Book Appointment</Button>
                  </Link>
                </div>
                
                <div className="px-6 py-4">
                  {appointments.filter(apt => apt.status === 'upcoming').length > 0 ? (
                    <div className="space-y-4">
                      {appointments
                        .filter(apt => apt.status === 'upcoming')
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .slice(0, 3)
                        .map(appointment => (
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
                              <Link href={`/patient/appointments/${appointment.id}`}>
                                <Button variant="outline" size="sm">View Details</Button>
                              </Link>
                              <Button variant="outline" size="sm">Cancel</Button>
                            </div>
                          </div>
                        ))
                      }
                      <div className="text-center mt-4">
                        <Link href="/patient/appointments">
                          <Button variant="ghost" size="sm">View All Appointments</Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500 mb-4">No upcoming appointments</p>
                      <Link href="/patient/appointments/book">
                        <Button>Book an Appointment</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Active Prescriptions Section */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800">Active Prescriptions</h2>
                </div>
                
                <div className="px-6 py-4">
                  {prescriptions.filter(p => p.status === 'active').length > 0 ? (
                    <div className="space-y-4">
                      {prescriptions
                        .filter(p => p.status === 'active')
                        .map(prescription => (
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
                              <Link href={`/patient/prescriptions/${prescription.id}`}>
                                <Button variant="outline" size="sm">View Full Prescription</Button>
                              </Link>
                            </div>
                          </div>
                        ))
                      }
                      <div className="text-center mt-4">
                        <Link href="/patient/prescriptions">
                          <Button variant="ghost" size="sm">View All Prescriptions</Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No active prescriptions</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Recent Lab Results Section */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800">Recent Lab Results</h2>
                </div>
                
                <div className="px-6 py-4">
                  {labResults.length > 0 ? (
                    <div className="space-y-4">
                      {labResults
                        .sort((a, b) => {
                          // Sort by ordered date, most recent first
                          return new Date(b.orderedDate).getTime() - new Date(a.orderedDate).getTime();
                        })
                        .slice(0, 3)
                        .map(result => (
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
                                <Link href={`/patient/lab-results/${result.id}`}>
                                  <Button variant="outline" size="sm">View Results</Button>
                                </Link>
                              ) : (
                                <Button variant="outline" size="sm" disabled>
                                  {result.status === 'processing' ? 'Processing' : 'Pending'}
                                </Button>
                              )}
                            </div>
                          </div>
                        ))
                      }
                      <div className="text-center mt-4">
                        <Link href="/patient/lab-results">
                          <Button variant="ghost" size="sm">View All Lab Results</Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No lab results available</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Recent Medical Records Section */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800">Recent Medical Records</h2>
                </div>
                
                <div className="px-6 py-4">
                  {medicalRecords.length > 0 ? (
                    <div className="space-y-4">
                      {medicalRecords
                        .sort((a, b) => {
                          // Sort by date, most recent first
                          return new Date(b.date).getTime() - new Date(a.date).getTime();
                        })
                        .slice(0, 3)
                        .map(record => (
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
                              <Link href={`/patient/records/${record.id}`}>
                                <Button variant="outline" size="sm">View Record</Button>
                              </Link>
                            </div>
                          </div>
                        ))
                      }
                      <div className="text-center mt-4">
                        <Link href="/patient/records">
                          <Button variant="ghost" size="sm">View All Medical Records</Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No medical records available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PatientDashboard;
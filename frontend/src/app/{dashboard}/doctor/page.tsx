'use client';

import {  useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';


// Mock data for development
const mockAppointments: Appointment[] = [
    { id: 1, patientName: 'John Smith', age: 45, gender: 'Male', time: '09:00 AM', reason: 'Fever', status: 'waiting' },
    { id: 2, patientName: 'Sarah Johnson', age: 32, gender: 'Female', time: '10:30 AM', reason: 'Follow-up', status: 'waiting' },
    { id: 3, patientName: 'Michael Brown', age: 52, gender: 'Male', time: '11:00 AM', reason: 'Consultation', status: 'waiting' },
    { id: 4, patientName: 'Emma Wilson', age: 28, gender: 'Female', time: '11:30 AM', reason: 'Consultation', status: 'waiting' },
  ];

type Appointment = {
    id: number;
    patientName: string;
    age: number;
    gender: string;
    time: string;
    reason: string;
    status: 'waiting' | 'in-progress' | 'completed';
  };
  
  const DoctorDashboard = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
    const [currentPatient, setCurrentPatient] = useState<Appointment | null>(null);
    const stats = {
        todayAppointments: 12,
        patientsInQueue: 4,
        pendingReports: 7,
      };
    const startConsultation = (appointment: Appointment) => {
      setCurrentPatient(appointment);
      setAppointments(appointments.map(app => 
        app.id === appointment.id ? { ...app, status: 'in-progress' } : app
      ));
    };

  const finishConsultation = () => {
    if (currentPatient) {
      setAppointments(appointments.map(app => 
        app.id === currentPatient.id ? { ...app, status: 'completed' } : app
      ));
      setCurrentPatient(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar
          role="doctor"
          items={[
            { label: 'Dashboard', href: '/doctor', active: true },
            { label: 'My Schedule', href: '/doctor/schedule' },
            { label: 'Patient Queue', href: '/doctor/queue' },
            { label: 'Patient Records', href: '/doctor/records' },
            { label: 'E-Prescriptions', href: '/doctor/prescriptions' },
            { label: 'Lab Results', href: '/doctor/lab-results' },
            { label: 'Settings', href: '/doctor/settings' },
          ]}
        />
        
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-600">Welcome back, Dr. {user?.firstName || 'Doctor'}</p>
            </div>
            <div className="text-gray-600">
              {formatDate(new Date())}
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard
              title="Today's Appointments"
              value={stats.todayAppointments}
              color="blue"
            />
            <StatsCard
              title="Patients in Queue"
              value={stats.patientsInQueue}
              color="red"
            />
            <StatsCard
              title="Pending Reports"
              value={stats.pendingReports}
              color="yellow"
            />
          </div>
          
          {/* Current Patient */}
          <div className="bg-white rounded-lg shadow mb-8 p-6">
            <h2 className="text-lg font-semibold mb-4">Current Patient</h2>
            
            {currentPatient ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      {currentPatient.patientName.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium">{currentPatient.patientName}</h3>
                    <p className="text-sm text-gray-500">
                      {currentPatient.gender}, {currentPatient.age} • Reason: {currentPatient.reason}
                    </p>
                  </div>
                </div>
                
                <div className="space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => window.location.href = `/doctor/records/${currentPatient.id}`}
                  >
                    View Records
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.location.href = `/doctor/prescriptions/new?patientId=${currentPatient.id}`}
                  >
                    Create Prescription
                  </Button>
                  <Button
                    variant="primary"
                    onClick={finishConsultation}
                  >
                    Complete Consultation
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No active consultation. Start with a patient from the queue below.
              </div>
            )}
          </div>
          
          {/* Patient Queue */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Patient Queue</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-medium">
                              {appointment.patientName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {appointment.patientName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {appointment.gender}, {appointment.age}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {appointment.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {appointment.reason}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={appointment.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {appointment.status === 'waiting' && (
                          <Button
                            size="sm"
                            onClick={() => startConsultation(appointment)}
                            disabled={currentPatient !== null}
                          >
                            Start
                          </Button>
                        )}
                        {appointment.status === 'in-progress' && (
                          <span className="text-blue-600">In Progress</span>
                        )}
                        {appointment.status === 'completed' && (
                          <span className="text-green-600">Completed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Helper Components
const StatsCard = ({ title, value, color }: { title: string; value: number; color: string }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-yellow-50 text-yellow-600',
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <p className="text-gray-600 text-sm font-medium">{title}</p>
      <p className={`text-3xl font-bold mt-2 ${colors[color as keyof typeof colors]}`}>{value}</p>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles = {
    waiting: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
  };
  
  const statusLabels = {
    waiting: 'Waiting',
    'in-progress': 'In Progress',
    completed: 'Completed',
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles]}`}>
      {statusLabels[status as keyof typeof statusLabels]}
    </span>
  );
};

export default DoctorDashboard;
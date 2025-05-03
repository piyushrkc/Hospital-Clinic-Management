import { AppointmentWithDoctor } from '@/types/appointment';

export async function getMyAppointments(): Promise<AppointmentWithDoctor[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'a1',
          doctorId: '1',
          doctorName: 'Dr. Anjali Mehra',
          specialty: 'Cardiologist',
          date: '2024-05-05',
          time: '10:30',
          status: 'Upcoming',
        },
        {
          id: 'a2',
          doctorId: '2',
          doctorName: 'Dr. Ravi Kapoor',
          specialty: 'Dermatologist',
          date: '2024-04-27',
          time: '15:00',
          status: 'Completed',
        },
      ]);
    }, 500);
  });
}

// ✅ ADD THIS BELOW
type AppointmentInput = {
  doctorId: string;
  date: string;
  time: string;
};

export async function createAppointment(data: AppointmentInput): Promise<void> {
  console.log('Appointment Created:', data);

  return new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
}
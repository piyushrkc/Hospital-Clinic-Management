import { Doctor } from '@/types/doctor';

export async function getDoctors(): Promise<Doctor[]> {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          name: 'Dr. Anjali Mehra',
          specialty: 'Cardiologist',
          experience: 12,
          location: 'Delhi',
          imageUrl: '/doctor1.jpg',
        },
        {
          id: '2',
          name: 'Dr. Ravi Kapoor',
          specialty: 'Dermatologist',
          experience: 8,
          location: 'Mumbai',
          imageUrl: '/doctor2.jpg',
        },
        {
          id: '3',
          name: 'Dr. Priya Nair',
          specialty: 'Neurologist',
          experience: 10,
          location: 'Bangalore',
          imageUrl: '/doctor3.jpg',
        },
      ]);
    }, 1000);
  });
}
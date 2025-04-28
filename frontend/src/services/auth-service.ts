import api from '@/lib/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role?: string;
  hospitalId: string;
}

export const AuthService = {
  async login(credentials: LoginCredentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('hospital', JSON.stringify(response.data.hospital));
    }
    return response.data;
  },
  
  async register(data: RegisterData) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  async logout() {
    // Call the backend logout endpoint if needed
    await api.post('/auth/logout');
    
    // Remove data from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('hospital');
  },
  
  getStoredUser() {
    if (typeof window === 'undefined') return null;
    
    const userString = localStorage.getItem('user');
    if (!userString) return null;
    
    try {
      return JSON.parse(userString);
    } catch (error) {
      console.error('Failed to parse stored user:', error);
      return null;
    }
  },
  
  isAuthenticated() {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  }
};
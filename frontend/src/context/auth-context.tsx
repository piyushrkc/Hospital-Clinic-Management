import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/auth-service';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  hospital: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Load user from localStorage on initial load
    const storedUser = AuthService.getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
    
    // Verify token validity with backend
    const verifyAuth = async () => {
      if (AuthService.isAuthenticated()) {
        try {
          const { user } = await AuthService.getCurrentUser();
          setUser(user);
        } catch (error) {
          console.error('Auth verification failed:', error);
          await logout();
        }
      }
      setIsLoading(false);
    };
    
    verifyAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await AuthService.login({ email, password });
      setUser(data.user);
      
      // Redirect based on user role
      const role = data.user.role;
      if (role === 'admin') {
        router.push('/admin');
      } else if (role === 'doctor') {
        router.push('/doctor');
      } else if (role === 'patient') {
        router.push('/patient');
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AuthService.logout();
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      await AuthService.register(data);
      router.push('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
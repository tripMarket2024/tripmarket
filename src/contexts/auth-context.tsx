'use client'


import { useRouter } from 'next/navigation';
import axios, { AxiosResponse } from 'axios';
import { useMemo, useState, useEffect, useContext, useCallback, createContext } from 'react';

import { LogInCredentialsDto } from 'src/app/api/auth/log-in/dto/log-in.dto';

import { ResponseInterface } from 'src/types/axios-respnse-type';
import { AuthResponse, TravelCompanyInterface } from 'src/types/login-response-type';
import { RegisterCompanyDto } from 'src/app/api/auth/register/dto/register-company.dto';

// Create a context
const defaultAuthContext = {
  isAuthenticated: false,
  user: null as TravelCompanyInterface | null,
  login: async (credentials: LogInCredentialsDto) => {},
  logout: async () => {},
  register: async (credentials: RegisterCompanyDto) => {},
};

// Create a context with a default value
const AuthContext = createContext(defaultAuthContext);

// Create a provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user, setUser] = useState<TravelCompanyInterface | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response: AxiosResponse<ResponseInterface<TravelCompanyInterface>> = await axios.get(
          '/api/auth/me',
          {
            headers: {
              authorization: `Bearer ${window.localStorage.getItem('accessToken')}`,
            },
          }
        );
        if (response.data.success) {
          setIsAuthenticated(true);
          setUser(response.data.data);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to check authentication status:', error);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(
    async (credentials: LogInCredentialsDto) => {
      // Example login function (replace with actual login logic)
      const response: AxiosResponse<ResponseInterface<AuthResponse>> = await axios.post(
        '/api/auth/log-in',
        credentials
      );

      if (response.data.success) {
        setIsAuthenticated(true);
        setUser(response.data.data.user);
        window.localStorage.setItem('accessToken', response.data.data.token);
        router.push('/e-commerce/account/personal/'); 
      }
    },
    [router]
  );

  const register = useCallback(
    async (credentials: RegisterCompanyDto) => {
      // Example login function (replace with actual login logic)
      const response: AxiosResponse<ResponseInterface<AuthResponse>> = await axios.post(
        '/api/auth/register',
        credentials
      );

      if (response.data.success) {
        setIsAuthenticated(true);
        setUser(response.data.data.user);
        window.localStorage.setItem('accessToken', response.data.data.token);
        router.push('/e-commerce/account/personal/'); 
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    setIsAuthenticated(false);
    setUser(null);
    window.localStorage.removeItem('accessToken');
    router.push('auth/login-cover'); 
  }, [router]);

  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
      login,
      register,
      logout,
    }),
    [isAuthenticated, user, login, logout, register]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the authentication context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

'use client';

import { useRouter } from 'next/navigation';
import axios, { AxiosResponse } from 'axios';
import { useMemo, useState, useEffect, useContext, useCallback, createContext } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

import { app } from 'src/firebase/firebase';
import { CreateCompanyDto } from 'src/app/api/auth/register/dto/create-company.dto';

import { ResponseInterface } from 'src/types/axios-respnse-type';
import { AuthResponse, TravelCompanyInterface } from 'src/types/login-response-type';

export interface LogInCredentialsDto {
  email: string;
  password: string;
}

// Create a context
const defaultAuthContext = {
  isAuthenticated: false,
  user: null as TravelCompanyInterface | null,
  login: async (credentials: LogInCredentialsDto) => {},
  logout: async () => {},
  register: async (credentials: CreateCompanyDto) => {},
  setUserState: (authenticatedUser: TravelCompanyInterface | null) => {},
};

// Create a context with a default value
const AuthContext = createContext(defaultAuthContext);

// Create a provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user, setUser] = useState<TravelCompanyInterface | null>(null);
  const router = useRouter();

  const setUserState = useCallback((authenticatedUser: TravelCompanyInterface | null) => {
    setUser(authenticatedUser);
  }, []);

  const login = useCallback(
    async (credentials: LogInCredentialsDto) => {
      const { email, password } = credentials;

      const credential = await signInWithEmailAndPassword(getAuth(app), email, password);
      const idToken = await credential.user.getIdToken();
      setIsAuthenticated(true);
      window.localStorage.setItem('accessToken', idToken);
      router.push('/e-commerce/account/personal/');
    },
    [router]
  );

  const register = useCallback(
    async (credentials: CreateCompanyDto) => {
      const { email, name, password } = credentials;
      const userAuth = await createUserWithEmailAndPassword(getAuth(app), email, password);

      const idToken = await userAuth.user.getIdToken();
      const response: AxiosResponse<ResponseInterface<AuthResponse>> = await axios.post(
        '/api/auth/register',
        {
          email,
          google_uid: userAuth.user.uid,
          name,
        }
      );
      setUser(response.data.data.user);
      setIsAuthenticated(true);
      window.localStorage.setItem('accessToken', idToken);
      router.push('/e-commerce/account/personal/');
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
      setUserState
    }),
    [isAuthenticated, user, login, logout, register, setUserState]
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

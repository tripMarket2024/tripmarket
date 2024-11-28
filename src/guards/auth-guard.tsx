// components/AuthGuard.tsx
import axios, { AxiosResponse } from 'axios';
import { useRouter } from 'next/navigation';
import { set } from 'nprogress';
import React, { useState, useEffect } from 'react';
import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from 'src/contexts/auth-context';
import { ResponseInterface } from 'src/types/axios-respnse-type';
import { TravelCompanyInterface } from 'src/types/login-response-type';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { setUserState } = useAuthContext();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

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
          setUserState(response.data.data);
        } else {
          setUserState(null);
          router.push('/auth/login-cover/');
        }

        setLoading(false);
      } catch (error) {
        console.error('Failed to check authentication status:', error);
      }
    };

    checkAuth();
  }, [router, setUserState]);

  // Show a loading spinner or nothing while checking authentication
  if (loading) return <SplashScreen />;

  // Render children if authenticated
  return <>{children}</>;
};

export default AuthGuard;

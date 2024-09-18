// components/AuthGuard.tsx
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import { useAuthContext } from 'src/contexts/auth-context';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated } = useAuthContext();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Is authenticated?', isAuthenticated);
    if (!isAuthenticated) {
      router.push('/auth/login-cover/'); // Redirect to login page if not authenticated
    } else {
      setLoading(false); // Set loading to false if authenticated
    }
  }, [isAuthenticated, router]);

  // Show a loading spinner or nothing while checking authentication
  if (loading) return <p>Loading...</p>;

  // Render children if authenticated
  return <>{children}</>;
};

export default AuthGuard;

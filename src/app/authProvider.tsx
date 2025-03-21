'use client';

import { useEffect } from 'react';

import { useUserStore } from '@/store';
import { User } from '@/types/user';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('/api/oauth/members/me');

        if (!response.ok) {
          setUser({});
          return;
        }

        const data = await response.json();

        setUser(data);
      } catch (error) {
        console.error('authProvider error:', error);
        setUser({});
      }
    }

    fetchUser();
  }, [setUser]);

  return <>{children}</>;
}

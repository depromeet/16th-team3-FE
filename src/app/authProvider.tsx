'use client';

import { useEffect } from 'react';

import { api } from '@/lib/ky';
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
        const response = await api.get('v1/members/me');
        if (!response.ok) {
          setUser({});
          return;
        }
        const data = await response.json<User>();
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

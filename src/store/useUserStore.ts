import { User } from '@/types/user';
import { create } from 'zustand';

interface UserState {
  userData: User;

  setUser: (user: User) => void;

  clearUser: () => void;
}

export const useUserStore = create<UserState>()((set) => ({
  userData: {
    memberId: -1,
    nickname: '',
    email: '',
    profileImageUrl: '',
    isNewUser: true,
  },

  setUser: (user) =>
    set((state) => ({ userData: { ...state.userData, ...user } })),

  clearUser: () =>
    set({
      userData: {
        memberId: -1,
        nickname: '',
        email: '',
        profileImageUrl: '',
        isNewUser: false,
      },
    }),
}));

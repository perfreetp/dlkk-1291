import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Certification } from '@/types';
import { users } from '@/data/mockData';

interface AuthState {
  user: (User & { certification?: Certification }) | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  register: (email: string, password: string, nickname: string) => boolean;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  submitCertification: (data: Omit<Certification, 'id' | 'userId' | 'status'>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: (email: string, _password: string) => {
        const user = users.find((u) => u.email === email);
        if (user) {
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },

      register: (email: string, _password: string, nickname: string) => {
        const newUser: User & { certification?: Certification } = {
          id: Date.now().toString(),
          email,
          nickname,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${nickname}`,
          createdAt: new Date().toISOString(),
        };
        set({ user: newUser, isAuthenticated: true });
        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateUser: (data: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...data } });
        }
      },

      submitCertification: (data) => {
        const currentUser = get().user;
        if (currentUser) {
          const certification: Certification = {
            id: Date.now().toString(),
            userId: currentUser.id,
            ...data,
            status: 'approved',
            certifiedAt: new Date().toISOString(),
          };
          set({ user: { ...currentUser, certification } });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Referral, Application, Resume } from '@/types';
import { referrals as mockReferrals } from '@/data/mockData';

interface ReferralState {
  referrals: Referral[];
  applications: Application[];
  resumes: Resume[];
  favorites: string[];
  filters: {
    city: string;
    jobType: string;
    grade: number | null;
    major: string;
    keyword: string;
  };
  setFilter: (key: string, value: string | number | null) => void;
  resetFilters: () => void;
  getFilteredReferrals: () => Referral[];
  getReferralById: (id: string) => Referral | undefined;
  getMyReferrals: (userId: string) => Referral[];
  addReferral: (referral: Omit<Referral, 'id' | 'createdAt' | 'applicantCount' | 'status'>) => void;
  updateReferral: (id: string, data: Partial<Referral>) => void;
  deleteReferral: (id: string) => void;
  toggleFavorite: (referralId: string) => void;
  addApplication: (application: Omit<Application, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  updateApplication: (id: string, data: Partial<Application>) => void;
  cancelApplication: (id: string) => void;
  addResume: (resume: Omit<Resume, 'id' | 'createdAt'>) => void;
  updateResume: (id: string, data: Partial<Resume>) => void;
  deleteResume: (id: string) => void;
  getDefaultResume: (userId: string) => Resume | undefined;
  hasApplied: (userId: string, referralId: string) => boolean;
}

const initialFilters = {
  city: '',
  jobType: '',
  grade: null as number | null,
  major: '',
  keyword: '',
};

export const useReferralStore = create<ReferralState>()(
  persist(
    (set, get) => ({
      referrals: mockReferrals,
      applications: [],
      resumes: [],
      favorites: [],
      filters: initialFilters,

      setFilter: (key, value) => {
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        }));
      },

      resetFilters: () => {
        set({ filters: initialFilters });
      },

      getFilteredReferrals: () => {
        const { referrals, filters } = get();
        return referrals.filter((referral) => {
          if (filters.city && referral.city !== filters.city) return false;
          if (filters.jobType && referral.jobType !== filters.jobType) return false;
          if (filters.grade && referral.gradeRequired !== filters.grade) return false;
          if (filters.major && !referral.majorRequired.includes(filters.major)) return false;
          if (filters.keyword) {
            const keyword = filters.keyword.toLowerCase();
            if (
              !referral.jobTitle.toLowerCase().includes(keyword) &&
              !referral.companyName.toLowerCase().includes(keyword) &&
              !referral.city.toLowerCase().includes(keyword)
            ) {
              return false;
            }
          }
          return referral.status === 'active';
        });
      },

      getReferralById: (id) => {
        return get().referrals.find((r) => r.id === id);
      },

      getMyReferrals: (userId) => {
        return get().referrals.filter((r) => r.posterId === userId);
      },

      addReferral: (data) => {
        const newReferral: Referral = {
          ...data,
          id: Date.now().toString(),
          applicantCount: 0,
          status: 'active',
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          referrals: [newReferral, ...state.referrals],
        }));
      },

      updateReferral: (id, data) => {
        set((state) => ({
          referrals: state.referrals.map((r) =>
            r.id === id ? { ...r, ...data } : r
          ),
        }));
      },

      deleteReferral: (id) => {
        set((state) => ({
          referrals: state.referrals.filter((r) => r.id !== id),
        }));
      },

      toggleFavorite: (referralId) => {
        set((state) => {
          const isFavorite = state.favorites.includes(referralId);
          return {
            favorites: isFavorite
              ? state.favorites.filter((id) => id !== referralId)
              : [...state.favorites, referralId],
          };
        });
      },

      addApplication: (data) => {
        const referral = get().referrals.find((r) => r.id === data.referralId);
        const newApplication: Application = {
          ...data,
          referral: referral,
          id: Date.now().toString(),
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          applications: [newApplication, ...state.applications],
          referrals: state.referrals.map((r) =>
            r.id === data.referralId
              ? { ...r, applicantCount: r.applicantCount + 1 }
              : r
          ),
        }));
      },

      updateApplication: (id, data) => {
        set((state) => ({
          applications: state.applications.map((a) =>
            a.id === id ? { ...a, ...data, updatedAt: new Date().toISOString() } : a
          ),
        }));
      },

      cancelApplication: (id) => {
        const application = get().applications.find((a) => a.id === id);
        if (application) {
          set((state) => ({
            applications: state.applications.filter((a) => a.id !== id),
            referrals: state.referrals.map((r) =>
              r.id === application.referralId
                ? { ...r, applicantCount: Math.max(0, r.applicantCount - 1) }
                : r
            ),
          }));
        }
      },

      addResume: (data) => {
        const newResume: Resume = {
          ...data,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          resumes: [...state.resumes, newResume],
        }));
      },

      updateResume: (id, data) => {
        set((state) => ({
          resumes: state.resumes.map((r) =>
            r.id === id ? { ...r, ...data } : r
          ),
        }));
      },

      deleteResume: (id) => {
        set((state) => ({
          resumes: state.resumes.filter((r) => r.id !== id),
        }));
      },

      getDefaultResume: (userId) => {
        return get().resumes.find((r) => r.userId === userId && r.isDefault);
      },

      hasApplied: (userId, referralId) => {
        return get().applications.some(
          (a) => a.applicantId === userId && a.referralId === referralId
        );
      },
    }),
    {
      name: 'referral-storage',
    }
  )
);

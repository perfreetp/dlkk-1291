import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Referral, Application, Resume, ApplicationStatus, StatusHistory } from '@/types';
import { referrals as mockReferrals } from '@/data/mockData';
import { useNotificationStore } from './dataStore';

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
  getReceivedApplications: (userId: string) => Application[];
  addReferral: (referral: Omit<Referral, 'id' | 'createdAt' | 'applicantCount' | 'status'>) => void;
  updateReferral: (id: string, data: Partial<Referral>) => void;
  deleteReferral: (id: string) => void;
  toggleFavorite: (referralId: string) => void;
  addApplication: (application: Omit<Application, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'statusHistory'>) => void;
  updateApplication: (id: string, data: Partial<Application>, note?: string) => void;
  cancelApplication: (id: string) => void;
  addResume: (resume: Omit<Resume, 'id' | 'createdAt'>) => void;
  updateResume: (id: string, data: Partial<Resume>) => void;
  deleteResume: (id: string) => void;
  getDefaultResume: (userId: string) => Resume | undefined;
  getValidResumes: (userId: string) => Resume[];
  hasApplied: (userId: string, referralId: string) => boolean;
  isResumeValid: (resumeId: string) => boolean;
}

const initialFilters = {
  city: '',
  jobType: '',
  grade: null as number | null,
  major: '',
  keyword: '',
};

const isValidResume = (resume: Resume): boolean => {
  if (!resume.fileUrl) return false;
  if (resume.fileUrl.startsWith('blob:')) return true;
  if (!resume.fileName) return false;
  const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  return validTypes.includes(resume.fileType || '') || 
         resume.fileUrl.includes('.pdf') || 
         resume.fileUrl.includes('.doc') || 
         resume.fileUrl.includes('.docx');
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

      getReceivedApplications: (userId) => {
        const userReferrals = get().referrals.filter((r) => r.posterId === userId);
        const referralIds = userReferrals.map((r) => r.id);
        return get().applications.filter((a) => referralIds.includes(a.referralId));
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
        const resume = get().resumes.find((r) => r.id === data.resumeId);
        const now = new Date().toISOString();
        const newApplication: Application = {
          ...data,
          referral: referral,
          resume: resume,
          id: Date.now().toString(),
          status: 'pending',
          createdAt: now,
          updatedAt: now,
          statusHistory: [{ status: 'pending', timestamp: now }],
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

      updateApplication: (id, data, note) => {
        const state = get();
        const application = state.applications.find((a) => a.id === id);
        if (!application) return;

        const oldStatus = application.status;
        const newStatus = data.status as ApplicationStatus;
        const now = new Date().toISOString();

        const statusHistory: StatusHistory = { status: newStatus, timestamp: now };
        if (note) statusHistory.note = note;

        const updatedHistory = [...application.statusHistory, statusHistory];

        set((state) => ({
          applications: state.applications.map((a) =>
            a.id === id
              ? { ...a, ...data, updatedAt: now, statusHistory: updatedHistory }
              : a
          ),
        }));

        if (newStatus !== oldStatus && data.status) {
          const notificationStore = useNotificationStore.getState();
          let notificationTitle = '';
          let notificationContent = '';

          switch (newStatus) {
            case 'viewed':
              notificationTitle = '简历已被查看';
              notificationContent = `推荐人已查看您投递「${application.referral?.jobTitle}」的简历`;
              break;
            case 'recommended':
              notificationTitle = '内推成功';
              notificationContent = `您的申请「${application.referral?.jobTitle}」已被推荐给HR，请保持手机畅通！`;
              break;
            case 'rejected':
              notificationTitle = '申请被婉拒';
              notificationContent = `您的申请「${application.referral?.jobTitle}」未被通过，您可以尝试其他岗位`;
              break;
            case 'completed':
              notificationTitle = '招聘流程完成';
              notificationContent = `恭喜！您投递的「${application.referral?.jobTitle}」已进入下一环节`;
              break;
          }

          if (notificationTitle) {
            notificationStore.addNotification({
              userId: application.applicantId,
              type: 'application',
              title: notificationTitle,
              content: notificationContent,
              link: '/applications',
            });
          }
        }
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
        const resumes = get().resumes.filter((r) => r.userId === userId);
        return resumes.find((r) => r.isDefault && isValidResume(r)) || resumes.find((r) => isValidResume(r));
      },

      getValidResumes: (userId) => {
        return get().resumes.filter((r) => r.userId === userId && isValidResume(r));
      },

      hasApplied: (userId, referralId) => {
        return get().applications.some(
          (a) => a.applicantId === userId && a.referralId === referralId
        );
      },

      isResumeValid: (resumeId) => {
        const resume = get().resumes.find((r) => r.id === resumeId);
        return resume ? isValidResume(resume) : false;
      },
    }),
    {
      name: 'referral-storage',
    }
  )
);

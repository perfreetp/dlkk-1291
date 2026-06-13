export interface User {
  id: string;
  email: string;
  nickname: string;
  avatar: string;
  createdAt: string;
  certification?: Certification;
}

export interface Certification {
  id: string;
  userId: string;
  schoolName: string;
  studentId: string;
  graduationYear: number;
  department: string;
  major: string;
  status: 'pending' | 'approved' | 'rejected';
  certifiedAt?: string;
}

export interface Referral {
  id: string;
  posterId: string;
  poster?: User;
  jobTitle: string;
  companyName: string;
  companyLogo: string;
  city: string;
  jobType: 'internship' | 'campus' | 'social';
  gradeRequired: number;
  majorRequired: string;
  requirements: string;
  salary: string;
  deadline: string;
  resumeRange: string;
  applicantCount: number;
  status: 'active' | 'closed' | 'expired';
  createdAt: string;
}

export interface Application {
  id: string;
  referralId: string;
  referral?: Referral;
  applicantId: string;
  applicant?: User;
  resumeId: string;
  resume?: Resume;
  status: 'pending' | 'recommended' | 'rejected' | 'completed';
  scheduledTime?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Resume {
  id: string;
  userId: string;
  title: string;
  fileUrl: string;
  isDefault: boolean;
  createdAt: string;
}

export interface Article {
  id: string;
  authorId: string;
  author?: User;
  title: string;
  content: string;
  category: 'experience' | 'thanks' | 'insight';
  likeCount: number;
  commentCount: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  articleId: string;
  authorId: string;
  author?: User;
  content: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'application' | 'deadline' | 'system' | 'new_referral';
  title: string;
  content: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Block {
  id: string;
  userId: string;
  blockedUserId: string;
  blockedUser?: User;
  createdAt: string;
}

export interface School {
  id: string;
  name: string;
  region: string;
}

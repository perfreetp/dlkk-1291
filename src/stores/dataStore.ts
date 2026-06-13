import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Notification, Article, Comment, Block } from '@/types';
import { notifications as mockNotifications, articles as mockArticles, users } from '@/data/mockData';

interface NotificationState {
  notifications: Notification[];
  markAsRead: (id: string) => void;
  markAllAsRead: (userId: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
  getNotificationsByUser: (userId: string, blockedUserIds?: string[]) => Notification[];
  getUnreadCountByUser: (userId: string, blockedUserIds?: string[]) => number;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: mockNotifications,

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        }));
      },

      markAllAsRead: (userId) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.userId === userId ? { ...n, isRead: true } : n
          ),
        }));
      },

      addNotification: (data) => {
        const newNotification: Notification = {
          ...data,
          id: Date.now().toString(),
          isRead: false,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
        }));
      },

      getNotificationsByUser: (userId, blockedUserIds = []) => {
        return get().notifications.filter(
          (n) => n.userId === userId && !blockedUserIds.includes(n.userId)
        );
      },

      getUnreadCountByUser: (userId, blockedUserIds = []) => {
        return get().notifications.filter(
          (n) => n.userId === userId && !n.isRead && !blockedUserIds.includes(n.userId)
        ).length;
      },
    }),
    {
      name: 'notification-storage',
    }
  )
);

interface ArticleState {
  articles: Article[];
  comments: Comment[];
  addArticle: (article: Omit<Article, 'id' | 'createdAt' | 'likeCount' | 'commentCount'>) => void;
  getArticleById: (id: string) => Article | undefined;
  likeArticle: (id: string) => void;
  getArticlesByCategory: (category: string) => Article[];
  addComment: (articleId: string, authorId: string, content: string) => void;
  getCommentsByArticle: (articleId: string) => Comment[];
}

export const useArticleStore = create<ArticleState>()((set, get) => ({
  articles: mockArticles,
  comments: [
    {
      id: 'cm1',
      articleId: '1',
      authorId: '2',
      author: users[1],
      content: '感谢分享！请问算法题刷了多少道？',
      createdAt: '2026-06-12T19:00:00Z',
    },
    {
      id: 'cm2',
      articleId: '1',
      authorId: '4',
      author: users[3],
      content: '同问，我也准备投字节',
      createdAt: '2026-06-12T20:00:00Z',
    },
  ],

  addArticle: (data) => {
    const newArticle: Article = {
      ...data,
      id: Date.now().toString(),
      likeCount: 0,
      commentCount: 0,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      articles: [newArticle, ...state.articles],
    }));
  },

  getArticleById: (id) => {
    return get().articles.find((a) => a.id === id);
  },

  likeArticle: (id) => {
    set((state) => ({
      articles: state.articles.map((a) =>
        a.id === id ? { ...a, likeCount: a.likeCount + 1 } : a
      ),
    }));
  },

  getArticlesByCategory: (category) => {
    return get().articles.filter((a) => a.category === category);
  },

  addComment: (articleId, authorId, content) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      articleId,
      authorId,
      author: users.find((u) => u.id === authorId),
      content,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      comments: [...state.comments, newComment],
      articles: state.articles.map((a) =>
        a.id === articleId ? { ...a, commentCount: a.commentCount + 1 } : a
      ),
    }));
  },

  getCommentsByArticle: (articleId) => {
    return get().comments.filter((c) => c.articleId === articleId);
  },
}));

interface BlockState {
  blocks: Block[];
  addBlock: (userId: string, blockedUserId: string, notificationIds?: string[]) => void;
  removeBlock: (id: string) => void;
  isBlocked: (userId: string, blockedUserId: string) => boolean;
  getBlocksByUser: (userId: string) => Block[];
  getBlockedUserIds: (userId: string) => string[];
  getHiddenNotificationIds: (userId: string) => string[];
  restoreHiddenNotifications: (userId: string, hiddenIds: string[]) => void;
}

export const useBlockStore = create<BlockState>()(
  persist(
    (set, get) => ({
      blocks: [],

      addBlock: (userId, blockedUserId, notificationIds = []) => {
        if (get().isBlocked(userId, blockedUserId)) return;
        
        const blockedUser = users.find((u) => u.id === blockedUserId);
        const newBlock: Block = {
          id: Date.now().toString(),
          userId,
          blockedUserId,
          blockedUser,
          hiddenNotificationIds: notificationIds,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          blocks: [...state.blocks, newBlock],
        }));
      },

      removeBlock: (id) => {
        set((state) => ({
          blocks: state.blocks.filter((b) => b.id !== id),
        }));
      },

      isBlocked: (userId, blockedUserId) => {
        return get().blocks.some(
          (b) => b.userId === userId && b.blockedUserId === blockedUserId
        );
      },

      getBlocksByUser: (userId) => {
        return get().blocks.filter((b) => b.userId === userId);
      },

      getBlockedUserIds: (userId) => {
        return get().blocks.filter((b) => b.userId === userId).map((b) => b.blockedUserId);
      },

      getHiddenNotificationIds: (userId) => {
        return get().blocks
          .filter((b) => b.userId === userId)
          .flatMap((b) => b.hiddenNotificationIds || []);
      },

      restoreHiddenNotifications: (userId, hiddenIds) => {
        useNotificationStore.setState((state) => ({
          notifications: state.notifications.map((n) =>
            n.userId === userId && hiddenIds.includes(n.id) ? { ...n, isRead: false } : n
          ),
        }));
      },
    }),
    {
      name: 'block-storage',
    }
  )
);

import { Link, useLocation } from 'react-router-dom';
import { Home, Briefcase, Users, Bell, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useNotificationStore, useBlockStore } from '@/stores/dataStore';

export default function Header() {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { getUnreadCountByUser } = useNotificationStore();
  const { getBlockedUserIds } = useBlockStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const blockedUserIds = isAuthenticated && user ? getBlockedUserIds(user.id) : [];
  const unreadCount = isAuthenticated && user ? getUnreadCountByUser(user.id, blockedUserIds) : 0;

  const navItems = [
    { path: '/', label: '首页', icon: Home },
    { path: '/referrals', label: '内推大厅', icon: Briefcase },
    { path: '/circle', label: '校友圈', icon: Users },
    { path: '/notifications', label: '通知', icon: Bell, badge: unreadCount },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E3A5F] to-[#2D5A87] flex items-center justify-center">
                <span className="text-white font-bold text-lg">校</span>
              </div>
              <span className="text-xl font-bold text-[#1E3A5F] hidden sm:block">校友内推</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-[#1E3A5F]/10 text-[#1E3A5F]'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#E53E3E] text-white text-xs rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <img
                    src={user?.avatar}
                    alt={user?.nickname}
                    className="w-8 h-8 rounded-full ring-2 ring-[#1E3A5F]/10"
                  />
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {user?.nickname}
                  </span>
                </Link>
                <button
                  onClick={logout}
                  className="text-sm text-gray-500 hover:text-[#1E3A5F] transition-colors"
                >
                  退出
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-[#1E3A5F] hover:bg-[#1E3A5F]/5 rounded-lg transition-colors"
                >
                  登录
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#1E3A5F] hover:bg-[#2D5A87] rounded-lg transition-colors shadow-sm"
                >
                  注册
                </Link>
              </div>
            )}

            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <nav className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-[#1E3A5F]/10 text-[#1E3A5F]'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-auto w-5 h-5 bg-[#E53E3E] text-white text-xs rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                <User className="w-5 h-5" />
                个人中心
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

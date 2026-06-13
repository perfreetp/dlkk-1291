import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Clock, Briefcase, CheckCircle, AlertCircle, Users, CheckCheck, Trash2 } from 'lucide-react';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { useNotificationStore } from '@/stores/dataStore';
import { useAuthStore } from '@/stores/authStore';

export default function Notifications() {
  const navigate = useNavigate();
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotificationStore();
  const { user, isAuthenticated } = useAuthStore();
  const [filter, setFilter] = useState<string>('all');

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">请先登录</h2>
          <p className="text-gray-500 mb-6">登录后才能查看通知</p>
          <Button onClick={() => navigate('/login')}>去登录</Button>
        </Card>
      </div>
    );
  }

  const userNotifications = notifications.filter((n) => n.userId === user?.id);

  const filteredNotifications = filter === 'all'
    ? userNotifications
    : userNotifications.filter((n) => {
        if (filter === 'deadline') return n.type === 'deadline';
        if (filter === 'application') return n.type === 'application';
        if (filter === 'system') return n.type === 'system' || n.type === 'new_referral';
        return true;
      });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deadline':
        return <Clock className="w-5 h-5" />;
      case 'application':
        return <Briefcase className="w-5 h-5" />;
      case 'system':
        return <AlertCircle className="w-5 h-5" />;
      case 'new_referral':
        return <Users className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'deadline':
        return 'text-red-500 bg-red-50';
      case 'application':
        return 'text-[#1E3A5F] bg-[#1E3A5F]/10';
      case 'system':
      case 'new_referral':
        return 'text-green-500 bg-green-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'deadline':
        return '截止提醒';
      case 'application':
        return '申请状态';
      case 'system':
        return '系统通知';
      case 'new_referral':
        return '新内推';
      default:
        return '通知';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return '刚刚';
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  };

  const handleNotificationClick = (notification: typeof notifications[0]) => {
    markAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">通知中心</h1>
            <p className="text-gray-500">
              {unreadCount > 0 ? `有 ${unreadCount} 条未读通知` : '暂无未读通知'}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" onClick={markAllAsRead}>
              <CheckCheck className="w-4 h-4 mr-2" />
              全部标为已读
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { value: 'all', label: '全部' },
            { value: 'application', label: '申请状态' },
            { value: 'deadline', label: '截止提醒' },
            { value: 'system', label: '系统通知' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === tab.value
                  ? 'bg-[#1E3A5F] text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {filteredNotifications.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无通知</h3>
            <p className="text-gray-500">有新通知时会在这里显示</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification, index) => (
              <Card
                key={notification.id}
                hover
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 cursor-pointer transition-all ${
                  !notification.isRead ? 'bg-[#1E3A5F]/5 border-l-4 border-l-[#1E3A5F]' : ''
                }`}
                style={{ opacity: 0, animation: `slideUp 0.3s ease-out ${0.05 * index}s forwards` }}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${getTypeColor(notification.type)}`}>
                    {getTypeIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900">{notification.title}</h3>
                      <Badge variant={notification.type === 'deadline' ? 'danger' : 'default'} size="sm">
                        {getTypeLabel(notification.type)}
                      </Badge>
                      {!notification.isRead && (
                        <span className="w-2 h-2 bg-[#1E3A5F] rounded-full" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2">{notification.content}</p>
                    <p className="text-xs text-gray-400 mt-2">{formatDate(notification.createdAt)}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

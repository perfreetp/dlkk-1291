import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, UserX, ArrowLeft, X, Search } from 'lucide-react';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { useBlockStore, useNotificationStore } from '@/stores/dataStore';
import { useAuthStore } from '@/stores/authStore';
import { users } from '@/data/mockData';

export default function BlockManagement() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { blocks, addBlock, removeBlock, isBlocked } = useBlockStore();
  const { notifications } = useNotificationStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">请先登录</h2>
          <p className="text-gray-500 mb-6">登录后才能管理屏蔽列表</p>
          <Button onClick={() => navigate('/login')}>去登录</Button>
        </Card>
      </div>
    );
  }

  const userBlocks = blocks.filter((b) => b.userId === user?.id);
  const availableUsers = users.filter(
    (u) => u.id !== user?.id && !isBlocked(user!.id, u.id)
  );

  const filteredUsers = searchQuery
    ? availableUsers.filter(
        (u) =>
          u.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : availableUsers;

  const handleBlockUser = (userId: string) => {
    const userNotifications = notifications.filter((n) => n.userId === userId);
    const notificationIds = userNotifications.map((n) => n.id);
    addBlock(user!.id, userId, notificationIds);
    setShowAddModal(false);
    setSearchQuery('');
  };

  const handleRemoveBlock = (blockId: string) => {
    if (window.confirm('确定要取消屏蔽吗？取消屏蔽后，之前未读的提醒会按原来的已读状态恢复。')) {
      removeBlock(blockId);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">屏蔽管理</h1>
            <p className="text-gray-500">管理您屏蔽的联系人，屏蔽后不会收到对方的内推</p>
          </div>
          <Button variant="outline" onClick={() => setShowAddModal(true)}>
            <UserX className="w-4 h-4 mr-2" />
            添加屏蔽
          </Button>
        </div>

        <div className="bg-[#1E3A5F]/5 rounded-xl p-4 mb-6">
          <Shield className="w-5 h-5 text-[#1E3A5F] mb-2" />
          <p className="text-sm text-gray-600">
            屏蔽某人后，您将不会收到该用户的内推信息。您的屏蔽行为对对方不可见。
            取消屏蔽后，之前未读的通知将恢复显示。
          </p>
        </div>

        {userBlocks.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserX className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无屏蔽</h3>
            <p className="text-gray-500 mb-6">您还没有屏蔽任何联系人</p>
            <Button onClick={() => setShowAddModal(true)}>添加屏蔽</Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {userBlocks.map((block) => (
              <Card key={block.id} className="p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={block.blockedUser?.avatar || 'https://via.placeholder.com/40'}
                    alt={block.blockedUser?.nickname}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{block.blockedUser?.nickname || '未知用户'}</h3>
                    <p className="text-sm text-gray-500">{block.blockedUser?.email || '邮箱不可见'}</p>
                    {block.hiddenNotificationIds && block.hiddenNotificationIds.length > 0 && (
                      <p className="text-xs text-gray-400 mt-1">
                        已隐藏 {block.hiddenNotificationIds.length} 条通知
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveBlock(block.id)}
                    className="text-gray-500 hover:text-[#1E3A5F]"
                  >
                    取消屏蔽
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">添加屏蔽</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSearchQuery('');
                }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索用户名或邮箱..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 transition-colors text-gray-900"
              />
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery ? '没有找到匹配的用户' : '没有可屏蔽的用户'}
                </div>
              ) : (
                filteredUsers.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <img
                      src={u.avatar}
                      alt={u.nickname}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{u.nickname}</p>
                      <p className="text-sm text-gray-500 truncate">{u.email}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBlockUser(u.id)}
                    >
                      屏蔽
                    </Button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

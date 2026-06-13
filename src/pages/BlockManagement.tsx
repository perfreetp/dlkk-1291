import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Trash2, ArrowLeft, UserX } from 'lucide-react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { useBlockStore } from '@/stores/dataStore';
import { useAuthStore } from '@/stores/authStore';

export default function BlockManagement() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { blocks, removeBlock } = useBlockStore();
  const [showAddModal, setShowAddModal] = useState(false);

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

  const handleRemoveBlock = (blockId: string) => {
    if (window.confirm('确定要取消屏蔽吗？')) {
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
          </p>
        </div>

        {userBlocks.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserX className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无屏蔽</h3>
            <p className="text-gray-500">您还没有屏蔽任何联系人</p>
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
    </div>
  );
}

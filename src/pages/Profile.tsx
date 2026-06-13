import { useNavigate } from 'react-router-dom';
import { User, FileText, Briefcase, Heart, Settings, Shield, ChevronRight, LogOut, Inbox } from 'lucide-react';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { useAuthStore } from '@/stores/authStore';
import { useReferralStore } from '@/stores/referralStore';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { getMyReferrals, favorites, getReceivedApplications } = useReferralStore();

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">请先登录</h2>
          <p className="text-gray-500 mb-6">登录后才能查看个人中心</p>
          <Button onClick={() => navigate('/login')}>去登录</Button>
        </Card>
      </div>
    );
  }

  const myReferrals = getMyReferrals(user.id);
  const receivedApps = getReceivedApplications(user.id);

  const menuItems = [
    {
      icon: Shield,
      title: '校友认证',
      description: user.certification?.status === 'approved' ? '已完成认证' : '点击完成认证',
      badge: user.certification?.status === 'approved' ? '已认证' : null,
      onClick: () => navigate('/certification'),
    },
    {
      icon: FileText,
      title: '简历管理',
      description: '管理您的简历版本',
      badge: null,
      onClick: () => navigate('/profile/resumes'),
    },
    {
      icon: Briefcase,
      title: '我发布的内推',
      description: `${myReferrals.length} 个内推岗位`,
      badge: null,
      onClick: () => navigate('/referrals'),
    },
    {
      icon: Heart,
      title: '收藏的岗位',
      description: `${favorites.length} 个收藏`,
      badge: null,
      onClick: () => navigate('/referrals'),
    },
    {
      icon: Inbox,
      title: '收到的申请',
      description: `${receivedApps.length} 个候选人申请`,
      badge: receivedApps.filter((a) => a.status === 'pending').length > 0 ? `${receivedApps.filter((a) => a.status === 'pending').length} 待处理` : null,
      onClick: () => navigate('/profile/received'),
    },
    {
      icon: Settings,
      title: '屏蔽管理',
      description: '管理屏蔽的联系人',
      badge: null,
      onClick: () => navigate('/profile/blocks'),
    },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar}
              alt={user.nickname}
              className="w-20 h-20 rounded-full ring-4 ring-[#1E3A5F]/10"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-gray-900">{user.nickname}</h1>
                {user.certification?.status === 'approved' ? (
                  <Badge variant="success">已认证</Badge>
                ) : (
                  <Badge variant="warning">未认证</Badge>
                )}
              </div>
              <p className="text-gray-500">{user.email}</p>
              {user.certification && (
                <p className="text-sm text-gray-400 mt-1">
                  {user.certification.schoolName} · {user.certification.major}
                </p>
              )}
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          {menuItems.map((item) => (
            <Card key={item.title} hover onClick={item.onClick} className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <item.icon className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    {item.badge && (
                      <Badge variant="success" size="sm">{item.badge}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-6">
          <Button variant="ghost" className="w-full text-red-500 hover:bg-red-50 hover:text-red-600" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" />
            退出登录
          </Button>
        </div>
      </div>
    </div>
  );
}

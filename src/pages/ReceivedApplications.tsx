import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Calendar, Filter, ChevronRight } from 'lucide-react';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { useReferralStore } from '@/stores/referralStore';
import { useAuthStore } from '@/stores/authStore';
import { ApplicationStatus } from '@/types';

const statusConfig: Record<ApplicationStatus, { label: string; color: string }> = {
  pending: { label: '待处理', color: 'warning' },
  viewed: { label: '已查看', color: 'primary' },
  recommended: { label: '已推荐', color: 'success' },
  rejected: { label: '已拒绝', color: 'danger' },
  completed: { label: '已完成', color: 'default' },
};

export default function ReceivedApplications() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { getReceivedApplications, getMyReferrals } = useReferralStore();
  const [filterReferral, setFilterReferral] = useState<string>('all');

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">请先登录</h2>
          <p className="text-gray-500 mb-6">登录后才能查看收到的申请</p>
          <Button onClick={() => navigate('/login')}>去登录</Button>
        </Card>
      </div>
    );
  }

  const receivedApps = getReceivedApplications(user!.id);
  const myReferrals = getMyReferrals(user!.id);

  const referralOptions = [
    { value: 'all', label: '全部岗位' },
    ...myReferrals.map((r) => ({ value: r.id, label: `${r.companyName} - ${r.jobTitle}` })),
  ];

  const filteredApps = filterReferral === 'all'
    ? receivedApps
    : receivedApps.filter((app) => app.referralId === filterReferral);

  const groupedByReferral = filteredApps.reduce((acc, app) => {
    if (!acc[app.referralId]) {
      acc[app.referralId] = {
        referral: app.referral,
        applications: [],
      };
    }
    acc[app.referralId].applications.push(app);
    return acc;
  }, {} as Record<string, { referral: typeof filteredApps[0]['referral']; applications: typeof filteredApps }>);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    const config = statusConfig[status];
    return (
      <Badge variant={config.color as 'warning' | 'primary' | 'success' | 'danger' | 'default'} size="sm">
        {config.label}
      </Badge>
    );
  };

  const pendingCount = filteredApps.filter((a) => a.status === 'pending').length;

  return (
    <div className="min-h-[calc(100vh-64px)] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">收到的申请</h1>
            <p className="text-gray-500">
              {filteredApps.length} 个申请
              {pendingCount > 0 && <span className="text-[#E53E3E]"> · {pendingCount} 待处理</span>}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterReferral}
              onChange={(e) => setFilterReferral(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20"
            >
              {referralOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredApps.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无申请</h3>
            <p className="text-gray-500">
              {filterReferral === 'all' ? '还没有人向您的内推岗位投递简历' : '该岗位暂无申请'}
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedByReferral).map(([referralId, group]) => (
              <div key={referralId}>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={group.referral?.companyLogo}
                    alt={group.referral?.companyName}
                    className="w-8 h-8 rounded-lg object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/32?text=Logo';
                    }}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{group.referral?.jobTitle}</h3>
                    <p className="text-sm text-gray-500">{group.referral?.companyName}</p>
                  </div>
                  <Badge variant="default" size="sm" className="ml-auto">
                    {group.applications.length} 个申请
                  </Badge>
                </div>

                <div className="space-y-3">
                  {group.applications.map((app, index) => (
                    <Card
                      key={app.id}
                      hover
                      onClick={() => navigate(`/profile/received/${app.id}`)}
                      className="p-4 cursor-pointer"
                      style={{ opacity: 0, animation: `slideUp 0.3s ease-out ${0.05 * index}s forwards` }}
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={app.applicant?.avatar || 'https://via.placeholder.com/48'}
                          alt={app.applicant?.nickname}
                          className="w-12 h-12 rounded-full flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48?text=User';
                          }}
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-semibold text-gray-900">
                              {app.applicant?.nickname || '匿名用户'}
                            </span>
                            {app.applicant?.certification && (
                              <Badge variant="primary" size="sm">
                                {app.applicant.certification.schoolName}
                              </Badge>
                            )}
                            {getStatusBadge(app.status)}
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                            <span>投递：{formatDate(app.createdAt)}</span>
                            {app.scheduledTime && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(app.scheduledTime)}
                              </span>
                            )}
                          </div>

                          {app.notes && (
                            <p className="mt-2 text-sm text-gray-600 line-clamp-1">
                              {app.notes}
                            </p>
                          )}
                        </div>

                        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

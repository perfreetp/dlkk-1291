import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Clock, CheckCircle, XCircle, AlertCircle, FileText } from 'lucide-react';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { useAuthStore } from '@/stores/authStore';
import { useReferralStore } from '@/stores/referralStore';

export default function Applications() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { applications, cancelApplication } = useReferralStore();
  const [filter, setFilter] = useState<string>('all');

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">请先登录</h2>
          <p className="text-gray-500 mb-6">登录后才能查看申请记录</p>
          <Button onClick={() => navigate('/login')}>去登录</Button>
        </Card>
      </div>
    );
  }

  const userApplications = applications.filter((app) => app.applicantId === user?.id);

  const filteredApplications = filter === 'all'
    ? userApplications
    : userApplications.filter((app) => app.status === filter);

  const statusConfig = {
    pending: { label: '待处理', color: 'warning', icon: Clock },
    recommended: { label: '已推荐', color: 'success', icon: CheckCircle },
    rejected: { label: '已拒绝', color: 'danger', icon: XCircle },
    completed: { label: '已完成', color: 'default', icon: CheckCircle },
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCancel = (id: string) => {
    if (window.confirm('确定要取消这个申请吗？')) {
      cancelApplication(id);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">我的申请</h1>
          <p className="text-gray-500">跟踪您的内推申请状态</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { value: 'all', label: '全部' },
            { value: 'pending', label: '待处理' },
            { value: 'recommended', label: '已推荐' },
            { value: 'rejected', label: '已拒绝' },
            { value: 'completed', label: '已完成' },
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

        {filteredApplications.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {filter === 'all' ? '暂无申请记录' : '暂无符合条件的申请'}
            </h3>
            <p className="text-gray-500 mb-6">
              {filter === 'all' ? '去内推大厅寻找心仪的岗位吧' : '尝试选择其他筛选条件'}
            </p>
            <Button onClick={() => navigate('/referrals')}>浏览内推岗位</Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application, index) => {
              const referral = application.referral;
              const status = statusConfig[application.status];
              const StatusIcon = status.icon;

              return (
                <Card
                  key={application.id}
                  className="p-5"
                  style={{ opacity: 0, animation: `slideUp 0.3s ease-out ${0.05 * index}s forwards` }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      {referral && (
                        <>
                          <img
                            src={referral.companyLogo}
                            alt={referral.companyName}
                            className="w-12 h-12 rounded-xl object-cover bg-gray-100 flex-shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48?text=Logo';
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900">{referral.jobTitle}</h3>
                              <Badge variant={status.color as 'warning' | 'success' | 'danger' | 'default'}>
                                {status.label}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500">{referral.companyName}</p>
                            <p className="text-sm text-gray-400 mt-1">
                              申请时间：{formatDate(application.createdAt)}
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      {application.status === 'pending' && (
                        <Button variant="outline" size="sm" onClick={() => handleCancel(application.id)}>
                          取消申请
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/referrals/${application.referralId}`)}>
                        查看详情
                      </Button>
                    </div>
                  </div>

                  {application.scheduledTime && (
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-sm text-[#1E3A5F]">
                      <Clock className="w-4 h-4" />
                      预约沟通时间：{formatDate(application.scheduledTime)}
                    </div>
                  )}

                  {application.notes && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-500">留言：{application.notes}</p>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

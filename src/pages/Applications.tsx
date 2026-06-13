import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Clock, CheckCircle, XCircle, Search, ArrowUpDown, FileText, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { useAuthStore } from '@/stores/authStore';
import { useReferralStore } from '@/stores/referralStore';

export default function Applications() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { applications, cancelApplication, referrals, resumes, updateApplication } = useReferralStore();
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'time' | 'scheduled'>('time');
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

  let userApplications = applications
    .filter((app) => app.applicantId === user?.id)
    .map((app) => ({
      ...app,
      referral: app.referral || referrals.find((r) => r.id === app.referralId),
      resume: resumes.find((r) => r.id === app.resumeId),
    }));

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    userApplications = userApplications.filter((app) => {
      const companyMatch = app.referral?.companyName.toLowerCase().includes(query);
      const jobMatch = app.referral?.jobTitle.toLowerCase().includes(query);
      return companyMatch || jobMatch;
    });
  }

  userApplications.sort((a, b) => {
    if (sortBy === 'scheduled') {
      const aTime = a.scheduledTime ? new Date(a.scheduledTime).getTime() : 0;
      const bTime = b.scheduledTime ? new Date(b.scheduledTime).getTime() : 0;
      return bTime - aTime;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const filteredApplications = filter === 'all'
    ? userApplications
    : userApplications.filter((app) => app.status === filter);

  const statusConfig = {
    pending: { label: '待处理', color: 'warning', icon: Clock },
    viewed: { label: '已查看', color: 'primary', icon: Eye },
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

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileExtension = (fileType?: string) => {
    if (!fileType) return '';
    if (fileType.includes('pdf')) return 'PDF';
    if (fileType.includes('word') || fileType.includes('document')) return 'DOCX';
    return '';
  };

  const handleCancel = (id: string) => {
    if (window.confirm('确定要取消这个申请吗？')) {
      cancelApplication(id);
    }
  };

  const toggleSort = () => {
    setSortBy((prev) => (prev === 'time' ? 'scheduled' : 'time'));
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">我的申请</h1>
          <p className="text-gray-500">跟踪您的内推申请状态</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索公司或岗位名称..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 transition-colors text-gray-900"
            />
          </div>
          <Button variant="outline" onClick={toggleSort}>
            <ArrowUpDown className="w-4 h-4 mr-2" />
            {sortBy === 'time' ? '按申请时间' : '按预约时间'}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { value: 'all', label: '全部' },
            { value: 'pending', label: '待处理' },
            { value: 'viewed', label: '已查看' },
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
              {searchQuery ? '没有找到匹配的申请' : filter === 'all' ? '暂无申请记录' : '暂无符合条件的申请'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery ? '尝试其他关键词' : filter === 'all' ? '去内推大厅寻找心仪的岗位吧' : '尝试选择其他筛选条件'}
            </p>
            {filter === 'all' && !searchQuery && (
              <Button onClick={() => navigate('/referrals')}>浏览内推岗位</Button>
            )}
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application, index) => {
              const referral = application.referral;
              const resume = application.resume;
              const status = statusConfig[application.status];
              const StatusIcon = status.icon;
              const isExpanded = expandedId === application.id;

              return (
                <Card
                  key={application.id}
                  className="overflow-hidden"
                  style={{ opacity: 0, animation: `slideUp 0.3s ease-out ${0.05 * index}s forwards` }}
                >
                  <div className="p-5">
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
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h3 className="font-semibold text-gray-900">{referral.jobTitle}</h3>
                                <Badge variant={status.color as 'warning' | 'success' | 'danger' | 'default' | 'primary'}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpand(application.id)}
                        >
                          {isExpanded ? (
                            <>
                              收起详情
                              <ChevronUp className="w-4 h-4 ml-1" />
                            </>
                          ) : (
                            <>
                              查看详情
                              <ChevronDown className="w-4 h-4 ml-1" />
                            </>
                          )}
                        </Button>
                        {application.status === 'pending' && (
                          <Button variant="outline" size="sm" onClick={() => handleCancel(application.id)}>
                            取消申请
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/referrals/${application.referralId}`)}>
                          岗位详情
                        </Button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-6 pt-6 border-t border-gray-100 space-y-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">投递信息</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-start gap-3">
                              <Briefcase className="w-4 h-4 text-gray-400 mt-0.5" />
                              <div>
                                <p className="text-gray-500">岗位</p>
                                <p className="font-medium text-gray-900">{referral?.jobTitle}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                              <div>
                                <p className="text-gray-500">使用简历</p>
                                <p className="font-medium text-gray-900">{resume?.title || '未找到简历'}</p>
                                {resume?.fileType && (
                                  <p className="text-xs text-gray-400">
                                    {resume.fileName} {resume.fileSize && `(${formatFileSize(resume.fileSize)})`}
                                  </p>
                                )}
                              </div>
                            </div>
                            {application.scheduledTime && (
                              <div className="flex items-start gap-3">
                                <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                                <div>
                                  <p className="text-gray-500">预约沟通时间</p>
                                  <p className="font-medium text-[#1E3A5F]">{formatDate(application.scheduledTime)}</p>
                                </div>
                              </div>
                            )}
                            {application.notes && (
                              <div className="flex items-start gap-3 md:col-span-2">
                                <div className="w-4 h-4 mt-1">
                                  <div className="w-1 h-1 bg-gray-400 rounded-full" />
                                </div>
                                <div>
                                  <p className="text-gray-500">留言</p>
                                  <p className="font-medium text-gray-900">{application.notes}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">状态时间线</h4>
                          <div className="relative pl-6 space-y-4">
                            <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-200" />
                            {application.statusHistory.map((history, idx) => {
                              const historyStatus = statusConfig[history.status];
                              const HistoryIcon = historyStatus.icon;
                              return (
                                <div key={idx} className="relative flex items-start gap-3">
                                  <div className={`absolute left-0 w-4 h-4 rounded-full flex items-center justify-center ${
                                    idx === application.statusHistory.length - 1
                                      ? 'bg-[#1E3A5F] text-white'
                                      : 'bg-gray-200 text-gray-500'
                                  }`}>
                                    <HistoryIcon className="w-2.5 h-2.5" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className={`font-medium ${
                                        idx === application.statusHistory.length - 1 ? 'text-gray-900' : 'text-gray-500'
                                      }`}>
                                        {historyStatus.label}
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                      {formatDate(history.timestamp)}
                                    </p>
                                    {history.note && (
                                      <p className="text-sm text-gray-600 mt-1">{history.note}</p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

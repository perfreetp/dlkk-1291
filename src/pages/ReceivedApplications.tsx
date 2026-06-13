import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Clock, Eye, CheckCircle, XCircle, Download, Calendar, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { useReferralStore } from '@/stores/referralStore';
import { useAuthStore } from '@/stores/authStore';
import { Application, ApplicationStatus } from '@/types';

const statusConfig: Record<ApplicationStatus, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: '待处理', color: 'warning', icon: Clock },
  viewed: { label: '已查看', color: 'primary', icon: Eye },
  recommended: { label: '已推荐', color: 'success', icon: CheckCircle },
  rejected: { label: '已拒绝', color: 'danger', icon: XCircle },
  completed: { label: '已完成', color: 'default', icon: CheckCircle },
};

export default function ReceivedApplications() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { getReceivedApplications, updateApplication, getMyReferrals } = useReferralStore();
  const [filterReferral, setFilterReferral] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showStatusModal, setShowStatusModal] = useState<Application | null>(null);
  const [statusNote, setStatusNote] = useState('');

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

  const getStatusBadge = (status: ApplicationStatus) => {
    const config = statusConfig[status];
    return (
      <Badge variant={config.color as 'warning' | 'primary' | 'success' | 'danger' | 'default'} size="sm">
        <config.icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const handleUpdateStatus = (application: Application, newStatus: ApplicationStatus) => {
    const note = statusNote.trim() || undefined;
    updateApplication(application.id, { status: newStatus }, note);
    setShowStatusModal(null);
    setStatusNote('');
  };

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
            <p className="text-gray-500">管理候选人投递的简历和申请</p>
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
          <div className="space-y-4">
            {filteredApps.map((app, index) => (
              <Card
                key={app.id}
                className="p-5 transition-all"
                style={{ opacity: 0, animation: `slideUp 0.3s ease-out ${0.05 * index}s forwards` }}
              >
                <div className="flex items-start gap-4">
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
                      <h3 className="font-semibold text-gray-900">{app.applicant?.nickname || '匿名用户'}</h3>
                      {app.applicant?.certification && (
                        <Badge variant="primary" size="sm">
                          {app.applicant.certification.schoolName}
                        </Badge>
                      )}
                      {getStatusBadge(app.status)}
                    </div>

                    <p className="text-sm text-gray-500 mb-2">
                      申请岗位：{app.referral?.jobTitle} @ {app.referral?.companyName}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                      <span>投递时间：{formatDate(app.createdAt)}</span>
                      {app.scheduledTime && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          预约时间：{formatDate(app.scheduledTime)}
                        </span>
                      )}
                    </div>

                    {app.notes && (
                      <p className="mt-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                        留言：{app.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {app.resume?.fileUrl && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="预览简历"
                          onClick={() => window.open(app.resume!.fileUrl, '_blank')}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="下载简历"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = app.resume!.fileUrl;
                            link.download = app.resume!.fileName || 'resume.pdf';
                            link.click();
                          }}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                      title="查看详情"
                    >
                      {expandedId === app.id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {expandedId === app.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {app.resume && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-400 mb-1">简历信息</p>
                          <p className="text-sm font-medium text-gray-700">{app.resume.title}</p>
                          {app.resume.fileName && (
                            <p className="text-xs text-gray-500">
                              {app.resume.fileName} ({formatFileSize(app.resume.fileSize)})
                            </p>
                          )}
                        </div>
                      )}
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">申请时间线</p>
                        <div className="space-y-1">
                          {app.statusHistory.map((h, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs">
                              <span className="w-2 h-2 rounded-full bg-[#1E3A5F]" />
                              <span className="text-gray-600">{statusConfig[h.status].label}</span>
                              <span className="text-gray-400">{formatDate(h.timestamp)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {app.status === 'pending' && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setShowStatusModal(app);
                            setStatusNote('');
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          标记为已查看
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                  {app.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowStatusModal({ ...app, status: 'viewed' } as Application);
                          setStatusNote('');
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        已查看
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowStatusModal({ ...app, status: 'recommended' } as Application);
                          setStatusNote('');
                        }}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        已推荐
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 border-red-200 hover:bg-red-50"
                        onClick={() => {
                          setShowStatusModal({ ...app, status: 'rejected' } as Application);
                          setStatusNote('');
                        }}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        婉拒
                      </Button>
                    </>
                  )}
                  {app.status === 'viewed' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowStatusModal({ ...app, status: 'recommended' } as Application);
                          setStatusNote('');
                        }}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        已推荐
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 border-red-200 hover:bg-red-50"
                        onClick={() => {
                          setShowStatusModal({ ...app, status: 'rejected' } as Application);
                          setStatusNote('');
                        }}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        婉拒
                      </Button>
                    </>
                  )}
                  {app.status === 'recommended' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 border-red-200 hover:bg-red-50"
                      onClick={() => {
                        setShowStatusModal({ ...app, status: 'rejected' } as Application);
                        setStatusNote('');
                      }}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      婉拒
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6 animate-scale-in">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              更新申请状态
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              将「{showStatusModal.applicant?.nickname}」的申请更新为：
              <span className="font-medium text-gray-900 ml-1">
                {statusConfig[showStatusModal.status].label}
              </span>
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                添加备注（可选）
              </label>
              <textarea
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="例如：简历优秀，已推荐给HR"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 resize-none"
                rows={3}
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowStatusModal(null);
                  setStatusNote('');
                }}
              >
                取消
              </Button>
              <Button
                className="flex-1"
                onClick={() => handleUpdateStatus(showStatusModal, showStatusModal.status)}
              >
                确认
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

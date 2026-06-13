import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Clock, Eye, CheckCircle, XCircle, Download, Calendar, Mail, MessageSquare, User } from 'lucide-react';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { useReferralStore } from '@/stores/referralStore';
import { useAuthStore } from '@/stores/authStore';
import { Application, ApplicationStatus, Resume } from '@/types';

const statusConfig: Record<ApplicationStatus, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: '待处理', color: 'warning', icon: Clock },
  viewed: { label: '已查看', color: 'primary', icon: Eye },
  recommended: { label: '已推荐', color: 'success', icon: CheckCircle },
  rejected: { label: '已拒绝', color: 'danger', icon: XCircle },
  completed: { label: '已完成', color: 'default', icon: CheckCircle },
};

export default function ReceivedApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { getReceivedApplications, updateApplication, resumes } = useReferralStore();
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<ApplicationStatus | null>(null);
  const [statusNote, setStatusNote] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const receivedApps = getReceivedApplications(user.id);
  const application = receivedApps.find((a) => a.id === id);

  if (!application) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">申请不存在</h2>
          <p className="text-gray-500 mb-6">该申请可能已被删除或不存在</p>
          <Button onClick={() => navigate('/profile/received')}>返回收到的申请</Button>
        </Card>
      </div>
    );
  }

  const sameReferralApps = receivedApps.filter((a) => a.referralId === application.referralId && a.id !== application.id);

  const resume = resumes.find((r) => r.id === application.resumeId) || application.resume;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
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

  const handleUpdateStatus = () => {
    if (!newStatus) return;
    const note = statusNote.trim() || undefined;
    updateApplication(application.id, { status: newStatus }, note);
    setShowStatusModal(false);
    setNewStatus(null);
    setStatusNote('');
  };

  const handlePreviewResume = (resumeData: Resume) => {
    if (resumeData.fileUrl.startsWith('blob:')) {
      window.open(resumeData.fileUrl, '_blank');
      return;
    }
    if (resumeData.base64Data && resumeData.fileType) {
      const byteCharacters = atob(resumeData.base64Data.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: resumeData.fileType });
      window.open(URL.createObjectURL(blob), '_blank');
      return;
    }
    window.open(resumeData.fileUrl, '_blank');
  };

  const handleDownloadResume = (resumeData: Resume) => {
    let url = resumeData.fileUrl;
    if (!url.startsWith('blob:') && resumeData.base64Data && resumeData.fileType) {
      const byteCharacters = atob(resumeData.base64Data.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: resumeData.fileType });
      url = URL.createObjectURL(blob);
    }
    const link = document.createElement('a');
    link.href = url;
    link.download = resumeData.fileName || 'resume.pdf';
    link.click();
  };

  return (
    <div className="min-h-[calc(100vh-64px)] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/profile/received')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回收到的申请
        </button>

        <Card className="p-6 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <img
              src={application.applicant?.avatar || 'https://via.placeholder.com/80'}
              alt={application.applicant?.nickname}
              className="w-20 h-20 rounded-full flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80?text=User';
              }}
            />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900">{application.applicant?.nickname || '匿名用户'}</h1>
                {getStatusBadge(application.status)}
              </div>
              {application.applicant?.certification && (
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="primary">
                    {application.applicant.certification.schoolName}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {application.applicant.certification.major} · {application.applicant.certification.graduationYear}届
                  </span>
                </div>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <a
                  href={`mailto:${application.applicant?.email}`}
                  className="flex items-center gap-1 hover:text-[#1E3A5F] transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  {application.applicant?.email}
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">申请岗位</h3>
                <p className="font-semibold text-gray-900 text-lg">{application.referral?.jobTitle}</p>
                <p className="text-gray-500">{application.referral?.companyName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">投递信息</h3>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-600">
                    <span className="text-gray-400">投递时间：</span>
                    {formatDate(application.createdAt)}
                  </p>
                  {application.scheduledTime && (
                    <p className="text-gray-600 flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400">预约沟通：</span>
                      {formatDate(application.scheduledTime)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {application.notes && (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-gray-400" />
                <h3 className="text-sm font-medium text-gray-500">候选人留言</h3>
              </div>
              <p className="text-gray-700">{application.notes}</p>
            </div>
          )}
        </Card>

        {resume && (
          <Card className="p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">简历文件</h2>
            <div className="flex items-start gap-4">
              <div className="p-4 bg-gray-100 rounded-xl">
                <FileText className="w-10 h-10 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{resume.title}</p>
                {resume.fileName && (
                  <p className="text-sm text-gray-500">
                    {resume.fileName} · {formatFileSize(resume.fileSize)}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePreviewResume(resume)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  预览
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadResume(resume)}
                >
                  <Download className="w-4 h-4 mr-1" />
                  下载
                </Button>
              </div>
            </div>
          </Card>
        )}

        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">状态时间线</h2>
          <div className="space-y-4">
            {application.statusHistory.map((h, index) => {
              const config = statusConfig[h.status];
              return (
                <div key={index} className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${h.status === 'pending' ? 'bg-yellow-50 text-yellow-500' : h.status === 'viewed' ? 'bg-blue-50 text-blue-500' : h.status === 'recommended' ? 'bg-green-50 text-green-500' : h.status === 'rejected' ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-500'}`}>
                    <config.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{config.label}</span>
                      <span className="text-sm text-gray-400">{formatDate(h.timestamp)}</span>
                    </div>
                    {h.note && (
                      <p className="text-sm text-gray-600 mt-1 bg-gray-50 rounded-lg p-2">
                        {h.note}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">更新状态</h2>
          <div className="flex flex-wrap gap-2">
            {application.status === 'pending' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setNewStatus('viewed');
                    setStatusNote('');
                    setShowStatusModal(true);
                  }}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  已查看
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setNewStatus('recommended');
                    setStatusNote('');
                    setShowStatusModal(true);
                  }}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  已推荐
                </Button>
                <Button
                  variant="outline"
                  className="text-red-500 border-red-200 hover:bg-red-50"
                  onClick={() => {
                    setNewStatus('rejected');
                    setStatusNote('');
                    setShowStatusModal(true);
                  }}
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  婉拒
                </Button>
              </>
            )}
            {application.status === 'viewed' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setNewStatus('recommended');
                    setStatusNote('');
                    setShowStatusModal(true);
                  }}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  已推荐
                </Button>
                <Button
                  variant="outline"
                  className="text-red-500 border-red-200 hover:bg-red-50"
                  onClick={() => {
                    setNewStatus('rejected');
                    setStatusNote('');
                    setShowStatusModal(true);
                  }}
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  婉拒
                </Button>
              </>
            )}
            {application.status === 'recommended' && (
              <Button
                variant="outline"
                className="text-red-500 border-red-200 hover:bg-red-50"
                onClick={() => {
                  setNewStatus('rejected');
                  setStatusNote('');
                  setShowStatusModal(true);
                }}
              >
                <XCircle className="w-4 h-4 mr-1" />
                婉拒
              </Button>
            )}
            {(application.status === 'rejected' || application.status === 'completed') && (
              <p className="text-gray-500">该申请已结束，无法更新状态</p>
            )}
          </div>
        </Card>

        {sameReferralApps.length > 0 && (
          <Card className="p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              同岗位其他申请 ({sameReferralApps.length})
            </h2>
            <div className="space-y-3">
              {sameReferralApps.slice(0, 3).map((app) => (
                <div
                  key={app.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/profile/received/${app.id}`)}
                >
                  <img
                    src={app.applicant?.avatar || 'https://via.placeholder.com/40'}
                    alt={app.applicant?.nickname}
                    className="w-10 h-10 rounded-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=User';
                    }}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{app.applicant?.nickname || '匿名用户'}</p>
                    <p className="text-xs text-gray-400">投递时间：{formatDate(app.createdAt)}</p>
                  </div>
                  {getStatusBadge(app.status)}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {showStatusModal && newStatus && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6 animate-scale-in">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              更新申请状态
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              将「{application.applicant?.nickname}」的申请更新为：
              <span className="font-medium text-gray-900 ml-1">
                {statusConfig[newStatus].label}
              </span>
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                添加备注（可选）
              </label>
              <textarea
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder={
                  newStatus === 'viewed' ? '例如：简历已查看，等待进一步评估' :
                  newStatus === 'recommended' ? '例如：简历优秀，已推荐给HR部门' :
                  '例如：岗位已招满，不再考虑其他候选人'
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 resize-none"
                rows={3}
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowStatusModal(false);
                  setNewStatus(null);
                  setStatusNote('');
                }}
              >
                取消
              </Button>
              <Button className="flex-1" onClick={handleUpdateStatus}>
                确认
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

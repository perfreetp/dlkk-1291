import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Users, Briefcase, Calendar, Share2, Heart, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Textarea from '@/components/forms/Textarea';
import { useReferralStore } from '@/stores/referralStore';
import { useAuthStore } from '@/stores/authStore';
import { useNotificationStore } from '@/stores/dataStore';

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getReferralById, favorites, toggleFavorite, addApplication, resumes, hasApplied } = useReferralStore();
  const { user, isAuthenticated } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedResume, setSelectedResume] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isApplied, setIsApplied] = useState(false);

  const referral = getReferralById(id || '');

  if (!referral) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">岗位不存在</h2>
          <p className="text-gray-500 mb-6">该内推岗位可能已下架或不存在</p>
          <Button onClick={() => navigate('/referrals')}>返回内推大厅</Button>
        </Card>
      </div>
    );
  }

  const isFavorite = favorites.includes(referral.id);
  const userResumes = resumes.filter((r) => r.userId === user?.id);
  const defaultResume = userResumes.find((r) => r.isDefault) || userResumes[0];
  const alreadyApplied = isAuthenticated && hasApplied(user!.id, referral.id);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleToggleFavorite = () => {
    toggleFavorite(referral.id);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `${referral.jobTitle} - 内推`,
        text: `${referral.companyName}正在招聘${referral.jobTitle}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedResume(defaultResume?.id || '');
    setScheduledTime('');
    setNotes('');
    setShowApplyModal(true);
  };

  const handleSubmitApplication = () => {
    if (!selectedResume) return;

    addApplication({
      referralId: referral.id,
      applicantId: user!.id,
      resumeId: selectedResume,
      scheduledTime: scheduledTime || undefined,
      notes,
    });

    addNotification({
      userId: user!.id,
      type: 'application',
      title: '申请已提交',
      content: `您已申请「${referral.jobTitle}」岗位，等待推荐人审核`,
      link: '/applications',
    });

    setIsApplied(true);
    setShowApplyModal(false);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </button>

        <Card className="overflow-hidden">
          <div className="p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-start gap-6 mb-8">
              <img
                src={referral.companyLogo}
                alt={referral.companyName}
                className="w-20 h-20 rounded-2xl object-cover bg-gray-100 flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80?text=Logo';
                }}
              />

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <h1 className="text-2xl font-bold text-gray-900">{referral.jobTitle}</h1>
                  <Badge variant={referral.jobType === 'internship' ? 'secondary' : 'primary'} size="md">
                    {referral.jobType === 'internship' ? '实习' : referral.jobType === 'campus' ? '校招' : '社招'}
                  </Badge>
                </div>
                <p className="text-lg text-gray-600 mb-4">{referral.companyName}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {referral.city}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {referral.salary}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {referral.applicantCount}人已申请
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={handleToggleFavorite}
                  className={`p-2 rounded-lg border transition-colors ${
                    isFavorite ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-200 text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="bg-[#1E3A5F]/5 rounded-xl p-4 mb-8 flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#E53E3E] flex-shrink-0" />
              <span className="text-[#E53E3E] font-medium">截止时间：{formatDate(referral.deadline)}</span>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">岗位要求</h2>
                <div className="prose prose-gray max-w-none text-gray-600 whitespace-pre-line">
                  {referral.requirements}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">简历接收范围</h2>
                <div className="bg-gray-50 rounded-xl p-4 text-gray-600">
                  {referral.resumeRange}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 p-6 lg:p-8 bg-gray-50/50">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <img
                  src={referral.poster?.avatar}
                  alt={referral.poster?.nickname}
                  className="w-14 h-14 rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-900">{referral.poster?.nickname}</p>
                  <p className="text-sm text-gray-500">
                    {referral.poster?.certification?.schoolName} · {referral.poster?.certification?.major}
                  </p>
                  <p className="text-sm text-gray-400">
                    {referral.poster?.certification?.graduationYear}届
                  </p>
                </div>
              </div>

              <Button
                size="lg"
                onClick={handleApply}
                disabled={alreadyApplied || referral.status !== 'active'}
                className="min-w-[200px]"
              >
                {alreadyApplied ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    已申请
                  </>
                ) : (
                  '立即申请'
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg p-6 animate-scale-in">
            <h2 className="text-xl font-bold text-gray-900 mb-6">申请内推</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">选择简历</label>
                {userResumes.length === 0 ? (
                  <div className="text-center p-4 border border-dashed border-gray-200 rounded-lg">
                    <p className="text-gray-500 mb-2">您还没有上传简历</p>
                    <Button variant="outline" size="sm" onClick={() => navigate('/profile/resumes')}>
                      上传简历
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {userResumes.map((resume) => (
                      <label
                        key={resume.id}
                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedResume === resume.id
                            ? 'border-[#1E3A5F] bg-[#1E3A5F]/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="resume"
                          value={resume.id}
                          checked={selectedResume === resume.id}
                          onChange={(e) => setSelectedResume(e.target.value)}
                          className="w-4 h-4 text-[#1E3A5F]"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{resume.title}</p>
                          {resume.isDefault && (
                            <span className="text-xs text-[#1E3A5F]">默认简历</span>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  预约沟通时间（选填）
                </label>
                <input
                  type="datetime-local"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 transition-colors text-gray-900"
                />
                <p className="mt-1.5 text-sm text-gray-500">选择您方便沟通的时间，推荐人可以看到</p>
              </div>

              <Textarea
                label="给推荐人的留言（选填）"
                placeholder="简单介绍一下自己，表达您的诚意..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowApplyModal(false)}>
                  取消
                </Button>
                <Button className="flex-1" onClick={handleSubmitApplication} disabled={!selectedResume}>
                  提交申请
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

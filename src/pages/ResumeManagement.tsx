import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Star, Trash2, ArrowLeft, Check } from 'lucide-react';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Input from '@/components/forms/Input';
import { useReferralStore } from '@/stores/referralStore';
import { useAuthStore } from '@/stores/authStore';

export default function ResumeManagement() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { resumes, addResume, updateResume, deleteResume } = useReferralStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newResumeTitle, setNewResumeTitle] = useState('');

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">请先登录</h2>
          <p className="text-gray-500 mb-6">登录后才能管理简历</p>
          <Button onClick={() => navigate('/login')}>去登录</Button>
        </Card>
      </div>
    );
  }

  const userResumes = resumes.filter((r) => r.userId === user?.id);

  const handleAddResume = () => {
    if (!newResumeTitle.trim()) return;

    addResume({
      userId: user!.id,
      title: newResumeTitle,
      fileUrl: `/resumes/${user!.id}/${Date.now()}.pdf`,
      isDefault: userResumes.length === 0,
    });

    setNewResumeTitle('');
    setShowAddModal(false);
  };

  const handleSetDefault = (resumeId: string) => {
    userResumes.forEach((r) => {
      if (r.id === resumeId) {
        updateResume(r.id, { isDefault: true });
      } else if (r.isDefault) {
        updateResume(r.id, { isDefault: false });
      }
    });
  };

  const handleDelete = (resumeId: string) => {
    if (window.confirm('确定要删除这个简历吗？')) {
      deleteResume(resumeId);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">简历管理</h1>
            <p className="text-gray-500">管理您的简历版本，设为默认简历将被用于申请</p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <Upload className="w-4 h-4 mr-2" />
            上传简历
          </Button>
        </div>

        {userResumes.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无简历</h3>
            <p className="text-gray-500 mb-6">上传您的简历，方便申请内推</p>
            <Button onClick={() => setShowAddModal(true)}>
              <Upload className="w-4 h-4 mr-2" />
              上传简历
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {userResumes.map((resume) => (
              <Card key={resume.id} className="p-5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <FileText className="w-6 h-6 text-gray-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{resume.title}</h3>
                      {resume.isDefault && (
                        <Badge variant="success" size="sm">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          默认
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">上传时间：{formatDate(resume.createdAt)}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {!resume.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetDefault(resume.id)}
                      >
                        <Star className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(resume.id)}
                      className="text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6 animate-scale-in">
            <h2 className="text-xl font-bold text-gray-900 mb-6">上传简历</h2>

            <div className="space-y-4">
              <Input
                label="简历标题"
                placeholder="例如：2024届校招简历"
                value={newResumeTitle}
                onChange={(e) => setNewResumeTitle(e.target.value)}
              />

              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-[#1E3A5F]/50 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">点击选择文件</p>
                <p className="text-xs text-gray-400 mt-1">支持 PDF、Word 格式，最大 10MB</p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>
                  取消
                </Button>
                <Button className="flex-1" onClick={handleAddResume} disabled={!newResumeTitle.trim()}>
                  上传
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

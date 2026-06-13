import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Star, Trash2, ArrowLeft, Download, Eye } from 'lucide-react';
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (validTypes.includes(file.type)) {
        setSelectedFile(file);
        if (!newResumeTitle) {
          const fileName = file.name.replace(/\.[^/.]+$/, '');
          setNewResumeTitle(fileName);
        }
      } else {
        alert('请选择 PDF 或 Word 文件');
      }
    }
  };

  const handleAddResume = () => {
    if (!newResumeTitle.trim()) return;

    addResume({
      userId: user!.id,
      title: newResumeTitle,
      fileUrl: selectedFile ? URL.createObjectURL(selectedFile) : `/resumes/${user!.id}/${Date.now()}.pdf`,
      fileName: selectedFile?.name,
      fileSize: selectedFile?.size,
      fileType: selectedFile?.type,
      isDefault: userResumes.length === 0,
    });

    setNewResumeTitle('');
    setSelectedFile(null);
    setShowAddModal(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
    const resumeToDelete = userResumes.find((r) => r.id === resumeId);
    const wasDefault = resumeToDelete?.isDefault;
    
    deleteResume(resumeId);
    
    if (wasDefault && userResumes.length > 1) {
      const remainingResumes = userResumes.filter((r) => r.id !== resumeId);
      if (remainingResumes.length > 0) {
        const latestResume = remainingResumes.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];
        updateResume(latestResume.id, { isDefault: true });
      }
    }
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
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-100 rounded-lg flex-shrink-0">
                    <FileText className="w-6 h-6 text-gray-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{resume.title}</h3>
                      {resume.isDefault && (
                        <Badge variant="success" size="sm">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          默认
                        </Badge>
                      )}
                      {resume.fileType && (
                        <Badge variant="default" size="sm">
                          {getFileExtension(resume.fileType)}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-500 space-y-0.5">
                      <p>上传时间：{formatDate(resume.createdAt)}</p>
                      {resume.fileName && (
                        <>
                          <p>文件名：{resume.fileName}</p>
                          {resume.fileSize && <p>大小：{formatFileSize(resume.fileSize)}</p>}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {resume.fileUrl && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="预览"
                          onClick={() => window.open(resume.fileUrl, '_blank')}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="下载"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = resume.fileUrl;
                            link.download = resume.fileName || 'resume.pdf';
                            link.click();
                          }}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    {!resume.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetDefault(resume.id)}
                        title="设为默认"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">选择文件</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-[#1E3A5F]/50 transition-colors cursor-pointer"
                >
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-2">
                      <FileText className="w-6 h-6 text-[#1E3A5F]" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-700">{selectedFile.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">点击选择文件</p>
                    </>
                  )}
                </div>
                <p className="mt-1.5 text-xs text-gray-400">支持 PDF、Word 格式，最大 10MB</p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => {
                  setShowAddModal(false);
                  setNewResumeTitle('');
                  setSelectedFile(null);
                }}>
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

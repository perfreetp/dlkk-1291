import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Upload } from 'lucide-react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/forms/Input';
import Select from '@/components/forms/Select';
import Textarea from '@/components/forms/Textarea';
import { useAuthStore } from '@/stores/authStore';
import { useReferralStore } from '@/stores/referralStore';
import { cities, jobTypes, grades } from '@/data/mockData';

export default function PostReferral() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { addReferral } = useReferralStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    city: '',
    jobType: '',
    salary: '',
    gradeRequired: '',
    majorRequired: '',
    requirements: '',
    resumeRange: '',
    deadline: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">请先登录</h2>
          <p className="text-gray-500 mb-6">登录后才能发布内推岗位</p>
          <Button onClick={() => navigate('/login')}>去登录</Button>
        </Card>
      </div>
    );
  }

  if (!user?.certification || user.certification.status !== 'approved') {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">需要完成校友认证</h2>
          <p className="text-gray-500 mb-6">认证后才能发布内推岗位</p>
          <Button onClick={() => navigate('/certification')}>去认证</Button>
        </Card>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.jobTitle) newErrors.jobTitle = '请输入岗位名称';
    if (!formData.companyName) newErrors.companyName = '请输入公司名称';
    if (!formData.city) newErrors.city = '请选择城市';
    if (!formData.jobType) newErrors.jobType = '请选择岗位类型';
    if (!formData.gradeRequired) newErrors.gradeRequired = '请选择年级要求';
    if (!formData.requirements) newErrors.requirements = '请输入岗位要求';
    if (!formData.resumeRange) newErrors.resumeRange = '请输入简历接收范围';
    if (!formData.deadline) newErrors.deadline = '请选择截止时间';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    addReferral({
      posterId: user!.id,
      poster: user!,
      jobTitle: formData.jobTitle,
      companyName: formData.companyName,
      companyLogo: `https://logo.clearbit.com/${formData.companyName.toLowerCase().replace(/\s+/g, '')}.com`,
      city: formData.city,
      jobType: formData.jobType as 'internship' | 'campus' | 'social',
      salary: formData.salary || '面议',
      gradeRequired: parseInt(formData.gradeRequired),
      majorRequired: formData.majorRequired || '不限专业',
      requirements: formData.requirements,
      resumeRange: formData.resumeRange,
      deadline: formData.deadline,
    });

    setIsSubmitting(false);
    navigate('/referrals');
  };

  const cityOptions = [{ value: '', label: '请选择城市' }, ...cities.map((c) => ({ value: c, label: c }))];
  const jobTypeOptions = [{ value: '', label: '请选择岗位类型' }, ...jobTypes.map((t) => ({ value: t.value, label: t.label }))];
  const gradeOptions = [{ value: '', label: '请选择年级要求' }, ...grades.map((g) => ({ value: g.value.toString(), label: g.label }))];

  return (
    <div className="min-h-[calc(100vh-64px)] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">发布内推</h1>
          <p className="text-gray-500">填写内推岗位信息，帮助学弟学妹获得机会</p>
        </div>

        <Card className="p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Input
                label="岗位名称"
                name="jobTitle"
                placeholder="例如：后端开发实习生"
                value={formData.jobTitle}
                onChange={handleChange}
                error={errors.jobTitle}
              />

              <Input
                label="公司名称"
                name="companyName"
                placeholder="例如：字节跳动"
                value={formData.companyName}
                onChange={handleChange}
                error={errors.companyName}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Select
                label="城市"
                name="city"
                options={cityOptions}
                value={formData.city}
                onChange={handleChange}
                error={errors.city}
              />

              <Select
                label="岗位类型"
                name="jobType"
                options={jobTypeOptions}
                value={formData.jobType}
                onChange={handleChange}
                error={errors.jobType}
              />

              <Input
                label="薪资范围"
                name="salary"
                placeholder="例如：300-400/天"
                value={formData.salary}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Select
                label="年级要求"
                name="gradeRequired"
                options={gradeOptions}
                value={formData.gradeRequired}
                onChange={handleChange}
                error={errors.gradeRequired}
              />

              <Input
                label="专业要求"
                name="majorRequired"
                placeholder="例如：计算机相关（可填'不限专业'）"
                value={formData.majorRequired}
                onChange={handleChange}
              />
            </div>

            <Textarea
              label="岗位要求"
              name="requirements"
              placeholder="请详细描述岗位要求，每条一行，例如：&#10;1. 本科及以上在读，计算机相关专业&#10;2. 熟悉Python/Go等后端语言&#10;3. 了解MySQL、Redis等数据库&#10;4. 每周可实习3天以上"
              value={formData.requirements}
              onChange={handleChange}
              error={errors.requirements}
              rows={6}
            />

            <Textarea
              label="简历接收范围"
              name="resumeRange"
              placeholder="说明您希望接收什么样的简历，例如：&#10;希望接收985/211高校的同学简历，计算机相关专业优先，需要有项目经验"
              value={formData.resumeRange}
              onChange={handleChange}
              error={errors.resumeRange}
              rows={3}
            />

            <Input
              label="截止时间"
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleChange}
              error={errors.deadline}
            />

            <div className="border-t border-gray-100 pt-6 flex gap-4">
              <Button variant="outline" className="flex-1" onClick={() => navigate('/referrals')}>
                取消
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? '发布中...' : '发布内推'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

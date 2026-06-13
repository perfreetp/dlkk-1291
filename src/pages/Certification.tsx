import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Upload, AlertCircle, Shield } from 'lucide-react';
import Button from '@/components/common/Button';
import Input from '@/components/forms/Input';
import Select from '@/components/forms/Select';
import Card from '@/components/common/Card';
import { useAuthStore } from '@/stores/authStore';
import { schools, grades } from '@/data/mockData';

export default function Certification() {
  const navigate = useNavigate();
  const { user, submitCertification, isAuthenticated } = useAuthStore();
  const [formData, setFormData] = useState({
    schoolName: '',
    studentId: '',
    graduationYear: '',
    department: '',
    major: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.schoolName) newErrors.schoolName = '请选择学校';
    if (!formData.studentId) newErrors.studentId = '请输入学号/工号';
    if (!formData.graduationYear) newErrors.graduationYear = '请选择毕业年份';
    if (!formData.department) newErrors.department = '请输入院系';
    if (!formData.major) newErrors.major = '请输入专业';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    submitCertification({
      schoolName: formData.schoolName,
      studentId: formData.studentId,
      graduationYear: parseInt(formData.graduationYear),
      department: formData.department,
      major: formData.major,
    });

    setIsSubmitting(false);
    navigate('/profile');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4">
        <Card className="max-w-md p-8 text-center">
          <AlertCircle className="w-16 h-16 text-[#F5A623] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">请先登录</h2>
          <p className="text-gray-500 mb-6">登录后才能进行校友认证</p>
          <Button onClick={() => navigate('/login')}>去登录</Button>
        </Card>
      </div>
    );
  }

  if (user?.certification?.status === 'approved') {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4">
        <Card className="max-w-md p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">认证已完成</h2>
          <p className="text-gray-500 mb-2">您已是认证校友，可以发布内推岗位</p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-600"><strong>学校：</strong>{user.certification.schoolName}</p>
            <p className="text-sm text-gray-600"><strong>专业：</strong>{user.certification.major}</p>
            <p className="text-sm text-gray-600"><strong>毕业年份：</strong>{user.certification.graduationYear}届</p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate('/referrals/post')}>发布内推</Button>
            <Button variant="outline" onClick={() => navigate('/profile')}>查看个人中心</Button>
          </div>
        </Card>
      </div>
    );
  }

  const schoolOptions = schools.map((s) => ({ value: s.name, label: s.name }));
  const gradeOptions = grades.map((g) => ({ value: g.value.toString(), label: g.label }));

  return (
    <div className="min-h-[calc(100vh-64px)] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1E3A5F]/10 mb-4">
            <Shield className="w-8 h-8 text-[#1E3A5F]" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">校友认证</h1>
          <p className="text-gray-500">完成认证后，您可以发布内推岗位，帮助更多校友</p>
        </div>

        <Card className="p-8">
          <div className="mb-8 p-4 bg-[#1E3A5F]/5 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-3">认证后享受的权益</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                可以发布内推岗位
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                获得认证标识，增加可信度
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                参与校友圈讨论
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                获取更多内推机会
              </li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Select
              label="学校名称"
              name="schoolName"
              options={schoolOptions}
              value={formData.schoolName}
              onChange={handleChange}
              placeholder="请选择您的学校"
              error={errors.schoolName}
            />

            <Input
              label="学号/工号"
              name="studentId"
              placeholder="请输入您的学号或工号"
              value={formData.studentId}
              onChange={handleChange}
              error={errors.studentId}
            />

            <Select
              label="毕业年份"
              name="graduationYear"
              options={gradeOptions}
              value={formData.graduationYear}
              onChange={handleChange}
              placeholder="请选择毕业年份"
              error={errors.graduationYear}
            />

            <Input
              label="院系"
              name="department"
              placeholder="例如：计算机科学与技术系"
              value={formData.department}
              onChange={handleChange}
              error={errors.department}
            />

            <Input
              label="专业"
              name="major"
              placeholder="例如：软件工程"
              value={formData.major}
              onChange={handleChange}
              error={errors.major}
            />

            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-[#1E3A5F]/50 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">点击上传身份证明</p>
              <p className="text-xs text-gray-400 mt-1">支持 JPG、PNG 格式，最大 5MB</p>
              <input type="file" className="hidden" accept="image/*" />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? '提交中...' : '提交认证'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

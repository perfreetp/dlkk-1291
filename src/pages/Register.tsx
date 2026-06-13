import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';
import Button from '@/components/common/Button';
import Input from '@/components/forms/Input';
import { useAuthStore } from '@/stores/authStore';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuthStore();
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.nickname || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('请填写所有必填项');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    if (formData.password.length < 6) {
      setError('密码长度至少为6位');
      return;
    }

    const success = register(formData.email, formData.password, formData.nickname);
    if (success) {
      navigate('/certification');
    } else {
      setError('注册失败，请重试');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">创建账号</h1>
          <p className="text-gray-500">加入校友内推，开启你的求职之旅</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-red-600">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" style={{ marginTop: '-11px' }} />
              <Input
                type="text"
                name="nickname"
                placeholder="昵称"
                value={formData.nickname}
                onChange={handleChange}
                className="pl-12"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" style={{ marginTop: '-11px' }} />
              <Input
                type="email"
                name="email"
                placeholder="邮箱地址"
                value={formData.email}
                onChange={handleChange}
                className="pl-12"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" style={{ marginTop: '-11px' }} />
              <Input
                type="password"
                name="password"
                placeholder="密码（至少6位）"
                value={formData.password}
                onChange={handleChange}
                className="pl-12"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" style={{ marginTop: '-11px' }} />
              <Input
                type="password"
                name="confirmPassword"
                placeholder="确认密码"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="pl-12"
              />
            </div>

            <div className="flex items-start gap-2 text-sm">
              <input type="checkbox" required className="w-4 h-4 mt-0.5 rounded border-gray-300 text-[#1E3A5F] focus:ring-[#1E3A5F]" />
              <span className="text-gray-600">
                我已阅读并同意{' '}
                <a href="#" className="text-[#1E3A5F] hover:underline">服务条款</a> 和{' '}
                <a href="#" className="text-[#1E3A5F] hover:underline">隐私政策</a>
              </span>
            </div>

            <Button type="submit" className="w-full" size="lg">
              注册
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            已有账号？{' '}
            <Link to="/login" className="text-[#1E3A5F] font-medium hover:underline">
              立即登录
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

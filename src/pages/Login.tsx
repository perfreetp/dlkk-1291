import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import Button from '@/components/common/Button';
import Input from '@/components/forms/Input';
import { useAuthStore } from '@/stores/authStore';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('请填写所有必填项');
      return;
    }

    const success = login(email, password);
    if (success) {
      navigate('/');
    } else {
      setError('邮箱或密码错误');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">欢迎回来</h1>
          <p className="text-gray-500">登录您的校友内推账号</p>
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
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" style={{ marginTop: '-11px' }} />
              <Input
                type="email"
                placeholder="邮箱地址"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-12"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" style={{ marginTop: '-11px' }} />
              <Input
                type="password"
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-12"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#1E3A5F] focus:ring-[#1E3A5F]" />
                <span className="text-gray-600">记住我</span>
              </label>
              <a href="#" className="text-[#1E3A5F] hover:underline">忘记密码？</a>
            </div>

            <Button type="submit" className="w-full" size="lg">
              登录
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            还没有账号？{' '}
            <Link to="/register" className="text-[#1E3A5F] font-medium hover:underline">
              立即注册
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          登录即表示您同意我们的{' '}
          <a href="#" className="underline">服务条款</a> 和{' '}
          <a href="#" className="underline">隐私政策</a>
        </p>
      </div>
    </div>
  );
}

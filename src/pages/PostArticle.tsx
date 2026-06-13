import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Image, X } from 'lucide-react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/forms/Input';
import Textarea from '@/components/forms/Textarea';
import Select from '@/components/forms/Select';
import { useArticleStore } from '@/stores/dataStore';
import { useAuthStore } from '@/stores/authStore';

export default function PostArticle() {
  const navigate = useNavigate();
  const { addArticle } = useArticleStore();
  const { user, isAuthenticated } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">请先登录</h2>
          <p className="text-gray-500 mb-6">登录后才能发布帖子</p>
          <Button onClick={() => navigate('/login')}>去登录</Button>
        </Card>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = '请输入标题';
    if (!formData.content.trim()) newErrors.content = '请输入内容';
    if (!formData.category) newErrors.category = '请选择分类';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    addArticle({
      authorId: user!.id,
      author: user!,
      title: formData.title,
      content: formData.content,
      category: formData.category as 'experience' | 'thanks' | 'insight',
    });

    setIsSubmitting(false);
    navigate('/circle');
  };

  const categoryOptions = [
    { value: '', label: '请选择分类' },
    { value: 'experience', label: '面经分享' },
    { value: 'thanks', label: '感谢信' },
    { value: 'insight', label: '内推感悟' },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/circle')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">发布帖子</h1>
          <p className="text-gray-500">分享您的经验，传递温暖与力量</p>
        </div>

        <Card className="p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Select
              label="分类"
              name="category"
              options={categoryOptions}
              value={formData.category}
              onChange={handleChange}
              error={errors.category}
            />

            <Input
              label="标题"
              name="title"
              placeholder="请输入帖子标题"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
            />

            <Textarea
              label="内容"
              name="content"
              placeholder="分享您的面试经验、感谢信或内推感悟..."
              value={formData.content}
              onChange={handleChange}
              error={errors.content}
              rows={12}
              helperText="支持 Markdown 格式"
            />

            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-[#1E3A5F]/50 transition-colors cursor-pointer">
              <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">点击添加图片（选填）</p>
              <p className="text-xs text-gray-400 mt-1">支持 JPG、PNG 格式，最多9张</p>
            </div>

            <div className="border-t border-gray-100 pt-6 flex gap-4">
              <Button variant="outline" type="button" className="flex-1" onClick={() => navigate('/circle')}>
                取消
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? '发布中...' : '发布'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

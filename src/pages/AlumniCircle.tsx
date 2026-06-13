import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenSquare, Heart, MessageCircle, Users, Star, Lightbulb } from 'lucide-react';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { useArticleStore } from '@/stores/dataStore';
import { useAuthStore } from '@/stores/authStore';

export default function AlumniCircle() {
  const navigate = useNavigate();
  const { articles, likeArticle } = useArticleStore();
  const { user, isAuthenticated } = useAuthStore();
  const [filter, setFilter] = useState<string>('all');

  const filteredArticles = filter === 'all'
    ? articles
    : articles.filter((a) => a.category === filter);

  const handleLike = (e: React.MouseEvent, articleId: string) => {
    e.stopPropagation();
    likeArticle(articleId);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'experience':
        return <Star className="w-4 h-4" />;
      case 'thanks':
        return <Heart className="w-4 h-4" />;
      case 'insight':
        return <Lightbulb className="w-4 h-4" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'experience':
        return '面经分享';
      case 'thanks':
        return '感谢信';
      case 'insight':
        return '内推感悟';
      default:
        return category;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return '刚刚';
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">校友圈</h1>
            <p className="text-gray-500">分享面试经验，传递温暖与力量</p>
          </div>
          {isAuthenticated && (
            <Button onClick={() => navigate('/circle/post')}>
              <PenSquare className="w-4 h-4 mr-2" />
              发布帖子
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { value: 'all', label: '全部' },
            { value: 'experience', label: '面经分享' },
            { value: 'thanks', label: '感谢信' },
            { value: 'insight', label: '内推感悟' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === tab.value
                  ? 'bg-[#1E3A5F] text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.value !== 'all' && getCategoryIcon(tab.value)}
              {tab.label}
            </button>
          ))}
        </div>

        {filteredArticles.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无帖子</h3>
            <p className="text-gray-500 mb-6">成为第一个分享的人吧</p>
            {isAuthenticated && (
              <Button onClick={() => navigate('/circle/post')}>发布帖子</Button>
            )}
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredArticles.map((article, index) => (
              <Card
                key={article.id}
                hover
                className="p-6"
                style={{ opacity: 0, animation: `slideUp 0.3s ease-out ${0.05 * index}s forwards` }}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={article.author?.avatar}
                    alt={article.author?.nickname}
                    className="w-10 h-10 rounded-full flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-gray-900">{article.author?.nickname}</span>
                      {article.author?.certification && (
                        <Badge variant="primary" size="sm">
                          {article.author.certification.schoolName}
                        </Badge>
                      )}
                      <span className="text-gray-400">·</span>
                      <span className="text-sm text-gray-400">{formatDate(article.createdAt)}</span>
                    </div>

                    <Badge
                      variant={
                        article.category === 'experience'
                          ? 'primary'
                          : article.category === 'thanks'
                          ? 'success'
                          : 'secondary'
                      }
                      className="mb-3"
                    >
                      {getCategoryIcon(article.category)}
                      <span className="ml-1">{getCategoryLabel(article.category)}</span>
                    </Badge>

                    <h2 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h2>
                    <p className="text-gray-600 whitespace-pre-line line-clamp-4">{article.content}</p>

                    <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={(e) => handleLike(e, article.id)}
                        className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Heart className="w-5 h-5" />
                        <span>{article.likeCount}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-500 hover:text-[#1E3A5F] transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        <span>{article.commentCount}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

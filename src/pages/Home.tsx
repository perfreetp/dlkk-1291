import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Briefcase, Users, TrendingUp, MapPin, Clock, ArrowRight, ChevronRight, Sparkles, Heart } from 'lucide-react';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { useReferralStore } from '@/stores/referralStore';
import { useArticleStore } from '@/stores/dataStore';
import { stats } from '@/data/mockData';

export default function Home() {
  const navigate = useNavigate();
  const { referrals } = useReferralStore();
  const { articles } = useArticleStore();
  const [keyword, setKeyword] = useState('');

  const hotReferrals = referrals.filter((r) => r.status === 'active').slice(0, 6);
  const latestReferrals = referrals.filter((r) => r.status === 'active').slice(0, 4);
  const featuredArticles = articles.filter((a) => a.category === 'experience').slice(0, 3);

  const handleSearch = () => {
    if (keyword.trim()) {
      navigate(`/referrals?keyword=${encodeURIComponent(keyword)}`);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return '已截止';
    if (diffDays <= 7) return `${diffDays}天后截止`;
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1E3A5F] via-[#2D5A87] to-[#3D6A97] text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#F5A623] rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-sm mb-6 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              <span>连接校友 · 共享机会</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              让内推资源在校友网络中
              <span className="block text-[#F5A623]">高效流动</span>
            </h1>
            <p className="text-lg text-white/80 mb-8">
              连接优秀校友，获取真实内推机会。实习、校招、社招，让每一次机会都触手可及。
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="relative w-full max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索公司、岗位或城市..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-12 pr-32 py-4 rounded-xl text-gray-900 placeholder-gray-400 shadow-lg focus:outline-none focus:ring-4 focus:ring-[#F5A623]/30"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-[#F5A623] hover:bg-[#E09000] text-white font-medium rounded-lg transition-colors"
                >
                  搜索
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 max-w-4xl mx-auto animate-slide-up">
            {[
              { label: '认证校友', value: stats.totalUsers.toLocaleString(), icon: Users },
              { label: '累计内推', value: stats.totalReferrals.toLocaleString(), icon: Briefcase },
              { label: '成功内推', value: stats.successfulReferrals.toLocaleString(), icon: TrendingUp },
              { label: '覆盖城市', value: stats.totalCities.toString(), icon: MapPin },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className={`text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm stagger-${index + 1}`}
                style={{ opacity: 0, animation: `slideUp 0.5s ease-out ${0.1 * (index + 1)}s forwards` }}
              >
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-[#F5A623]" />
                <div className="text-2xl lg:text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">热门内推</h2>
            <p className="text-gray-500 mt-1">精选最受欢迎的内推岗位</p>
          </div>
          <Link
            to="/referrals"
            className="flex items-center gap-1 text-[#1E3A5F] hover:text-[#2D5A87] font-medium transition-colors"
          >
            查看更多 <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotReferrals.map((referral, index) => (
            <Card
              key={referral.id}
              hover
              onClick={() => navigate(`/referrals/${referral.id}`)}
              className="overflow-hidden"
              style={{ opacity: 0, animation: `slideUp 0.4s ease-out ${0.1 * index}s forwards` }}
            >
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={referral.companyLogo}
                    alt={referral.companyName}
                    className="w-14 h-14 rounded-xl object-cover bg-gray-100"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/56?text=Logo';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{referral.jobTitle}</h3>
                    <p className="text-sm text-gray-500">{referral.companyName}</p>
                  </div>
                  <Badge variant={referral.jobType === 'internship' ? 'secondary' : 'primary'}>
                    {referral.jobType === 'internship' ? '实习' : referral.jobType === 'campus' ? '校招' : '社招'}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    {referral.city}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    {formatDate(referral.deadline)}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <img
                      src={referral.poster?.avatar}
                      alt={referral.poster?.nickname}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm text-gray-500">{referral.poster?.nickname}</span>
                  </div>
                  <span className="text-sm text-gray-400">{referral.applicantCount}人已申请</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">最新内推</h2>
              <p className="text-gray-500 mt-1">刚刚发布的内推机会</p>
            </div>
            <Link
              to="/referrals"
              className="flex items-center gap-1 text-[#1E3A5F] hover:text-[#2D5A87] font-medium transition-colors"
            >
              查看更多 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {latestReferrals.map((referral, index) => (
              <Card
                key={referral.id}
                hover
                onClick={() => navigate(`/referrals/${referral.id}`)}
                className="p-4"
                style={{ opacity: 0, animation: `slideUp 0.4s ease-out ${0.1 * index}s forwards` }}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={referral.companyLogo}
                    alt={referral.companyName}
                    className="w-12 h-12 rounded-xl object-cover bg-gray-100 flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48?text=Logo';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{referral.jobTitle}</h3>
                      <Badge variant="secondary" size="sm">
                        {referral.jobType === 'internship' ? '实习' : referral.jobType === 'campus' ? '校招' : '社招'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{referral.companyName}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {referral.city}
                      </span>
                      <span>·</span>
                      <span>{referral.salary}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm text-[#E53E3E] font-medium">{formatDate(referral.deadline)}</div>
                    <div className="text-xs text-gray-400 mt-1">{referral.applicantCount}人申请</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">校友圈精选</h2>
            <p className="text-gray-500 mt-1">面试经验与感谢分享</p>
          </div>
          <Link
            to="/circle"
            className="flex items-center gap-1 text-[#1E3A5F] hover:text-[#2D5A87] font-medium transition-colors"
          >
            查看更多 <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {featuredArticles.map((article, index) => (
            <Card
              key={article.id}
              hover
              onClick={() => navigate(`/circle`)}
              className="p-6"
              style={{ opacity: 0, animation: `slideUp 0.4s ease-out ${0.1 * index}s forwards` }}
            >
              <Badge
                variant={article.category === 'experience' ? 'primary' : article.category === 'thanks' ? 'success' : 'secondary'}
                className="mb-4"
              >
                {article.category === 'experience' ? '面经分享' : article.category === 'thanks' ? '感谢信' : '内推感悟'}
              </Badge>
              <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2">{article.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-3 mb-4">{article.content}</p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <img
                    src={article.author?.avatar}
                    alt={article.author?.nickname}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm text-gray-500">{article.author?.nickname}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {article.likeCount}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-gradient-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">准备好开始了吗？</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            加入校友内推，与优秀校友建立连接，获取第一手内推机会
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button variant="secondary" size="lg" className="bg-white text-[#1E3A5F] hover:bg-gray-100">
                立即注册
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/certification">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                校友认证
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

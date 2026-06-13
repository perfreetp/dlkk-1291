import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, MapPin, Clock, Users, X } from 'lucide-react';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Select from '@/components/forms/Select';
import { useReferralStore } from '@/stores/referralStore';
import { useAuthStore } from '@/stores/authStore';
import { useBlockStore } from '@/stores/dataStore';
import { cities, jobTypes, grades } from '@/data/mockData';

export default function ReferralHall() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters, setFilter, resetFilters, getFilteredReferrals } = useReferralStore();
  const { user, isAuthenticated } = useAuthStore();
  const { getBlockedUserIds } = useBlockStore();
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const keyword = searchParams.get('keyword');
    if (keyword) {
      setFilter('keyword', keyword);
    }
  }, [searchParams, setFilter]);

  const blockedUserIds = isAuthenticated && user ? getBlockedUserIds(user.id) : [];
  
  const filteredReferrals = getFilteredReferrals().filter(
    (referral) => !blockedUserIds.includes(referral.posterId)
  );

  const handleSearch = (value: string) => {
    setFilter('keyword', value);
  };

  const handleClearFilters = () => {
    resetFilters();
    setSearchParams({});
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return '已截止';
    if (diffDays <= 7) return `${diffDays}天后截止`;
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  };

  const hasActiveFilters = filters.city || filters.jobType || filters.grade || filters.keyword;

  const cityOptions = [{ value: '', label: '全部城市' }, ...cities.map((c) => ({ value: c, label: c }))];
  const jobTypeOptions = [{ value: '', label: '全部类型' }, ...jobTypes.map((t) => ({ value: t.value, label: t.label }))];
  const gradeOptions = [{ value: '', label: '全部年级' }, ...grades.map((g) => ({ value: g.value.toString(), label: g.label }))];

  return (
    <div className="min-h-[calc(100vh-64px)] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索公司、岗位或城市..."
              value={filters.keyword}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 transition-colors text-gray-900"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-5 h-5" />
            筛选
            {hasActiveFilters && <span className="w-2 h-2 bg-[#F5A623] rounded-full" />}
          </button>

          <div className={`lg:flex gap-4 ${showFilters ? 'flex' : 'hidden'} flex-col lg:flex-row flex-wrap`}>
            <div className="w-full lg:w-40">
              <Select
                options={cityOptions}
                value={filters.city}
                onChange={(e) => setFilter('city', e.target.value)}
              />
            </div>
            <div className="w-full lg:w-40">
              <Select
                options={jobTypeOptions}
                value={filters.jobType}
                onChange={(e) => setFilter('jobType', e.target.value)}
              />
            </div>
            <div className="w-full lg:w-44">
              <Select
                options={gradeOptions}
                value={filters.grade?.toString() || ''}
                onChange={(e) => setFilter('grade', e.target.value ? parseInt(e.target.value) : null)}
              />
            </div>
            {hasActiveFilters && (
              <Button variant="ghost" onClick={handleClearFilters} className="whitespace-nowrap">
                <X className="w-4 h-4 mr-1" />
                清除筛选
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500">
            共找到 <span className="font-semibold text-gray-900">{filteredReferrals.length}</span> 个内推岗位
          </p>
        </div>

        {filteredReferrals.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">没有找到匹配的岗位</h3>
            <p className="text-gray-500 mb-4">尝试调整筛选条件或搜索关键词</p>
            <Button variant="outline" onClick={handleClearFilters}>清除筛选</Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredReferrals.map((referral, index) => (
              <Card
                key={referral.id}
                hover
                onClick={() => navigate(`/referrals/${referral.id}`)}
                className="p-5"
                style={{ opacity: 0, animation: `slideUp 0.3s ease-out ${0.05 * index}s forwards` }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <img
                    src={referral.companyLogo}
                    alt={referral.companyName}
                    className="w-14 h-14 rounded-xl object-cover bg-gray-100 flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/56?text=Logo';
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">{referral.jobTitle}</h3>
                      <Badge variant={referral.jobType === 'internship' ? 'secondary' : 'primary'}>
                        {referral.jobType === 'internship' ? '实习' : referral.jobType === 'campus' ? '校招' : '社招'}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="font-medium">{referral.companyName}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {referral.city}
                      </span>
                      <span>{referral.salary}</span>
                      <span className="text-gray-400">|</span>
                      <span>{referral.gradeRequired}届</span>
                      <span className="text-gray-400">|</span>
                      <span>{referral.majorRequired}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 flex-shrink-0">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-[#E53E3E] font-medium">
                        <Clock className="w-4 h-4" />
                        {formatDate(referral.deadline)}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-400 mt-1">
                        <Users className="w-4 h-4" />
                        {referral.applicantCount}人已申请
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <img
                      src={referral.poster?.avatar}
                      alt={referral.poster?.nickname}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm text-gray-500">
                      推荐人：{referral.poster?.nickname}
                      {referral.poster?.certification && (
                        <span className="text-[#1E3A5F]"> · {referral.poster.certification.schoolName}</span>
                      )}
                    </span>
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

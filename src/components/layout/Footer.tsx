import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1E3A5F] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <span className="text-xl font-bold">校</span>
              </div>
              <span className="text-xl font-bold">校友内推</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-md">
              校友内推是一个连接高校校友的实习和校招内推平台。我们致力于打破信息壁垒，
              让优质的内推资源在校友网络中高效流动，帮助更多人找到理想的工作机会。
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="/referrals" className="hover:text-white transition-colors">内推大厅</a></li>
              <li><a href="/circle" className="hover:text-white transition-colors">校友圈</a></li>
              <li><a href="/certification" className="hover:text-white transition-colors">校友认证</a></li>
              <li><a href="/profile" className="hover:text-white transition-colors">个人中心</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">联系我们</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>邮箱：contact@xiaoneitui.com</li>
              <li>合作：bd@xiaoneitui.com</li>
              <li>地址：北京市海淀区中关村</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/50">
            © 2024 校友内推. 保留所有权利.
          </p>
          <p className="text-sm text-white/50 flex items-center gap-1">
            用 <Heart className="w-4 h-4 text-[#E53E3E] fill-current" /> 打造
          </p>
        </div>
      </div>
    </footer>
  );
}

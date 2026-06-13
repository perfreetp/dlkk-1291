import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Certification from '@/pages/Certification';
import ReferralHall from '@/pages/ReferralHall';
import JobDetail from '@/pages/JobDetail';
import PostReferral from '@/pages/PostReferral';
import Applications from '@/pages/Applications';
import AlumniCircle from '@/pages/AlumniCircle';
import PostArticle from '@/pages/PostArticle';
import Notifications from '@/pages/Notifications';
import Profile from '@/pages/Profile';
import ResumeManagement from '@/pages/ResumeManagement';
import BlockManagement from '@/pages/BlockManagement';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/certification" element={<Certification />} />
            <Route path="/referrals" element={<ReferralHall />} />
            <Route path="/referrals/:id" element={<JobDetail />} />
            <Route path="/referrals/post" element={<PostReferral />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/circle" element={<AlumniCircle />} />
            <Route path="/circle/post" element={<PostArticle />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/resumes" element={<ResumeManagement />} />
            <Route path="/profile/blocks" element={<BlockManagement />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

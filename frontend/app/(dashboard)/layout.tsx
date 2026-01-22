import type { ReactNode } from 'react';
import TopBar from '@/components/dashboard/TopBar';
import BottomNav from '@/components/dashboard/BottomNav';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className='min-h-screen bg-[#0b1a12] text-white flex flex-col'>
      {/* 상단 헤더 */}
      <TopBar />

      {/* 메인 콘텐츠 */}
      <main className='flex-1 overflow-y-auto px-4 pb-24'>{children}</main>

      {/* 하단 네비게이션 (모바일 중심) */}
      <BottomNav />
    </div>
  );
}

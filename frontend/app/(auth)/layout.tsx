import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className='min-h-screen flex items-center justify-center bg-[#0b1a12] text-white'>
      {/* 배경 패턴 */}
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#1f3d2b_1px,transparent_0)] bg-[size:24px_24px] opacity-40' />

      {/* 인증 카드 */}
      <div className='relative z-10 w-full max-w-md px-6'>{children}</div>
    </div>
  );
}

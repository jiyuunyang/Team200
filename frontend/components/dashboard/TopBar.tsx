// components/dashboard/TopBar.tsx
import { Settings } from 'lucide-react';

export default function TopBar() {
  return (
    <header className='h-14 flex items-center justify-between px-4 border-b border-green-900/40'>
      <div className='flex items-center gap-2'>
        <span className='text-green-400'>🔋</span>
        <h1 className='font-semibold'>배터리 헬스 대시보드</h1>
      </div>

      <button className='text-gray-400 hover:text-green-400'>
        <Settings size={20} />
      </button>
    </header>
  );
}

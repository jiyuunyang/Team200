// components/dashboard/BottomNav.tsx
'use client';

import { LayoutGrid, BarChart2, Bell, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/dashboard', label: '대시보드', icon: LayoutGrid },
  { href: '/analysis', label: '분석', icon: BarChart2 },
  { href: '/alerts', label: '알림', icon: Bell },
  { href: '/settings', label: '설정', icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className='fixed bottom-0 left-0 right-0 h-16 bg-[#0b1a12] border-t border-green-900/40 flex justify-around items-center'>
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <a
            key={href}
            href={href === '/analysis' ? '/dashboard' : href}
            className={`flex flex-col items-center text-xs ${
              active ? 'text-green-400' : 'text-gray-500'
            }`}
          >
            <Icon size={20} />
            {label}
          </a>
        );
      })}
    </nav>
  );
}

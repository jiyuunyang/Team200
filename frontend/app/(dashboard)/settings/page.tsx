'use client';

import SettingItem from '@/components/dashboard/setting/SettingItem';
import SettingSection from '@/components/dashboard/setting/SettingSection';

export default function SettingsPage() {
  async function handleLogout() {
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    const result = await res.json();

    if (result.success) {
      // 로그아웃 후 루트 페이지 이동
      window.location.href = '/';
    } else {
      alert('로그아웃 실패');
    }
  }

  return (
    <div className='space-y-6 pt-6'>
      <h1 className='text-xl font-semibold'>설정</h1>

      <SettingSection title='계정'>
        <SettingItem label='이메일' value='engineer@battery.com' />
        <SettingItem label='비밀번호 변경' action={() => {}} />
      </SettingSection>

      <SettingSection title='알림'>
        <SettingItem label='이메일 알림' action={() => {}} />
        <SettingItem label='위험 알림 푸시' action={() => {}} />
      </SettingSection>

      <SettingSection title='시스템'>
        <SettingItem label='로그아웃' action={handleLogout} danger />
      </SettingSection>
    </div>
  );
}

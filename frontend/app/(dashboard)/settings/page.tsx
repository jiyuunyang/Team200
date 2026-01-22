import SettingItem from '@/components/dashboard/SettingItem';
import SettingSection from '@/components/dashboard/SettingSection';

export default function SettingsPage() {
  return (
    <div className='space-y-6 pt-6'>
      <h1 className='text-xl font-semibold'>설정</h1>

      <SettingSection title='계정'>
        <SettingItem label='이메일' value='engineer@battery.com' />
        <SettingItem label='비밀번호 변경' action='변경' />
      </SettingSection>

      <SettingSection title='알림'>
        <SettingItem label='이메일 알림' action='ON' />
        <SettingItem label='위험 알림 푸시' action='ON' />
      </SettingSection>

      <SettingSection title='시스템'>
        <SettingItem label='로그아웃' action='로그아웃' danger />
      </SettingSection>
    </div>
  );
}

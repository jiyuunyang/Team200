import AlertCard from '@/components/dashboard/AlertCard';
import SOHRing from '@/components/dashboard/SOHRing';
import RULCard from '@/components/dashboard/RULCard';

export default async function DashboardPage() {
  const summary = {
    soh: 94,
    rul: 14,
    alert: '배터리 온도 편차 감지',
  };

  return (
    <div className='space-y-6 pt-6'>
      {/* 알림 카드 */}
      <AlertCard message={summary.alert} />

      {/* SOH */}
      <SOHRing value={summary.soh} />

      {/* RUL 카드 */}
      <div className='grid grid-cols-2 gap-4'>
        <RULCard title='예상 잔여 수명' value={`${summary.rul}개월`} />
        <RULCard title='열화 속도' value='안정' />
      </div>
    </div>
  );
}

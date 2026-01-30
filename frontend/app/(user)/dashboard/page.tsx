import AlertCard from '@/components/alerts/AlertCard';
import AddBatteryButton from '@/components/dashboard/AddBatteryButton';
import BatteryListSection from '@/components/dashboard/BatteryListSection';

export default async function DashboardPage() {
  // 임시 알림 데이터
  const alert = {
    message: '배터리 온도 편차 감지',
  };
  // 임시 배터리 데이터
  const batteryList = [
    { title: '배터리1', checked: '2022-05-15', rul: 10 },
    { title: '배터리2', checked: '2023-04-03', rul: 30 },
    { title: '배터리3', checked: '2024-06-03', rul: 60 },
  ];

  return (
    <div className='space-y-6 pt-6'>
      {/* 알림 카드 */}
      <AlertCard message={alert.message} />
      <BatteryListSection batteryList={batteryList} />
      <AddBatteryButton />
    </div>
  );
}

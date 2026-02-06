import { BatteryData } from '@/lib/service/battery';
import BatteryCard from './BatteryCard';

export default function BatteryListSection({
  batteryList,
}: {
  batteryList: BatteryData[];
}) {
  return (
    <section className='px-5 flex flex-col gap-4'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-lg font-bold'>관리 중인 배터리</h2>
        <span className='px-3 py-1 text-xs rounded-full bg-green-400/20 text-green-400 font-bold'>
          ● 실시간
        </span>
      </div>
      {batteryList &&
        batteryList.map((battery) => (
          <BatteryCard
            //TODO: 배터리 이름, 마지막 측정일, RUL 데이터로 변경 필요
            key={battery.id}
            id={battery.id}
            title={battery.battery_name}
            checked={battery.has_data ? '데이터 있음' : '데이터 없음'}
            rul={battery.id}
          />
        ))}
    </section>
  );
}

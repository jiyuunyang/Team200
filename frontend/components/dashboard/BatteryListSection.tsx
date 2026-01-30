import BatteryCard from './BatteryCard';

export default function BatteryListSection({
  batteryList,
}: {
  batteryList: { title: string; checked: string; rul: number }[];
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
        batteryList.map((battery, index) => (
          <BatteryCard
            key={index}
            title={battery.title}
            checked={battery.checked}
            rul={battery.rul}
          />
        ))}
    </section>
  );
}

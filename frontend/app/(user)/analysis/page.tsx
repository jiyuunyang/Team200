import MetricCard from '@/components/analysis/MetricCard';
import SOHTrendChart from '@/components/analysis/SOHTrendChart';

export default async function DetailPage({
  params,
}: {
  params: { batteryId: string };
}) {
  return (
    <div className='space-y-6 pt-4'>
      {/* SOH 요약 */}
      <section>
        <p className='text-3xl font-bold'>
          92.4% <span className='text-green-400 text-sm'>+0.2%</span>
        </p>
        <p className='text-sm text-gray-400'>현재 배터리 성능 상태 (SOH)</p>
      </section>

      {/* 기간 필터 */}
      <div className='flex gap-2'>
        {['1개월', '3개월', '6개월', '1년'].map((label) => (
          <button
            key={label}
            className={`px-4 py-2 rounded-full text-sm ${
              label === '3개월'
                ? 'bg-green-700 text-white'
                : 'bg-green-900/30 text-gray-400'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 차트 */}
      <SOHTrendChart />

      {/* AI 요약 */}
      <div className='rounded-xl bg-green-900/30 p-4 text-sm'>
        ✨ 현재의 방전 및 열화 패턴을 분석한 결과, 예상 잔여 수명(RUL)은 약{' '}
        <span className='text-green-400 font-semibold'>14개월</span>입니다.
      </div>

      {/* 내부 지표 */}
      <section>
        <h2 className='font-semibold mb-3'>내부 지표 상세</h2>
        <div className='grid grid-cols-2 gap-4'>
          <MetricCard title='내부 저항 (Re)' value='42.8 mΩ' status='정상' />
          <MetricCard
            title='전하 전달 저항 (Rct)'
            value='15.2 mΩ'
            status='주의'
          />
          <MetricCard title='용량 감소율' value='7.6 %' status='안정' />
          <MetricCard title='열적 편차' value='1.4 ℃' status='최적' />
        </div>
      </section>
    </div>
  );
}

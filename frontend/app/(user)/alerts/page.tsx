import AlertItem from '@/components/alerts/AlertItem';

export default function AlertsPage() {
  return (
    <div className='space-y-4 pt-6'>
      <h1 className='text-xl font-semibold'>알림</h1>

      <AlertItem
        title='온도 이상 감지'
        description='배터리 셀 3번에서 비정상적인 온도 상승이 감지되었습니다.'
        level='warning'
      />

      <AlertItem
        title='SOH 급격한 감소'
        description='최근 24시간 동안 SOH가 2.1% 감소했습니다.'
        level='critical'
      />

      <AlertItem
        title='시스템 점검 완료'
        description='정기 진단이 정상적으로 완료되었습니다.'
        level='info'
      />
    </div>
  );
}

export default function LoginForm() {
  return (
    <div className='space-y-8'>
      {/* 헤더 */}
      <div>
        <p className='text-sm text-green-400 tracking-widest'>
          BATTERY INTELLIGENCE
        </p>
        <h1 className='mt-2 text-4xl font-bold'>
          시스템 <span className='text-green-400'>접속</span>
        </h1>
        <p className='mt-3 text-sm text-gray-400'>
          실시간 SOH 및 잔여 수명(RUL) 예측 모니터링을 위해 로그인해 주세요.
        </p>
      </div>

      {/* 폼 */}
      <form className='space-y-4'>
        <input
          type='email'
          placeholder='engineer@battery-monitor.com'
          className='w-full rounded-xl bg-black/30 border border-green-900 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500'
        />

        <input
          type='password'
          placeholder='••••••••'
          className='w-full rounded-xl bg-black/30 border border-green-900 px-4 py-3'
        />

        <button className='w-full flex items-center justify-center gap-2 rounded-xl bg-green-400 py-4 font-semibold text-black hover:bg-green-300'>
          로그인 ⚡
        </button>
      </form>
    </div>
  );
}

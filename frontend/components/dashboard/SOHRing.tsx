// components/dashboard/SOHRing.tsx
export default function SOHRing({ value }: { value: number }) {
  return (
    <div className='rounded-xl bg-green-900/30 p-6 text-center'>
      <p className='text-sm text-gray-400'>SOH</p>
      <p className='text-4xl font-bold text-green-400'>{value}%</p>
      <p className='text-xs text-gray-400 mt-1'>상태 양호</p>
    </div>
  );
}

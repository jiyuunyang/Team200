export default function MetricCard({
  title,
  value,
  status,
}: {
  title: string;
  value: string;
  status: string;
}) {
  return (
    <div className='rounded-xl bg-green-900/20 p-4 space-y-2'>
      <p className='text-sm text-gray-400'>{title}</p>
      <p className='text-xl font-semibold'>{value}</p>
      <span className='text-xs text-green-400'>{status}</span>
    </div>
  );
}

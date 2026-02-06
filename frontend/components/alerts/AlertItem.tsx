export default function AlertItem({
  title,
  description,
  level,
}: {
  title: string;
  description: string;
  level: 'info' | 'warning' | 'critical';
}) {
  const color =
    level === 'critical'
      ? 'border-red-500 text-red-400'
      : level === 'warning'
        ? 'border-yellow-500 text-yellow-400'
        : 'border-green-500 text-green-400';

  return (
    <div className={`rounded-xl border-l-4 bg-green-900/20 p-4 ${color}`}>
      <p className='font-semibold'>{title}</p>
      <p className='text-sm text-gray-400 mt-1'>{description}</p>
    </div>
  );
}

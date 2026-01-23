// components/dashboard/RULCard.tsx
export default function RULCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className='rounded-xl bg-green-900/20 p-4 space-y-2'>
      <p className='text-sm text-gray-400'>{title}</p>
      <p className='text-xl font-semibold'>{value}</p>
    </div>
  );
}

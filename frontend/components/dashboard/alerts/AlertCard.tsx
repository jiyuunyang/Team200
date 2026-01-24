export default function AlertCard({ message }: { message: string }) {
  return (
    <div className='rounded-xl bg-red-900/30 p-4 text-sm'>⚠️ {message}</div>
  );
}

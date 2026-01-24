export default function Input({ label, ...props }: any) {
  return (
    <div className='space-y-1'>
      <label className='text-sm'>{label}</label>
      <input
        {...props}
        className='w-full rounded-xl bg-black/30 border border-green-900 px-4 py-3'
      />
    </div>
  );
}

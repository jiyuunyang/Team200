export default function SettingSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className='space-y-2'>
      <h2 className='text-sm text-gray-400'>{title}</h2>
      <div className='rounded-xl bg-green-900/20 divide-y divide-green-900/40'>
        {children}
      </div>
    </section>
  );
}

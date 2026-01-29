export default function SettingSwitch({
  label,
  value,
  action,
}: {
  label: string;
  value?: string;
  action?: () => void;
}) {
  return (
    <div className='flex items-center justify-between px-4 py-3'>
      <span>{label}</span>

      {value && <span className='text-sm text-gray-400'>{value}</span>}

      {action && (
        <label className='relative inline-flex items-center cursor-pointer'>
          <input type='checkbox' className='sr-only peer' onChange={action} />

          <div
            className="
              w-11 h-6 rounded-full relative
              bg-slate-200 dark:bg-slate-700
              peer-focus:outline-none
              peer-checked:bg-green-400

              after:content-['']
              after:absolute after:top-[2px] after:left-[2px]
              after:h-5 after:w-5 after:rounded-full
              after:bg-white after:border after:border-gray-300
              after:transition-all

              peer-checked:after:translate-x-full
            "
          />
        </label>
      )}
    </div>
  );
}

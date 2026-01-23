export default function SettingItem({
  label,
  value,
  action,
  danger,
}: {
  label: string;
  value?: string;
  action?: () => void;
  danger?: boolean;
}) {
  return (
    <div className='flex items-center justify-between px-4 py-3'>
      <span className={danger ? 'text-red-400' : ''}>{label}</span>
      {value && <span className='text-sm text-gray-400'>{value}</span>}
      {action && (
        <button
          className={`text-sm ${danger ? 'text-red-400' : 'text-green-400'}`}
          onClick={action}
        >
          {label}
        </button>
      )}
    </div>
  );
}

export default function Condition({
  text,
  checked,
}: {
  text: string;
  checked?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-1 ${checked ? 'text-green-400' : ''}`}
    >
      ● {text}
    </div>
  );
}

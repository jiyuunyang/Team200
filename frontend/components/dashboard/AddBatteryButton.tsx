'use client';

import { useState } from 'react';
import { AddBatteryDialog } from './AddBatteryDialog';

export default function AddBatteryButton() {
  const [open, setOpen] = useState(false);

  return (
    <section className='px-5 mt-3'>
      <div
        onClick={() => setOpen(true)}
        className='border-2 border-dashed border-zinc-700 rounded-3xl 
        py-10 flex flex-col items-center gap-3 text-zinc-500 cursor-pointer'
      >
        <div className='w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-[#22c55e] text-2xl'>
          +
        </div>
        새 배터리 추가
      </div>
      {open && <AddBatteryDialog onClose={() => setOpen(false)} />}
    </section>
  );
}

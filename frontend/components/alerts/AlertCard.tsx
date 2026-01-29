export default function AlertCard({ message }: { message: string }) {
  return (
    <section className='px-6 mt-6'>
      <div className='border border-orange-500/40 bg-orange-500/10 rounded-2xl p-5'>
        <p className='text-orange-400 font-bold flex items-center gap-2'>
          ⚠️ {message}
        </p>
        <div className='flex justify-end mt-3'>
          <button className=' text-green-400 font-semibold'>상세보기 →</button>
        </div>
      </div>
    </section>
  );
}

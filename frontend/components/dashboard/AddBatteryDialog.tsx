'use client';

export function AddBatteryDialog({ onClose }: { onClose: () => void }) {
  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/60'
      onClick={onClose}
    >
      {/* Modal Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className='
          w-[90%] max-w-md
          bg-[#0f1f14]
          rounded-3xl
          p-6
          animate-modalIn
        '
      >
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-xl font-bold'>새 배터리 등록</h2>
          <button
            onClick={onClose}
            className='text-zinc-400 text-xl hover:text-white cursor-pointer'
          >
            ✕
          </button>
        </div>

        {/* Input */}
        <label className='block text-sm mb-2'>배터리 이름 입력</label>
        <input
          placeholder='예: 배터리 #3'
          className='
            w-full rounded-xl
            bg-[#132a1b]
            border border-green-900
            px-4 py-3 mb-6
            outline-none
            focus:border-green-400
          '
        />

        {/* Upload */}
        <div className='border-2 border-dashed border-green-900 rounded-2xl p-6 text-center mb-6 cursor-pointer'>
          <div className='w-14 h-14 mx-auto mb-4 rounded-full bg-green-900/40 flex items-center justify-center text-green-400 text-2xl'>
            ⬆
          </div>
          <p className='font-semibold'>파일 선택 또는 드래그</p>
          <p className='text-sm text-zinc-400 mt-1'>
            CSV, JSON 형식의 데이터 파일
          </p>
          <button className='mt-4 px-6 py-2 rounded-full bg-green-900/60 text-green-400 font-bold'>
            파일 찾기
          </button>
        </div>

        {/* Info */}
        <div className='flex gap-2 text-sm text-green-300 bg-green-900/30 p-4 rounded-xl mb-6'>
          ℹ 업로드된 데이터는 예측 분석에 사용됩니다.
        </div>

        {/* Submit */}
        <button className='w-full py-4 rounded-2xl bg-green-400 text-black font-bold text-lg cursor-pointer'>
          추가하기
        </button>
      </div>
    </div>
  );
}

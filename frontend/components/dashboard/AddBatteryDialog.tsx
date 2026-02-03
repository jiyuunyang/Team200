"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export function AddBatteryDialog({ onClose }: { onClose: () => void }) {
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [dragOver, setDragOver] = useState(false);
	const [uploadedFile, setUploadedFile] = useState<File | null>(null);
	const [batteryName, setBatteryName] = useState("");

	// 파일 처리
	const handleFiles = (files: FileList | null) => {
		if (!files || files.length === 0) return;
		setUploadedFile(files[0]);
	};

	// 서버 전송
	const handleSubmit = async () => {
		if (!batteryName.trim()) {
			alert("배터리 이름을 입력하세요!");
			return;
		}
		if (!uploadedFile) {
			alert("파일을 업로드하세요!");
			return;
		}

		const formData = new FormData();
		formData.append("battery_name", batteryName);
		formData.append("battery_file", uploadedFile);

		try {
			const res = await fetch("/api/batteries/uploads", {
				method: "POST",
				body: formData,
			});
			const result = await res.json();
			if (result.success) {
				alert("등록 완료!");
				router.refresh();
				onClose();
			} else {
				alert(result.message);
			}
		} catch (error) {
			console.error(error);
			alert("등록 중 오류가 발생했습니다.");
		}
	};

	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center bg-black/60'
			onClick={onClose}
		>
			<div
				onClick={(e) => e.stopPropagation()}
				className='w-[90%] max-w-md bg-[#0f1f14] rounded-3xl p-6 animate-modalIn'
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

				{/* Battery Name Input */}
				<label className='block text-sm mb-2'>배터리 이름 입력</label>
				<input
					placeholder='예: 배터리 #3'
					value={batteryName}
					onChange={(e) => setBatteryName(e.target.value)}
					className='w-full rounded-xl bg-[#132a1b] border border-green-900 px-4 py-3 mb-6 outline-none focus:border-green-400'
				/>

				{/* Upload Section */}
				<div
					className={`
            border-2 border-dashed rounded-2xl p-6 text-center mb-6
            ${dragOver ? "border-green-400 bg-green-900/20" : "border-green-900"}
            cursor-pointer
          `}
					onClick={() => fileInputRef.current?.click()}
					onDragOver={(e) => {
						e.preventDefault();
						setDragOver(true);
					}}
					onDragLeave={() => setDragOver(false)}
					onDrop={(e) => {
						e.preventDefault();
						setDragOver(false);
						handleFiles(e.dataTransfer.files);
					}}
				>
					<input
						type='file'
						accept='.csv,.json'
						ref={fileInputRef}
						hidden
						onChange={(e) => handleFiles(e.target.files)}
					/>

					<div className='w-14 h-14 mx-auto mb-4 rounded-full bg-green-900/40 flex items-center justify-center text-green-400 text-2xl'>
						⬆
					</div>

					{uploadedFile ? (
						<>
							<p className='font-semibold text-green-300'>
								{uploadedFile.name}
							</p>
							<p className='text-sm text-zinc-400 mt-1'>업로드 완료</p>
						</>
					) : (
						<>
							<p className='font-semibold'>파일 선택 또는 드래그</p>
							<p className='text-sm text-zinc-400 mt-1'>
								CSV, JSON 형식의 데이터 파일
							</p>
							<button className='mt-4 px-6 py-2 rounded-full bg-green-900/60 text-green-400 font-bold cursor-pointer'>
								파일 찾기
							</button>
						</>
					)}
				</div>

				{/* Info */}
				<div className='flex gap-2 text-sm text-green-300 bg-green-900/30 p-4 rounded-xl mb-6'>
					ℹ 업로드된 데이터는 예측 분석에 사용됩니다.
				</div>

				{/* Submit */}
				<button
					onClick={handleSubmit}
					className='w-full py-4 rounded-2xl bg-green-400 text-black font-bold text-lg cursor-pointer'
				>
					추가하기
				</button>
			</div>
		</div>
	);
}

// components/analysis/UploadSelect.tsx
"use client";

import type { UploadRow } from "@/lib/service/client/batteryUploads.client";

function fmtMinute(iso: string) {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return iso;
	const yyyy = d.getFullYear();
	const mm = String(d.getMonth() + 1).padStart(2, "0");
	const dd = String(d.getDate()).padStart(2, "0");
	const hh = String(d.getHours()).padStart(2, "0");
	const mi = String(d.getMinutes()).padStart(2, "0");
	return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}

export default function UploadSelect({
	uploads,
	selectedUploadId,
	loading,
	err,
	onPick,
}: {
	uploads: UploadRow[];
	selectedUploadId: number | null;
	loading: boolean;
	err: string | null;
	onPick: (uploadId: number) => void;
}) {
	const selected = uploads.find((u) => u.id === selectedUploadId) ?? null;

	return (
		<section className='rounded-xl border border-green-900/40 bg-green-900/20 p-4'>
			<div className='flex items-center justify-between gap-3'>
				<div>
					<div className='text-sm font-semibold text-gray-200'>데이터 선택</div>
					<div className='text-xs text-gray-500'>
						{uploads.length
							? "업로드 시각(분) 기준으로 선택하세요. 최신이 기본 적용됩니다."
							: "업로드된 데이터가 없습니다."}
					</div>
				</div>
				{loading && <div className='text-xs text-gray-400'>로딩중...</div>}
			</div>

			{err && <div className='mt-3 text-sm text-red-400'>{err}</div>}

			<div className='mt-4'>
				<select
					value={selectedUploadId ?? ""}
					onChange={(e) => onPick(Number(e.target.value))}
					disabled={uploads.length === 0 || loading}
					className='w-full rounded-xl border border-green-900/40 bg-black/20 px-3 py-2 text-sm text-gray-200 outline-none focus:ring-2 focus:ring-green-500/40 disabled:opacity-60'
				>
					{uploads.length === 0 ? (
						<option value=''>선택할 데이터 없음</option>
					) : (
						uploads.map((u, idx) => (
							<option key={u.id} value={u.id} className='text-black'>
								{idx === 0 ? "[최신] " : ""}
								{fmtMinute(u.uploaded_at)}
							</option>
						))
					)}
				</select>

				{selected && (
					<div className='mt-2 text-xs text-gray-500'>
						{selected.file_ext} · {selected.file_size} bytes
					</div>
				)}
			</div>
		</section>
	);
}

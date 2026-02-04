// hooks/useBatteryUploadSeries.ts
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
	parseCycleCsv,
	CyclePoint,
} from "@/components/analysis/cycle/parseCsv";
import {
	fetchUploadsClient,
	downloadUploadCsvTextClient,
	type UploadRow,
} from "@/lib/service/client/batteryUploads.client";

export function useBatteryUploadSeries(batteryId: number) {
	const [uploads, setUploads] = useState<UploadRow[]>([]);
	const [selectedUploadId, setSelectedUploadId] = useState<number | null>(null);
	const [series, setSeries] = useState<CyclePoint[]>([]);
	const [loadingList, setLoadingList] = useState(false);
	const [loadingSeries, setLoadingSeries] = useState(false);
	const [err, setErr] = useState<string | null>(null);

	const selected = useMemo(
		() => uploads.find((u) => u.id === selectedUploadId) ?? null,
		[uploads, selectedUploadId],
	);

	const loadUpload = useCallback(
		async (uploadId: number) => {
			setSelectedUploadId(uploadId);
			setLoadingSeries(true);
			setErr(null);

			try {
				const text = await downloadUploadCsvTextClient(batteryId, uploadId);
				setSeries(parseCycleCsv(text));
			} catch (e: any) {
				setErr(e?.message || "error");
			} finally {
				setLoadingSeries(false);
			}
		},
		[batteryId],
	);

	useEffect(() => {
		if (!batteryId || Number.isNaN(batteryId)) return;

		let alive = true;
		setLoadingList(true);
		setErr(null);

		(async () => {
			try {
				const list = await fetchUploadsClient(batteryId);
				if (!alive) return;

				setUploads(list);

				if (!list.length) {
					setSelectedUploadId(null);
					setSeries([]);
					return;
				}

				// 최신 자동 선택 (서버가 최신순으로 내려준다는 전제: list[0])
				await loadUpload(list[0].id);
			} catch (e: any) {
				if (!alive) return;
				setErr(e?.message || "error");
			} finally {
				if (!alive) return;
				setLoadingList(false);
			}
		})();

		return () => {
			alive = false;
		};
	}, [batteryId, loadUpload]);

	return {
		uploads,
		selectedUploadId,
		selected,
		series,
		loading: loadingList || loadingSeries,
		loadingList,
		loadingSeries,
		err,
		loadUpload,
	};
}

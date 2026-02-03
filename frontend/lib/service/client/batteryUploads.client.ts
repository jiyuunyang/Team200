// lib/services/client/batteryUploads.client.ts
export type UploadRow = {
	id: number;
	battery_id: number;
	user_id: number;
	original_filename: string;
	stored_path: string;
	file_ext: string;
	file_size: number;
	uploaded_at: string; // ISO
};

type ApiEnvelope<T> = {
	success: boolean;
	message?: string;
	data?: T;
};

async function getJson<T>(url: string): Promise<T> {
	const res = await fetch(url, { cache: "no-store" });
	const json = (await res.json().catch(() => ({}))) as Partial<ApiEnvelope<T>>;

	if (!res.ok || !json?.success) {
		throw new Error(json?.message || `Request failed: ${res.status}`);
	}

	return (json.data ?? []) as T;
}

export async function fetchUploadsClient(
	batteryId: number,
): Promise<UploadRow[]> {
	return getJson<UploadRow[]>(`/api/batteries/${batteryId}/uploads`);
}

export async function downloadUploadCsvTextClient(
	batteryId: number,
	uploadId: number,
): Promise<string> {
	const res = await fetch(
		`/api/batteries/${batteryId}/uploads/${uploadId}/download`,
		{ cache: "no-store" },
	);
	if (!res.ok) throw new Error("download failed");
	return res.text();
}

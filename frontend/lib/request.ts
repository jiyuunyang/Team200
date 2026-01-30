export type ApiResponse<T = any> = {
	success: boolean;
	message?: string;
	data?: T;
};

const API_URL = process.env.API_URL;

export async function apiRequest<T>(
	endpoint: string,
	options: RequestInit = {},
): Promise<ApiResponse<T>> {
	try {
		const res = await fetch(`${API_URL}${endpoint}`, {
			headers: {
				"Content-Type": "application/json",
				...(options.headers || {}),
			},
			...options,
		});

		const result = await res.json();
		if (!res.ok)
			return { success: false, message: result.message || "에러 발생" };
		return { success: true, message: result.message, data: result };
	} catch (err) {
		console.error("API 호출 오류:", err);
		return { success: false, message: "네트워크 오류" };
	}
}

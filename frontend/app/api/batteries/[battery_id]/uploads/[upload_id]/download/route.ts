import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(
	req: Request,
	{ params }: { params: Promise<{ battery_id: string; upload_id: string }> },
) {
	const { battery_id, upload_id } = await params;

	const token = (await cookies()).get("accessToken")?.value;
	if (!token) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	const res = await fetch(
		`${process.env.API_URL}/batteries/${battery_id}/uploads/${upload_id}/download`,
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	);

	if (!res.ok) {
		const msg = await res.text();
		return NextResponse.json({ message: msg }, { status: res.status });
	}

	// 그대로 스트리밍
	return new Response(await res.arrayBuffer(), {
		headers: {
			"Content-Type": "text/csv",
		},
	});
}

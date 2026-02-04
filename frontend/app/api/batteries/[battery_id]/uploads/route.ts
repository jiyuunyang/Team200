import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getBatteryUploads } from "@/lib/service/battery";

export async function GET(
	_req: Request,
	context: { params: Promise<{ battery_id: string }> },
) {
	const token = (await cookies()).get("accessToken")?.value;
	if (!token) {
		return NextResponse.json(
			{ success: false, message: "Unauthorized" },
			{ status: 401 },
		);
	}

	const { battery_id } = await context.params;
	const batteryId = Number(battery_id);

	if (Number.isNaN(batteryId)) {
		return NextResponse.json(
			{ success: false, message: "Invalid battery_id" },
			{ status: 400 },
		);
	}

	const result = await getBatteryUploads(batteryId, token);
	return NextResponse.json(result, { status: result.success ? 200 : 400 });
}

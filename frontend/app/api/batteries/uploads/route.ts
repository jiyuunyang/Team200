// frontend/app/api/batteries/uploads/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { uploadBatteryFile } from "@/lib/service/battery";

export async function POST(req: Request) {
	const token = (await cookies()).get("accessToken")?.value;
	if (!token) {
		return NextResponse.json(
			{ success: false, message: "Unauthorized" },
			{ status: 401 },
		);
	}

	const formData = await req.formData();

	// 방어 체크(선택)
	const batteryName = formData.get("battery_name");
	const file = formData.get("battery_file");
	console.log("file:", file);
	if (typeof batteryName !== "string" || !batteryName.trim()) {
		return NextResponse.json(
			{ success: false, message: "battery_name is required" },
			{ status: 400 },
		);
	}
	if (!(file instanceof File)) {
		return NextResponse.json(
			{ success: false, message: "file is required" },
			{ status: 400 },
		);
	}

	const result = await uploadBatteryFile(formData, token);
	return NextResponse.json(result, { status: result.success ? 201 : 400 });
}

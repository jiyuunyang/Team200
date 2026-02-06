import { NextResponse } from "next/server";
import { signup } from "@/lib/service/auth";

export async function POST(req: Request) {
	const { name, email, password } = await req.json();
	const result = await signup({ name, email, password });
	return NextResponse.json(result, { status: result.success ? 200 : 400 });
}

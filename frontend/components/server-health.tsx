import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { getHealth, postEcho, getMlHealth } from "../api/health.api";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export function ServerHealth() {
	const [health, setHealth] = useState(null);
	const [echo, setEcho] = useState(null);
	const [mlHealth, setMlHealth] = useState(null);

	useEffect(() => {
		getHealth().then(setHealth).catch(console.error);
		getMlHealth().then(setMlHealth).catch(console.error);
	}, []);

	const sendEcho = async () => {
		const res = await postEcho({
			message: "hello backend",
			at: new Date().toISOString(),
		});
		setEcho(res);
	};

	return (
		<Card className='bg-card border-border'>
			<CardHeader className='pb-3'>
				<CardTitle className='text-base font-semibold text-foreground flex items-center gap-2'>
					<AlertTriangle className='w-5 h-5 text-warning' />
					서빙 서버 상태
				</CardTitle>
				<pre>{JSON.stringify(health, null, 2)}</pre>
			</CardHeader>
			<Button onClick={sendEcho}>Echo</Button>
			<pre>{JSON.stringify(echo, null, 2)}</pre>
			<CardHeader className='pb-3'>
				<CardTitle className='text-base font-semibold text-foreground flex items-center gap-2'>
					<AlertTriangle className='w-5 h-5 text-warning' />
					ML 서버 상태
				</CardTitle>
				<pre>{JSON.stringify(mlHealth, null, 2)}</pre>
			</CardHeader>

			<CardContent className='space-y-3'></CardContent>
		</Card>
	);
}

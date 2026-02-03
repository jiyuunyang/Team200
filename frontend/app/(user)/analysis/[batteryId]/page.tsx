import AnalysisClient from "@/components/analysis/AnalysisClient";

export default async function DetailPage({
	params,
}: {
	params: Promise<{ batteryId: string }>;
}) {
	const { batteryId } = await params;
	const id = Number(batteryId);

	console.log("Rendering Analysis Page for batteryId:", id);

	return (
		<div className='space-y-6 pt-4'>
			<AnalysisClient batteryId={id} />
		</div>
	);
}

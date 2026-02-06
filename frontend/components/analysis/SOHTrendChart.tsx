"use client";

import React, { useMemo } from "react";
import {
	ResponsiveContainer,
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
} from "recharts";
import type { CyclePoint } from "@/components/analysis/cycle/parseCsv";

type ChartPoint = {
	time: number;
	voltage: number;
	temperature?: number;
};

function sampleData<T>(arr: T[], maxPoints = 1200) {
	if (arr.length <= maxPoints) return arr;
	const step = Math.ceil(arr.length / maxPoints);
	return arr.filter((_, i) => i % step === 0);
}

// 온도 키 후보들 (네 데이터에 맞춰서 하나로 고정 가능)
function pickTemp(p: any) {
	const cand =
		p?.temperature ??
		p?.temp ??
		p?.Temperature_measured ??
		p?.temperature_m ??
		p?.Temperature_m ??
		p?.t_c ??
		p?.T;
	const n = Number(cand);
	return Number.isFinite(n) ? n : undefined;
}

export default function VoltageTempCharts({
	series,
	height = 220,
	maxPoints = 1200,
}: {
	series: CyclePoint[];
	height?: number;
	maxPoints?: number;
}) {
	const { data, vMin, vMax, tMin, tMax, hasTemp } = useMemo(() => {
		const clean = series
			.map((p: any) => {
				const t = Number(p?.t);
				const v = Number(p?.v);
				if (!Number.isFinite(t) || !Number.isFinite(v)) return null;

				const temperature = pickTemp(p);

				const row: ChartPoint = { time: t, voltage: v };
				if (temperature !== undefined) row.temperature = temperature;
				return row;
			})
			.filter(Boolean) as ChartPoint[];

		clean.sort((a, b) => a.time - b.time);
		const sampled = sampleData(clean, maxPoints);

		if (sampled.length === 0) {
			return {
				data: [] as ChartPoint[],
				vMin: 0,
				vMax: 1,
				tMin: 0,
				tMax: 1,
				hasTemp: false,
			};
		}

		const vs = sampled.map((d) => d.voltage);
		const ts = sampled
			.map((d) => d.temperature)
			.filter((x): x is number => typeof x === "number" && Number.isFinite(x));

		const hasTemp = ts.length > 0;

		return {
			data: sampled,
			vMin: Math.min(...vs),
			vMax: Math.max(...vs),
			tMin: hasTemp ? Math.min(...ts) : 0,
			tMax: hasTemp ? Math.max(...ts) : 1,
			hasTemp,
		};
	}, [series, maxPoints]);

	// 공통 그리드/축 스타일
	const gridStroke = "rgba(255,255,255,0.12)";
	const yStroke = "rgba(255,255,255,0.35)";

	return (
		<div className='space-y-4'>
			{/* Voltage */}
			<div className='rounded-2xl border border-green-900/40 bg-green-900/10 p-4'>
				<div className='mb-2 flex items-end justify-between'>
					<div className='text-sm font-semibold text-gray-200'>
						Voltage curve
					</div>
					<div className='text-xs text-gray-500'>
						{data.length
							? `V: ${vMin.toFixed(2)} ~ ${vMax.toFixed(2)}`
							: "no data"}
					</div>
				</div>

				<div style={{ height }} className='w-full'>
					{data.length ? (
						<ResponsiveContainer width='100%' height='100%'>
							<AreaChart
								data={data}
								margin={{ top: 8, right: 8, bottom: 8, left: 0 }}
							>
								<defs>
									{/* ⚡ 전기 느낌 노랑 그라데이션 */}
									<linearGradient id='voltGlow' x1='0' y1='0' x2='0' y2='1'>
										<stop offset='5%' stopColor='#facc15' stopOpacity={0.28} />
										<stop offset='95%' stopColor='#facc15' stopOpacity={0} />
									</linearGradient>
								</defs>

								<CartesianGrid
									strokeDasharray='3 3'
									vertical={false}
									stroke={gridStroke}
								/>
								<XAxis dataKey='time' hide />
								<YAxis
									domain={["auto", "auto"]}
									fontSize={11}
									axisLine={false}
									tickLine={false}
									stroke={yStroke}
									width={38}
								/>

								<Tooltip
									contentStyle={{
										backgroundColor: "#0b1220",
										border: "1px solid rgba(250,204,21,0.28)",
										borderRadius: "14px",
										color: "#fff",
										boxShadow: "0 10px 15px -3px rgba(0,0,0,0.35)",
									}}
									labelFormatter={(t) => `Time: ${t}s`}
									formatter={(value) => [
										`${Number(value).toFixed(3)} V`,
										"Voltage",
									]}
								/>

								<Area
									type='monotone'
									dataKey='voltage'
									stroke='rgba(250,204,21,0.95)'
									strokeWidth={2.6}
									fill='url(#voltGlow)'
									fillOpacity={1}
									isAnimationActive
								/>
							</AreaChart>
						</ResponsiveContainer>
					) : (
						<div className='flex h-full items-center'>
							<div className='text-sm text-gray-400'>
								선택된 파일의 CSV를 불러오면 여기에 곡선이 그려져요.
							</div>
						</div>
					)}
				</div>

				<div className='mt-2 text-xs text-gray-500'>
					x = Time, y = Voltage_measured
				</div>
			</div>

			{/* Temperature (있을 때만) */}
			{hasTemp && (
				<div className='rounded-2xl border border-green-900/40 bg-green-900/10 p-4'>
					<div className='mb-2 flex items-end justify-between'>
						<div className='text-sm font-semibold text-gray-200'>
							Temperature curve
						</div>
						<div className='text-xs text-gray-500'>
							{`T: ${tMin.toFixed(1)} ~ ${tMax.toFixed(1)} °C`}
						</div>
					</div>

					<div style={{ height }} className='w-full'>
						<ResponsiveContainer width='100%' height='100%'>
							<AreaChart
								data={data}
								margin={{ top: 8, right: 8, bottom: 8, left: 0 }}
							>
								<defs>
									{/* 🔥 주황 그라데이션 */}
									<linearGradient id='tempGlow' x1='0' y1='0' x2='0' y2='1'>
										<stop offset='5%' stopColor='#f97316' stopOpacity={0.22} />
										<stop offset='95%' stopColor='#f97316' stopOpacity={0} />
									</linearGradient>
								</defs>

								<CartesianGrid
									strokeDasharray='3 3'
									vertical={false}
									stroke={gridStroke}
								/>
								<XAxis dataKey='time' hide />
								<YAxis
									domain={["auto", "auto"]}
									fontSize={11}
									axisLine={false}
									tickLine={false}
									stroke={yStroke}
									width={38}
								/>

								<Tooltip
									contentStyle={{
										backgroundColor: "#0b1220",
										border: "1px solid rgba(249,115,22,0.28)",
										borderRadius: "14px",
										color: "#fff",
										boxShadow: "0 10px 15px -3px rgba(0,0,0,0.35)",
									}}
									labelFormatter={(t) => `Time: ${t}s`}
									formatter={(value) => [
										`${Number(value).toFixed(2)} °C`,
										"Temp",
									]}
								/>

								<Area
									type='monotone'
									dataKey='temperature'
									stroke='rgba(249,115,22,0.95)'
									strokeWidth={2.6}
									fill='url(#tempGlow)'
									fillOpacity={1}
									isAnimationActive
								/>
							</AreaChart>
						</ResponsiveContainer>
					</div>

					<div className='mt-2 text-xs text-gray-500'>
						x = Time, y = Temperature
					</div>
				</div>
			)}
		</div>
	);
}

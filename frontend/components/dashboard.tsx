"use client";

import { useState } from "react";
import { Header } from "./header";
import { StatsOverview } from "./stats-overview";
import { EquipmentGrid } from "./equipment-grid";
import { AlertList } from "./alert-list";
import { HealthTrendChart } from "./health-trend-chart";
import { ServerHealth } from "./server-health";

export function Dashboard() {
	const [selectedFilter, setSelectedFilter] = useState<string>("all");

	return (
		<div className='min-h-screen bg-background'>
			<Header />
			<main className='container mx-auto px-4 py-6 space-y-6'>
				<StatsOverview />
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
					<div className='lg:col-span-2 space-y-6'>
						<EquipmentGrid
							filter={selectedFilter}
							onFilterChange={setSelectedFilter}
						/>
					</div>
					<div className='space-y-6'>
						<AlertList />
						<HealthTrendChart />
						<ServerHealth />
					</div>
				</div>
			</main>
		</div>
	);
}

// frontend/components/analysis/cycle/parseCsv.ts

export type CyclePoint = {
	t: number;
	v?: number;
	i?: number;
	temp?: number;
	vCharge?: number;
	iCharge?: number;
};

type RowObj = Record<string, string>;

function splitRow(line: string, delim: string) {
	const out: string[] = [];
	let cur = "";
	let depth = 0; // [ ] depth
	let inQuote = false;

	for (let k = 0; k < line.length; k++) {
		const ch = line[k];

		if (ch === '"') inQuote = !inQuote;

		if (!inQuote) {
			if (ch === "[") depth++;
			if (ch === "]") depth = Math.max(0, depth - 1);
		}

		if (!inQuote && depth === 0 && ch === delim) {
			out.push(cur.trim());
			cur = "";
			continue;
		}
		cur += ch;
	}
	out.push(cur.trim());
	return out;
}

function detectDelimiter(headerLine: string) {
	// 네 데이터 샘플은 탭이 매우 유력
	if (headerLine.includes("\t")) return "\t";
	return ","; // fallback
}

function parseArrayCell(cell: string): number[] {
	const s = cell.trim();
	if (!s) return [];

	// 이미 [ ... ] 형태로 들어옴
	if (s.startsWith("[") && s.endsWith("]")) {
		try {
			const arr = JSON.parse(s);
			if (Array.isArray(arr))
				return arr.map((x) => Number(x)).filter((n) => !Number.isNaN(n));
		} catch {
			// JSON.parse 실패하면 아래 fallback
		}
	}

	// fallback: 숫자만 긁어오기
	const nums = s.match(/-?\d+(\.\d+)?(e-?\d+)?/gi) || [];
	return nums.map((x) => Number(x)).filter((n) => !Number.isNaN(n));
}

function toRowObj(headers: string[], cells: string[]): RowObj {
	const obj: RowObj = {};
	headers.forEach((h, idx) => (obj[h] = cells[idx] ?? ""));
	return obj;
}

/**
 * 너희 CSV 형식:
 * index  Voltage_measured  Current_measured  Temperature_measured  Current_charge  Voltage_charge  Time
 * 각 값이 [ ... ] 배열
 */
export function parseCycleCsv(text: string): CyclePoint[] {
	const lines = text
		.split(/\r?\n/)
		.map((l) => l.trim())
		.filter(Boolean);

	if (lines.length < 2) return [];

	const delim = detectDelimiter(lines[0]);
	const headers = splitRow(lines[0], delim);

	// 데이터는 여러 줄일 수도 있고, 1줄일 수도 있음.
	// 여기서는 "첫 번째 데이터 행" 기준으로 파싱(선택 업로드 1개 = 1행 구조일 가능성이 커서)
	const firstDataLine = lines[1];
	const cells = splitRow(firstDataLine, delim);
	const row = toRowObj(headers, cells);

	const T = parseArrayCell(row["Time"]);
	const V = parseArrayCell(row["Voltage_measured"]);
	const I = parseArrayCell(row["Current_measured"]);
	const Temp = parseArrayCell(row["Temperature_measured"]);
	const ICh = parseArrayCell(row["Current_charge"]);
	const VCh = parseArrayCell(row["Voltage_charge"]);

	// 길이 맞추기: Time이 기준, 없으면 Voltage 기준
	const n = T.length || V.length || I.length || Temp.length;
	const points: CyclePoint[] = [];

	for (let k = 0; k < n; k++) {
		points.push({
			t: T[k] ?? k,
			v: V[k],
			i: I[k],
			temp: Temp[k],
			iCharge: ICh[k],
			vCharge: VCh[k],
		});
	}

	return points;
}

// parseCsv.ts (기존 파일에 추가)

export type CycleMetrics = {
	vMin: number | null;
	vMax: number | null;
	dV: number | null;

	tMin: number | null;
	tMax: number | null;
	dT: number | null;

	points: number;
	durationSec: number | null;
	tempMissingRate: number | null; // 0~1
};

function minMax(arr: number[]) {
	let min = Infinity;
	let max = -Infinity;
	for (const v of arr) {
		if (v < min) min = v;
		if (v > max) max = v;
	}
	return { min, max };
}

export function computeCycleMetrics(series: CyclePoint[]): CycleMetrics {
	const ts: number[] = [];
	const vs: number[] = [];
	const temps: (number | null)[] = [];

	for (const p of series as any[]) {
		const t = Number(p?.t);
		const v = Number(p?.v);
		if (!Number.isFinite(t) || !Number.isFinite(v)) continue;

		ts.push(t);
		vs.push(v);

		// ✅ 너가 확정한 키
		const tempRaw = p?.Temperature_measured;
		const tempNum = Number(tempRaw);
		temps.push(Number.isFinite(tempNum) ? tempNum : null);
	}

	const points = ts.length;
	if (points === 0) {
		return {
			vMin: null,
			vMax: null,
			dV: null,
			tMin: null,
			tMax: null,
			dT: null,
			points: 0,
			durationSec: null,
			tempMissingRate: null,
		};
	}

	const { min: t0, max: t1 } = minMax(ts);
	const durationSec = t1 - t0;

	const { min: vMin, max: vMax } = minMax(vs);
	const dV = vMax - vMin;

	const validTemps = temps.filter(
		(x): x is number => typeof x === "number" && Number.isFinite(x),
	);
	const hasTemp = validTemps.length > 0;

	const tempMissingRate = temps.length
		? (temps.length - validTemps.length) / temps.length
		: null;

	let tMin: number | null = null;
	let tMax: number | null = null;
	let dT: number | null = null;

	if (hasTemp) {
		const mm = minMax(validTemps);
		tMin = mm.min;
		tMax = mm.max;
		dT = tMax - tMin;
	}

	return {
		vMin,
		vMax,
		dV,
		tMin,
		tMax,
		dT,
		points,
		durationSec,
		tempMissingRate,
	};
}

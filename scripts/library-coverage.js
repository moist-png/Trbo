// ============================================================================
// Library coverage audit (Stage 0.2)
// ============================================================================
// The planner is only as good as the candidate pool behind each slot. This
// prints two views:
//
//   1. Purpose × duration band: how many non-pain workouts exist per band.
//   2. Purpose × session budget: for every realistic per-session time budget
//      the UI can produce (weekly hours ÷ days), how many workouts of each
//      purpose fit the picker's "comfortable" ceiling (1.5× the session
//      budget) — this is the pool the duration-fit rule actually selects
//      from, so it's the grid that matters for rotation health.
//
// Cells with 0–2 candidates are flagged — those are content gaps.
//
//   node scripts/library-coverage.js
// ============================================================================
import { WORKOUT_PURPOSE } from '../src/planner.js';
import { loadLibrary } from './extract-library.js';

const LIBRARY = loadLibrary();

const PURPOSES = ['recovery', 'endurance', 'tempo', 'sweetspot', 'threshold', 'vo2max', 'anaerobic', 'climbing', 'race'];
const pool = {};
for (const p of PURPOSES) {
  pool[p] = LIBRARY
    .filter(w => !w.pain && WORKOUT_PURPOSE[w.id] === p)
    .map(w => ({ id: w.id, minutes: Math.round(w.intervals.reduce((a, b) => a + b.duration, 0) / 60) }));
}

// --- View 1: purpose × duration band ---
const BANDS = [
  { label: '20-30m', min: 0, max: 30 },
  { label: '31-50m', min: 31, max: 50 },
  { label: '51-75m', min: 51, max: 75 },
  { label: '76-100m', min: 76, max: 100 },
  { label: '101-125m', min: 101, max: 125 },
  { label: '126m+', min: 126, max: Infinity },
];

console.log('=== View 1: candidates per purpose × duration band (non-pain) ===\n');
const head1 = ['purpose'.padEnd(10), ...BANDS.map(b => b.label.padStart(9)), 'total'.padStart(7)].join('');
console.log(head1);
const gaps1 = [];
for (const p of PURPOSES) {
  const cells = BANDS.map(b => pool[p].filter(w => w.minutes >= b.min && w.minutes <= b.max).length);
  console.log([p.padEnd(10), ...cells.map(c => String(c).padStart(9)), String(pool[p].length).padStart(7)].join(''));
}

// --- View 2: purpose × realistic session budget ---
// Every distinct hours/days combo the UI offers, expressed as the picker's
// comfortable ceiling (1.5 × weekly seconds / days).
const HOURS = [3, 4, 6, 8, 10, 12];
const DAYS = [2, 3, 4, 5, 6];
const ceilings = [...new Set(
  HOURS.flatMap(h => DAYS.map(d => Math.round((h * 60 / d) * 1.5)))
)].sort((a, b) => a - b);

// Only quality purposes are duration-gated by the picker (flexible aerobic
// rides get rescaled, so their native length doesn't restrict the pool).
const FIXED = ['sweetspot', 'threshold', 'vo2max', 'anaerobic', 'climbing', 'race'];

console.log('\n=== View 2: fixed-length purposes — candidates fitting each session ceiling ===');
console.log('(ceiling = 1.5 × per-session time; cells with 0-2 are rotation-starved)\n');
console.log(['ceiling'.padEnd(9), ...FIXED.map(p => p.padStart(10))].join(''));
const gaps2 = [];
for (const c of ceilings) {
  const cells = FIXED.map(p => pool[p].filter(w => w.minutes <= c).length);
  console.log([`${c}min`.padEnd(9), ...cells.map(n => String(n).padStart(10))].join(''));
  FIXED.forEach((p, i) => { if (cells[i] <= 2) gaps2.push(`${p} @ ≤${c}min ceiling: ${cells[i]} candidate(s)`); });
}

console.log('\n=== Flagged gaps (0-2 candidates) ===\n');
if (!gaps2.length) console.log('None — every fixed-length purpose has 3+ candidates at every realistic session budget.');
else gaps2.forEach(g => console.log('  - ' + g));

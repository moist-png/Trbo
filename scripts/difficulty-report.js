// ============================================================================
// Difficulty report (Stage 1.2 validation)
// ============================================================================
// Prints every plannable workout ranked by computed difficulty within its
// purpose, plus the default progression starting levels per training age.
// The check is by eye: within each purpose, does the ordering look right?
//
//   node scripts/difficulty-report.js
// ============================================================================
import { WORKOUT_PURPOSE, workoutDifficulty, progressionLevels } from '../src/planner.js';
import { loadLibrary } from './extract-library.js';

const LIBRARY = loadLibrary();
const byPurpose = {};
for (const w of LIBRARY) {
  const p = WORKOUT_PURPOSE[w.id];
  if (!p || p === 'test' || w.pain) continue;
  const minutes = Math.round(w.intervals.reduce((a, b) => a + b.duration, 0) / 60);
  (byPurpose[p] || (byPurpose[p] = [])).push({ id: w.id, name: w.name, minutes, d: workoutDifficulty(w) });
}

for (const p of ['recovery', 'endurance', 'tempo', 'sweetspot', 'threshold', 'vo2max', 'anaerobic', 'climbing', 'race']) {
  console.log(`\n=== ${p} ===`);
  (byPurpose[p] || []).sort((a, b) => a.d - b.d).forEach(w => {
    console.log(`  ${String(w.d).padStart(5)}  ${String(w.minutes).padStart(4)}min  ${w.name}`);
  });
}

console.log('\n=== Default starting levels (no history) ===\n');
for (const age of ['new', 'developing', 'established']) {
  const levels = progressionLevels([], LIBRARY, age);
  console.log(age.padEnd(12), Object.entries(levels).map(([p, v]) => `${p}:${v}`).join('  '));
}

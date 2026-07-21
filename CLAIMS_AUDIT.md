# Claims audit — what the marketing site may truthfully say

Last audited: 21 July 2026, against the code on `main`. Re-run this audit
whenever marketing copy is written or the planner changes. The rule: **every
claim below is marked SAFE only if the feature is shipped, harness-tested,
and behaves as the sentence says.** If in doubt, soften the sentence, not
the truth.

## SAFE — shipped and verified

| Claim | Backed by |
|---|---|
| "Periodised training plans" | Base → Build → Peak → Taper phase model (`planPhases`), recovery weeks structurally enforced every 3–4 weeks. |
| "Safe load ramping" | Weekly TSS ramp hard-capped at 8% (5% multi-sport or new riders); validated across 18,000+ generated plans by `scripts/planner-sweep.js`. |
| "Your plan adapts to you" | Post-ride survey + intensity signals feed per-purpose progression levels; workout selection prefers difficulty just above the rider's demonstrated level and never schedules far above it. |
| "…and tells you why, in one sentence" | Every adaptation (check-ins, repairs, retests, pauses) writes a plain-English entry to the plan's adaptation log, shown in "Plan changes". |
| "Adapts when life happens" | Missed-week re-entry (ramps from actual load, not planned), key-session rescue, early recovery weeks, and vacation/pause handling — all opt-in with reasons, never silent. |
| "Knows when your FTP has gone stale" | 7+ weeks old + hard sessions rated easy → a ramp test is scheduled into the plan as a proper test day. |
| "A weekly review, not a nag" | One review moment per new plan week, hard-capped proposals (max 3), dismissals remembered forever, quiet weeks get one line. |
| "Fitness, fatigue and freshness tracking" | Standard 42/7-day impulse-response model, computed on-device from ride history; shown in the Plan health panel. |
| "Tapers tuned to your event and your age" | Taper length varies by goal type (short & sharp for crits/TTs/hill climbs, fuller for endurance events) and age band (55+ gets an extra week on longer plans). |
| "No FTP test? Start anyway" | Humble weight + self-assessment estimate, clearly labelled as an estimate, with a real ramp test auto-scheduled into week 1. |
| "150+ workouts" | Library is 155 at audit time (including 4 Pain rides). Re-count before quoting any number: `node -e` with scripts/extract-library.js, or just say "over 150". |
| "Runs in a browser" / "works with your trainer" | PWA + FTMS and Cycling Power Service Bluetooth support, Wahoo proprietary ERG fallback. |
| "Heart rate never stored" | Displayed live and written only to the rider's own exported files; never persisted server-side (enforced in `recordWorkoutSession`). |

## SAY CAREFULLY — true with caveats

- **"Adaptive training"** — true, but do NOT say or imply "machine learning"
  or "AI-powered". It is a deterministic, explainable rules engine. That is
  the selling point; own it.
- **"Like TrainerRoad"** — never claim parity. The honest angle: a fraction
  of the price, runs anywhere, and explains every decision — not "the same
  engine".
- **Pricing comparisons** — verify competitor pricing on the day copy is
  written; do not reuse old numbers.

## DO NOT SAY — not shipped

- Anything implying multiplayer/group training (Tug of War and multiplayer
  Mini Games are deferred).
- "Syncs your outdoor rides automatically" — outdoor rides are logged
  manually with duration + RPE. Strava integration UPLOADS completed indoor
  rides; it does not import.
- "Coaching" or "coach" as a noun — the plan advises and explains; no human
  is involved. "Smart training" yes; "your coach" no.
- Anything about nutrition, health outcomes, weight loss, or medical
  benefit. The FTP estimate uses weight for a starting number only.

## Process

1. Before publishing any page, check each sentence against this file.
2. If a sentence isn't covered here, either ship the thing or cut the
   sentence.
3. After shipping planner changes, re-run `node scripts/planner-sweep.js`
   and update the table above if a claim's backing changed.

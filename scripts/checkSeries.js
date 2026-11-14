// Validates every series script before it can reach YouTube:
//   npm run check:series
// Checks scenes exist, speakers are on screen, casts fit, hooks exist, and estimates each part's length.
// The rules live in services/seriesValidator.js (also used by the series writer page).
const { SERIES } = require("../services/seriesService");
const { validateSeries, TARGET_MAX } = require("../services/seriesValidator");

let errors = 0;
let total = 0;
const rows = [];
for (const series of SERIES) {
  const r = validateSeries(series);
  for (const e of r.errors) console.error(`❌ ${e}`);
  for (const w of r.warnings) console.warn(`⚠️  ${w}`);
  errors += r.errors.length;
  total += r.parts.length;
  rows.push(...r.parts);
}

for (const r of rows) console.log(`${r.where.padEnd(32)} ${String(r.lines).padStart(3)} lines  ~${r.seconds}s`);
console.log(`\n${total} parts checked across ${SERIES.length} series (target under ${TARGET_MAX}s). ${errors ? `${errors} error(s).` : "No errors."}`);
process.exit(errors ? 1 : 0);

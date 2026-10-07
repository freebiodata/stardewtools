#!/usr/bin/env node
/**
 * StardewTools math verification tests.
 * Values trace to research/batch3/worker-stardew-data.md (wiki-sourced).
 */
let pass = 0, fail = 0;
const ok = (name, cond, detail = '') => {
  if (cond) { pass++; console.log(`  ✓ ${name}`); }
  else { fail++; console.log(`  ✗ ${name} ${detail}`); }
};
const closeTo = (a, b, tol) => Math.abs(a - b) <= tol;

function harvestsInSeason(crop, plantDay = 1, seasonDays = 28) {
  const daysLeft = seasonDays - plantDay + 1;
  if (daysLeft < crop.growDays) return 0;
  if (crop.regrowDays === null) return Math.floor(daysLeft / crop.growDays);
  const after = daysLeft - crop.growDays;
  return 1 + Math.floor(after / crop.regrowDays);
}
function seedCostSeason(crop, harvests) {
  const unit = crop.seedCost ?? 0;
  if (harvests <= 0) return 0;
  return crop.regrowDays === null ? unit * harvests : unit;
}

console.log('StardewTools math tests\n');

console.log('Harvest counts (wiki data):');
{
  // Starfruit: 13d grow, no regrow -> floor(28/13) = 2 plantings
  const starfruit = { growDays: 13, regrowDays: null };
  ok('starfruit day1 = 2 plantings (replanting)', harvestsInSeason(starfruit, 1) === 2, `got ${harvestsInSeason(starfruit, 1)}`);
  // Planted day 16: only one planting fits (16+13-1=28)
  ok('starfruit day16 = 1 planting', harvestsInSeason(starfruit, 16) === 1);
  ok('starfruit day17 = 0 (cannot finish)', harvestsInSeason(starfruit, 17) === 0);

  // Cranberries: 7d grow, 5d regrow -> 1 + floor(21/5) = 5
  const cran = { growDays: 7, regrowDays: 5 };
  ok('cranberry day1 = 5 harvests', harvestsInSeason(cran, 1) === 5, `got ${harvestsInSeason(cran, 1)}`);

  // Blueberry: 13d grow, 4d regrow -> 1 + floor(15/4) = 4
  const blue = { growDays: 13, regrowDays: 4 };
  ok('blueberry day1 = 4 harvests', harvestsInSeason(blue, 1) === 4, `got ${harvestsInSeason(blue, 1)}`);

  // Ancient Fruit: 28d grow, 7d regrow -> planted day 1 = 1 harvest
  const ancient = { growDays: 28, regrowDays: 7 };
  ok('ancient fruit day1 = 1 harvest (28d growth)', harvestsInSeason(ancient, 1) === 1);

  // Corn (28d available if planted start of summer): 14d + 4 regrow -> 1 + floor(14/4) = 4
  const corn = { growDays: 14, regrowDays: 4 };
  ok('corn day1 = 4 harvests', harvestsInSeason(corn, 1) === 4, `got ${harvestsInSeason(corn, 1)}`);
}

console.log('\nProfit calcs (worked examples):');
{
  // Starfruit: 750×2 − 400×2 = 700g; 25.0/day
  const h = harvestsInSeason({ growDays: 13, regrowDays: null }, 1);
  const seed = seedCostSeason({ seedCost: 400, regrowDays: null }, h);
  const profit = 750 * h - seed;
  ok('starfruit profit = 700g', profit === 700, `got ${profit}`);
  ok('starfruit gold/day = 25.0', closeTo(profit / 28, 25.0, 0.01));

  // Cranberries: 75×2×5 − 240 = 510g
  const h2 = harvestsInSeason({ growDays: 7, regrowDays: 5 }, 1);
  const seed2 = seedCostSeason({ seedCost: 240, regrowDays: 5 }, h2);
  const profit2 = 75 * 2 * h2 - seed2;
  ok('cranberry profit = 510g', profit2 === 510, `got ${profit2}`);

  // Pumpkin: 320, 13d, seed 100 -> floor(28/13)=2 plantings: 320×2 − 100×2 = 440
  const hp = harvestsInSeason({ growDays: 13, regrowDays: null }, 1);
  const sp = seedCostSeason({ seedCost: 100, regrowDays: null }, hp);
  ok('pumpkin profit = 440g', 320 * hp - sp === 440, `got ${320 * hp - sp}`);
}

console.log('\nArtisan rules (wiki):');
{
  const wine = (fruitBase) => fruitBase * 3;
  ok('starfruit wine = 2250g', wine(750) === 2250);
  ok('melon wine = 750g', wine(250) === 750);
  const juice = (vegBase) => vegBase * 2.25;
  ok('pumpkin juice = 720g', juice(320) === 720);
  const jelly = (fruitBase) => fruitBase * 2 + 50;
  ok('cranberry jelly = 200g', jelly(75) === 200);
  ok('starfruit jelly = 1550g', jelly(750) === 1550);

  // Keg vs jar breakpoint: fruits above ~50g favor keg per the wiki
  // At 50g: wine 150 vs jelly 150 — equal. At 75g: 225 vs 200 — keg wins.
  ok('breakpoint check: 50g equal (150 each)', wine(50) === jelly(50) && wine(50) === 150);
  ok('75g fruit: keg wins (225 > 200)', wine(75) > jelly(75));
}

console.log('\nKeg planner:');
{
  const batches = (days, pdays) => Math.max(1, Math.floor(days / pdays));
  ok('wine: 4 batches in 28 days (6.25d)', batches(28, 6.25) === 4);
  ok('juice: 7 batches in 28 days (4d)', batches(28, 4) === 7);
  ok('jelly: 11 batches in 28 days (2.5d)', batches(28, 2.5) === 11);
  ok('pale ale: 19 batches in 28 days (1.4d)', batches(28, 1.40625) === 19);
  const machinesNeeded = (items, batches) => Math.ceil(items / batches);
  ok('100 items wine in 28d: 25 machines', machinesNeeded(100, 4) === 25);
}

console.log('\nQuality & professions (wiki):');
{
  const q = { silver: 1.25, gold: 1.5, iridium: 2 };
  ok('parsnip silver = floor(35×1.25) = 43', Math.floor(35 * q.silver) === 43);
  ok('parsnip gold = floor(35×1.5) = 52', Math.floor(35 * q.gold) === 52);
  ok('parsnip iridium = 70', Math.floor(35 * q.iridium) === 70);
  ok('artisan +40%: 750 wine base → floor(2250×1.4) = 3150', Math.floor(2250 * 1.4) === 3150);
  ok('tiller +10%: floor(750×1.1) = 825', Math.floor(750 * 1.1) === 825);
}

console.log('\nSanity: rankings make sense:');
{
  // Starfruit raw 25/day vs cauliflower: 175×(floor(28/12)=2) − 80×2 = 190 → 6.8/day
  const hc = harvestsInSeason({ growDays: 12, regrowDays: null }, 1);
  const cProfit = 175 * hc - 80 * hc;
  ok('cauliflower 2 plantings = 190g profit', cProfit === 190, `got ${cProfit}`);
  ok('starfruit out-earns cauliflower per day (25 > 6.8)', 25 > cProfit / 28);
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

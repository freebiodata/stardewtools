/**
 * StardewTools: profit calculation engine.
 *
 * Crop data: src/data/crops.ts (compiled from stardewvalleywiki.com, see
 * research/batch3/worker-stardew-data.md). This file holds the math only:
 *
 *   harvests (regrow) = 1 + floor((daysLeft − growDays) ÷ regrowDays)
 *   revenue           = sellPrice × yieldPerHarvest × harvests
 *   profit            = revenue − seedCost
 *   profit/day        = profit ÷ 28
 *
 * Artisan (from wiki):
 *   Wine  = 3 × fruit base price, 10000 min
 *   Juice = 2.25 × veg base price, 6000 min
 *   Jelly = 2 × fruit base + 50, 4000 min   (Preserves Jar)
 *   Pickles = 2 × veg base + 50, 4000 min
 *   Dried (fruit) = 7.5 × base + 25, 1 day  (Dehydrator, consumes 5 per output)
 */

import type { Crop } from '../data/crops';

export const SEASON_DAYS = 28;

export interface ProfitRow {
  name: string;
  season: string;
  seedCost: number | null;
  seedNote?: string;
  sellPrice: number;
  totalPerHarvest: number; // sellPrice × yieldPerHarvest
  growDays: number;
  regrowDays: number | null;
  harvests: number;
  totalRevenue: number;
  totalProfit: number;
  profitPerDay: number;
  /** best artisan path */
  artisanLabel: string;
  artisanPerDay: number;
  artisanNote: string;
  notPlantable?: boolean; // can't finish before season end
  spans?: string;
  trellis?: boolean;
  extraNote?: string;
}

/** Harvests achievable when planting on `plantDay` (1-based in-season day).
 *
 * Regrow crops: 1 + floor((daysLeft − growDays) ÷ regrowDays), seed bought once.
 * Single-harvest crops: assumes replanting immediately after each harvest,
 * so plantings = floor(daysLeft ÷ growDays) and seed cost is paid per planting.
 */
export function harvestsInSeason(crop: Crop, plantDay = 1, seasonDays = SEASON_DAYS): number {
  const daysLeft = seasonDays - plantDay + 1;
  if (daysLeft < crop.growDays) return 0;
  if (crop.regrowDays === null) return Math.floor(daysLeft / crop.growDays);
  const after = daysLeft - crop.growDays;
  return 1 + Math.floor(after / crop.regrowDays);
}

/** Total seed cost for the season: once for regrow crops, per planting for single-harvest. */
export function seedCostForSeason(crop: Crop, harvests: number): number {
  const unit = crop.seedCost ?? 0;
  if (harvests <= 0) return 0;
  return crop.regrowDays === null ? unit * harvests : unit;
}

export function singleHarvestValue(crop: Crop): number {
  return crop.sellPrice * crop.yieldPerHarvest;
}

/** Keg output value per input item (from wiki rules). */
export function kegValue(crop: Crop): { label: string; value: number; days: number } | null {
  if (crop.kegSpecial) return { label: crop.kegSpecial.name, value: crop.kegSpecial.price, days: crop.kegSpecial.days };
  if (crop.isFruit) return { label: 'Wine', value: crop.sellPrice * 3, days: 6.25 };
  // vegetables (excluding flowers which aren't keggable meaningfully; keep simple rule)
  return { label: 'Juice', value: crop.sellPrice * 2.25, days: 4 };
}

/** Preserves Jar output value per input item. */
export function jarValue(crop: Crop): { label: string; value: number; days: number } {
  if (crop.isFruit) return { label: 'Jelly', value: crop.sellPrice * 2 + 50, days: 2.5 };
  return { label: 'Pickles', value: crop.sellPrice * 2 + 50, days: 2.5 };
}

/** Compute the full profit row for a crop at a given planting day. */
export function computeProfit(crop: Crop, plantDay = 1): ProfitRow {
  const harvests = harvestsInSeason(crop, plantDay);
  const seedCostTotal = seedCostForSeason(crop, harvests);
  const perHarvest = singleHarvestValue(crop);
  const totalRevenue = perHarvest * harvests;
  const totalProfit = harvests > 0 ? totalRevenue - seedCostTotal : 0;
  const profitPerDay = totalProfit / SEASON_DAYS;

  // Best artisan path: compare keg vs jar per day over the season (processed same day value)
  const keg = kegValue(crop);
  const jar = jarValue(crop);
  let artisanLabel = 'None';
  let artisanPerDay = profitPerDay;
  let artisanNote = 'Not processable (flower or similar)';
  if (keg && jar) {
    const kegTotal = keg.value * crop.yieldPerHarvest * harvests;
    const jarTotal = jar.value * crop.yieldPerHarvest * harvests;
    const kegNet = kegTotal - seedCostTotal;
    const jarNet = jarTotal - seedCostTotal;
    if (kegNet >= jarNet) {
      artisanLabel = `Keg → ${keg.label}`;
      artisanPerDay = kegNet / SEASON_DAYS;
      artisanNote = `${keg.value.toFixed(0)}g per item, ${keg.days} days processing`;
    } else {
      artisanLabel = `Jar → ${jar.label}`;
      artisanPerDay = jarNet / SEASON_DAYS;
      artisanNote = `${jar.value.toFixed(0)}g per item, ${jar.days.toFixed(1)} days processing`;
    }
  }

  return {
    name: crop.name,
    season: crop.season,
    seedCost: crop.seedCost,
    seedNote: crop.seedNote,
    sellPrice: crop.sellPrice,
    totalPerHarvest: perHarvest,
    growDays: crop.growDays,
    regrowDays: crop.regrowDays,
    harvests,
    totalRevenue,
    totalProfit,
    profitPerDay,
    artisanLabel,
    artisanPerDay,
    artisanNote,
    notPlantable: harvests === 0,
    spans: crop.spans,
    trellis: crop.trellis,
    extraNote: crop.extraNote,
  };
}

/** Rank crops for a season by profit/day (raw), filtered to plantable ones. */
export function rankSeason(crops: Crop[], season: string, plantDay = 1): ProfitRow[] {
  return crops
    .filter((c) => c.season === season)
    .map((c) => computeProfit(c, plantDay))
    .filter((r) => !r.notPlantable)
    .sort((a, b) => b.profitPerDay - a.profitPerDay);
}

/** Best crop considering artisan processing (keg/jar). */
export function rankSeasonArtisan(crops: Crop[], season: string, plantDay = 1): ProfitRow[] {
  return crops
    .filter((c) => c.season === season)
    .map((c) => computeProfit(c, plantDay))
    .filter((r) => !r.notPlantable)
    .sort((a, b) => b.artisanPerDay - a.artisanPerDay);
}

export function fmtGold(n: number): string {
  return `${n.toLocaleString('en-US', { maximumFractionDigits: 1 })}g`;
}

export function fmtDays(n: number): string {
  return `${n.toLocaleString('en-US', { maximumFractionDigits: 1 })} days`;
}

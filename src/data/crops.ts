/**
 * Stardew Valley crop dataset.
 *
 * Source: stardewvalleywiki.com tables compiled 2026-10-08: see
 * research/batch3/worker-stardew-data.md for the full source trail.
 * Every number below traces to a fetched wiki page. Values are the wiki's
 * base (normal quality) numbers; quality and profession math lives in lib/profit.ts.
 */

export interface Crop {
  name: string;
  season: 'spring' | 'summer' | 'fall' | 'winter' | 'special';
  /** Seed purchase cost (cheapest standard source). null = not sold in shops. */
  seedCost: number | null;
  /** Seed note when not sold in shops */
  seedNote?: string;
  /** Base sell price per item (normal quality) */
  sellPrice: number;
  /** Days from planting to first harvest */
  growDays: number;
  /** Days between harvests (null = single harvest) */
  regrowDays: number | null;
  /** Items per harvest (multi-yield crops; e.g. blueberry 3) */
  yieldPerHarvest: number;
  /** Is this a fruit (keg → wine)? false = vegetable (keg → juice) */
  isFruit: boolean;
  /** Special keg product override: {name, price, days} */
  kegSpecial?: { name: string; price: number; days: number };
  /** Trellis crop (can't walk through) */
  trellis?: boolean;
  /** Extra-yield chance note */
  extraNote?: string;
  /** Multi-season crop spans */
  spans?: string;
}

export const crops: Crop[] = [
  // ================= SPRING =================
  { name: 'Blue Jazz', season: 'spring', seedCost: 30, sellPrice: 50, growDays: 7, regrowDays: null, yieldPerHarvest: 1, isFruit: false },
  { name: 'Carrot', season: 'spring', seedCost: null, seedNote: 'Seeds from Seed Spots / Raccoon Wife (not sold)', sellPrice: 35, growDays: 3, regrowDays: null, yieldPerHarvest: 1, isFruit: false },
  { name: 'Cauliflower', season: 'spring', seedCost: 80, sellPrice: 175, growDays: 12, regrowDays: null, yieldPerHarvest: 1, isFruit: false },
  { name: 'Coffee Bean', season: 'spring', seedCost: null, seedNote: 'Traveling Cart / Dust Sprite drop', sellPrice: 15, growDays: 10, regrowDays: 2, yieldPerHarvest: 4, isFruit: false, kegSpecial: { name: 'Coffee (5 beans)', price: 150, days: 0.125 }, spans: 'Spring + Summer' },
  { name: 'Garlic', season: 'spring', seedCost: 40, sellPrice: 60, growDays: 4, regrowDays: null, yieldPerHarvest: 1, isFruit: false },
  { name: 'Green Bean', season: 'spring', seedCost: 60, sellPrice: 40, growDays: 10, regrowDays: 3, yieldPerHarvest: 1, isFruit: false, trellis: true },
  { name: 'Kale', season: 'spring', seedCost: 70, sellPrice: 110, growDays: 6, regrowDays: null, yieldPerHarvest: 1, isFruit: false },
  { name: 'Parsnip', season: 'spring', seedCost: 20, sellPrice: 35, growDays: 4, regrowDays: null, yieldPerHarvest: 1, isFruit: false },
  { name: 'Potato', season: 'spring', seedCost: 50, sellPrice: 80, growDays: 6, regrowDays: null, yieldPerHarvest: 1.25, isFruit: false, extraNote: 'averages +0.25 extra potato per harvest' },
  { name: 'Rhubarb', season: 'spring', seedCost: 100, sellPrice: 220, growDays: 13, regrowDays: null, yieldPerHarvest: 1, isFruit: true, seedNote: 'Oasis seed' },
  { name: 'Strawberry', season: 'spring', seedCost: 100, sellPrice: 120, growDays: 8, regrowDays: 4, yieldPerHarvest: 1, isFruit: true, seedNote: 'Egg Festival only', extraNote: '+2% extra chance' },
  { name: 'Tulip', season: 'spring', seedCost: 20, sellPrice: 30, growDays: 6, regrowDays: null, yieldPerHarvest: 1, isFruit: false },
  { name: 'Unmilled Rice', season: 'spring', seedCost: 40, sellPrice: 30, growDays: 8, regrowDays: null, yieldPerHarvest: 1.1, isFruit: false, extraNote: '10% extra-yield; 6 days irrigated' },

  // ================= SUMMER =================
  { name: 'Blueberry', season: 'summer', seedCost: 80, sellPrice: 50, growDays: 13, regrowDays: 4, yieldPerHarvest: 3, isFruit: true, extraNote: '3 berries/harvest +2%' },
  { name: 'Corn', season: 'summer', seedCost: 150, sellPrice: 50, growDays: 14, regrowDays: 4, yieldPerHarvest: 1, isFruit: false, spans: 'Summer + Fall' },
  { name: 'Hops', season: 'summer', seedCost: 60, sellPrice: 25, growDays: 11, regrowDays: 1, yieldPerHarvest: 1, isFruit: false, trellis: true, kegSpecial: { name: 'Pale Ale', price: 300, days: 1.40625 } },
  { name: 'Hot Pepper', season: 'summer', seedCost: 40, sellPrice: 40, growDays: 5, regrowDays: 3, yieldPerHarvest: 1, isFruit: true, extraNote: '+3% extra chance' },
  { name: 'Melon', season: 'summer', seedCost: 80, sellPrice: 250, growDays: 12, regrowDays: null, yieldPerHarvest: 1, isFruit: true },
  { name: 'Poppy', season: 'summer', seedCost: 100, sellPrice: 140, growDays: 7, regrowDays: null, yieldPerHarvest: 1, isFruit: false },
  { name: 'Radish', season: 'summer', seedCost: 40, sellPrice: 90, growDays: 6, regrowDays: null, yieldPerHarvest: 1, isFruit: false },
  { name: 'Red Cabbage', season: 'summer', seedCost: 100, sellPrice: 260, growDays: 9, regrowDays: null, yieldPerHarvest: 1, isFruit: false, seedNote: 'Year 2+' },
  { name: 'Starfruit', season: 'summer', seedCost: 400, sellPrice: 750, growDays: 13, regrowDays: null, yieldPerHarvest: 1, isFruit: true, seedNote: 'Oasis seed' },
  { name: 'Summer Spangle', season: 'summer', seedCost: 50, sellPrice: 90, growDays: 8, regrowDays: null, yieldPerHarvest: 1, isFruit: false },
  { name: 'Summer Squash', season: 'summer', seedCost: null, seedNote: 'Raccoon Wife: 15 Sap (not sold)', sellPrice: 45, growDays: 6, regrowDays: 3, yieldPerHarvest: 1, isFruit: false },
  { name: 'Sunflower', season: 'summer', seedCost: 200, sellPrice: 80, growDays: 8, regrowDays: null, yieldPerHarvest: 1, isFruit: false, spans: 'Summer + Fall', extraNote: 'Drops 0-2 sunflower seeds' },
  { name: 'Tomato', season: 'summer', seedCost: 50, sellPrice: 60, growDays: 11, regrowDays: 4, yieldPerHarvest: 1, isFruit: true, extraNote: '+5% extra chance' },
  { name: 'Wheat', season: 'summer', seedCost: 10, sellPrice: 25, growDays: 4, regrowDays: null, yieldPerHarvest: 1, isFruit: false, spans: 'Summer + Fall', kegSpecial: { name: 'Beer', price: 200, days: 1.09 } },

  // ================= FALL =================
  { name: 'Amaranth', season: 'fall', seedCost: 70, sellPrice: 150, growDays: 7, regrowDays: null, yieldPerHarvest: 1, isFruit: false },
  { name: 'Artichoke', season: 'fall', seedCost: 30, sellPrice: 160, growDays: 8, regrowDays: null, yieldPerHarvest: 1, isFruit: false, seedNote: 'Year 2+' },
  { name: 'Beet', season: 'fall', seedCost: 20, sellPrice: 100, growDays: 6, regrowDays: null, yieldPerHarvest: 1, isFruit: false, seedNote: 'Oasis seed' },
  { name: 'Bok Choy', season: 'fall', seedCost: 50, sellPrice: 80, growDays: 4, regrowDays: null, yieldPerHarvest: 1, isFruit: false },
  { name: 'Broccoli', season: 'fall', seedCost: null, seedNote: 'Raccoon Wife: 5 Moss (not sold)', sellPrice: 70, growDays: 8, regrowDays: 4, yieldPerHarvest: 1, isFruit: false },
  { name: 'Cranberries', season: 'fall', seedCost: 240, sellPrice: 75, growDays: 7, regrowDays: 5, yieldPerHarvest: 2, isFruit: true, extraNote: '2 berries/harvest +10%' },
  { name: 'Eggplant', season: 'fall', seedCost: 20, sellPrice: 60, growDays: 5, regrowDays: 5, yieldPerHarvest: 1, isFruit: false },
  { name: 'Fairy Rose', season: 'fall', seedCost: 200, sellPrice: 290, growDays: 12, regrowDays: null, yieldPerHarvest: 1, isFruit: false },
  { name: 'Grape', season: 'fall', seedCost: 60, sellPrice: 80, growDays: 10, regrowDays: 3, yieldPerHarvest: 1, isFruit: true, trellis: true },
  { name: 'Pumpkin', season: 'fall', seedCost: 100, sellPrice: 320, growDays: 13, regrowDays: null, yieldPerHarvest: 1, isFruit: false },
  { name: 'Yam', season: 'fall', seedCost: 60, sellPrice: 160, growDays: 10, regrowDays: null, yieldPerHarvest: 1, isFruit: false },

  // ================= WINTER / SPECIAL =================
  { name: 'Powdermelon', season: 'winter', seedCost: null, seedNote: 'Raccoon Wife: 2 Pine Cone (not sold)', sellPrice: 60, growDays: 7, regrowDays: null, yieldPerHarvest: 1, isFruit: true },
  { name: 'Fiber', season: 'special', seedCost: null, seedNote: 'Fiber Seeds: crafting (free recipe)', sellPrice: 1, growDays: 7, regrowDays: null, yieldPerHarvest: 5.5, isFruit: false, extraNote: '4-7 fiber/harvest; all seasons, no watering' },
  { name: 'Taro Root', season: 'special', seedCost: null, seedNote: 'Island Trader: 2 Bone Fragment', sellPrice: 100, growDays: 10, regrowDays: null, yieldPerHarvest: 1, isFruit: false, spans: 'Summer on farm; year-round Ginger Island' },
  { name: 'Tea Leaves', season: 'special', seedCost: null, seedNote: 'Tea Sapling: crafting (free)', sellPrice: 50, growDays: 20, regrowDays: 1, yieldPerHarvest: 1, isFruit: false, spans: 'All seasons; harvest last week of each season' },
  { name: 'Ancient Fruit', season: 'special', seedCost: null, seedNote: 'Ancient Seeds (crafted, free recipe)', sellPrice: 550, growDays: 28, regrowDays: 7, yieldPerHarvest: 1, isFruit: true, spans: 'Spring + Summer + Fall' },
  { name: 'Cactus Fruit', season: 'special', seedCost: 150, sellPrice: 75, growDays: 12, regrowDays: 3, yieldPerHarvest: 1, isFruit: true, seedNote: 'Greenhouse / Ginger Island' },
  { name: 'Pineapple', season: 'special', seedCost: null, seedNote: 'Island Trader: 1 Magma Cap', sellPrice: 300, growDays: 14, regrowDays: 7, yieldPerHarvest: 1, isFruit: true, spans: 'Summer on farm; year-round on Ginger Island' },
  { name: 'Sweet Gem Berry', season: 'special', seedCost: 1000, sellPrice: 3000, growDays: 24, regrowDays: null, yieldPerHarvest: 1, isFruit: true, seedNote: 'Rare Seed (Traveling Cart)' },
];

export const seasons = ['spring', 'summer', 'fall'] as const;
export const SEASON_DAYS = 28;

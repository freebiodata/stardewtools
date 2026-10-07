#!/usr/bin/env node
/**
 * StardewTools DOM smoke tests: loads built pages in jsdom, executes the
 * bundled scripts, verifies the tools compute and render results.
 */
import { JSDOM } from 'jsdom';
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

const CACHE = '.dom-test-cache';
if (!existsSync(CACHE)) mkdirSync(CACHE, { recursive: true });

let pass = 0, fail = 0;
const ok = (name, cond, detail = '') => {
  if (cond) { pass++; console.log(`  ✓ ${name}`); }
  else { fail++; console.log(`  ✗ ${name} ${detail}`); }
};

function bundleScript(srcPath, outName) {
  const out = join(CACHE, outName);
  execSync(
    `npx esbuild "${srcPath}" --bundle --format=iife --outfile="${out}" --log-level=error`,
    { stdio: 'pipe' },
  );
  return readFileSync(out, 'utf-8');
}

async function loadPage(path) {
  const html = readFileSync(path, 'utf-8');
  const dom = new JSDOM(html, {
    runScripts: 'outside-only',
    pretendToBeVisual: true,
    url: 'https://stardewtools.top/',
  });
  const { window } = dom;
  const scripts = [...window.document.querySelectorAll('script[src]')];
  let i = 0;
  for (const s of scripts) {
    const src = s.getAttribute('src').replace(/^\//, 'dist/');
    try {
      window.eval(bundleScript(src, `b-${path.replace(/[^a-z0-9]/gi, '_')}-${i++}.js`));
    } catch (e) { console.log(`    (skip ${src}: ${e.message.slice(0, 80)})`); }
  }
  for (const s of window.document.querySelectorAll('script:not([src]):not([type="application/ld+json"])')) {
    try { window.eval(s.textContent); } catch (e) { console.log(`    (inline skip: ${e.message.slice(0, 80)})`); }
  }
  return dom;
}

console.log('StardewTools DOM smoke tests\n');

// ---------------------------------------------------------------- crop profit
{
  const dom = await loadPage('dist/crop-profit-calculator/index.html');
  const doc = dom.window.document;
  const val = (id) => doc.getElementById(id)?.textContent ?? '';
  console.log('crop-profit-calculator:');
  // default: starfruit (selected), day 1 -> 25.0g/day raw
  const result = val('result-value');
  ok('starfruit default = 25g/day', result.startsWith('25'), `got "${result}"`);
  ok('harvests = 2', val('out-harvests') === '2', `got "${val('out-harvests')}"`);
  ok('profit = 700g', val('out-profit') === '700g', `got "${val('out-profit')}"`);
  // switch to keg view
  const view = doc.getElementById('view');
  view.value = 'keg';
  view.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  const kegResult = val('result-value');
  ok('starfruit wine = 132g/day', kegResult.startsWith('132'), `got "${kegResult}"`);
  // change planting day to 17 -> cannot finish
  const day = doc.getElementById('plant-day');
  day.value = '17';
  day.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  ok('day 17 starfruit cannot finish', val('result-value').includes('Cannot finish'), `got "${val('result-value')}"`);
  // ranking table rendered
  const rows = doc.getElementById('ranking-rows').querySelectorAll('tr');
  ok('ranking table has rows', rows.length >= 5, `got ${rows.length} rows`);
}

// ---------------------------------------------------------------- best crop
{
  const dom = await loadPage('dist/best-crop-calculator/index.html');
  const doc = dom.window.document;
  const val = (id) => doc.getElementById(id)?.textContent ?? '';
  console.log('\nbest-crop-calculator:');
  const rows = doc.getElementById('rows').querySelectorAll('tr');
  ok('spring ranking rendered', rows.length >= 5, `got ${rows.length} rows`);
  // switch to fall: pumpkin should rank high
  const season = doc.getElementById('season');
  season.value = 'fall';
  season.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  const html = doc.getElementById('rows').innerHTML;
  ok('fall ranking includes Pumpkin', html.includes('Pumpkin'), 'pumpkin missing');
  // late day: few crops can finish
  const day = doc.getElementById('day');
  day.value = '25';
  day.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  const lateRows = doc.getElementById('rows').querySelectorAll('tr');
  ok('day 25 has fewer plantable crops', lateRows.length < rows.length || lateRows.length <= 8, `got ${lateRows.length}`);
}

// ---------------------------------------------------------------- keg planner
{
  const dom = await loadPage('dist/keg-calculator/index.html');
  const doc = dom.window.document;
  const val = (id) => doc.getElementById(id)?.textContent ?? '';
  console.log('\nkeg-calculator:');
  // default: wine, 100 items, base 750, 50 machines, 28 days
  ok('per item = 2250g', val('out-peritem') === '2,250g', `got "${val('out-peritem')}"`);
  ok('capacity = 200 items (50×4)', val('out-capacity') === '200 items', `got "${val('out-capacity')}"`);
  ok('machines needed = 25', val('out-needed') === '25 machines', `got "${val('out-needed')}"`);
  // switch to jelly: 11 batches -> capacity 550
  const product = doc.getElementById('product');
  product.value = 'jelly';
  product.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  ok('jelly batches = 11', val('out-batches') === '11', `got "${val('out-batches')}"`);
  ok('jelly per item = 1550g (750×2+50)', val('out-peritem') === '1,550g', `got "${val('out-peritem')}"`);
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

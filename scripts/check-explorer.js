#!/usr/bin/env node
/* ---------------------------------------------------------------------------
   Checks the explorer against the canonical data file.

     node scripts/check-explorer.js

   For each of the nine views it renders every card with the page's own code
   (the script in explore.html, run in Node without a browser) and asserts:
     - every displayed figure equals the data file's display string, and each
       status text ("Not labeled in the report" and so on) matches the record;
     - figures belong to the selected view (cohort counts excepted), and no
       overall figure stands in for a missing subgroup figure;
     - every record the card is meant to show is shown, and metrics the report
       doesn't cover for the view say "Not reported for this category";
     - each card has at most four headline figures and at most one chart;
     - the group-size line and the small-group note use the approved wording;
     - no digits appear outside figures and data-derived text, so nothing is
       typed in by hand;
     - budget-band labels such as $250k-$999k sit in a nowrap span.
   It also checks that the data file is complete, that the CSV and the
   inventory are up to date, and that new files use CRLF line endings.
   No dependencies.
--------------------------------------------------------------------------- */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const build = require('./build-smu-profile.js');

const ROOT = path.resolve(__dirname, '..');
const failures = [];
let checks = 0;
function ok(cond, msg){ checks++; if(!cond) failures.push(msg); }

/* ---------------------------------------------------------------- load --- */
const D = build.loadData();
const html = fs.readFileSync(path.join(ROOT, 'explore.html'), 'utf8');
const m = html.match(/<script id="explorer-app">([\s\S]*?)<\/script>/);
if(!m) { console.error('explore.html: no <script id="explorer-app"> block'); process.exit(1); }
const sandbox = { window: { SMU_HOUSTON_PROFILE: D } };
vm.runInNewContext(m[1], sandbox, { filename: 'explore.html#explorer-app' });
const E = sandbox.window.SMU_EXPLORER;
if(!E) { console.error('explore.html did not define window.SMU_EXPLORER'); process.exit(1); }

const VIEW = Object.fromEntries(D.views.map(v=>[v.id, v]));
const MET = Object.fromEntries(D.metrics.map(x=>[x.id, x]));
const key = (mm, v, g, c) => [mm, v, g, c || ''].join('|');
const REC = {};
D.values.forEach(r=>{ REC[key(r.metric, r.view, r.geo, r.component)] = r; });
/* approved threshold: a note on every view where the Houston group has fewer than 20 organizations */
const SMALL_GROUP = 20;
const COHORT = new Set(['orgs_total', 'orgs_by_discipline_count', 'orgs_by_discipline_share', 'orgs_by_budget_count', 'orgs_by_budget_share']);
const covered = (mm, view) => MET[mm].coverage.includes(VIEW[view].mode);

/* ------------------------------------------------- tiny HTML reader --- */
/* Enough for the markup this page generates: walks tags, collects value
   spans (class "v" with data-m) and the free text outside value spans and
   data-derived (class "dx") spans. */
const VOID = new Set(['br', 'img', 'input', 'meta', 'link', 'hr', 'wbr']);
const decode = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
function read(src){
  const values = [], free = [];
  const stack = [];
  const re = /<(\/?)([a-zA-Z0-9]+)([^>]*)>|([^<]+)/g;
  let t, cur = null;
  while((t = re.exec(src))){
    if(t[4] !== undefined){
      const text = decode(t[4]);
      if(cur) cur.text += text;
      else if(!stack.some(s=>s.skip)) free.push(text);
      continue;
    }
    const [, close, tag, attrs] = t;
    const name = tag.toLowerCase();
    if(close){
      const top = stack.pop();
      if(top && top.value){ values.push(top.value); cur = null; }
      continue;
    }
    if(VOID.has(name) || /\/\s*$/.test(attrs)) continue;
    const cls = (attrs.match(/class="([^"]*)"/) || [, ''])[1].split(/\s+/);
    const a = {};
    attrs.replace(/data-([a-z]+)="([^"]*)"/g, (_, k, v)=>{ a[k] = v; });
    const entry = { tag: name, skip: cls.includes('dx') };
    if(cls.includes('v') && a.m !== undefined){
      if(cur) failures.push(`nested value span inside ${cur.m}`);
      cur = entry.value = { m: a.m, g: a.g, c: a.c, v: a.v, s: a.s, text: '' };
      entry.skip = true;
    }
    stack.push(entry);
  }
  return { values, free: free.join(' ') };
}
const textOf = s => decode(s.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();

function checkValues(where, values, view){
  for(const v of values){
    if(v.s === 'not-reported'){
      ok(!covered(v.m, view), `${where}: ${v.m} marked not reported but the report covers ${VIEW[view].mode}`);
      ok(v.text === E.STATUS_TEXT['not-reported'], `${where}: not-reported text "${v.text}"`);
      continue;
    }
    const r = REC[key(v.m, v.v, v.g, v.c)];
    ok(!!r, `${where}: no record for ${key(v.m, v.v, v.g, v.c)}`);
    if(!r) continue;
    ok(r.status === v.s, `${where}: ${key(v.m, v.v, v.g, v.c)} status ${v.s}, data says ${r.status}`);
    const want = r.status === 'reported' ? r.display : E.STATUS_TEXT[r.status];
    ok(v.text === want, `${where}: ${key(v.m, v.v, v.g, v.c)} shows "${v.text}", data says "${want}"`);
    ok(COHORT.has(v.m) ? v.v === 'overall' : v.v === view, `${where}: ${v.m} from view ${v.v} shown in view ${view}`);
  }
}
function checkFree(where, free){
  ok(!/\d/.test(free), `${where}: digits outside figures and data text: "${(free.match(/.{0,30}\d.{0,30}/) || [''])[0].trim()}"`);
}
const BAND = /\$\d[\d.]*[kKM]-\$\d[\d.]*[kKM]/g;
function checkBands(where, src){
  let b;
  BAND.lastIndex = 0;
  while((b = BAND.exec(src))){
    ok(src.slice(0, b.index).endsWith('<span class="nw">'), `${where}: band label "${b[0]}" is not in a nowrap span`);
  }
}

/* ---------------------------------------------------- data integrity --- */
for(const mt of D.metrics){
  for(const v of D.views){
    if(!covered(mt.id, v.id)) continue;
    if(mt.coverage.length === 1 && v.id !== 'overall') continue;   /* cohort metrics live on overall */
    for(const g of ['houston', 'national']){
      for(const c of (mt.components || [null])){
        ok(!!REC[key(mt.id, v.id, g, c)], `data: missing ${key(mt.id, v.id, g, c)}`);
      }
    }
  }
}
for(const r of D.values){
  ok(r.status === 'reported' ? (r.value !== null && typeof r.display === 'string') : (r.value === null && r.display === null),
    `data: ${key(r.metric, r.view, r.geo, r.component)} value/display don't fit status ${r.status}`);
  ok(covered(r.metric, r.view), `data: ${key(r.metric, r.view, r.geo, r.component)} outside the metric's coverage`);
}

/* ------------------------------------------------------- every view --- */
const exact = {
  group: (h, n) => `Based on a group of ${h} Houston and ${n} national benchmark organizations.`,
  small: h => `A small group: these averages come from a group of ${h} Houston organizations, and one organization can move them substantially.`
};
const nRec = (view, geo) => VIEW[view].mode === 'overall' ? REC[key('orgs_total', 'overall', geo)]
  : REC[key(VIEW[view].mode === 'discipline' ? 'orgs_by_discipline_count' : 'orgs_by_budget_count', 'overall', geo, view)];

for(const v of D.views){
  const view = v.id;
  const all = E.renderCards(view);
  const cards = all.split(/(?=<section class="card")/).filter(Boolean);
  ok(cards.length === E.CARDS.length, `${view}: ${cards.length} cards rendered, expected ${E.CARDS.length}`);
  checkBands(`${view}`, all);

  cards.forEach((card, i)=>{
    const cfg = E.CARDS[i];
    const where = `${view} / ${cfg.section}`;
    const { values, free } = read(card);
    checkValues(where, values, view);
    checkFree(where, free);
    const figs = (card.match(/class="fig-item"/g) || []).length;
    const charts = (card.match(/<figure class="chart"/g) || []).length;
    ok(figs >= 1 && figs <= 4, `${where}: ${figs} headline figures`);
    ok(charts <= 1, `${where}: ${charts} charts`);

    const h = nRec(view, 'houston').display, n = nRec(view, 'national').display;
    const gl = card.match(/<p class="groupline">([\s\S]*?)<\/p>/);
    const sn = card.match(/<p class="smallnote">([\s\S]*?)<\/p>/);
    if(cfg.section === 'sector-profile'){
      ok(!gl, `${where}: unexpected group line`);
    } else {
      ok(gl && textOf(gl[1]) === exact.group(h, n), `${where}: group line reads "${gl && textOf(gl[1])}"`);
      if(nRec(view, 'houston').value < SMALL_GROUP) ok(sn && textOf(sn[1]) === exact.small(h), `${where}: small-group note reads "${sn && textOf(sn[1])}"`);
      else ok(!sn, `${where}: small-group note on a group of ${h}`);
    }

    /* each figure sits in the right slot: Houston in Houston's place, the
       national benchmark in its own, and each label over its own metric */
    const slot = (re, want, what) => { let x; re.lastIndex = 0; while((x = re.exec(card))) ok(want(x), `${where}: ${what} "${x.slice(1).map(t=>textOf(t).slice(0, 60)).join('" / "')}"`); };
    slot(/<span class="fig-h"><span class="[^"]*" data-m="[^"]*" data-g="([^"]*)"/g, x=>x[1] === 'houston', 'Houston headline slot holds');
    slot(/<span class="fig-n"><span class="[^"]*" data-m="[^"]*" data-g="([^"]*)"/g, x=>x[1] === 'national', 'national headline slot holds');
    slot(/<div class="bar (h|n)">(?:(?!<div class="bar)[\s\S])*?data-g="([^"]*)"/g, x=>(x[1] === 'h') === (x[2] === 'houston'), 'bar slot / geography');
    slot(/<th scope="row">(?:(?!<\/tr>)[\s\S])*?<\/th><td class="num">((?:(?!<\/td>)[\s\S])*)<\/td><td class="num">((?:(?!<\/td>)[\s\S])*)<\/td>/g,
      x=>[...x[1].matchAll(/data-g="([^"]*)"/g)].every(g=>g[1] === 'houston') && [...x[2].matchAll(/data-g="([^"]*)"/g)].every(g=>g[1] === 'national'), 'table columns hold');
    slot(/<div class="fig-item"><dt>([^<]*)<\/dt><dd>(?:(?!<\/dd>)[\s\S])*?data-m="([^"]*)" data-g="[^"]*" data-c="([^"]*)"/g,
      x=>decode(x[1]).startsWith(COHORT.has(x[2]) ? MET.orgs_total.label : MET[x[2]].label) && (!x[3] || COHORT.has(x[2]) || MET[x[2]].components.length <= 2 || decode(x[1]).endsWith(D.componentLabels[x[3]])), 'headline label / metric');
    slot(/<div class="crow[^"]*"><p class="crow-label">((?:(?!<\/p>)[\s\S])*)<\/p><div class="bars">((?:(?!<div class="crow|<\/figure>)[\s\S])*)/g, x=>{
      const label = textOf(x[1]).replace(/^Selected: /, '');
      const cs = [...x[2].matchAll(/data-g="([^"]*)" data-c="([^"]*)"/g)];
      if(label === 'Houston' || label === 'National benchmark') return cs.every(c=>c[1] === (label === 'Houston' ? 'houston' : 'national'));
      return cs.length > 0 && cs.every(c=>(VIEW[c[2]] ? VIEW[c[2]].label : D.componentLabels[c[2]]) === label);
    }, 'chart row label / values');
    slot(/<tr class="sub"><th scope="row">((?:(?!<\/th>)[\s\S])*)<\/th>((?:(?!<\/tr>)[\s\S])*)/g, x=>{
      const label = textOf(x[1]);
      return [...x[2].matchAll(/data-c="([^"]*)"/g)].every(c=>(VIEW[c[1]] ? VIEW[c[1]].label : D.componentLabels[c[1]]) === label);
    }, 'table row label / values');

    /* every record the card is meant to show is shown */
    const shown = new Set(values.map(x=>key(x.m, x.v, x.g, x.c)));
    const notReported = new Set(values.filter(x=>x.s === 'not-reported').map(x=>x.m));
    const want = [];
    (cfg.figs || []).forEach(f=>{ want.push([f.m, f.c]); if(f.sub) want.push([f.m, f.sub]); });
    if(cfg.chart) (MET[cfg.chart.m].components || [null]).forEach(c=>want.push([cfg.chart.m, c]));
    (cfg.table || []).forEach(id=>(MET[id].components || [null]).forEach(c=>want.push([id, c])));
    for(const [mm, c] of want){
      if(!covered(mm, view)) { ok(notReported.has(mm), `${where}: ${mm} should say "Not reported for this category"`); continue; }
      for(const g of ['houston', 'national']){
        ok(shown.has(key(mm, view, g, c)), `${where}: ${key(mm, view, g, c)} not shown`);
      }
    }
    if(cfg.section === 'sector-profile'){
      const comp = v.mode === 'budget' ? 'orgs_by_budget_share' : 'orgs_by_discipline_share';
      for(const c of MET[comp].components) for(const g of ['houston', 'national']){
        ok(shown.has(key(comp, 'overall', g, c)), `${where}: ${comp} ${g} ${c} not shown`);
        ok(shown.has(key(comp.replace('_share', '_count'), 'overall', g, c)), `${where}: count ${g} ${c} not shown`);
      }
      if(v.mode !== 'overall') ok(textOf(card).includes(v.cardDefinition || v.definition), `${where}: group definition missing`);
    }
    if(cfg.section === 'funding'){
      const note = MET.avg_revenue.tableNote;
      ok(card.includes(note) === covered('avg_revenue', view), `${where}: revenue note ${covered('avg_revenue', view) ? 'missing' : 'shown without revenue'}`);
      ok(card.includes(MET.earned_vs_contributed.cardNote), `${where}: earned revenue definition missing`);
    }
  });

  const st = read(E.statusText(view));
  checkValues(`${view} / status`, st.values, view);
  checkFree(`${view} / status`, st.free);
}

/* exact approved wording in the data file */
ok(MET.avg_revenue.tableNote === "Average revenue minus average expenses doesn't equal the operating surplus or deficit. The report gives the operating result separately.", 'revenue note wording');
ok(MET.earned_vs_contributed.cardNote === 'Earned revenue includes admissions, ticket sales, and program fees.', 'earned revenue wording');
ok(/media and communications/i.test(VIEW.visual.cardDefinition) && /NTEE A3/.test(VIEW.visual.cardDefinition), 'Visual Arts definition names media and communications (NTEE A3)');

/* surrounding text */
for(const [name, fn] of [['about', E.aboutHTML], ['standfirst', E.standfirst], ['hero meta', E.heroMeta], ['credit', E.creditHTML]]){
  const out = fn();
  const r = read(out);
  checkValues(name, r.values, 'overall');
  checkFree(name, r.free);
  checkBands(name, out);
}
ok(E.keepBands('$250k-$999k') === '<span class="nw">$250k-$999k</span>', 'keepBands: $250k-$999k');
ok(E.keepBands('$1M-$2.99M') === '<span class="nw">$1M-$2.99M</span>', 'keepBands: $1M-$2.99M');
ok(E.keepBands('0-20%') === '<span class="nw">0-20%</span>', 'keepBands: 0-20%');

/* ------------------------------------------- generated files, endings --- */
ok(fs.readFileSync(build.CSV, 'utf8') === build.buildCSV(D), 'data/smu-houston-profile.csv is stale: run node scripts/build-smu-profile.js');
ok(fs.readFileSync(build.INVENTORY, 'utf8') === build.buildInventory(D), 'docs/smu-houston-profile-inventory.md is stale: run node scripts/build-smu-profile.js');
for(const f of ['index.html', 'explore.html', 'data/smu-houston-profile.js', 'data/smu-houston-profile.csv',
  'docs/smu-houston-profile-inventory.md', 'docs/explorer.md', 'scripts/build-smu-profile.js', 'scripts/check-explorer.js']){
  const p = path.join(ROOT, f);
  if(!fs.existsSync(p)) { ok(false, `${f} missing`); continue; }
  const s = fs.readFileSync(p, 'utf8');
  ok(!/(^|[^\r])\n/.test(s), `${f}: has LF-only line endings`);
}

/* -------------------------------------------------------------- report --- */
if(failures.length){
  console.error(`FAIL: ${failures.length} of ${checks} checks failed`);
  failures.slice(0, 50).forEach(f=>console.error('  - ' + f));
  process.exit(1);
}
console.log(`PASS: ${checks} checks across ${D.views.length} views`);

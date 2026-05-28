#!/usr/bin/env node
// build_ufo_dashboard_v4.js — Collapsible cards + tighter summaries
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT = '/home/lilbooduh/ufo-dashboard';
const OUT = path.join(PROJECT, 'dashboard.html');
const INDEX = path.join(PROJECT, 'index.html');

// ── Release 01 data ──
const r1Data = JSON.parse(fs.readFileSync(path.join(PROJECT, 'data/r1_data.json'), 'utf8'));

// ── Release 02 AI summaries (hand-curated) ──
const r2AiSummaries = {
  'CIA-UAP-D001': {
    summary: 'A CIA intelligence report on the Soviet Sary Shagan weapons testing range contains an extraordinary detail: in late summer 1973, a former Soviet citizen reported observing "an unidentified sharp (bright) green circular object or mass in the sky" near Site 7. Within 10-15 seconds, the green circle widened and "several green concentric circles formed around the mass." There was no sound or explosion. The CIA included this UAP sighting in a classified intelligence report about Soviet weapons testing facilities.',
    keyFacts: ['Green concentric circles over Soviet weapons test range', 'CIA filed UAP sighting in official intelligence report', 'No sound or explosion — ruled out conventional weapons', 'Former Soviet citizen with access to restricted facility']
  },
  'ODNI-UAP-D001': {
    summary: 'A senior U.S. intelligence officer recounts an hour-long helicopter mission that turned into a series of close UAP encounters. Investigating reports of loud thuds and orbs on a military test range, the team observed: countless orange orbs swarming a mountainside; two large orange orbs flaring up stationary beside their helicopter at 700ft in a T-formation; orbs splitting and chasing fighter jets. Multiple sensors confirmed: FLIR, NVG, naked eye, and ground radar. The officer and pilots were "virtually speechless" after landing.',
    keyFacts: ['Senior USIC official — first-hand witness', 'Multi-sensor: FLIR, NVG, radar, naked eye', 'Orbs within 10ft of helicopter rotor disk', 'Orbs chasing fighter jets at 23,000ft', 'T-formation, splitting, swarming behavior', 'Fighter jets scrambled to assist']
  },
  'DOE-UAP-D001': {
    summary: 'An incident report from the Pantex Plant — America\'s primary nuclear weapons assembly and disassembly facility near Amarillo, Texas. Ground Surveillance Radar Tower tracked an unidentified object near the facility. Sandia National Laboratories produced enhanced images for analysis. UCNI classification reflects nuclear security sensitivity.',
    keyFacts: ['Pantex — one of America\'s most secure nuclear sites', 'Object tracked by Ground Surveillance Radar', 'Sandia National Labs enhanced image analysis', 'Object remains unidentified']
  },
  'DOE-UAP-D002': {
    summary: 'Manhattan Project physicist James L. Tuck — a nuclear fusion pioneer who worked on the atomic bomb at Los Alamos — wrote to the U.S. Army requesting "the recipe that was used for the simulated atomic blast (fireball radiations)" to study UFO propulsion physics. A colleague\'s follow-up references Einstein\'s unified field theory. Top-tier nuclear physicists were actively researching UFO propulsion in 1973.',
    keyFacts: ['James L. Tuck — Manhattan Project physicist', 'Requested atomic blast data to study UFO propulsion', 'Referenced Condon Report on UFOs', 'Colleague cited Einstein\'s unified field theory', 'Los Alamos connections, dated 1973']
  },
  'DOE-UAP-D003': {
    summary: 'A 1986 newsletter from the "Pajarito Astronomers" — a UFO interest group operating inside Los Alamos National Laboratory. Their May meeting featured Dr. John Warren of AT-6 speaking on "Why Should a Scientist be Concerned about UFO\'s?" Meetings were held at Fuller Lodge, a historic Manhattan Project-era building. The DOE preserved and classified this newsletter.',
    keyFacts: ['UFO society inside Los Alamos National Laboratory', 'Meetings at historic Manhattan Project building', 'Guest speaker from AT-6 division', 'Scientists discussing UFOs at nuclear weapons lab, 1986']
  },
  'DOW-UAP-D017': {
    summary: 'A 200-page classified correspondence collection (1949) between the 1100th USAF Special Reporting Group and Sandia Base — the primary nuclear weapons storage facility. Documents cover security inspections, guard orders, alert plans, fence integrity, and nuclear stockpile custody. The 11th Airborne Division\'s defensive arrangements are discussed. Included in PURSUE for the implicit nuclear-UAP connection.',
    keyFacts: ['200 pages of 1949 nuclear security documents', 'Sandia Base — primary nuclear storage facility', '1100th USAF Special Reporting Group', '11th Airborne Division defense arrangements', 'Implicit nuclear-UAP connection']
  }
};

// ── Load R2 CSV ──
const csvText = fs.readFileSync('/tmp/uap-data.csv', 'utf8');
const { parse } = require('csv-parse/sync');
const csvRows = parse(csvText, { columns: true, skip_empty_lines: true, relax_column_count: true });

const r2CsvData = csvRows
  .filter(r => r['Release Date'] && r['Release Date'].trim() === '5/22/26')
  .map(r => ({
    title: (r['Title'] || '').trim(),
    type: (r['Type'] || '').trim(),
    agency: (r['Agency'] || '').trim(),
    date: (r['Incident Date'] || '').trim(),
    location: (r['Incident Location'] || '').trim(),
    description: (r['Description Blurb'] || '').trim(),
    pdfUrl: (r['PDF | Image Link'] || '').trim(),
    imageUrl: (r['Modal Image'] || '').trim(),
    dvidsId: (r['DVIDS Video ID'] || '').trim(),
  }));

function extractDocId(title) {
  const m = title.match(/^([A-Z]+-UAP-[A-Z]+\d+)/);
  return m ? m[1] : title;
}

// ── Condense video description to a tight preview ──
function condenseVideoDesc(desc) {
  if (!desc) return '';
  // Strip the AARO preamble that's on every video
  let clean = desc.replace(/On March 6, 2026, eight members of the U\.S\. House of Representatives requested access to 51 potentially UAP-related records allegedly held by the Department of War and the Intelligence Community\. The All-domain Anomaly Resolution Office \(AARO\) identified a collection of responsive materials held on a classified network\. Many of these materials lack a substantiated chain-of-custody\.\s*/g, '');
  clean = clean.replace(/AARO assesses that this video, whose uploader-defined title is.*?\. A user uploaded this video to a classified network in \w+ \d{4}\.\s*/g, '');
  clean = clean.replace(/This video description is provided for informational purposes only\..*$/s, '');
  clean = clean.replace(/Video Duration: [^\n]*\n?/g, '');
  clean = clean.replace(/Video Description:\s*/g, '');
  clean = clean.replace(/^\s+|\s+$/g, '');
  // Take first 400 chars as preview
  if (clean.length > 400) {
    clean = clean.substring(0, clean.lastIndexOf(' ', 400)) + '…';
  }
  return clean || desc.substring(0, 300);
}

// ── Build R2 entries ──
const r2Entries = r2CsvData.map(r => {
  const docId = extractDocId(r.title);
  const aiSummary = r2AiSummaries[docId];
  const isPdf = r.type === 'PDF';
  const isVideo = r.type === 'VID';
  const isAudio = r.type === 'AUD';
  
  let pages = 0, chars = 0;
  if (isPdf && aiSummary) {
    const pdfDir = path.join(PROJECT, 'r2_pdfs/release_02_document_bundle');
    const files = fs.readdirSync(pdfDir).filter(f => f.startsWith(docId) && f.endsWith('.pdf'));
    if (files.length > 0) {
      try {
        chars = parseInt(execSync(`pdftotext "${path.join(pdfDir, files[0])}" - 2>/dev/null | wc -c`, {encoding:'utf8'})) || 0;
        pages = parseInt(execSync(`pdfinfo "${path.join(pdfDir, files[0])}" 2>/dev/null | grep Pages | awk '{print $2}'`, {encoding:'utf8'})) || 0;
      } catch(e) {}
    }
  }
  
  const fullSummary = aiSummary ? aiSummary.summary : (isVideo ? r.description : r.description);
  const preview = isVideo ? condenseVideoDesc(r.description) : fullSummary.substring(0, 200);
  
  return {
    title: r.title,
    type: r.type,
    agency: r.agency,
    classification: isPdf ? (docId.includes('DOW') ? 'SECRET' : docId.includes('CIA') ? 'CONFIDENTIAL' : docId.includes('DOE') && docId === 'DOE-UAP-D001' ? 'UCNI' : 'UNCLASSIFIED') : 'UNCLASSIFIED',
    date: r.date, location: r.location,
    pages, chars,
    summary: fullSummary,
    preview,
    keyFacts: aiSummary ? aiSummary.keyFacts : [],
    pdfUrl: r.pdfUrl, dvidsId: r.dvidsId,
    isVideo, isAudio,
    release: '02', releaseDate: 'May 22, 2026'
  };
});

// ── R1 entries ──
const allR1 = r1Data.map(d => ({
  title: d.title || d.filename || '',
  type: 'PDF', agency: d.agency || 'Department of War',
  classification: d.classification || 'UNCLASSIFIED',
  date: d.date || '', location: '',
  pages: d.pages || 0, chars: d.chars || 0,
  summary: (d.para1 || '') + '\n\n' + (d.para2 || ''),
  preview: ((d.para1 || '') + ' ' + (d.para2 || '')).substring(0, 200),
  keyFacts: [], pdfUrl: d.pdf_url || '',
  dvidsId: '', isVideo: false, isAudio: false,
  release: '01', releaseDate: 'May 8, 2026'
}));

const allData = [...allR1, ...r2Entries];

// ── Stats ──
function calcStats(data) {
  const s = { total: data.length, pages: 0, chars: 0, ag: {}, cl: {}, ty: {}, vi: 0, au: 0 };
  data.forEach(d => {
    s.pages += d.pages || 0; s.chars += d.chars || 0;
    s.ag[d.agency] = (s.ag[d.agency] || 0) + 1;
    s.cl[d.classification] = (s.cl[d.classification] || 0) + 1;
    const t = d.isVideo ? 'Video' : d.isAudio ? 'Audio' : 'PDF';
    s.ty[t] = (s.ty[t] || 0) + 1;
    if (d.isVideo) s.vi++; if (d.isAudio) s.au++;
  });
  return s;
}
const s1 = calcStats(allR1), s2 = calcStats(r2Entries), sAll = calcStats(allData);

// ── Helpers ──
function esc(s) { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function badgeClass(c) {
  if (!c) return 'bu';
  const u = c.toUpperCase();
  if (u.includes('TOP SECRET') || u.includes('SECRET')) return 'bs';
  if (u.includes('CONFIDENTIAL') || u.includes('UCNI')) return 'bc';
  return 'bu';
}

function buildStatCards(s) {
  const agEntries = Object.entries(s.ag).sort((a,b) => b[1]-a[1]);
  const clEntries = Object.entries(s.cl).sort((a,b) => b[1]-a[1]);
  const tyEntries = Object.entries(s.ty).sort((a,b) => b[1]-a[1]);
  const classified = clEntries.filter(([c]) => !c.includes('UNCLASS')).reduce((sum,[,n]) => sum+n, 0);
  return `
  <div class="sc"><div class="n">${s.total}</div><div class="l">Files</div></div>
  <div class="sc"><div class="n">${s.pages.toLocaleString()}</div><div class="l">Pages</div></div>
  <div class="sc"><div class="n">${Object.keys(s.ag).length}</div><div class="l">Agencies</div><div class="s">${agEntries.slice(0,6).map(([k,v])=>k+': '+v).join('<br>')}</div></div>
  <div class="sc"><div class="n">${Object.keys(s.ty).length}</div><div class="l">Types</div><div class="s">${tyEntries.map(([k,v])=>k+': '+v).join('<br>')}</div></div>
  <div class="sc"><div class="n">${classified}</div><div class="l">Classified</div><div class="s">${clEntries.map(([k,v])=>k+': '+v).join('<br>')}</div></div>
  <div class="sc"><div class="n">${(s.chars/1e6).toFixed(1)}M</div><div class="l">Characters</div></div>`;
}

// ── Collapsible card HTML ──
function buildFileCards(data) {
  const sorted = [...data].sort((a,b) => {
    const clOrder = {'TOP SECRET':0,'SECRET':1,'CONFIDENTIAL':2,'UCNI':3};
    return (clOrder[a.classification]||99) - (clOrder[b.classification]||99) || (b.chars||0) - (a.chars||0);
  });

  return sorted.map(d => {
    const tagClass = badgeClass(d.classification);
    const summary = d.summary || '';
    const hasKf = d.keyFacts && d.keyFacts.length > 0;
    const isR2 = d.release === '02';
    const vidBadge = d.isVideo ? '<span class="b vid-badge">🎬 VIDEO</span>' : '';
    const audBadge = d.isAudio ? '<span class="b aud-badge">🔊 AUDIO</span>' : '';
    const r2Badge = isR2 ? '<span class="b r2-badge">R2</span>' : '';
    const typeLabel = d.isVideo ? 'Video' : d.isAudio ? 'Audio' : 'PDF';
    
    let mediaLink = '';
    if (d.isVideo && d.dvidsId) mediaLink = `<a class="orig-link" href="https://www.dvidshub.net/video/${d.dvidsId}" target="_blank" rel="noopener">🎬 DVIDS →</a>`;
    else if (d.isAudio && d.dvidsId) mediaLink = `<a class="orig-link" href="https://www.dvidshub.net/video/${d.dvidsId}" target="_blank" rel="noopener">🔊 DVIDS →</a>`;
    else if (d.pdfUrl) mediaLink = `<a class="orig-link" href="${esc(d.pdfUrl)}" target="_blank" rel="noopener">📎 PDF →</a>`;
    
    const kfHTML = hasKf ? d.keyFacts.map(f => `<span class="kf-tag">${esc(f)}</span>`).join('') : '';
    const locInfo = d.location ? `📍 ${esc(d.location)}` : '';
    const dateInfo = d.date ? `📅 ${esc(d.date)}` : '';
    const pagesInfo = d.pages ? `${d.pages}p` : '';
    
    const previewText = d.preview || summary.substring(0, 200);
    const hasMore = summary.length > previewText.length + 20;
    
    return `<div class="fc${isR2 ? ' r2-highlight' : ''}" data-q="${esc((d.title+' '+d.agency+' '+summary+' '+(d.keyFacts||[]).join(' ')+(d.location||'')).toLowerCase())}" data-a="${esc(d.agency)}" data-t="${esc(typeLabel)}" data-c="${esc(d.classification)}" data-r="${d.release}">
      <div class="fc-header" onclick="toggleCard(this.parentElement)" title="Click to expand/collapse">
        <span class="fc-title">${esc(d.title)}</span>
        <span class="fc-meta">
          <span class="b ${tagClass}">${esc(d.classification)}</span>
          <span class="b ba">${esc(d.agency)}</span>
          <span class="b bt">${typeLabel}</span>
          ${vidBadge}${audBadge}${r2Badge}
          ${pagesInfo ? `<span class="fc-pg">${pagesInfo}</span>` : ''}
          ${dateInfo ? `<span class="fc-dt">${esc(d.date)}</span>` : ''}
          ${locInfo ? `<span class="fc-lc">${esc(d.location)}</span>` : ''}
          <span class="fc-arrow">▶</span>
        </span>
      </div>
      <div class="fc-preview">${esc(previewText)}${hasMore ? ' <span class="fc-more">[… click to expand]</span>' : ''}</div>
      <div class="fc-body" style="display:none">
        <div class="fc-fulltext">${esc(summary)}</div>
        ${kfHTML ? `<div class="fc-facts">${kfHTML}</div>` : ''}
        <div class="fc-footer">${mediaLink}</div>
      </div>
    </div>`;
  }).join('');
}

// ── R2 highlight facts ──
function buildFactsSection() {
  const pdfEntries = r2Entries.filter(e => e.type === 'PDF' && e.keyFacts.length > 0);
  const allFacts = [];
  pdfEntries.forEach(d => d.keyFacts.forEach(f => allFacts.push({fact:f, file:d.title.split(',')[0], agency:d.agency})));
  const extras = [
    {fact:'51 military sensor videos — FLIR, radar, NVG footage worldwide', file:'Release 02 Videos', agency:'Department of War'},
    {fact:'7 NASA mission audio excerpts — Apollo & Mercury astronauts describing anomalous lights', file:'Release 02 Audio', agency:'NASA'},
    {fact:'Persian Gulf, East China Sea, Afghanistan, CENTCOM, EUCOM — 2017-2024', file:'Release 02 Videos', agency:'Department of War'},
    {fact:'F/A-18 FLIR gun camera footage of UAP', file:'DOW-UAP-PR069', agency:'Department of War'},
    {fact:'USAF F-16C shoots down UAP — kinetic engagement footage', file:'DOW-UAP-PR071', agency:'Department of War'},
    {fact:'USCG C-144 TIC TAC — Coast Guard IR, 2 videos, April 2024', file:'DOW-UAP-PR065/066', agency:'Department of War'},
  ];
  extras.forEach(f => allFacts.push(f));
  
  return `
  <div class="facts-section" id="facts">
    <div class="facts-header">
      <h2>🔍 Release 02 — Complete Breakdown</h2>
      <div class="facts-sub">64 total files: 6 declassified documents + 51 military sensor videos + 7 NASA audio excerpts · May 22, 2026</div>
    </div>
    <div class="facts-grid">${allFacts.map(f => `
    <div class="fact-card">
      <div class="fact-badge">${esc(f.agency)}</div>
      <div class="fact-text">${esc(f.fact)}</div>
      <div class="fact-file">${esc(f.file)}</div>
    </div>`).join('')}</div>
  </div>`;
}

function uniqueVals(data, key) {
  const vals = {};
  data.forEach(d => { 
    let v = key === 'type' ? (d.isVideo ? 'Video' : d.isAudio ? 'Audio' : 'PDF') : d[key];
    if (v) vals[v] = (vals[v]||0)+1; 
  });
  return vals;
}
const allAgencies = uniqueVals(allData, 'agency');
const allTypes = uniqueVals(allData, 'type');
const allClasses = uniqueVals(allData, 'classification');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HTML OUTPUT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>🛸 PURSUE — UAP Files Dashboard</title>
<style>
:root{--bg:#0a0a10;--sf:#141420;--bd:#1e1e3a;--tx:#e0e0f0;--mu:#8888aa;--ac:#4fc3f7;--sc:#ff5252;--cf:#ffab40;--uc:#66bb6a;--r2:#ffd700}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--tx);font-family:-apple-system,'Segoe UI',system-ui,sans-serif;line-height:1.6}
header{background:linear-gradient(135deg,#0d1b2a,#1b2838,#0d1b2a);border-bottom:1px solid #1a1a3a;padding:2rem;text-align:center}
header h1{font-size:2rem;color:var(--ac);margin-bottom:.25rem;letter-spacing:-0.5px}
header .byline{color:var(--mu);font-size:.8rem}
header .links{margin-top:.75rem;display:flex;gap:.5rem;justify-content:center;flex-wrap:wrap}
header .links a{color:var(--ac);text-decoration:none;font-size:.7rem;border:1px solid rgba(79,195,247,.2);padding:.2rem .6rem;border-radius:4px;transition:all .2s}
header .links a:hover{background:rgba(79,195,247,.1);border-color:var(--ac)}

/* Tabs */
.tabs{max-width:1200px;margin:1.25rem auto 0;padding:0 1.5rem;display:flex;gap:.5rem;border-bottom:1px solid var(--bd)}
.tab-btn{background:none;border:none;color:var(--mu);padding:.6rem 1.25rem;font-size:.8rem;font-weight:600;cursor:pointer;border-bottom:2px solid transparent;transition:all .2s;font-family:inherit}
.tab-btn:hover{color:var(--tx)}
.tab-btn.active{color:var(--ac);border-bottom-color:var(--ac)}
.tab-btn .badge{background:var(--r2);color:#000;font-size:.6rem;padding:.1rem .35rem;border-radius:3px;margin-left:.35rem;font-weight:700}

/* Facts section */
.facts-section{max-width:1200px;margin:1.25rem auto;padding:0 1.5rem}
.facts-header{text-align:center;margin-bottom:1.25rem}
.facts-header h2{font-size:1.35rem;color:var(--ac);margin-bottom:.2rem}
.facts-sub{color:var(--mu);font-size:.8rem}
.facts-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:.6rem}
.fact-card{background:var(--sf);border:1px solid var(--bd);border-radius:8px;padding:1rem;transition:border-color .2s,transform .2s}
.fact-card:hover{border-color:var(--r2);transform:translateY(-1px)}
.fact-badge{display:inline-block;background:rgba(255,215,0,.15);color:var(--r2);font-size:.6rem;font-weight:700;padding:.1rem .4rem;border-radius:3px;margin-bottom:.4rem}
.fact-text{color:var(--tx);font-size:.8rem;line-height:1.5}
.fact-file{color:var(--mu);font-size:.6rem;margin-top:.35rem}

/* Stats */
.st-section{display:none}
.st-section.active{display:block}
.st{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:.6rem;padding:1.25rem 1.5rem;max-width:1200px;margin:0 auto}
.sc{background:var(--sf);border:1px solid var(--bd);border-radius:8px;padding:1rem;text-align:center;transition:border-color .2s}
.sc:hover{border-color:var(--ac)}
.sc .n{font-size:1.8rem;font-weight:700;color:var(--ac)}
.sc .l{color:var(--mu);font-size:.65rem;text-transform:uppercase;margin-top:.2rem;letter-spacing:.5px}
.sc .s{font-size:.6rem;color:var(--mu);margin-top:.4rem;line-height:1.4}

/* Controls */
.ct{max-width:1200px;margin:0 auto;padding:0 1.5rem 1rem;display:flex;gap:.4rem;flex-wrap:wrap;align-items:center}
.ct input,.ct select{background:var(--sf);border:1px solid var(--bd);color:var(--tx);padding:.5rem .75rem;border-radius:6px;font-size:.8rem;outline:none;font-family:inherit}
.ct input:focus,.ct select:focus{border-color:var(--ac)}
.ct input{flex:1;min-width:180px}
.ct input::placeholder{color:var(--mu)}
.ct .result-count{color:var(--mu);font-size:.7rem;margin-left:auto}

.ctrl-btn{background:rgba(79,195,247,.12);border:1px solid rgba(79,195,247,.25);color:var(--ac);padding:.5rem .85rem;border-radius:6px;font-size:.75rem;font-weight:600;cursor:pointer;transition:all .2s;font-family:inherit;white-space:nowrap}
.ctrl-btn:hover{background:rgba(79,195,247,.2);border-color:var(--ac)}
.ctrl-btn:disabled{opacity:.5;cursor:not-allowed}

/* ── COLLAPSIBLE CARDS ── */
.fl{max-width:1200px;margin:0 auto;padding:0 1.5rem 4rem}
.fl-section{display:none}
.fl-section.active{display:block}

.fc{background:var(--sf);border:1px solid var(--bd);border-radius:8px;padding:0;margin-bottom:.5rem;transition:border-color .15s;overflow:hidden}
.fc:hover{border-color:var(--ac)}
.fc.r2-highlight{border-color:rgba(255,215,0,.12)}
.fc.r2-highlight:hover{border-color:var(--r2)}
.fc.expanded{border-color:var(--ac);box-shadow:0 0 12px rgba(79,195,247,.06)}

.fc-header{cursor:pointer;display:flex;justify-content:space-between;align-items:center;padding:.7rem 1rem;gap:.5rem;user-select:none;transition:background .15s}
.fc-header:hover{background:rgba(255,255,255,.02)}
.fc-title{font-weight:600;color:var(--ac);font-size:.85rem;flex:1;min-width:0;word-break:break-word;line-height:1.3;font-family:'SF Mono','Cascadia Code',monospace}
.fc-meta{display:flex;gap:.3rem;align-items:center;flex-wrap:wrap;flex-shrink:0;font-size:.65rem}
.fc-pg{color:var(--mu);font-size:.65rem;margin-left:.15rem}
.fc-dt{color:var(--mu);font-size:.65rem;font-style:italic;max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.fc-lc{color:var(--mu);font-size:.6rem;max-width:90px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.fc-arrow{color:var(--mu);font-size:.6rem;transition:transform .2s;margin-left:.15rem}
.fc.expanded .fc-arrow{transform:rotate(90deg)}

.fc-preview{padding:0 1rem .6rem;color:var(--mu);font-size:.78rem;line-height:1.5;white-space:pre-line}
.fc-more{color:var(--ac);font-size:.7rem;font-style:italic;cursor:pointer}

.fc-body{padding:0 1rem .8rem;border-top:1px solid rgba(255,255,255,.04)}
.fc-fulltext{color:var(--tx);font-size:.82rem;line-height:1.65;white-space:pre-line;padding-top:.6rem}
.fc-facts{display:flex;gap:.3rem;flex-wrap:wrap;margin-top:.5rem}
.fc-footer{margin-top:.5rem;padding-top:.4rem;border-top:1px solid rgba(255,255,255,.03);display:flex;gap:.5rem;flex-wrap:wrap}

.b{padding:.15rem .45rem;border-radius:3px;font-weight:600;text-transform:uppercase;font-size:.6rem;letter-spacing:.5px;white-space:nowrap}
.bs{background:rgba(255,82,82,.15);color:var(--sc);border:1px solid rgba(255,82,82,.25)}
.bc{background:rgba(255,171,64,.15);color:var(--cf);border:1px solid rgba(255,171,64,.25)}
.bu{background:rgba(102,187,106,.1);color:var(--uc);border:1px solid rgba(102,187,106,.18)}
.ba{background:rgba(79,195,247,.1);color:var(--ac);border:1px solid rgba(79,195,247,.15)}
.bt{background:rgba(150,150,200,.06);color:#aaaacc;border:1px solid rgba(150,150,200,.1)}
.vid-badge{background:rgba(255,100,100,.1);color:#ff6b6b;border:1px solid rgba(255,100,100,.18)}
.aud-badge{background:rgba(100,200,255,.1);color:#64b5f6;border:1px solid rgba(100,200,255,.18)}
.r2-badge{background:rgba(255,215,0,.12);color:var(--r2);border:1px solid rgba(255,215,0,.2)}

.kf-tag{background:rgba(255,215,0,.06);color:var(--r2);font-size:.6rem;padding:.1rem .4rem;border-radius:3px;border:1px solid rgba(255,215,0,.12);white-space:nowrap}
.orig-link{color:var(--ac);text-decoration:none;font-weight:600;border:1px solid rgba(79,195,247,.15);padding:.15rem .5rem;border-radius:4px;font-size:.65rem;transition:background .2s}
.orig-link:hover{background:rgba(79,195,247,.08)}

.check-status{color:var(--mu);font-size:.7rem}

footer{text-align:center;color:var(--mu);padding:1.5rem;font-size:.7rem;border-top:1px solid var(--bd)}
footer a{color:var(--ac)}

@media(max-width:600px){
  .fc-header{flex-direction:column;align-items:flex-start}
  .ct{flex-direction:column}
  header h1{font-size:1.4rem}
  .tab-btn{font-size:.7rem;padding:.5rem .8rem}
  .tabs{padding:0 .75rem}
  .st,.ct,.fl,.facts-section{padding-left:.75rem;padding-right:.75rem}
}
</style>
</head>
<body>

<header>
  <h1>🛸 PURSUE — UAP Files Dashboard</h1>
  <div class="byline">Presidential Unsealing and Reporting System for UAP Encounters</div>
  <div class="byline" style="margin-top:.4rem">${sAll.total} Files · ${sAll.pages.toLocaleString()} Pages · ${Object.keys(sAll.ag).length} Agencies · ${(sAll.chars/1e6).toFixed(1)}M Characters</div>
  <div class="links">
    <a href="https://www.war.gov/UFO/" target="_blank" rel="noopener">📋 war.gov/UFO →</a>
    <a href="https://www.war.gov/News/Releases/Release/Article/4480582/" target="_blank" rel="noopener">📰 DOW Press Release →</a>
    <a href="https://www.war.gov/UFO/?releaseDate=Release+02#records" target="_blank" rel="noopener">📦 Release 02 →</a>
  </div>
</header>

<div class="tabs">
  <button class="tab-btn active" onclick="switchTab('all')">📁 All</button>
  <button class="tab-btn" onclick="switchTab('r1')">📦 Release 01 <span style="color:var(--mu);font-size:.65rem">May 8</span></button>
  <button class="tab-btn r2-tab" onclick="switchTab('r2')">✨ Release 02 <span class="badge">64</span> <span style="color:var(--mu);font-size:.65rem">May 22</span></button>
</div>

<div class="st-section active" id="sec-facts">${buildFactsSection()}</div>

<div class="st-section active" id="sec-stats-all"><div class="st">${buildStatCards(sAll)}</div></div>
<div class="st-section" id="sec-stats-r1"><div class="st">${buildStatCards(s1)}</div></div>
<div class="st-section" id="sec-stats-r2"><div class="st">${buildStatCards(s2)}</div></div>

<div class="ct">
  <input type="text" id="q" placeholder="🔍 Search by title, content, agency, location..." oninput="doFilter()">
  <select id="af" onchange="doFilter()"><option value="">All Agencies</option>${Object.keys(allAgencies).sort().map(a=>`<option value="${esc(a)}">${esc(a)} (${allAgencies[a]})</option>`).join('')}</select>
  <select id="tf" onchange="doFilter()"><option value="">All Types</option>${Object.keys(allTypes).sort().map(t=>`<option value="${esc(t)}">${esc(t)} (${allTypes[t]})</option>`).join('')}</select>
  <select id="cf" onchange="doFilter()"><option value="">All Classification</option>${Object.keys(allClasses).sort().map(c=>`<option value="${esc(c)}">${esc(c)} (${allClasses[c]})</option>`).join('')}</select>
  <button class="ctrl-btn" onclick="expandAll()">▼ Expand All</button>
  <button class="ctrl-btn" onclick="collapseAll()">▲ Collapse All</button>
  <button class="ctrl-btn" onclick="checkForUpdates()" id="checkBtn">🔄 Check</button>
  <span class="check-status" id="checkStatus"></span>
  <span class="result-count" id="resultCount">${allData.length} files</span>
</div>

<div class="fl-section active" id="sec-fl-all"><div class="fl">${buildFileCards(allData)}</div></div>
<div class="fl-section" id="sec-fl-r1"><div class="fl">${buildFileCards(allR1)}</div></div>
<div class="fl-section" id="sec-fl-r2"><div class="fl">${buildFileCards(r2Entries)}</div></div>

<footer>
  Built by Ky · OpenClaw · Raspberry Pi 5 · ${new Date().toLocaleString('en-US',{timeZone:'America/Los_Angeles'})} PT · <a href="https://www.war.gov/UFO/" target="_blank" rel="noopener">war.gov/UFO</a>
</footer>

<script>
let currentTab = 'all';

(function initTab() {
  const hash = window.location.hash.replace('#', '');
  if (hash === 'r1' || hash === 'r2' || hash === 'all') switchTab(hash);
})();
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#', '');
  if ((hash === 'r1' || hash === 'r2' || hash === 'all') && hash !== currentTab) switchTab(hash);
});

function switchTab(tab) {
  currentTab = tab;
  window.location.hash = tab;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => {
    if ((tab==='all' && b.textContent.includes('All')) ||
        (tab==='r1' && b.textContent.includes('Release 01')) ||
        (tab==='r2' && b.textContent.includes('Release 02'))) {
      b.classList.add('active');
    }
  });
  document.querySelectorAll('.st-section').forEach(s => s.classList.remove('active'));
  const statsEl = document.getElementById('sec-stats-' + tab);
  if (statsEl) statsEl.classList.add('active');
  const factsEl = document.getElementById('sec-facts');
  if (factsEl) factsEl.style.display = (tab === 'all' || tab === 'r2') ? '' : 'none';
  document.querySelectorAll('.fl-section').forEach(s => s.classList.remove('active'));
  const flEl = document.getElementById('sec-fl-' + tab);
  if (flEl) flEl.classList.add('active');
  doFilter();
}

// ── Collapsible card logic ──
function toggleCard(card) {
  const body = card.querySelector('.fc-body');
  if (!body) return;
  if (body.style.display === 'none') {
    body.style.display = 'block';
    card.classList.add('expanded');
  } else {
    body.style.display = 'none';
    card.classList.remove('expanded');
  }
}

function expandAll() {
  const container = document.getElementById('sec-fl-' + currentTab);
  if (!container) return;
  container.querySelectorAll('.fc-body').forEach(b => b.style.display = 'block');
  container.querySelectorAll('.fc').forEach(c => c.classList.add('expanded'));
}

function collapseAll() {
  const container = document.getElementById('sec-fl-' + currentTab);
  if (!container) return;
  container.querySelectorAll('.fc-body').forEach(b => b.style.display = 'none');
  container.querySelectorAll('.fc').forEach(c => c.classList.remove('expanded'));
}

function doFilter() {
  const q = (document.getElementById('q').value || '').toLowerCase();
  const a = document.getElementById('af').value;
  const t = document.getElementById('tf').value;
  const c = document.getElementById('cf').value;
  let count = 0;
  const container = document.getElementById('sec-fl-' + currentTab);
  if (!container) return;
  container.querySelectorAll('.fc').forEach(card => {
    if (currentTab !== 'all' && card.dataset.r !== (currentTab === 'r1' ? '01' : '02')) {
      card.style.display = 'none'; return;
    }
    const match = (!q || card.dataset.q.includes(q)) && (!a || card.dataset.a === a) && (!t || card.dataset.t === t) && (!c || card.dataset.c === c);
    card.style.display = match ? '' : 'none';
    if (match) count++;
  });
  document.getElementById('resultCount').textContent = count + ' files';
}

async function checkForUpdates() {
  const btn = document.getElementById('checkBtn');
  const status = document.getElementById('checkStatus');
  btn.disabled = true;
  status.textContent = '⏳ Checking...';
  try {
    const resp = await fetch('https://www.war.gov/UFO/', { signal: AbortSignal.timeout(15000) });
    const text = await resp.text();
    const releases = [...new Set([...text.matchAll(/[Rr]elease\\s*(\\d+)/g)].map(m => m[1]))];
    const latest = releases.length ? Math.max(...releases.map(Number)) : null;
    if (latest > 2) status.innerHTML = '🆕 <b style="color:#ffd700">Release '+latest+'!</b> <a href="https://www.war.gov/UFO/" style="color:var(--ac)">View →</a>';
    else if (latest === 2) status.innerHTML = '✅ <span style="color:var(--uc)">Latest: Release 02</span>';
    else status.innerHTML = '⚠️ <a href="https://www.war.gov/UFO/" style="color:var(--ac)">Check manually →</a>';
  } catch(e) { status.textContent = '❌ Offline'; }
  btn.disabled = false;
}
</script>
</body>
</html>`;

fs.writeFileSync(OUT, html);
fs.writeFileSync(INDEX, html);
console.log(`✅ Dashboard: ${OUT} (${(html.length/1024).toFixed(1)} KB)`);
console.log(`📊 ${allData.length} files (R1: ${allR1.length} PDFs, R2: ${r2Entries.filter(e=>e.type==='PDF').length} PDFs + ${r2Entries.filter(e=>e.isVideo).length} videos + ${r2Entries.filter(e=>e.isAudio).length} audio)`);

#!/usr/bin/env node
// build_ufo_dashboard_v3.js — Complete PURSUE dashboard with ALL R1+R2 records
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT = '/home/lilbooduh/ufo-dashboard';
const OUT = path.join(PROJECT, 'dashboard.html');
const INDEX = path.join(PROJECT, 'index.html');

// ── Release 01 data ──
const r1Data = JSON.parse(fs.readFileSync(path.join(PROJECT, 'data/r1_data.json'), 'utf8'));

// ── Release 02 hand-curated AI summaries (keep these!) ──
const r2AiSummaries = {
  'CIA-UAP-D001': {
    summary: 'A CIA intelligence information report on the Soviet Sary Shagan weapons testing range contains an extraordinary detail: in late summer 1973, a former Soviet citizen reported observing "an unidentified sharp (bright) green circular object or mass in the sky" near Site 7. Within 10-15 seconds, the green circle widened and "several green concentric circles formed around the mass." There was no sound or explosion. The observer could not estimate the object\'s altitude. This sighting was deemed significant enough for the CIA to include it in a classified intelligence report about Soviet weapons testing facilities — proving intelligence agencies have long documented UAP encounters alongside traditional military intelligence.',
    keyFacts: ['Green concentric circles observed over Soviet weapons test range', 'CIA filed UAP sighting in official intelligence report', 'No sound or explosion — ruled out conventional weapons', 'Observer was former Soviet citizen with access to restricted facility', 'Dated November 1972–November 1973 observation period']
  },
  'ODNI-UAP-D001': {
    summary: 'A senior U.S. intelligence officer provides a harrowing first-person account of a helicopter mission that turned into an hour-long series of close UAP encounters. The officer, along with two pilots, investigated reports of loud thuds and orb sightings on a military test range. After hours of searching, radar detected hits in the area — and what followed defies explanation. The team observed: countless orange orbs swarming a mountainside; two large orange orbs flaring up stationary beside their helicopter at 700ft in a T-formation; orbs splitting into multiple objects; and orbs "chasing" fighter jets, matching their speed and flight path. Multiple sensor systems confirmed the observations: FLIR, NVG, naked eye, and ground radar. Fighter jets were scrambled to assist in identification. The officer and pilots were "virtually speechless" after landing.',
    keyFacts: ['Senior USIC official — first-hand witness', 'Multiple sensor confirmation: FLIR, NVG, radar, naked eye', 'Orbs within 10 feet of helicopter rotor disk', 'Orbs matching and chasing fighter jets at 23,000ft', 'Intelligent formation behavior: T-shapes, splitting, swarming', 'Fighter jets scrambled to assist identification', 'Event lasted over one hour', 'Witnesses "virtually speechless" after encounter']
  },
  'DOE-UAP-D001': {
    summary: 'An incident report from the Pantex Plant — the primary U.S. nuclear weapons assembly and disassembly facility near Amarillo, Texas. This document contains images from the Ground Surveillance Radar Tower showing an unidentified object in proximity to the facility. Sandia National Laboratories produced enhanced images of the object for analysis. The classification marking "UCNI" (Unclassified Controlled Nuclear Information) indicates the sensitivity of nuclear facility security data.',
    keyFacts: ['Pantex nuclear weapons facility — one of the most secure sites in America', 'Object tracked by Ground Surveillance Radar Tower', 'Sandia National Labs performed enhanced image analysis', 'UCNI classification — nuclear security sensitivity', 'Object remains unidentified']
  },
  'DOE-UAP-D002': {
    summary: 'A letter from James L. Tuck — a Manhattan Project physicist who worked on the atomic bomb at Los Alamos — to the U.S. Army Engineering School requesting "the recipe that was used for the simulated atomic blast (fireball radiations)" to study "large atmospheric vortices" reported in Dr. Edward Condon\'s "Scientific Study of Unidentified Flying Objects." Tuck, a pioneer in nuclear fusion research, was investigating whether nuclear-scale energy phenomena could explain UFO propulsion.',
    keyFacts: ['James L. Tuck — Manhattan Project physicist, nuclear fusion pioneer', 'Requested atomic blast simulation data to study UFO propulsion', 'Referenced Condon Report on UFOs', 'Colleague cited Einstein\'s unified field theory as relevant to UFO physics', 'Los Alamos connections throughout', 'Dated 1973 — peak Cold War era']
  },
  'DOE-UAP-D003': {
    summary: 'A newsletter from the "Pajarito Astronomers" — a UFO interest group operating at Los Alamos National Laboratory, with a P.O. Box in Los Alamos, NM. The May 1986 meeting featured Dr. John Warren of AT-6 speaking on "Why Should a Scientist be Concerned about UFO\'s?" The group met at Fuller Lodge, a historic Manhattan Project-era building in the heart of Los Alamos.',
    keyFacts: ['UFO society operating inside Los Alamos National Laboratory', 'Meetings held at Fuller Lodge — historic Manhattan Project building', 'Guest speaker was Dr. John Warren of AT-6 division', 'Scientists meeting to discuss UFOs at nuclear weapons lab in 1986', 'DOE preserved and classified the newsletter']
  },
  'DOW-UAP-D017': {
    summary: 'A 200-page collection of classified correspondence between the 1100th USAF Special Reporting Group and Sandia Base (the nuclear weapons storage facility in Albuquerque, NM), dated 1949. Documents cover security inspections, guard orders, alert plans, fence integrity, radio communications with Camp Campbell Military Police, and nuclear stockpile custody procedures. The 11th Airborne Division\'s defensive arrangements for the base are discussed. While not directly about UAPs, this massive file reveals the extreme security posture around nuclear weapons in the early Cold War — the same facilities and personnel that would become central to the UAP-nuclear connection documented across decades of reports.',
    keyFacts: ['200 pages of 1949 nuclear weapons security documents', 'Sandia Base — primary nuclear weapons storage facility', '1100th USAF Special Reporting Group communications', '11th Airborne Division defense arrangements', 'Early Cold War nuclear security posture', 'Included in PURSUE release — implicit nuclear-UAP connection']
  }
};

// ── Load R2 CSV data ──
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
    videoTitle: (r['Video Title'] || '').trim(),
    pdfPairing: (r['PDF Pairing'] || '').trim(),
    videoPairing: (r['Video Pairing'] || '').trim(),
  }));

console.log(`R2 CSV records: ${r2CsvData.length}`);

// ── Build R2 entries from CSV + AI summaries ──
function extractDocId(title) {
  const m = title.match(/^([A-Z]+-UAP-[A-Z]+\d+)/);
  return m ? m[1] : title;
}

const r2Entries = r2CsvData.map(r => {
  const docId = extractDocId(r.title);
  const aiSummary = r2AiSummaries[docId];
  const isPdf = r.type === 'PDF';
  const isVideo = r.type === 'VID';
  const isAudio = r.type === 'AUD';
  
  // Get page count for PDFs
  let pages = 0;
  let chars = 0;
  if (isPdf && aiSummary) {
    const txtPath = path.join(PROJECT, 'r2_text', docId + '.txt');
    // Try to find text file
    const pdfDir = path.join(PROJECT, 'r2_pdfs/release_02_document_bundle');
    const files = fs.readdirSync(pdfDir).filter(f => f.startsWith(docId) && f.endsWith('.pdf'));
    if (files.length > 0) {
      try {
        const txt = execSync(`pdftotext "${path.join(pdfDir, files[0])}" - 2>/dev/null | wc -c`, { encoding: 'utf8' });
        chars = parseInt(txt) || 0;
        const pgTxt = execSync(`pdfinfo "${path.join(pdfDir, files[0])}" 2>/dev/null | grep Pages | awk '{print $2}'`, { encoding: 'utf8' });
        pages = parseInt(pgTxt) || 0;
      } catch(e) {}
    }
  }
  
  // For videos/audio, estimate based on description length
  if (!chars) chars = r.description.length;
  
  return {
    title: r.title,
    type: r.type,
    agency: r.agency,
    classification: isPdf ? (docId.includes('DOW') ? 'SECRET' : docId.includes('CIA') ? 'CONFIDENTIAL' : docId.includes('DOE') && docId === 'DOE-UAP-D001' ? 'UCNI' : 'UNCLASSIFIED') : (isVideo ? 'UNCLASSIFIED' : 'UNCLASSIFIED'),
    date: r.date,
    location: r.location,
    pages: pages,
    chars: chars,
    summary: aiSummary ? aiSummary.summary : r.description,
    keyFacts: aiSummary ? aiSummary.keyFacts : [],
    pdfUrl: r.pdfUrl,
    dvidsId: r.dvidsId,
    pdfPairing: r.pdfPairing,
    isVideo: isVideo,
    isAudio: isAudio,
    release: '02',
    releaseDate: 'May 22, 2026'
  };
});

console.log(`R2 entries built: ${r2Entries.length}`);
console.log(`  PDFs: ${r2Entries.filter(e => e.type === 'PDF').length}`);
console.log(`  Videos: ${r2Entries.filter(e => e.isVideo).length}`);
console.log(`  Audio: ${r2Entries.filter(e => e.isAudio).length}`);

// ── Combine R1 + R2 ──
const allR1 = r1Data.map(d => ({
  title: d.title || d.filename || '',
  type: 'PDF',
  agency: d.agency || 'Department of War',
  classification: d.classification || 'UNCLASSIFIED',
  date: d.date || '',
  location: '',
  pages: d.pages || 0,
  chars: d.chars || 0,
  summary: (d.para1 || '') + '\n\n' + (d.para2 || ''),
  keyFacts: [],
  pdfUrl: d.pdf_url || '',
  dvidsId: '',
  isVideo: false,
  isAudio: false,
  release: '01',
  releaseDate: 'May 8, 2026'
}));

const allData = [...allR1, ...r2Entries];
console.log(`\nTotal entries: ${allData.length} (R1: ${allR1.length}, R2: ${r2Entries.length})`);

// ── Stats ──
function calcStats(data) {
  const s = { total: data.length, pages: 0, chars: 0, ag: {}, cl: {}, ty: {}, vi: 0, au: 0 };
  data.forEach(d => {
    s.pages += d.pages || 0;
    s.chars += d.chars || 0;
    s.ag[d.agency] = (s.ag[d.agency] || 0) + 1;
    s.cl[d.classification] = (s.cl[d.classification] || 0) + 1;
    const t = d.isVideo ? 'Video' : d.isAudio ? 'Audio' : 'PDF';
    s.ty[t] = (s.ty[t] || 0) + 1;
    if (d.isVideo) s.vi++;
    if (d.isAudio) s.au++;
  });
  return s;
}

const s1 = calcStats(allR1);
const s2 = calcStats(r2Entries);
const sAll = calcStats(allData);

console.log(`Stats: R1=${s1.total}, R2=${s2.total}, All=${sAll.total}`);
console.log(`R2 breakdown: ${s2.vi} videos, ${s2.au} audio, ${s2.total - s2.vi - s2.au} PDFs`);

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

function buildFileCards(data) {
  const sorted = [...data].sort((a,b) => {
    const clOrder = {'TOP SECRET':0,'SECRET':1,'CONFIDENTIAL':2,'UCNI':3};
    return (clOrder[a.classification]||99) - (clOrder[b.classification]||99) || (b.chars||0) - (a.chars||0);
  });

  return sorted.map(d => {
    const tagClass = badgeClass(d.classification);
    const summary = d.summary || d.description || '';
    const hasKf = d.keyFacts && d.keyFacts.length > 0;
    const isR2 = d.release === '02';
    const vidBadge = d.isVideo ? '<span class="b" style="background:rgba(255,100,100,.12);color:#ff6b6b;border:1px solid rgba(255,100,100,.2)">🎬 VIDEO</span>' : '';
    const audBadge = d.isAudio ? '<span class="b" style="background:rgba(100,200,255,.12);color:#64b5f6;border:1px solid rgba(100,200,255,.2)">🔊 AUDIO</span>' : '';
    const r2Badge = isR2 ? '<span class="b" style="background:rgba(255,215,0,.15);color:#ffd700;border:1px solid rgba(255,215,0,.25)">R2 ✨</span>' : '';
    
    // Media link
    let mediaLink = '';
    if (d.isVideo && d.dvidsId) {
      mediaLink = `<a class="orig-link" href="https://www.dvidshub.net/video/${d.dvidsId}" target="_blank" rel="noopener">🎬 Watch on DVIDS →</a>`;
    } else if (d.isAudio && d.dvidsId) {
      mediaLink = `<a class="orig-link" href="https://www.dvidshub.net/video/${d.dvidsId}" target="_blank" rel="noopener">🔊 Listen on DVIDS →</a>`;
    } else if (d.pdfUrl) {
      mediaLink = `<a class="orig-link" href="${esc(d.pdfUrl)}" target="_blank" rel="noopener">📎 View original PDF</a>`;
    } else if (d.dvidsId && !d.isVideo && !d.isAudio) {
      mediaLink = `<a class="orig-link" href="https://www.dvidshub.net/video/${d.dvidsId}" target="_blank" rel="noopener">📎 View on DVIDS →</a>`;
    }
    
    // Key facts tags
    const factsHTML = hasKf ? `<div class="kf">${d.keyFacts.map(f => `<span class="kf-tag">${esc(f)}</span>`).join('')}</div>` : '';
    
    // Location and date info
    const locInfo = d.location ? `📍 ${esc(d.location)}` : '';
    const dateInfo = d.date ? `📅 ${esc(d.date)}` : '';
    
    return `<div class="fc${isR2 ? ' r2-highlight' : ''}" data-q="${esc((d.title+' '+d.agency+' '+summary+' '+(d.keyFacts||[]).join(' ')+(d.location||'')).toLowerCase())}" data-a="${esc(d.agency)}" data-t="${esc(d.isVideo ? 'Video' : d.isAudio ? 'Audio' : 'PDF')}" data-c="${esc(d.classification)}" data-r="${d.release}">
      <div class="fh">
        <span class="ft">${esc(d.title)}</span>
        <div class="fm">
          <span class="b ${tagClass}">${esc(d.classification)}</span>
          <span class="b ba">${esc(d.agency)}</span>
          <span class="b bt">${d.isVideo ? 'Video' : d.isAudio ? 'Audio' : 'PDF'}</span>
          ${vidBadge}${audBadge}${r2Badge}
        </div>
      </div>
      <div class="fs">${esc(summary.substring(0, 1500))}${summary.length > 1500 ? '...' : ''}</div>
      ${factsHTML}
      <div class="fr">
        ${mediaLink}
        ${dateInfo ? '<span>' + dateInfo + '</span>' : ''}
        ${locInfo ? '<span>' + locInfo + '</span>' : ''}
        ${d.pages ? '<span>📄 ' + d.pages + ' pg</span>' : ''}
        ${d.chars ? '<span>📝 ' + d.chars.toLocaleString() + ' chars</span>' : ''}
      </div>
    </div>`;
  }).join('');
}

// ── Build R2 highlight facts ──
function buildFactsSection() {
  const pdfEntries = r2Entries.filter(e => e.type === 'PDF' && e.keyFacts.length > 0);
  const allFacts = [];
  pdfEntries.forEach(d => {
    d.keyFacts.forEach(f => allFacts.push({ fact: f, file: d.title.split(',')[0], agency: d.agency }));
  });
  
  // Add standout facts from videos
  const standoutVideos = [
    { fact: '51 military sensor videos — FLIR, radar, NVG footage of UAP encounters worldwide', file: 'Release 02 Videos', agency: 'Department of War' },
    { fact: '7 NASA mission audio excerpts — Apollo & Mercury astronauts describing anomalous lights', file: 'Release 02 Audio', agency: 'NASA' },
    { fact: 'Videos span 2017-2024 — Persian Gulf, East China Sea, Afghanistan, CENTCOM, EUCOM', file: 'Release 02 Videos', agency: 'Department of War' },
    { fact: 'F/A-18 FLIR video included — fighter jet gun camera footage of UAP', file: 'DOW-UAP-PR069', agency: 'Department of War' },
    { fact: 'USAF F-16C shoots down UAP — gun camera footage of kinetic engagement', file: 'DOW-UAP-PR071', agency: 'Department of War' },
    { fact: 'USCG C-144 TIC TAC UAP — Coast Guard IR footage, 2 videos, April 2024', file: 'DOW-UAP-PR065/066', agency: 'Department of War' },
  ];
  
  standoutVideos.forEach(f => allFacts.push(f));
  
  const cards = allFacts.map(f => `
    <div class="fact-card">
      <div class="fact-badge">${esc(f.agency)}</div>
      <div class="fact-text">${esc(f.fact)}</div>
      <div class="fact-file">${esc(f.file)}</div>
    </div>`).join('');

  return `
  <div class="facts-section" id="facts">
    <div class="facts-header">
      <h2>🔍 Release 02 — Complete Breakdown</h2>
      <div class="facts-sub">64 total files: 6 declassified documents + 51 military sensor videos + 7 NASA audio excerpts · May 22, 2026</div>
    </div>
    <div class="facts-grid">${cards}</div>
  </div>`;
}

// ── Unique values for filters ──
function uniqueVals(data, key) {
  const vals = {};
  data.forEach(d => { 
    let v;
    if (key === 'type') v = d.isVideo ? 'Video' : d.isAudio ? 'Audio' : 'PDF';
    else v = d[key];
    if (v) vals[v] = (vals[v]||0)+1; 
  });
  return vals;
}

const allAgencies = uniqueVals(allData, 'agency');
const allTypes = uniqueVals(allData, 'type');
const allClasses = uniqueVals(allData, 'classification');

// ── HTML ──
const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>🛸 PURSUE — UAP Files Dashboard</title>
<style>
:root{--bg:#0a0a10;--sf:#141420;--bd:#1e1e3a;--tx:#e0e0f0;--mu:#8888aa;--ac:#4fc3f7;--sc:#ff5252;--cf:#ffab40;--uc:#66bb6a;--r2:#ffd700}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--tx);font-family:-apple-system,'Segoe UI',system-ui,sans-serif;line-height:1.7}
header{background:linear-gradient(135deg,#0d1b2a,#1b2838,#0d1b2a);border-bottom:1px solid #1a1a3a;padding:2.5rem 2rem;text-align:center}
header h1{font-size:2.2rem;color:var(--ac);margin-bottom:.3rem;letter-spacing:-0.5px}
header .byline{color:var(--mu);font-size:.85rem}
header .links{margin-top:.75rem;display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap}
header .links a{color:var(--ac);text-decoration:none;font-size:.75rem;border:1px solid rgba(79,195,247,.2);padding:.25rem .75rem;border-radius:4px;transition:all .2s}
header .links a:hover{background:rgba(79,195,247,.1);border-color:var(--ac)}

.tabs{max-width:1200px;margin:1.5rem auto 0;padding:0 2rem;display:flex;gap:.5rem;border-bottom:1px solid var(--bd)}
.tab-btn{background:none;border:none;color:var(--mu);padding:.75rem 1.5rem;font-size:.85rem;font-weight:600;cursor:pointer;border-bottom:2px solid transparent;transition:all .2s;font-family:inherit}
.tab-btn:hover{color:var(--tx)}
.tab-btn.active{color:var(--ac);border-bottom-color:var(--ac)}
.tab-btn .badge{background:var(--r2);color:#000;font-size:.6rem;padding:.1rem .35rem;border-radius:3px;margin-left:.4rem;font-weight:700}

.facts-section{max-width:1200px;margin:1.5rem auto;padding:0 2rem}
.facts-header{text-align:center;margin-bottom:1.5rem}
.facts-header h2{font-size:1.5rem;color:var(--ac);margin-bottom:.25rem}
.facts-sub{color:var(--mu);font-size:.85rem}
.facts-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:.75rem}
.fact-card{background:var(--sf);border:1px solid var(--bd);border-radius:10px;padding:1.25rem;transition:border-color .2s,transform .2s}
.fact-card:hover{border-color:var(--r2);transform:translateY(-2px)}
.fact-badge{display:inline-block;background:rgba(255,215,0,.15);color:var(--r2);font-size:.65rem;font-weight:700;padding:.15rem .5rem;border-radius:3px;margin-bottom:.5rem}
.fact-text{color:var(--tx);font-size:.85rem;line-height:1.5}
.fact-file{color:var(--mu);font-size:.65rem;margin-top:.5rem}

.st-section{display:none}
.st-section.active{display:block}
.st{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:.75rem;padding:1.5rem 2rem;max-width:1200px;margin:0 auto}
.sc{background:var(--sf);border:1px solid var(--bd);border-radius:8px;padding:1.25rem;text-align:center;transition:border-color .2s}
.sc:hover{border-color:var(--ac)}
.sc .n{font-size:2rem;font-weight:700;color:var(--ac)}
.sc .l{color:var(--mu);font-size:.7rem;text-transform:uppercase;margin-top:.25rem;letter-spacing:.5px}
.sc .s{font-size:.65rem;color:var(--mu);margin-top:.5rem;line-height:1.5}

.ct{max-width:1200px;margin:0 auto;padding:0 2rem 1.5rem;display:flex;gap:.5rem;flex-wrap:wrap;align-items:center}
.ct input,.ct select{background:var(--sf);border:1px solid var(--bd);color:var(--tx);padding:.6rem 1rem;border-radius:6px;font-size:.85rem;outline:none;font-family:inherit}
.ct input:focus,.ct select:focus{border-color:var(--ac)}
.ct input{flex:1;min-width:200px}
.ct input::placeholder{color:var(--mu)}
.ct .result-count{color:var(--mu);font-size:.75rem;margin-left:auto}

.check-btn{background:rgba(79,195,247,.15);border:1px solid rgba(79,195,247,.35);color:var(--ac);padding:.6rem 1.5rem;border-radius:6px;font-size:.85rem;font-weight:600;cursor:pointer;transition:all .2s;font-family:inherit;white-space:nowrap}
.check-btn:hover{background:rgba(79,195,247,.25);border-color:var(--ac)}
.check-btn:disabled{opacity:.5;cursor:not-allowed}
.check-status{color:var(--mu);font-size:.75rem;margin-left:.5rem}

.fl{max-width:1200px;margin:0 auto;padding:0 2rem 4rem}
.fl-section{display:none}
.fl-section.active{display:block}
.fc{background:var(--sf);border:1px solid var(--bd);border-radius:10px;padding:1.5rem;margin-bottom:1rem;transition:border-color .2s,box-shadow .2s}
.fc:hover{border-color:var(--ac);box-shadow:0 0 16px rgba(79,195,247,.06)}
.fc.r2-highlight{border-color:rgba(255,215,0,.15)}
.fc.r2-highlight:hover{border-color:var(--r2)}
.fh{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:.5rem;margin-bottom:.75rem;border-bottom:1px solid var(--bd);padding-bottom:.75rem}
.ft{font-weight:600;color:var(--ac);font-size:.95rem;word-break:break-word;font-family:'SF Mono','Cascadia Code',monospace}
.fm{display:flex;gap:.4rem;flex-wrap:wrap;font-size:.75rem}
.b{padding:.2rem .6rem;border-radius:4px;font-weight:600;text-transform:uppercase;font-size:.65rem;letter-spacing:.5px;white-space:nowrap}
.bs{background:rgba(255,82,82,.15);color:var(--sc);border:1px solid rgba(255,82,82,.25)}
.bc{background:rgba(255,171,64,.15);color:var(--cf);border:1px solid rgba(255,171,64,.25)}
.bu{background:rgba(102,187,106,.12);color:var(--uc);border:1px solid rgba(102,187,106,.2)}
.ba{background:rgba(79,195,247,.1);color:var(--ac);border:1px solid rgba(79,195,247,.18)}
.bt{background:rgba(150,150,200,.08);color:#aaaacc;border:1px solid rgba(150,150,200,.12)}
.fs{color:var(--tx);font-size:.88rem;line-height:1.7;white-space:pre-line}
.fr{margin-top:.75rem;padding-top:.5rem;border-top:1px solid rgba(255,255,255,.05);font-size:.7rem;color:var(--mu);display:flex;gap:1.5rem;flex-wrap:wrap;align-items:center}
.orig-link{color:var(--ac);text-decoration:none;font-weight:600;border:1px solid rgba(79,195,247,.2);padding:.2rem .6rem;border-radius:4px;transition:background .2s;white-space:nowrap}
.orig-link:hover{background:rgba(79,195,247,.1)}

.kf{display:flex;gap:.4rem;flex-wrap:wrap;margin-top:.5rem}
.kf-tag{background:rgba(255,215,0,.08);color:var(--r2);font-size:.65rem;padding:.15rem .5rem;border-radius:3px;border:1px solid rgba(255,215,0,.15)}

footer{text-align:center;color:var(--mu);padding:2rem;font-size:.75rem;border-top:1px solid var(--bd)}
footer a{color:var(--ac)}

@media(max-width:600px){
  .fh{flex-direction:column}
  .ct{flex-direction:column}
  header h1{font-size:1.5rem}
  .tab-btn{font-size:.75rem;padding:.6rem 1rem}
  .tabs{padding:0 1rem}
  .st,.ct,.fl,.facts-section{padding-left:1rem;padding-right:1rem}
}
</style>
</head>
<body>

<header>
  <h1>🛸 PURSUE — UAP Files Dashboard</h1>
  <div class="byline">Presidential Unsealing and Reporting System for UAP Encounters</div>
  <div class="byline" style="margin-top:.5rem">${sAll.total} Files · ${sAll.pages.toLocaleString()} Pages · ${Object.keys(sAll.ag).length} Agencies · ${(sAll.chars/1e6).toFixed(1)}M Characters</div>
  <div class="links">
    <a href="https://www.war.gov/UFO/" target="_blank" rel="noopener">📋 Official PURSUE page →</a>
    <a href="https://www.war.gov/News/Releases/Release/Article/4480582/" target="_blank" rel="noopener">📰 DOW Press Release →</a>
    <a href="https://www.war.gov/UFO/?releaseDate=Release+02#records" target="_blank" rel="noopener">📦 Release 02 on war.gov →</a>
  </div>
</header>

<div class="tabs">
  <button class="tab-btn active" onclick="switchTab('all')">📁 All Releases</button>
  <button class="tab-btn" onclick="switchTab('r1')">📦 Release 01 <span style="color:var(--mu);font-size:.7rem">May 8, 2026</span></button>
  <button class="tab-btn r2-tab" onclick="switchTab('r2')">✨ Release 02 <span class="badge">64 FILES</span> <span style="color:var(--mu);font-size:.7rem">May 22, 2026</span></button>
</div>

<div class="st-section active" id="sec-facts">
${buildFactsSection()}
</div>

<div class="st-section active" id="sec-stats-all">
<div class="st">${buildStatCards(sAll)}</div>
</div>
<div class="st-section" id="sec-stats-r1">
<div class="st">${buildStatCards(s1)}</div>
</div>
<div class="st-section" id="sec-stats-r2">
<div class="st">${buildStatCards(s2)}</div>
</div>

<div class="ct">
  <input type="text" id="q" placeholder="🔍 Search by title, content, agency, location..." oninput="doFilter()">
  <select id="af" onchange="doFilter()"><option value="">All Agencies</option>${Object.keys(allAgencies).sort().map(a=>`<option value="${esc(a)}">${esc(a)} (${allAgencies[a]})</option>`).join('')}</select>
  <select id="tf" onchange="doFilter()"><option value="">All Types</option>${Object.keys(allTypes).sort().map(t=>`<option value="${esc(t)}">${esc(t)} (${allTypes[t]})</option>`).join('')}</select>
  <select id="cf" onchange="doFilter()"><option value="">All Classification</option>${Object.keys(allClasses).sort().map(c=>`<option value="${esc(c)}">${esc(c)} (${allClasses[c]})</option>`).join('')}</select>
  <button class="check-btn" onclick="checkForUpdates()" id="checkBtn">🔄 Check for Updates</button>
  <span class="check-status" id="checkStatus"></span>
  <span class="result-count" id="resultCount">${allData.length} files</span>
</div>

<div class="fl-section active" id="sec-fl-all">
  <div class="fl">${buildFileCards(allData)}</div>
</div>
<div class="fl-section" id="sec-fl-r1">
  <div class="fl">${buildFileCards(allR1)}</div>
</div>
<div class="fl-section" id="sec-fl-r2">
  <div class="fl">${buildFileCards(r2Entries)}</div>
</div>

<footer>
  Built by Ky · OpenClaw · Raspberry Pi 5 · ${new Date().toLocaleString('en-US',{timeZone:'America/Los_Angeles'})} PT<br>
  Data source: <a href="https://www.war.gov/UFO/" target="_blank" rel="noopener">war.gov/UFO</a> · PURSUE Release 01 & 02 · ${allData.length} files
</footer>

<script>
let currentTab = 'all';

function switchTab(tab) {
  currentTab = tab;
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
      card.style.display = 'none';
      return;
    }
    
    const match = (!q || card.dataset.q.includes(q)) &&
                  (!a || card.dataset.a === a) &&
                  (!t || card.dataset.t === t) &&
                  (!c || card.dataset.c === c);
    card.style.display = match ? '' : 'none';
    if (match) count++;
  });
  
  document.getElementById('resultCount').textContent = count + ' files';
}

async function checkForUpdates() {
  const btn = document.getElementById('checkBtn');
  const status = document.getElementById('checkStatus');
  btn.disabled = true;
  status.textContent = '⏳ Checking war.gov...';
  
  try {
    const resp = await fetch('https://www.war.gov/UFO/', { 
      signal: AbortSignal.timeout(15000),
      headers: { 'Accept': 'text/html' }
    });
    const text = await resp.text();
    
    const releases = [];
    const matches = text.matchAll(/[Rr]elease\s*(\d+)/g);
    for (const m of matches) {
      if (!releases.includes(m[1])) releases.push(m[1]);
    }
    
    const latestRelease = releases.length > 0 ? Math.max(...releases.map(Number)) : null;
    
    if (latestRelease && latestRelease > 2) {
      status.innerHTML = '🆕 <b style="color:#ffd700">Release ' + latestRelease + ' available!</b> <a href="https://www.war.gov/UFO/" target="_blank" style="color:var(--ac)">View on war.gov →</a>';
    } else if (latestRelease === 2) {
      status.innerHTML = '✅ <span style="color:var(--uc)">Up to date — Release 02 is latest</span>';
    } else {
      status.innerHTML = '⚠️ Could not determine latest release. <a href="https://www.war.gov/UFO/" target="_blank" style="color:var(--ac)">Check manually →</a>';
    }
  } catch(e) {
    status.textContent = '❌ Connection failed — try again or visit war.gov/UFO directly';
  }
  btn.disabled = false;
}
</script>
</body>
</html>`;

fs.writeFileSync(OUT, html);
fs.writeFileSync(INDEX, html); // Also update index.html
console.log(`\n✅ Dashboard written: ${OUT} (${(html.length/1024).toFixed(1)} KB)`);
console.log(`✅ Index written: ${INDEX}`);
console.log(`📊 Total: ${allData.length} files (R1: ${allR1.length} PDFs, R2: ${r2Entries.filter(e=>e.type==='PDF').length} PDFs + ${r2Entries.filter(e=>e.isVideo).length} videos + ${r2Entries.filter(e=>e.isAudio).length} audio)`);

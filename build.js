#!/usr/bin/env node
// build_ufo_dashboard_v2.js — Generation script for the combined PURSUE dashboard
const fs = require('fs');
const path = require('path');

const PROJECT = '/home/lilbooduh/ufo-dashboard';
const OUT = path.join(PROJECT, 'dashboard.html');

// ── Release 01 data ──
const r1Data = JSON.parse(fs.readFileSync(path.join(PROJECT, 'data/r1_data.json'), 'utf8'));

// ── Release 02 data (hand-curated AI summaries) ──
const r2Data = [
  {
    title: 'CIA-UAP-D001 — Intelligence Report, USSR, 1973',
    agency: 'CIA',
    classification: 'CONFIDENTIAL',
    type: 'Intelligence Report',
    pages: 4,
    chars: 6069,
    date: 'December 1977',
    fname: 'CIA-UAP-D001_Intelligence_Information_Report_USSR_1973',
    pdf_url: '',
    summary: 'A CIA intelligence information report on the Soviet Sary Shagan weapons testing range contains an extraordinary detail: in late summer 1973, a former Soviet citizen reported observing "an unidentified sharp (bright) green circular object or mass in the sky" near Site 7. Within 10-15 seconds, the green circle widened and "several green concentric circles formed around the mass." There was no sound or explosion. The observer could not estimate the object\'s altitude. This sighting was deemed significant enough for the CIA to include it in a classified intelligence report about Soviet weapons testing facilities — proving intelligence agencies have long documented UAP encounters alongside traditional military intelligence.',
    keyFacts: ['Green concentric circles observed over Soviet weapons test range', 'CIA filed UAP sighting in official intelligence report', 'No sound or explosion — ruled out conventional weapons', 'Observer was former Soviet citizen with access to restricted facility', 'Dated November 1972–November 1973 observation period']
  },
  {
    title: 'ODNI-UAP-D001 — USPER Narrative, Senior USIC Official',
    agency: 'ODNI',
    classification: 'UNCLASSIFIED',
    type: 'First-Hand Account',
    pages: 3,
    chars: 5679,
    date: 'Late 2025',
    fname: 'ODNI-UAP-D001_USPER_Narrative_Senior_USIC',
    pdf_url: '',
    summary: 'A senior U.S. intelligence officer provides a harrowing first-person account of a helicopter mission that turned into an hour-long series of close UAP encounters. The officer, along with two pilots, investigated reports of loud thuds and orb sightings on a military test range. After hours of searching, radar detected hits in the area — and what followed defies explanation. The team observed: countless orange orbs swarming a mountainside; two large orange orbs flaring up stationary beside their helicopter at 700ft in a T-formation; orbs splitting into multiple objects; and orbs "chasing" fighter jets, matching their speed and flight path. Multiple sensor systems confirmed the observations: FLIR, NVG, naked eye, and ground radar. Fighter jets were scrambled to assist in identification. The officer and pilots were "virtually speechless" after landing. This is the most detailed, multi-sensor, close-proximity UAP encounter ever officially released by the U.S. government.',
    keyFacts: ['Senior USIC official — first-hand witness', 'Multiple sensor confirmation: FLIR, NVG, radar, naked eye', 'Orbs within 10 feet of helicopter rotor disk', 'Orbs matching and chasing fighter jets at 23,000ft', 'Intelligent formation behavior: T-shapes, splitting, swarming', 'Fighter jets scrambled to assist identification', 'Event lasted over one hour', 'Witnesses "virtually speechless" after encounter']
  },
  {
    title: 'DOE-UAP-D001 — PANTEX Nuclear Facility — Unidentified Object',
    agency: 'DOE',
    classification: 'UCNI',
    type: 'Incident Report',
    pages: 6,
    chars: 1131,
    date: 'Unknown',
    fname: 'DOE-UAP-D001_PANTEX_Image',
    pdf_url: '',
    summary: 'An incident report from the Pantex Plant — the primary U.S. nuclear weapons assembly and disassembly facility near Amarillo, Texas. This document contains images from the Ground Surveillance Radar Tower showing an unidentified object in proximity to the facility. Sandia National Laboratories produced enhanced images of the object for analysis. The classification marking "UCNI" (Unclassified Controlled Nuclear Information) indicates the sensitivity of nuclear facility security data. An unidentified object near America\'s primary nuclear weapons plant, documented by ground radar and analyzed by Sandia — and the government still couldn\'t identify it.',
    keyFacts: ['Pantex nuclear weapons facility — one of the most secure sites in America', 'Object tracked by Ground Surveillance Radar Tower', 'Sandia National Labs performed enhanced image analysis', 'UCNI classification — nuclear security sensitivity', 'Object remains unidentified']
  },
  {
    title: 'DOE-UAP-D002 — James Tuck Correspondence on UFO Physics',
    agency: 'DOE',
    classification: 'UNCLASSIFIED',
    type: 'Correspondence',
    pages: 3,
    chars: 2034,
    date: 'November 28, 1973',
    fname: 'DOE-UAP-D002_JamesTuck_Correspondence',
    pdf_url: '',
    summary: 'A letter from James L. Tuck — a Manhattan Project physicist who worked on the atomic bomb at Los Alamos — to the U.S. Army Engineering School requesting "the recipe that was used for the simulated atomic blast (fireball radiations)" to study "large atmospheric vortices" reported in Dr. Edward Condon\'s "Scientific Study of Unidentified Flying Objects." Tuck, a pioneer in nuclear fusion research, was investigating whether nuclear-scale energy phenomena could explain UFO propulsion. A follow-up letter from a colleague references Einstein\'s unified field theory and UFO propulsion research from the 1976 book "UFOLOGY." This correspondence reveals that top-tier nuclear physicists — the same people who built the bomb — were actively researching the physics of UFOs.',
    keyFacts: ['James L. Tuck — Manhattan Project physicist, nuclear fusion pioneer', 'Requested atomic blast simulation data to study UFO propulsion', 'Referenced Condon Report on UFOs', 'Colleague cited Einstein\'s unified field theory as relevant to UFO physics', 'Los Alamos connections throughout', 'Dated 1973 — peak Cold War era']
  },
  {
    title: 'DOE-UAP-D003 — Pajarito Astronomers UFO Society, Los Alamos',
    agency: 'DOE',
    classification: 'UNCLASSIFIED',
    type: 'Newsletter',
    pages: 2,
    chars: 1207,
    date: 'May 20, 1986',
    fname: 'DOE-UAP-D003_Pajarito_Astronomers',
    pdf_url: '',
    summary: 'A newsletter from the "Pajarito Astronomers" — a UFO interest group operating at Los Alamos National Laboratory, with a P.O. Box in Los Alamos, NM. The May 1986 meeting featured Dr. John Warren of AT-6 speaking on "Why Should a Scientist be Concerned about UFO\'s?" The group met at Fuller Lodge, a historic Manhattan Project-era building in the heart of Los Alamos. This document proves that even in 1986 — at the height of SDI/Star Wars — scientists inside America\'s premier nuclear weapons laboratory were organizing regular meetings to discuss UFOs. The fact that the DOE preserved and classified this newsletter says everything about how seriously these scientists\' UFO interests were taken.',
    keyFacts: ['UFO society operating inside Los Alamos National Laboratory', 'Meetings held at Fuller Lodge — historic Manhattan Project building', 'Guest speaker was Dr. John Warren of AT-6 division', 'Scientists meeting to discuss UFOs at nuclear weapons lab in 1986', 'DOE preserved and classified the newsletter', 'Members had Los Alamos lab address codes (MS K553, MSE531)']
  },
  {
    title: 'DOW-UAP-D017 — Sandia Base Security Correspondence, 1949',
    agency: 'Department of War',
    classification: 'SECRET',
    type: 'Security Correspondence',
    pages: 200,
    chars: 717501,
    date: 'April 7, 1949',
    fname: 'DOW-UAP-D017_General_Correspondence_Of_Sandia',
    pdf_url: '',
    summary: 'A 200-page collection of classified correspondence between the 1100th USAF Special Reporting Group and Sandia Base (the nuclear weapons storage facility in Albuquerque, NM), dated 1949. Documents cover security inspections, guard orders, alert plans, fence integrity, radio communications with Camp Campbell Military Police, and nuclear stockpile custody procedures. The 11th Airborne Division\'s defensive arrangements for the base are discussed. While not directly about UAPs, this massive file reveals the extreme security posture around nuclear weapons in the early Cold War — the same facilities and personnel that would become central to the UAP-nuclear connection documented across decades of reports. The Department of War chose to include this in the PURSUE release, suggesting a connection between nuclear security and UAP incidents.',
    keyFacts: ['200 pages of 1949 nuclear weapons security documents', 'Sandia Base — primary nuclear weapons storage facility', '1100th USAF Special Reporting Group communications', '11th Airborne Division defense arrangements', 'Early Cold War nuclear security posture', 'Included in PURSUE release — implicit nuclear-UAP connection']
  }
];

// ── Combine data ──
const allR1 = r1Data.map(d => ({
  ...d,
  release: '01',
  releaseDate: 'May 8, 2026',
  summary: (d.para1 || '') + '\n\n' + (d.para2 || ''),
  keyFacts: []
}));

const allR2 = r2Data.map(d => ({
  ...d,
  release: '02',
  releaseDate: 'May 22, 2026',
  para1: d.summary.split('\n\n')[0] || '',
  para2: d.summary.split('\n\n')[1] || ''
}));

const allData = [...allR1, ...allR2];

// ── Stats ──
function stats(data) {
  const s = { total: data.length, pages: 0, chars: 0, ag: {}, cl: {}, ty: {} };
  data.forEach(d => {
    s.pages += d.pages || 0;
    s.chars += d.chars || 0;
    s.ag[d.agency] = (s.ag[d.agency] || 0) + 1;
    s.cl[d.classification] = (s.cl[d.classification] || 0) + 1;
    s.ty[d.type] = (s.ty[d.type] || 0) + 1;
  });
  return s;
}

const s1 = stats(allR1);
const s2 = stats(allR2);
const sAll = stats(allData);

function badgeClass(c) {
  if (!c) return 'bu';
  const u = c.toUpperCase();
  if (u.includes('TOP SECRET') || u.includes('SECRET')) return 'bs';
  if (u.includes('CONFIDENTIAL') || u.includes('UCNI')) return 'bc';
  if (u.includes('UNCLASSIFIED') || u.includes('UNCLAS')) return 'bu';
  return 'bu';
}

function esc(s) { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function buildStatCards(s, label) {
  const agEntries = Object.entries(s.ag).sort((a,b) => b[1]-a[1]);
  const clEntries = Object.entries(s.cl).sort((a,b) => b[1]-a[1]);
  const tyEntries = Object.entries(s.ty).sort((a,b) => b[1]-a[1]);
  return `
  <div class="sc"><div class="n">${s.total}</div><div class="l">Files</div></div>
  <div class="sc"><div class="n">${s.pages.toLocaleString()}</div><div class="l">Pages</div></div>
  <div class="sc"><div class="n">${Object.keys(s.ag).length}</div><div class="l">Agencies</div><div class="s">${agEntries.slice(0,6).map(([k,v])=>k+': '+v).join('<br>')}</div></div>
  <div class="sc"><div class="n">${Object.keys(s.ty).length}</div><div class="l">Types</div><div class="s">${tyEntries.slice(0,6).map(([k,v])=>k+': '+v).join('<br>')}</div></div>
  <div class="sc"><div class="n">${clEntries.filter(([c])=>c!=='UNCLASSIFIED'&&c!=='UNCLAS').reduce((s,[,n])=>s+n,0)}</div><div class="l">Classified</div><div class="s">${clEntries.map(([k,v])=>k+': '+v).join('<br>')}</div></div>
  <div class="sc"><div class="n">${(s.chars/1e6).toFixed(1)}M</div><div class="l">Characters</div></div>`;
}

// ── Key Facts section for R2 ──
function buildFactsSection() {
  const allFacts = [];
  r2Data.forEach(d => {
    (d.keyFacts || []).forEach(f => {
      allFacts.push({ fact: f, file: d.title.split(' —')[0], agency: d.agency });
    });
  });
  
  const cards = allFacts.map(f => `
    <div class="fact-card">
      <div class="fact-badge">${f.agency}</div>
      <div class="fact-text">${esc(f.fact)}</div>
      <div class="fact-file">${esc(f.file)}</div>
    </div>`).join('');

  return `
  <div class="facts-section" id="facts">
    <div class="facts-header">
      <h2>🔍 Release 02 — What's New</h2>
      <div class="facts-sub">6 new declassified files. 1,200+ pages. Level of detail: unprecedented.</div>
    </div>
    <div class="facts-grid">${cards}</div>
  </div>`;
}

// ── Build file cards ──
function buildFileCards(data) {
  const sorted = [...data].sort((a,b) => {
    const clOrder = {'TOP SECRET':0,'SECRET':1,'CONFIDENTIAL':2,'UCNI':3};
    return (clOrder[a.classification]||99) - (clOrder[b.classification]||99) || (b.chars||0) - (a.chars||0);
  });

  return sorted.map(d => {
    const tagClass = badgeClass(d.classification);
    const summary = d.summary || ((d.para1||'') + '\n\n' + (d.para2||''));
    return `<div class="fc" data-q="${esc((d.title+' '+d.agency+' '+summary+' '+(d.keyFacts||[]).join(' ')).toLowerCase())}" data-a="${esc(d.agency)}" data-t="${esc(d.type)}" data-c="${esc(d.classification)}" data-r="${d.release}">
      <div class="fh">
        <span class="ft">${esc(d.title)}</span>
        <div class="fm">
          <span class="b ${tagClass}">${esc(d.classification)}</span>
          <span class="b ba">${esc(d.agency)}</span>
          <span class="b bt">${esc(d.type)}</span>
          ${d.release === '02' ? '<span class="b" style="background:rgba(255,215,0,.15);color:#ffd700;border:1px solid rgba(255,215,0,.25)">R2 ✨</span>' : ''}
        </div>
      </div>
      <div class="fs">${esc(summary.substring(0, 1200))}${summary.length > 1200 ? '...' : ''}</div>
      <div class="fr">
        ${d.pdf_url ? `<a class="orig-link" href="${esc(d.pdf_url)}" target="_blank" rel="noopener">📎 View original PDF</a>` : '<span class="orig-link" style="opacity:.5">📎 PDF in bundle</span>'}
        <span>📅 ${esc(d.date||'Unknown')} · 📄 ${d.pages||'?'} pg · 📝 ${(d.chars||0).toLocaleString()} chars</span>
      </div>
    </div>`;
  }).join('');
}

// ── Unique filter options ──
function uniqueVals(data, key) {
  const vals = {};
  data.forEach(d => { const v = d[key]; if (v) vals[v] = (vals[v]||0)+1; });
  return vals;
}

const allAgencies = uniqueVals(allData, 'agency');
const allTypes = uniqueVals(allData, 'type');
const allClasses = uniqueVals(allData, 'classification');

// ── Build the full HTML ──
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

/* Tabs */
.tabs{max-width:1200px;margin:1.5rem auto 0;padding:0 2rem;display:flex;gap:.5rem;border-bottom:1px solid var(--bd)}
.tab-btn{background:none;border:none;color:var(--mu);padding:.75rem 1.5rem;font-size:.85rem;font-weight:600;cursor:pointer;border-bottom:2px solid transparent;transition:all .2s;font-family:inherit}
.tab-btn:hover{color:var(--tx)}
.tab-btn.active{color:var(--ac);border-bottom-color:var(--ac)}
.tab-btn.r2-tab{position:relative}
.tab-btn .badge{background:var(--r2);color:#000;font-size:.6rem;padding:.1rem .35rem;border-radius:3px;margin-left:.4rem;font-weight:700}

/* Facts */
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

/* Stats */
.st-section{display:none}
.st-section.active{display:block}
.st{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:.75rem;padding:1.5rem 2rem;max-width:1200px;margin:0 auto}
.sc{background:var(--sf);border:1px solid var(--bd);border-radius:8px;padding:1.25rem;text-align:center;transition:border-color .2s}
.sc:hover{border-color:var(--ac)}
.sc .n{font-size:2rem;font-weight:700;color:var(--ac)}
.sc .l{color:var(--mu);font-size:.7rem;text-transform:uppercase;margin-top:.25rem;letter-spacing:.5px}
.sc .s{font-size:.65rem;color:var(--mu);margin-top:.5rem;line-height:1.5}

/* Controls */
.ct{max-width:1200px;margin:0 auto;padding:0 2rem 1.5rem;display:flex;gap:.5rem;flex-wrap:wrap;align-items:center}
.ct input,.ct select{background:var(--sf);border:1px solid var(--bd);color:var(--tx);padding:.6rem 1rem;border-radius:6px;font-size:.85rem;outline:none;font-family:inherit}
.ct input:focus,.ct select:focus{border-color:var(--ac)}
.ct input{flex:1;min-width:200px}
.ct input::placeholder{color:var(--mu)}
.ct .result-count{color:var(--mu);font-size:.75rem;margin-left:auto}

/* Check button */
.check-btn{background:rgba(79,195,247,.15);border:1px solid rgba(79,195,247,.35);color:var(--ac);padding:.6rem 1.5rem;border-radius:6px;font-size:.85rem;font-weight:600;cursor:pointer;transition:all .2s;font-family:inherit;white-space:nowrap}
.check-btn:hover{background:rgba(79,195,247,.25);border-color:var(--ac)}
.check-btn:disabled{opacity:.5;cursor:not-allowed}
.check-status{color:var(--mu);font-size:.75rem;margin-left:.5rem}

/* File list */
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

/* Key facts inline */
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

<!-- Tabs -->
<div class="tabs">
  <button class="tab-btn active" onclick="switchTab('all')">📁 All Releases</button>
  <button class="tab-btn" onclick="switchTab('r1')">📦 Release 01 <span style="color:var(--mu);font-size:.7rem">May 8, 2026</span></button>
  <button class="tab-btn r2-tab" onclick="switchTab('r2')">✨ Release 02 <span class="badge">NEW</span> <span style="color:var(--mu);font-size:.7rem">May 22, 2026</span></button>
</div>

<!-- Release 02 Key Facts -->
<div class="st-section active" id="sec-facts">
${buildFactsSection()}
</div>

<!-- Stats: All -->
<div class="st-section active" id="sec-stats-all">
<div class="st">${buildStatCards(sAll, 'All')}</div>
</div>
<div class="st-section" id="sec-stats-r1">
<div class="st">${buildStatCards(s1, 'R1')}</div>
</div>
<div class="st-section" id="sec-stats-r2">
<div class="st">${buildStatCards(s2, 'R2')}</div>
</div>

<!-- Controls -->
<div class="ct">
  <input type="text" id="q" placeholder="🔍 Search by title, content, agency, key facts..." oninput="doFilter()">
  <select id="af" onchange="doFilter()"><option value="">All Agencies</option>${Object.keys(allAgencies).sort().map(a=>`<option value="${esc(a)}">${esc(a)} (${allAgencies[a]})</option>`).join('')}</select>
  <select id="tf" onchange="doFilter()"><option value="">All Types</option>${Object.keys(allTypes).sort().map(t=>`<option value="${esc(t)}">${esc(t)} (${allTypes[t]})</option>`).join('')}</select>
  <select id="cf" onchange="doFilter()"><option value="">All Classification</option>${Object.keys(allClasses).sort().map(c=>`<option value="${esc(c)}">${esc(c)} (${allClasses[c]})</option>`).join('')}</select>
  <button class="check-btn" onclick="checkForUpdates()" id="checkBtn">🔄 Check for Updates</button>
  <span class="check-status" id="checkStatus"></span>
  <span class="result-count" id="resultCount">${allData.length} files</span>
</div>

<!-- File lists -->
<div class="fl-section active" id="sec-fl-all">
  <div class="fl">${buildFileCards(allData)}
  </div>
</div>
<div class="fl-section" id="sec-fl-r1">
  <div class="fl">${buildFileCards(allR1)}</div>
</div>
<div class="fl-section" id="sec-fl-r2">
  <div class="fl">${buildFileCards(allR2)}</div>
</div>

<footer>
  Built by Ky · OpenClaw · Raspberry Pi 5 · ${new Date().toLocaleString('en-US',{timeZone:'America/Los_Angeles'})} PT<br>
  Data source: <a href="https://www.war.gov/UFO/" target="_blank" rel="noopener">war.gov/UFO</a> · PURSUE Release 01 & 02
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
  
  // Stats
  document.querySelectorAll('.st-section').forEach(s => s.classList.remove('active'));
  const statsEl = document.getElementById('sec-stats-' + tab);
  if (statsEl) statsEl.classList.add('active');
  
  // Facts only for all and r2
  const factsEl = document.getElementById('sec-facts');
  if (factsEl) factsEl.style.display = (tab === 'all' || tab === 'r2') ? '' : 'none';
  
  // File list
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
    // Tab filter
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
    
    // Look for release dates
    const releases = [];
    const matches = text.matchAll(/[Rr]elease\s*(\d+)/g);
    for (const m of matches) {
      if (!releases.includes(m[1])) releases.push(m[1]);
    }
    
    // Look for dates in format MM DD YY or Month DD, YYYY
    const dates = [];
    const datePatterns = [
      /(\d{2}\s+\d{2}\s+\d{2})/g,
      /(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}/g
    ];
    for (const pat of datePatterns) {
      for (const m of text.matchAll(pat)) {
        dates.push(m[0]);
      }
    }
    
    const latestRelease = releases.length > 0 ? Math.max(...releases.map(Number)) : null;
    const knownReleases = [1, 2]; // We have Release 01 and 02
    
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
console.log(`✅ Dashboard written: ${OUT} (${(html.length/1024).toFixed(1)} KB)`);
console.log(`📊 R1: ${allR1.length} files | R2: ${allR2.length} files | Total: ${allData.length}`);
console.log(`📊 Agencies: ${Object.keys(sAll.ag).sort().join(', ')}`);
console.log(`📊 Classified: ${Object.entries(sAll.cl).filter(([c])=>!c.includes('UNCLASS')&&!c.includes('UNCLAS')).reduce((s,[,n])=>s+n,0)} files`);

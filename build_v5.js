#!/usr/bin/env node
// build_ufo_dashboard_v5.js — Release 03 added: 72 records, expanded summaries, three-release view
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT = '/home/lilbooduh/ufo-dashboard';
const OUT = path.join(PROJECT, 'dashboard.html');
const INDEX = path.join(PROJECT, 'index.html');

// ── Release 01 data ──
const r1Data = JSON.parse(fs.readFileSync(path.join(PROJECT, 'data/r1_data.json'), 'utf8'));

// ── Release 02 AI summaries ──
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

// ── Release 03 AI summaries ──
const r3AiSummaries = {
  'CIA-UAP-017': {
    summary: 'A never-before-released July 2008 CIA intelligence report covering an alarming incident: a UFO sighting at Harare International Airport, one of Africa\'s busiest air hubs. The report documents extensive internal debate among intelligence analysts about whether the object was an advanced reconnaissance device deployed by a foreign government — or something of extraterrestrial origin. The airport was placed on high alert, and the CIA assessed "aggressive foreign posturing" as a possible explanation. Zimbabwean authorities and international aviation officials were reportedly involved in the investigation. This document sat undisclosed for 18 years.',
    keyFacts: ['UFO sighting at Harare International Airport, July 2008', 'CIA debated foreign recon vs. extraterrestrial origin', 'Airport placed on high alert', 'Withheld from public for 18 years', 'Never-before-released CIA intelligence report']
  },
  'DOW-UAP-D084': {
    summary: 'A bombshell historical document: a 1949 U.S. Army General Staff "Evaluation Study of the Phenomenon (Flying Saucers)," requested by the Plans & Operations Division. The study sought to determine whether flying saucers could be traced to natural phenomena or the activities of a foreign power. At the dawn of the Cold War, with atomic paranoia at its peak, the U.S. Army\'s top strategic planners were sufficiently concerned about the flying saucer phenomenon to commission a formal study. The document reveals that the highest levels of the military establishment took UFOs seriously long before Project Blue Book.',
    keyFacts: ['1949 U.S. Army General Staff evaluation of flying saucers', 'Requested by Plans & Operations Division (P&O, GSUSA)', 'Investigated: natural phenomenon vs. foreign power origin', 'Predates Project Blue Book', 'Cold War-era formal military study']
  },
  'FBI-UAP-D002': {
    summary: 'An FBI FD-1057 form documenting a first-hand UAP encounter near Colorado Springs, Colorado in 2022. The interviewee provided a narrative description directly to FBI special agents, who then produced a digital artistic interpretation of the incident. The FD-1057 form is used specifically to record investigative activity — meaning the FBI treated this as an active investigation, not a civilian curiosity report. The document carries redactions, indicating sensitive information remains classified. Colorado Springs is home to NORAD, Peterson Space Force Base, and multiple defense contractors.',
    keyFacts: ['FBI active investigation of UAP in Colorado Springs, 2022', 'First-hand witness interview by FBI special agents', 'Digital artistic rendering produced from witness account', 'Colorado Springs = NORAD + Space Force HQ + defense contractors', 'Document contains redactions']
  },
  'FBI-UAP-D009': {
    summary: 'An FBI FD-302 interview form from February 2026 documenting a U.S. person\'s account of an orb sighting in the northeastern United States. The FD-302 is the FBI\'s standard form for recording witness interviews — its use signals this was a formal investigative interview. The document is paired with companion file FBI-UAP-D010 and video footage FBI-UAP-PR004, forming a multi-source case file. Multiple witnesses in the same northeastern region reported similar orb phenomena during 2025-2026. Redactions obscure key details.',
    keyFacts: ['FBI FD-302 formal interview, February 2026', 'Orb sighting in northeastern United States', 'Linked to companion interview (D010) and video evidence (PR004)', 'Part of multi-witness orb cluster 2025-2026', 'Document is redacted']
  },
  'FBI-UAP-D010': {
    summary: 'A companion FBI FD-302 from the northeastern orb investigation, this document records an interview with an additional U.S. person who provided a first-hand account of anomalous orb activity. Together with FBI-UAP-D009 and video FBI-UAP-PR004, these files form a compelling multi-witness, multi-evidence-type case. The FBI corroborated reports originating from the same general area across different dates and witnesses. The fact that the Bureau maintained multiple FD-302s on UAP indicates sustained investigative interest at the federal law enforcement level.',
    keyFacts: ['Second FBI witness interview on northeastern orbs', 'First-hand account corroborates other witness', 'Multi-source: documents + video evidence', 'FBI sustained UAP investigation across witnesses', 'Document is redacted']
  },
  'FBI-UAP-D011': {
    summary: 'Extraordinary historical correspondence between FBI Director J. Edgar Hoover and Reverend Charles Barnes from 1949. Barnes wrote to Hoover describing an incident he personally witnessed, and Hoover — the most powerful law enforcement figure in America — took the report seriously enough to maintain official correspondence. A Department of Justice referral is included. This 1949 exchange reveals that the FBI\'s interest in UFOs dates to the very beginning of the modern UFO era, just two years after Kenneth Arnold\'s famous 1947 sighting.',
    keyFacts: ['J. Edgar Hoover personally corresponded about UFOs, 1949', 'Witness: Reverend Charles Barnes', 'Includes Department of Justice referral', 'FBI interest in UFOs dates to modern era\'s dawn', 'Predates Project Blue Book by 3 years']
  },
  'CIA-UAP-002': {
    summary: 'The foundational document of CIA UFO engagement: correspondence and reports from the Scientific Advisory Panel on Unidentified Flying Objects, convened by the CIA\'s Office of Scientific Intelligence in 1952-1953. This panel, known as the Robertson Panel, brought together prominent scientists — including physicists, astronomers, and engineers — to evaluate the national security implications of UFO reports. The panel famously recommended that UFOs be debunked to reduce public interest. These documents reveal the inner workings of the CIA\'s decision to manage public perception of the phenomenon rather than pursue transparent investigation.',
    keyFacts: ['CIA-convened Robertson Panel, 1952-1953', 'Office of Scientific Intelligence organized the review', 'Panel included prominent physicists and astronomers', 'Recommendation: debunk UFOs to reduce public interest', 'Historic turning point in government UFO policy']
  },
  'CIA-UAP-015': {
    summary: 'Project Blue Book Special Report No. 14 — the Air Force\'s most significant statistical analysis of UFO sightings — bearing a CIA cover sheet marking it as "Official Record Copy." This report analyzed 3,201 UFO cases and was prepared by the Battelle Memorial Institute. It famously found that 22% of cases remained "unknown" even after rigorous analysis. The CIA\'s possession of this copy demonstrates the Agency\'s deep, sustained interest in the Air Force\'s UFO investigations. A handwritten note on the first page hints at unofficial handling within CIA channels.',
    keyFacts: ['Project Blue Book Special Report No. 14 — 3,201 cases analyzed', 'Battelle Memorial Institute statistical analysis', '22% of cases remained "Unknown" after analysis', 'CIA cover sheet: "Official Record Copy"', 'Handwritten annotations suggest internal CIA handling']
  },
  'DOW-UAP-D077': {
    summary: 'AARO\'s unresolved case analysis on a multi-incident UAP event near a sensitive national security site in the western United States. Over a period of three days, multiple U.S. federal law enforcement officers reported encounters with anomalous objects exhibiting flight characteristics beyond known technology. The All-domain Anomaly Resolution Office assembled witness narratives, sensor data, and analysis from Intelligence Community partners but could not resolve the incidents. The case remains officially "unresolved" — a categorization AARO reserves for its most puzzling cases.',
    keyFacts: ['Multi-day UAP event at sensitive national security site', 'Multiple federal law enforcement witnesses', 'AARO-led investigation, IC partner analysis', 'Objects exhibited flight beyond known technology', 'Case officially unresolved']
  },
  'DOW-UAP-D079': {
    summary: 'The sworn first-hand narrative of Witness 1 — a U.S. federal law enforcement officer — who encountered UAP near a sensitive national security site in October 2023. The officer describes anomalous objects exhibiting no visible means of propulsion, emitting unusual light signatures, and performing maneuvers impossible for conventional aircraft. This is one of five witness statements AARO collected from a three-day event in the western United States. The coordinated, multi-witness nature of the incident makes it one of AARO\'s most compelling unresolved cases.',
    keyFacts: ['Federal law enforcement officer — first-hand witness', 'October 2023, western United States', 'Anomalous objects: no propulsion, unusual lights, impossible flight', 'One of five coordinated witness statements', 'Collected by AARO for unresolved case analysis']
  },
  'DOW-UAP-D085': {
    summary: 'A historic transmission document: the CIA\'s 1953 "Report of the Scientific Panel on Unidentified Flying Objects" — the Robertson Panel report — forwarded to the Secretary of Defense. This routing document shows the formal chain of custody as the CIA\'s most consequential UFO analysis reached the Pentagon\'s highest office. The report\'s journey from CIA to Secretary of Defense demonstrates that the UFO question was elevated to the level of national security leadership, not buried in mid-level bureaucracy.',
    keyFacts: ['CIA Robertson Panel report sent to Secretary of Defense', '1953 transmission document', 'Shows formal chain of custody to Pentagon leadership', 'UFO question elevated to highest DoD levels', 'Historic national security document']
  },
  'NASA-UAP-D015': {
    summary: 'A remarkable collection of 1962-1963 NASA memoranda, correspondence, and reports documenting contemporary scientific interest in UFO investigation — by the very astronauts who were pushing the boundaries of human spaceflight. These astronaut scientific debriefings reveal that NASA\'s early space pioneers were not only aware of the UFO phenomenon but actively engaged in scientific discussion about its nature. The documents capture a moment when the line between space exploration and the UFO question was thinner than commonly acknowledged.',
    keyFacts: ['1962-1963 NASA astronaut scientific debriefings', 'Memoranda and correspondence on UFO investigation', 'Early astronauts actively discussed UFO phenomenon', 'Documents the intersection of spaceflight and UAP science', 'Mercury/Gemini era — NASA\'s formative years']
  },
  'DOW-UAP-D086': {
    summary: 'A 1948 U.S. Navy memorandum from the Commandant of the 5th Naval District citing a reference to "flying discs" from the Chief of Naval Operations. This is one of the earliest known official Navy documents acknowledging the flying disc phenomenon — predating Project Sign, the Air Force\'s first UFO investigation. The Navy\'s involvement has been historically underreported compared to the Air Force\'s Project Blue Book, making this document especially significant.',
    keyFacts: ['1948 U.S. Navy memo on "flying discs"', 'From Commandant, 5th Naval District', 'Referenced Chief of Naval Operations', 'Predates Project Sign and Blue Book', 'Early Navy acknowledgment — historically underrepresented']
  },
  'ICA-UAP-D001': {
    summary: 'An Intelligence Community agency analysis of the 2022 Colorado Springs UAP incident, generated by an AARO partner organization. This document attempted to account for the incident using conventional explanations. The analysis was shared with AARO for incorporation into its broader unresolved cases portfolio. The existence of IC-level analysis on a single UAP case demonstrates the seriousness with which the intelligence apparatus now treats the phenomenon — moving beyond mere collection to active analytical investigation.',
    keyFacts: ['IC partner analysis of Colorado Springs 2022 incident', 'Generated for AARO unresolved case portfolio', 'Attempted conventional-accounts analysis', 'IC-level resources applied to single UAP case', 'Document is redacted']
  },
  'USG-UAP-D001': {
    summary: 'A collection of 1998-era correspondence between the White House, members of Congress, and constituents demanding answers on UFOs. Draft and final letters show elected officials grappling with how to respond to persistent public inquiries about government knowledge of UFOs. This collection reveals that UFO constituent pressure reached the highest levels of government — the White House itself — and forced a coordinated official response strategy. Redactions indicate sensitive content was removed from public release.',
    keyFacts: ['1998 White House and Congressional UFO correspondence', 'Constituent pressure reached Executive Office', 'Draft and final letters reveal response strategy', 'Coordinated government handling of UFO inquiries', 'Document contains redactions']
  },
  'CIA-UAP-004': {
    summary: 'A 1958 CIA memorandum documenting a phone conversation with Dr. Leon Davidson, a physicist who became obsessed with the CIA\'s involvement in UFO secrecy. Davidson was concerned about a reportedly destroyed "space message and its transmitter." The memorandum captures the CIA\'s efforts to manage a persistent citizen-investigator who had penetrated further into the Agency\'s UFO activities than most. A previously redacted version was available; this release shows less redaction, revealing more of the exchange.',
    keyFacts: ['1958 CIA memo on Dr. Leon Davidson phone call', 'Davidson: physicist turned citizen UFO investigator', 'Concerns about destroyed "space message and transmitter"', 'Less redacted than previously public version', 'CIA managing persistent external investigator']
  },
  'CIA-UAP-005': {
    summary: 'A 1950 CIA Information Report out of Chile relaying a German scientist\'s published theory that "Flying Discs" could be explained as a novel aircraft type based on aerodynamic principles developed during WWII. The report demonstrates that as early as 1950 — just three years after Kenneth Arnold\'s sighting — the CIA was collecting foreign scientific theories about UFOs. The German aerospace connection is significant: Operation Paperclip had brought Nazi aerospace engineers to America, and the CIA was monitoring whether foreign scientists were reverse-engineering or predicting the phenomenon.',
    keyFacts: ['1950 CIA report from Chile on German UFO theory', 'German scientist: flying discs = new aircraft from WWII tech', 'CIA monitoring foreign scientific UFO theories in 1950', 'Operation Paperclip context', 'Three years after Kenneth Arnold\'s sighting']
  }
};

// ── Load CSV ──
const csvText = fs.readFileSync(path.join(PROJECT, 'data/uap-data.csv'), 'utf8');
const { parse } = require('csv-parse/sync');
const csvRows = parse(csvText, { columns: true, skip_empty_lines: true, relax_column_count: true });

// ── Release 02 CSV data ──
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

// ── Release 03 CSV data ──
const r3CsvData = csvRows
  .filter(r => r['Release Date'] && r['Release Date'].trim() === '6/12/26')
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
    redacted: (r['Redaction'] || '').trim() === 'TRUE',
  }));

function extractDocId(title) {
  const m = title.match(/^([A-Z]+-UAP-[A-Z]*\d+)/);
  return m ? m[1] : title.split(',')[0].trim();
}

// ── Condense video description to a tight preview ──
function condenseVideoDesc(desc) {
  if (!desc) return '';
  let clean = desc.replace(/On March 6, 2026, eight members of the U\.S\. House of Representatives requested access to 51 potentially UAP-related records allegedly held by the Department of War and the Intelligence Community\. The All-domain Anomaly Resolution Office \(AARO\) identified a collection of responsive materials held on a classified network\. Many of these materials lack a substantiated chain-of-custody\.\s*/g, '');
  clean = clean.replace(/AARO assesses that this video, whose uploader-defined title is.*?\. A user uploaded this video to a classified network in \w+ \d{4}\.\s*/g, '');
  clean = clean.replace(/This video description is provided for informational purposes only\..*$/s, '');
  clean = clean.replace(/Video Duration: [^\n]*\n?/g, '');
  clean = clean.replace(/Video Description:\s*/g, '');
  clean = clean.replace(/^\s+|\s+$/g, '');
  if (clean.length > 400) {
    clean = clean.substring(0, clean.lastIndexOf(' ', 400)) + '…';
  }
  return clean || desc.substring(0, 300);
}

function condenseImgDesc(desc) {
  if (!desc) return '';
  let clean = desc.replace(/This image is an artistic interpretation of a reported incident near a sensitive national security site in the western United States involving unidentified anomalous phenomena \(UAP\) over a period of three days\./g, '');
  clean = clean.replace(/This artistic interpretation was commissioned to support the All-domain Anomaly Resolution Office's \(AARO\) ongoing unresolved case analysis\./g, '');
  clean = clean.replace(/^\s+|\s+$/g, '');
  return clean || desc.substring(0, 200);
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

// ── Build R3 entries ──
const r3Entries = r3CsvData.map(r => {
  const docId = extractDocId(r.title);
  const aiSummary = r3AiSummaries[docId];
  const isPdf = r.type === 'PDF';
  const isVideo = r.type === 'VID';
  const isAudio = r.type === 'AUD';
  const isImage = r.type === 'IMG';
  
  // Classification inference
  let classification = 'UNCLASSIFIED';
  if (docId.includes('ICA')) classification = 'CONFIDENTIAL';
  else if (docId.includes('CIA') && !docId.includes('CIA-UAP-D')) classification = 'CONFIDENTIAL';
  else if (docId.includes('USG')) classification = 'CONFIDENTIAL';
  
  const fullSummary = aiSummary ? aiSummary.summary : r.description;
  let preview = '';
  if (isVideo) preview = condenseVideoDesc(r.description);
  else if (isImage) preview = condenseImgDesc(r.description).substring(0, 200);
  else preview = fullSummary.substring(0, 200);
  
  return {
    title: r.title,
    type: r.type,
    agency: r.agency,
    classification,
    date: r.date, location: r.location,
    pages: 0, chars: 0,
    summary: fullSummary,
    preview,
    keyFacts: aiSummary ? aiSummary.keyFacts : [],
    pdfUrl: r.pdfUrl, dvidsId: r.dvidsId,
    isVideo, isAudio, isImage,
    release: '03', releaseDate: 'June 12, 2026'
  };
});

// ── R1 entries ──
const allR1 = r1Data
  .filter(d => d['Release Date'] === '5/8/26' || !d['Release Date'])
  .map(d => ({
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

const allData = [...allR1, ...r2Entries, ...r3Entries];

// ── Stats ──
function calcStats(data) {
  const s = { total: data.length, pages: 0, chars: 0, ag: {}, cl: {}, ty: {}, vi: 0, au: 0, im: 0 };
  data.forEach(d => {
    s.pages += d.pages || 0; s.chars += d.chars || 0;
    s.ag[d.agency] = (s.ag[d.agency] || 0) + 1;
    s.cl[d.classification] = (s.cl[d.classification] || 0) + 1;
    const t = d.isVideo ? 'Video' : d.isAudio ? 'Audio' : d.isImage ? 'Image' : 'PDF';
    s.ty[t] = (s.ty[t] || 0) + 1;
    if (d.isVideo) s.vi++; if (d.isAudio) s.au++; if (d.isImage) s.im++;
  });
  return s;
}

const s1 = calcStats(allR1), s2 = calcStats(r2Entries), s3 = calcStats(r3Entries), sAll = calcStats(allData);

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
    const isR3 = d.release === '03';
    const vidBadge = d.isVideo ? '<span class="b vid-badge">🎬 VIDEO</span>' : '';
    const audBadge = d.isAudio ? '<span class="b aud-badge">🔊 AUDIO</span>' : '';
    const imgBadge = d.isImage ? '<span class="b img-badge">🖼 IMAGE</span>' : '';
    const relBadge = isR2 ? '<span class="b r2-badge">R2</span>' : isR3 ? '<span class="b r3-badge">R3</span>' : '';
    const typeLabel = d.isVideo ? 'Video' : d.isAudio ? 'Audio' : d.isImage ? 'Image' : 'PDF';
    
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
    
    const highlightClass = isR2 ? ' r2-highlight' : isR3 ? ' r3-highlight' : '';
    
    return `<div class="fc${highlightClass}" data-q="${esc((d.title+' '+d.agency+' '+summary+' '+(d.keyFacts||[]).join(' ')+(d.location||'')).toLowerCase())}" data-a="${esc(d.agency)}" data-t="${esc(typeLabel)}" data-c="${esc(d.classification)}" data-r="${d.release}">
      <div class="fc-header" onclick="toggleCard(this.parentElement)" title="Click to expand/collapse">
        <span class="fc-title">${esc(d.title)}</span>
        <span class="fc-meta">
          <span class="b ${tagClass}">${esc(d.classification)}</span>
          <span class="b ba">${esc(d.agency)}</span>
          <span class="b bt">${typeLabel}</span>
          ${vidBadge}${audBadge}${imgBadge}${relBadge}
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

// ── R3 highlight facts section ──
function buildR3FactsSection() {
  const pdfEntries = r3Entries.filter(e => e.type === 'PDF' && e.keyFacts.length > 0);
  const allFacts = [];
  pdfEntries.forEach(d => d.keyFacts.forEach(f => allFacts.push({fact:f, file:d.title.split(',')[0], agency:d.agency})));

  // Add notable non-summarized highlights
  const extras = [
    {fact:'CIA-UAP-003: Complete history of U-2 and OXCART (A-12) reconnaissance programs 1954-1974', file:'CIA-UAP-003', agency:'CIA'},
    {fact:'CIA-UAP-006: 1955 eyewitness account of triangular aircraft near Baku, Azerbaijan', file:'CIA-UAP-006', agency:'CIA'},
    {fact:'CIA-UAP-008: Soviet scientists Kardashev & Sakharov paper on "charged mass in space," 1972', file:'CIA-UAP-008', agency:'CIA'},
    {fact:'CIA-UAP-016: 7 UFO sightings in Ladakh, Nepal, Sikkim, and Bhutan — Feb-Mar 1968', file:'CIA-UAP-016', agency:'CIA'},
    {fact:'FBI-UAP-D012: Newark Field Office special UFO inquiry spanning 1952-1967', file:'FBI-UAP-D012', agency:'FBI'},
    {fact:'FBI-UAP-D013: Washington State UFO investigation, July 1952-August 1960', file:'FBI-UAP-D013', agency:'FBI'},
    {fact:'DOW-UAP-D087/D088: USAF Analysis of Flying Objects — 172 incident checklists', file:'DOW-UAP-D087/088', agency:'Department of War'},
    {fact:'NASA-UAP-D016-D022: Gemini 4, 5, 7, 9 crew debriefing transcripts', file:'NASA-UAP-D016-022', agency:'NASA'},
    {fact:'NASA-UAP-D023: Gordon Cooper interviewed by Walter Cronkite on UFOs, 1962', file:'NASA-UAP-D023', agency:'NASA'},
    {fact:'NASA-UAP-D025: Apollo 16 debriefing — "Could be an alien starbase or something"', file:'NASA-UAP-D025', agency:'NASA'},
    {fact:'Western US Event: 5 witnesses + 10 FBI renderings + 2 digital recreation videos', file:'DOW-UAP-D077-083', agency:'FBI/DoW'},
    {fact:'6 FBI witness videos: orb sightings northeast US 2021-2025', file:'FBI-UAP-PR001-006', agency:'FBI'},
  ];
  extras.forEach(f => allFacts.push(f));
  
  return `
  <div class="facts-section" id="facts-r3">
    <div class="facts-header">
      <h2>🔍 Release 03 — Complete Breakdown</h2>
      <div class="facts-sub">72 total files: 53 documents + 6 videos + 10 images + 3 audio excerpts · June 12, 2026</div>
    </div>
    <div class="facts-grid">${allFacts.map(f => `
    <div class="fact-card">
      <div class="fact-badge">${esc(f.agency)}</div>
      <div class="fact-text">${esc(f.fact)}</div>
      <div class="fact-file">${esc(f.file)}</div>
    </div>`).join('')}</div>
  </div>`;
}

// ── R2 highlight facts section ──
function buildR2FactsSection() {
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
  <div class="facts-section" id="facts-r2">
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
    let v = key === 'type' ? (d.isVideo ? 'Video' : d.isAudio ? 'Audio' : d.isImage ? 'Image' : 'PDF') : d[key];
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
<title>🛸 PURSUE — UAP Files Dashboard v5</title>
<style>
:root{--bg:#0a0a10;--sf:#141420;--bd:#1e1e3a;--tx:#e0e0f0;--mu:#8888aa;--ac:#4fc3f7;--sc:#ff5252;--cf:#ffab40;--uc:#66bb6a;--r2:#ffd700;--r3:#00e5ff}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--tx);font-family:-apple-system,'Segoe UI',system-ui,sans-serif;line-height:1.6}
header{background:linear-gradient(135deg,#0d1b2a,#1b2838,#0d1b2a);border-bottom:1px solid #1a1a3a;padding:2rem;text-align:center}
header h1{font-size:2rem;color:var(--ac);margin-bottom:.25rem;letter-spacing:-0.5px}
header .byline{color:var(--mu);font-size:.8rem}
header .links{margin-top:.75rem;display:flex;gap:.5rem;justify-content:center;flex-wrap:wrap}
header .links a{color:var(--ac);text-decoration:none;font-size:.7rem;border:1px solid rgba(79,195,247,.2);padding:.2rem .6rem;border-radius:4px;transition:all .2s}
header .links a:hover{background:rgba(79,195,247,.1);border-color:var(--ac)}

/* Tabs */
.tabs{max-width:1200px;margin:1.25rem auto 0;padding:0 1.5rem;display:flex;gap:.5rem;border-bottom:1px solid var(--bd);flex-wrap:wrap}
.tab-btn{background:none;border:none;color:var(--mu);padding:.6rem 1.25rem;font-size:.8rem;font-weight:600;cursor:pointer;border-bottom:2px solid transparent;transition:all .2s;font-family:inherit}
.tab-btn:hover{color:var(--tx)}
.tab-btn.active{color:var(--ac);border-bottom-color:var(--ac)}
.tab-btn.active.r3-tab{color:var(--r3);border-bottom-color:var(--r3)}
.tab-btn.active.r2-tab{color:var(--r2);border-bottom-color:var(--r2)}
.tab-btn .badge{background:var(--r2);color:#000;font-size:.6rem;padding:.1rem .35rem;border-radius:3px;margin-left:.35rem;font-weight:700}
.tab-btn .badge.r3-badge{background:var(--r3)}

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
.fc.r3-highlight{border-color:rgba(0,229,255,.12)}
.fc.r3-highlight:hover{border-color:var(--r3)}
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
.img-badge{background:rgba(200,150,255,.1);color:#b388ff;border:1px solid rgba(200,150,255,.18)}
.r2-badge{background:rgba(255,215,0,.12);color:var(--r2);border:1px solid rgba(255,215,0,.2)}
.r3-badge{background:rgba(0,229,255,.12);color:var(--r3);border:1px solid rgba(0,229,255,.2)}

.kf-tag{background:rgba(255,215,0,.06);color:var(--r2);font-size:.6rem;padding:.1rem .4rem;border-radius:3px;border:1px solid rgba(255,215,0,.12);white-space:nowrap}
.orig-link{color:var(--ac);text-decoration:none;font-weight:600;border:1px solid rgba(79,195,247,.15);padding:.15rem .5rem;border-radius:4px;font-size:.65rem;transition:background .2s}
.orig-link:hover{background:rgba(79,195,247,.08)}

.check-status{color:var(--mu);font-size:.7rem}

/* Pagination */
.pgn{display:flex;justify-content:center;align-items:center;gap:.3rem;padding:.75rem 1.5rem;max-width:1200px;margin:0 auto}
.pgn button{background:var(--sf);border:1px solid var(--bd);color:var(--tx);padding:.4rem .75rem;border-radius:4px;font-size:.7rem;cursor:pointer;font-family:inherit;transition:all .15s}
.pgn button:hover:not(:disabled){border-color:var(--ac);color:var(--ac)}
.pgn button:disabled{opacity:.3;cursor:default}
.pgn button.active{background:rgba(79,195,247,.15);border-color:var(--ac);color:var(--ac)}
.pgn .pgn-info{color:var(--mu);font-size:.65rem;margin:0 .5rem}

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
  <div class="byline" style="margin-top:.4rem">${sAll.total} Files · ${sAll.pages.toLocaleString()} Pages · ${Object.keys(sAll.ag).length} Agencies · ${(sAll.chars/1e6).toFixed(1)}M Characters · 3 Releases</div>
  <div class="links">
    <a href="https://www.war.gov/UFO/" target="_blank" rel="noopener">📋 war.gov/UFO →</a>
    <a href="https://www.war.gov/News/Releases/Release/Article/4480582/" target="_blank" rel="noopener">📰 DOW Press Release →</a>
    <a href="https://www.war.gov/UFO/?releaseDate=Release+02#records" target="_blank" rel="noopener">📦 Release 02 →</a>
    <a href="https://www.war.gov/UFO/?releaseDate=Release+03#records" target="_blank" rel="noopener">📦 Release 03 →</a>
  </div>
</header>

<div class="tabs">
  <button class="tab-btn active" onclick="switchTab('all')">📁 All Releases</button>
  <button class="tab-btn" onclick="switchTab('r1')">📦 R1 <span style="color:var(--mu);font-size:.65rem">May 8</span></button>
  <button class="tab-btn r2-tab" onclick="switchTab('r2')">✨ R2 <span class="badge">64</span> <span style="color:var(--mu);font-size:.65rem">May 22</span></button>
  <button class="tab-btn r3-tab" onclick="switchTab('r3')">🆕 R3 <span class="badge r3-badge">72</span> <span style="color:var(--mu);font-size:.65rem">Jun 12</span></button>
</div>

<div class="st-section active" id="sec-facts-r2">${buildR2FactsSection()}</div>
<div class="st-section" id="sec-facts-r3">${buildR3FactsSection()}</div>

<div class="st-section active" id="sec-stats-all"><div class="st">${buildStatCards(sAll)}</div></div>
<div class="st-section" id="sec-stats-r1"><div class="st">${buildStatCards(s1)}</div></div>
<div class="st-section" id="sec-stats-r2"><div class="st">${buildStatCards(s2)}</div></div>
<div class="st-section" id="sec-stats-r3"><div class="st">${buildStatCards(s3)}</div></div>

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

<div class="fl-section active" id="sec-fl-all"><div class="pgn pgn-top" id="pgn-top-all"></div><div class="fl">${buildFileCards(allData)}</div><div class="pgn pgn-bot" id="pgn-bot-all"></div></div>
<div class="fl-section" id="sec-fl-r1"><div class="pgn pgn-top" id="pgn-top-r1"></div><div class="fl">${buildFileCards(allR1)}</div><div class="pgn pgn-bot" id="pgn-bot-r1"></div></div>
<div class="fl-section" id="sec-fl-r2"><div class="pgn pgn-top" id="pgn-top-r2"></div><div class="fl">${buildFileCards(r2Entries)}</div><div class="pgn pgn-bot" id="pgn-bot-r2"></div></div>
<div class="fl-section" id="sec-fl-r3"><div class="pgn pgn-top" id="pgn-top-r3"></div><div class="fl">${buildFileCards(r3Entries)}</div><div class="pgn pgn-bot" id="pgn-bot-r3"></div></div>

<footer>
  Built by Ky · OpenClaw · Raspberry Pi 5 · ${new Date().toLocaleString('en-US',{timeZone:'America/Los_Angeles'})} PT · <a href="https://www.war.gov/UFO/" target="_blank" rel="noopener">war.gov/UFO</a> · Data: R1+R2+R3
</footer>

<script>
let currentTab = 'all', currentPage = 1, cardsPerPage = 25;

(function initTab() {
  const hash = window.location.hash.replace('#', '');
  if (hash === 'r1' || hash === 'r2' || hash === 'r3' || hash === 'all') switchTab(hash);
})();
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#', '');
  if ((hash === 'r1' || hash === 'r2' || hash === 'r3' || hash === 'all') && hash !== currentTab) switchTab(hash);
});

function switchTab(tab) {
  currentTab = tab; currentPage = 1;
  window.location.hash = tab;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => {
    if ((tab==='all' && b.textContent.includes('All Releases')) ||
        (tab==='r1' && b.textContent.includes('R1')) ||
        (tab==='r2' && b.textContent.includes('R2')) ||
        (tab==='r3' && b.textContent.includes('R3'))) {
      b.classList.add('active');
    }
  });
  document.querySelectorAll('.st-section').forEach(s => s.classList.remove('active'));
  const statsEl = document.getElementById('sec-stats-' + tab);
  if (statsEl) statsEl.classList.add('active');
  
  // Show/hide facts sections
  const factsR2 = document.getElementById('sec-facts-r2');
  const factsR3 = document.getElementById('sec-facts-r3');
  if (factsR2) factsR2.classList.remove('active');
  if (factsR3) factsR3.classList.remove('active');
  if (tab === 'all') {
    // Show the most recent facts section
    if (factsR3) factsR3.classList.add('active');
  } else if (tab === 'r2' && factsR2) {
    factsR2.classList.add('active');
  } else if (tab === 'r3' && factsR3) {
    factsR3.classList.add('active');
  }
  
  document.querySelectorAll('.fl-section').forEach(s => s.classList.remove('active'));
  const flEl = document.getElementById('sec-fl-' + tab);
  if (flEl) flEl.classList.add('active');
  doFilter();
}

// ── Collapsible cards ──
function toggleCard(card) {
  const body = card.querySelector('.fc-body');
  if (!body) return;
  if (body.style.display === 'none') { body.style.display = 'block'; card.classList.add('expanded'); }
  else { body.style.display = 'none'; card.classList.remove('expanded'); }
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

// ── Pagination ──
function renderPagination(totalFiltered) {
  const totalPages = Math.ceil(totalFiltered / cardsPerPage) || 1;
  if (currentPage > totalPages) currentPage = totalPages;
  const build = (id) => {
    const el = document.getElementById(id); if (!el) return;
    let h = '';
    h += '<button onclick="goPage(' + (currentPage-1) + ')" ' + (currentPage<=1?'disabled':'') + '>◀ Prev</button>';
    for (let i=1; i<=totalPages; i++) {
      if (totalPages<=7 || i===1 || i===totalPages || Math.abs(i-currentPage)<=1) {
        h += '<button onclick="goPage('+i+')" ' + (i===currentPage?'class="active"':'') + '>'+i+'</button>';
      } else if (i===2 || i===totalPages-1) {
        h += '<span style="color:var(--mu);font-size:.7rem">…</span>';
      }
    }
    h += '<button onclick="goPage(' + (currentPage+1) + ')" ' + (currentPage>=totalPages?'disabled':'') + '>Next ▶</button>';
    h += '<span class="pgn-info">Page '+currentPage+' of '+totalPages+' · '+totalFiltered+' files</span>';
    el.innerHTML = h;
  };
  ['pgn-top-'+currentTab, 'pgn-bot-'+currentTab].forEach(build);
}

function goPage(p) { currentPage = p; doFilter(true); }

function doFilter(skipPageReset) {
  if (!skipPageReset) currentPage = 1;
  const q = (document.getElementById('q').value || '').toLowerCase();
  const a = document.getElementById('af').value, t = document.getElementById('tf').value, c = document.getElementById('cf').value;
  const container = document.getElementById('sec-fl-' + currentTab);
  if (!container) return;
  
  const matches = [];
  container.querySelectorAll('.fc').forEach(card => {
    if (currentTab !== 'all' && card.dataset.r !== (currentTab === 'r1' ? '01' : currentTab === 'r2' ? '02' : '03')) {
      card.style.display = 'none'; return;
    }
    const match = (!q || card.dataset.q.includes(q)) && (!a || card.dataset.a === a) && (!t || card.dataset.t === t) && (!c || card.dataset.c === c);
    if (match) matches.push(card);
    card.style.display = 'none';
  });
  
  const start = (currentPage - 1) * cardsPerPage;
  const pageCards = matches.slice(start, start + cardsPerPage);
  pageCards.forEach(card => card.style.display = '');
  
  renderPagination(matches.length);
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
    if (latest > 3) status.innerHTML = '🆕 <b style="color:#ffd700">Release '+latest+'!</b> <a href="https://www.war.gov/UFO/" style="color:var(--ac)">View →</a>';
    else if (latest === 3) status.innerHTML = '✅ <span style="color:var(--uc)">Latest: Release 03</span>';
    else status.innerHTML = '⚠️ <a href="https://www.war.gov/UFO/" style="color:var(--ac)">Check manually →</a>';
  } catch(e) { status.textContent = '❌ Offline'; }
  btn.disabled = false;
}
</script>
</body>
</html>`;

fs.writeFileSync(OUT, html);
fs.writeFileSync(INDEX, html);
console.log(`✅ Dashboard v5: ${OUT} (${(html.length/1024).toFixed(1)} KB)`);
console.log(`📊 ${allData.length} files (R1: ${allR1.length} PDFs, R2: ${r2Entries.filter(e=>e.type==='PDF').length} PDFs + ${r2Entries.filter(e=>e.isVideo).length} videos + ${r2Entries.filter(e=>e.isAudio).length} audio, R3: ${r3Entries.filter(e=>e.type==='PDF').length} PDFs + ${r3Entries.filter(e=>e.isVideo).length} videos + ${r3Entries.filter(e=>e.isImage).length} images + ${r3Entries.filter(e=>e.isAudio).length} audio)`);

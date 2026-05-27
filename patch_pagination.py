#!/usr/bin/env python3
"""Add pagination + back-to-top to the UFO dashboard HTML"""
import re

with open('/home/lilbooduh/ufo-dashboard/dashboard.html', 'r') as f:
    html = f.read()

# ── 1. Add CSS for pagination and back-to-top ──
extra_css = """
/* Pagination */
.pg-bar{display:flex;align-items:center;gap:.5rem;padding:.75rem 2rem;max-width:1200px;margin:0 auto;flex-wrap:wrap}
.pg-btn{background:var(--sf);border:1px solid var(--bd);color:var(--tx);padding:.4rem .9rem;border-radius:6px;font-size:.8rem;cursor:pointer;transition:all .2s;font-family:inherit}
.pg-btn:hover:not(:disabled){border-color:var(--ac);color:var(--ac)}
.pg-btn:disabled{opacity:.3;cursor:default}
.pg-btn.active{background:rgba(79,195,247,.15);border-color:var(--ac);color:var(--ac)}
.pg-select{background:var(--sf);border:1px solid var(--bd);color:var(--tx);padding:.4rem .6rem;border-radius:6px;font-size:.8rem;font-family:inherit;cursor:pointer}
.pg-info{color:var(--mu);font-size:.75rem;margin-left:auto}
/* Back to top */
#btt{position:fixed;bottom:2rem;right:2rem;background:rgba(79,195,247,.2);border:1px solid rgba(79,195,247,.4);color:var(--ac);width:44px;height:44px;border-radius:50%;font-size:1.2rem;cursor:pointer;opacity:0;transform:translateY(10px);transition:all .3s;z-index:999;display:flex;align-items:center;justify-content:center}
#btt.show{opacity:1;transform:translateY(0)}
#btt:hover{background:rgba(79,195,247,.35)}
@media(max-width:600px){.pg-bar{padding:.75rem 1rem}}
"""

# Insert before </style>
html = html.replace('</style>', extra_css + '\n</style>')

# ── 2. Add pagination controls HTML before the file list ──
pag_html = """
<div class="pg-bar" id="pgTop" style="display:none">
  <button class="pg-btn" onclick="goPage(-1)" id="btnPrev">◀ Prev</button>
  <span id="pageNumbers"></span>
  <button class="pg-btn" onclick="goPage(1)" id="btnNext">Next ▶</button>
  <select class="pg-select" id="perPage" onchange="changePerPage()">
    <option value="10">10 per page</option>
    <option value="25" selected>25 per page</option>
    <option value="50">50 per page</option>
    <option value="100">100 per page</option>
  </select>
  <span class="pg-info" id="pgInfo"></span>
</div>
"""

# Insert before first <div class="fl-section"
html = html.replace('<div class="fl-section active" id="sec-fl-all">', pag_html + '\n<div class="fl-section active" id="sec-fl-all">')

# ── 3. Add pagination bar at bottom too ──
pag_bottom = '\n<div class="pg-bar" id="pgBottom" style="display:none">\n  <button class="pg-btn" onclick="goPage(-1)">◀ Prev</button>\n  <span id="pageNumbersB"></span>\n  <button class="pg-btn" onclick="goPage(1)">Next ▶</button>\n  <span class="pg-info" id="pgInfoB"></span>\n</div>\n'
html = html.replace('</footer>', pag_bottom + '</footer>')

# ── 4. Add back-to-top button ──
html = html.replace('</body>', '<button id="btt" onclick="window.scrollTo({top:0,behavior:\'smooth\'})" title="Back to top">⬆</button>\n</body>')

# ── 5. Replace the filter/display JavaScript with paginated version ──
old_js = """function doFilter() {
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
}"""

new_js = """let currentPage = 1;
let filteredCards = [];

function doFilter() {
  const q = (document.getElementById('q').value || '').toLowerCase();
  const a = document.getElementById('af').value;
  const t = document.getElementById('tf').value;
  const c = document.getElementById('cf').value;
  
  filteredCards = [];
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
    card.style.display = 'none'; // Hide all, show via pagination
    if (match) filteredCards.push(card);
  });
  
  currentPage = 1;
  renderPage();
}

function renderPage() {
  const per = parseInt(document.getElementById('perPage').value) || 25;
  const total = filteredCards.length;
  const totalPages = Math.ceil(total / per);
  if (currentPage > totalPages) currentPage = totalPages || 1;
  
  const start = (currentPage - 1) * per;
  const end = Math.min(start + per, total);
  
  // Hide all, show current page
  document.querySelectorAll('.fl-section .fc').forEach(c => c.style.display = 'none');
  for (let i = start; i < end; i++) {
    filteredCards[i].style.display = '';
    // Smooth fade
    filteredCards[i].style.opacity = '1';
  }
  
  // Update all pagination bars
  document.querySelectorAll('.pg-bar').forEach(b => b.style.display = total > per ? '' : 'none');
  
  // Page number buttons
  const buildBtns = (containerId) => {
    const c = document.getElementById(containerId);
    if (!c) return;
    c.innerHTML = '';
    const maxShow = 6;
    let rangeStart = Math.max(1, currentPage - Math.floor(maxShow/2));
    let rangeEnd = Math.min(totalPages, rangeStart + maxShow - 1);
    if (rangeEnd - rangeStart < maxShow - 1) rangeStart = Math.max(1, rangeEnd - maxShow + 1);
    
    if (currentPage > 1) {
      const b = document.createElement('button'); b.className='pg-btn'; b.textContent='1'; b.onclick=()=>goToPage(1); c.appendChild(b);
      if (rangeStart > 2) { const d = document.createElement('span'); d.textContent='…'; d.style.color='var(--mu)'; d.style.padding='0 .2rem'; c.appendChild(d); }
    }
    for (let i = rangeStart; i <= rangeEnd; i++) {
      const b = document.createElement('button');
      b.className = 'pg-btn' + (i === currentPage ? ' active' : '');
      b.textContent = i;
      b.onclick = () => goToPage(i);
      c.appendChild(b);
    }
    if (rangeEnd < totalPages) {
      const d = document.createElement('span'); d.textContent='…'; d.style.color='var(--mu)'; d.style.padding='0 .2rem'; c.appendChild(d);
      const b = document.createElement('button'); b.className='pg-btn'; b.textContent=totalPages; b.onclick=()=>goToPage(totalPages); c.appendChild(b);
    }
  };
  
  buildBtns('pageNumbers');
  buildBtns('pageNumbersB');
  
  document.getElementById('btnPrev').disabled = currentPage <= 1;
  document.getElementById('btnNext').disabled = currentPage >= totalPages;
  
  const info = `Showing ${start+1}–${end} of ${total} files`;
  document.getElementById('pgInfo').textContent = info;
  document.getElementById('pgInfoB').textContent = info;
  document.getElementById('resultCount').textContent = total + ' files';
}

function goPage(dir) {
  currentPage += dir;
  const total = Math.ceil(filteredCards.length / (parseInt(document.getElementById('perPage').value) || 25));
  if (currentPage < 1) currentPage = 1;
  if (currentPage > total) currentPage = total;
  renderPage();
  window.scrollTo({top:200, behavior:'smooth'});
}

function goToPage(n) {
  currentPage = n;
  renderPage();
  window.scrollTo({top:200, behavior:'smooth'});
}

function changePerPage() {
  currentPage = 1;
  renderPage();
}"""

if old_js in html:
    html = html.replace(old_js, new_js)
    print('✅ Replaced doFilter with paginated version')
else:
    print('❌ Could not find doFilter function')

# ── 6. Update switchTab to reset pagination ──
old_tab = """function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => {
    if ((tab==='all' && b.textContent.includes('All')) ||
        (tab==='r1' && b.textContent.includes('Release 01')) ||
        (tab==='r2' && b.textContent.includes('Release 02'))) {
      b.classList.add('active');
    }
  });"""

new_tab = """function switchTab(tab) {
  currentTab = tab;
  currentPage = 1;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => {
    if ((tab==='all' && b.textContent.includes('All')) ||
        (tab==='r1' && b.textContent.includes('Release 01')) ||
        (tab==='r2' && b.textContent.includes('Release 02'))) {
      b.classList.add('active');
    }
  });"""

if old_tab in html:
    html = html.replace(old_tab, new_tab)
    print('✅ Added pagination reset to tab switch')

# ── 7. Add scroll listener for back-to-top ──
old_listener = 'btn.disabled = false;\n}'
if old_listener in html:
    html = html.replace(old_listener, old_listener + '\n\n// Back to top visibility\nwindow.addEventListener(\'scroll\',()=>{const b=document.getElementById(\'btt\');if(b)b.classList.toggle(\'show\',window.scrollY>600)});')
    print('✅ Added back-to-top scroll listener')

# Write
with open('/home/lilbooduh/ufo-dashboard/dashboard.html', 'w') as f:
    f.write(html)
print(f'✅ Patched dashboard ({len(html)} chars)')

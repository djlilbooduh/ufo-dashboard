// Stealth-mode scraper for war.gov PURSUE — Release 03
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');

puppeteer.use(StealthPlugin());

const URL = 'https://www.war.gov/UFO/';
const OUT_CSV = '/tmp/uap-data-r3.csv';
const OUT_JSON = '/home/lilbooduh/ufo-dashboard/data/r3_raw.json';
const OUT_PNG = '/tmp/pursue_r3.png';

(async () => {
  console.log('Launching stealth browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/usr/bin/chromium',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-blink-features=AutomationControlled',
      '--disable-features=IsolateOrigins,site-per-process',
    ]
  });
  
  const page = await browser.newPage();
  
  // Set realistic viewport and user agent
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent('Mozilla/5.0 (X11; Linux aarch64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');
  
  // Remove webdriver flag
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
    window.chrome = { runtime: {} };
  });
  
  page.setDefaultTimeout(90000);
  
  console.log('Navigating to PURSUE...');
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
  
  // Check if we got blocked
  const bodyText = await page.evaluate(() => document.body.innerText);
  if (bodyText.includes('Access Denied')) {
    console.log('BLOCKED by Akamai — taking screenshot for debug');
    await page.screenshot({ path: '/tmp/blocked.png' });
    await browser.close();
    process.exit(1);
  }
  
  console.log('Page loaded! Waiting for React to render...');
  await new Promise(r => setTimeout(r, 8000));
  
  // Wait for table rows
  try {
    await page.waitForSelector('tr', { timeout: 20000 });
    console.log('Table rows found!');
  } catch(e) {
    console.log('No tr elements found, trying any elements with data...');
  }
  
  // Take screenshot
  await page.screenshot({ path: OUT_PNG, fullPage: true });
  console.log(`Screenshot: ${OUT_PNG}`);
  
  // Extract all table data
  const data = await page.evaluate(() => {
    // Strategy: find all tables and extract
    const tables = document.querySelectorAll('table');
    const result = [];
    
    tables.forEach((table, ti) => {
      const headers = [];
      table.querySelectorAll('thead th').forEach(th => {
        headers.push(th.textContent.trim());
      });
      
      const rows = table.querySelectorAll('tbody tr');
      console.log(`Table ${ti}: ${rows.length} rows, headers: [${headers.join(', ')}]`);
      
      rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const record = {};
        cells.forEach((td, i) => {
          const key = headers[i] || `col_${i}`;
          let val = td.textContent.trim();
          // Check for links
          const link = td.querySelector('a');
          if (link) {
            record[`${key}_url`] = link.href;
          }
          record[key] = val;
        });
        if (Object.keys(record).length > 0) result.push(record);
      });
    });
    
    return result;
  });
  
  console.log(`Extracted ${data.length} records from tables`);
  
  if (data.length === 0) {
    // Fallback: try getting all text content and figure out structure
    console.log('No table data. Trying alternative extraction...');
    const altData = await page.evaluate(() => {
      // Get all text content organized by visible sections
      const body = document.body.innerText;
      return { bodyLength: body.length, preview: body.substring(0, 3000) };
    });
    console.log('Page text preview:', altData.preview.substring(0, 500));
  }
  
  // Save data
  const output = {
    scraped_at: new Date().toISOString(),
    url: URL,
    recordCount: data.length,
    records: data
  };
  fs.writeFileSync(OUT_JSON, JSON.stringify(output, null, 2));
  console.log(`JSON saved: ${OUT_JSON} (${data.length} records)`);
  
  // Build CSV
  if (data.length > 0) {
    const allKeys = new Set();
    data.forEach(d => Object.keys(d).forEach(k => allKeys.add(k)));
    const headers = [...allKeys];
    const csvLines = [headers.join(',')];
    data.forEach(d => {
      csvLines.push(headers.map(h => {
        const v = (d[h] || '').replace(/"/g, '""');
        return `"${v}"`;
      }).join(','));
    });
    fs.writeFileSync(OUT_CSV, csvLines.join('\n'));
    console.log(`CSV saved: ${OUT_CSV}`);
  }
  
  await browser.close();
  console.log('Done!');
})().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});

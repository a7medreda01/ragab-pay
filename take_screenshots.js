const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = 'C:\\Users\\Dubai Store\\.gemini\\antigravity\\brain\\db46b9da-17f8-470f-a271-372e64eef368\\screenshots';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();

  // Helper to click by button text
  async function clickByText(selector, textSnippet) {
    return page.evaluate((sel, text) => {
      const els = Array.from(document.querySelectorAll(sel));
      const target = els.find(e => e.textContent.includes(text));
      if (target) {
        target.click();
        return true;
      }
      return false;
    }, selector, textSnippet);
  }

  // 1. Welcome Screen (3 viewports)
  console.log('Capturing Welcome screen...');
  for (const vp of [
    { name: 'desktop_1440', w: 1440, h: 900 },
    { name: 'tablet_768', w: 768, h: 1024 },
    { name: 'mobile_375', w: 375, h: 812 }
  ]) {
    await page.setViewport({ width: vp.w, height: vp.h });
    await page.goto('http://localhost:4200', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(OUTPUT_DIR, `${vp.name}_01_welcome.png`) });
  }

  // 2. Home Screen
  console.log('Capturing Home screen...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:4200', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 400));
  await clickByText('button', 'تصفح كزائر');
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUTPUT_DIR, `desktop_1440_02_home.png`) });

  await page.setViewport({ width: 768, height: 1024 });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(OUTPUT_DIR, `tablet_768_02_home.png`) });

  await page.setViewport({ width: 375, height: 812 });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(OUTPUT_DIR, `mobile_375_02_home.png`) });

  // 3. Search Screen
  console.log('Capturing Search screen...');
  await page.setViewport({ width: 1440, height: 900 });
  await clickByText('button', 'استكشاف');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUTPUT_DIR, `desktop_1440_03_search.png`) });

  await page.setViewport({ width: 375, height: 812 });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(OUTPUT_DIR, `mobile_375_03_search.png`) });

  // 4. Filter Sheet Modal
  console.log('Capturing Filter sheet...');
  await page.setViewport({ width: 1440, height: 900 });
  await clickByText('button', 'تصفية');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUTPUT_DIR, `desktop_1440_04_filters.png`) });

  // Close filter sheet
  await page.evaluate(() => {
    const backdrop = document.querySelector('.bg-slate-950\\/60');
    if (backdrop) backdrop.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // 5. Property Details Screen
  console.log('Capturing Details screen...');
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('div.cursor-pointer'));
    const card = cards.find(c => c.textContent.includes('ج.م'));
    if (card) card.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUTPUT_DIR, `desktop_1440_05_details.png`) });

  await page.setViewport({ width: 375, height: 812 });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(OUTPUT_DIR, `mobile_375_05_details.png`) });

  // 6. Checkout Screen
  console.log('Capturing Checkout screen...');
  await page.setViewport({ width: 1440, height: 900 });
  await clickByText('button', 'احجز الآن');
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUTPUT_DIR, `desktop_1440_06_checkout.png`) });

  await page.setViewport({ width: 375, height: 812 });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(OUTPUT_DIR, `mobile_375_06_checkout.png`) });

  // 7. Voucher Screen
  console.log('Capturing Voucher screen...');
  await page.setViewport({ width: 1440, height: 900 });
  await clickByText('button', 'إتمام الحجز');
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(OUTPUT_DIR, `desktop_1440_07_voucher.png`) });

  await page.setViewport({ width: 375, height: 812 });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(OUTPUT_DIR, `mobile_375_07_voucher.png`) });

  // 8. Auth Modal (Login / Register / Switch to Owner)
  console.log('Capturing Auth modal...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:4200', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 400));
  await clickByText('button', 'استكشف الوحدات');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUTPUT_DIR, `desktop_1440_08_auth.png`) });

  // 9. Owner Dashboard
  console.log('Capturing Owner dashboard...');
  await clickByText('button', 'تجربة لوحة تحكم المالك');
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUTPUT_DIR, `desktop_1440_09_owner_dashboard.png`) });

  await page.setViewport({ width: 375, height: 812 });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(OUTPUT_DIR, `mobile_375_09_owner_dashboard.png`) });

  // 10. Owner Edit Unit Modal
  console.log('Capturing Owner Edit modal...');
  await page.setViewport({ width: 1440, height: 900 });
  await clickByText('button', 'تعديل');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUTPUT_DIR, `desktop_1440_10_owner_edit_modal.png`) });

  // 11. Side Drawer / VIP Services / QR Pass
  console.log('Capturing QR Pass modal...');
  await page.goto('http://localhost:4200', { waitUntil: 'networkidle0' });
  await clickByText('button', 'تصفح كزائر');
  await new Promise(r => setTimeout(r, 600));
  // Open side drawer
  await page.evaluate(() => {
    const burger = document.querySelector('button i.bi-list');
    if (burger && burger.parentElement) burger.parentElement.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUTPUT_DIR, `desktop_1440_11_side_drawer.png`) });

  // Click on Tourist QR in drawer
  await clickByText('button, div', 'تصريح الدخول');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUTPUT_DIR, `desktop_1440_12_qr_pass_modal.png`) });

  console.log('Done capturing all screens and modalities!');
  await browser.close();
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});

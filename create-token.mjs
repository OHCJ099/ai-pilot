import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'fs';

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext();
const page = await context.newPage();

await page.goto('https://www.npmjs.com/login');
console.log('浏览器已打开 npm 登录页面');
console.log('请在浏览器中登录 npm，然后我来创建 token');

// Wait for user to log in (check for tokens page)
for (let i = 0; i < 120; i++) {
  await page.waitForTimeout(3000);
  const url = page.url();
  if (url.includes('/settings/') && url.includes('/tokens')) {
    console.log('检测到已登录并进入 tokens 页面');
    break;
  }
  if (url.includes('/login')) {
    console.log('等待登录中... (' + (i * 3) + '秒)');
  } else {
    // Navigate to tokens page
    await page.goto('https://www.npmjs.com/settings/ohcj099/tokens');
    await page.waitForTimeout(3000);
    break;
  }
}

// Now on tokens page, click Generate New Token
const genBtn = page.locator('text=Generate New Token');
await genBtn.waitFor({ timeout: 10000 });
await genBtn.click();
await page.waitForTimeout(2000);

// Select Classic Token
const classicBtn = page.locator('text=Classic Token');
if (await classicBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  await classicBtn.click();
  await page.waitForTimeout(1000);
}

// Fill token name
const nameInput = page.locator('input').first();
await nameInput.fill('ai-pilot-publish');

// Select All packages with read-write
const allPkgRadio = page.locator('text=All packages').first();
await allPkgRadio.click();
await page.waitForTimeout(500);

// Set read-write permission
const rwOption = page.locator('text=Read and Write');
if (await rwOption.isVisible({ timeout: 3000 }).catch(() => false)) {
  await rwOption.click();
}

// Click Generate
const generateBtn = page.locator('button:has-text("Generate")');
await generateBtn.click();
await page.waitForTimeout(5000);

// Screenshot the result
await page.screenshot({ path: 'npm-token-result.png' });

// Try to copy the token
const tokenInput = page.locator('input[type="text"], input[type="password"]').last();
const token = await tokenInput.inputValue().catch(() => '');

if (token && token.startsWith('npm_')) {
  console.log('TOKEN:' + token);
  // Save to npmrc
  const npmrc = readFileSync(process.env.USERPROFILE + '/.npmrc', 'utf8');
  const updated = npmrc.replace(
    /\/\/registry\.npmjs\.org\/:_authToken=.*/,
    `//registry.npmjs.org/:_authToken=${token}`
  );
  writeFileSync(process.env.USERPROFILE + '/.npmrc', updated);
  console.log('Token saved to ~/.npmrc');
} else {
  console.log('请手动复制 token，截图已保存: npm-token-result.png');
}

await page.waitForTimeout(30000);
await browser.close();

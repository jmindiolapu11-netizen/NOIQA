import { chromium } from 'playwright';

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox'],
});

const page = await browser.newPage({ viewport: { width: 420, height: 820 } });
const dir = '/tmp/claude-0/-home-user-NOIQA/c029d8c0-6ea6-5d14-952c-5c116b1c3064/scratchpad';

// Splash screen
await page.goto('http://localhost:3000');
await page.waitForSelector('text=Comenzar', { timeout: 10000 });

// Wait for animations to complete
await page.waitForTimeout(2000);
await page.screenshot({ path: `${dir}/splash.png`, fullPage: false });
console.log('Splash captured');

// Click comenzar -> onboarding
await page.click('text=Comenzar');
await page.waitForSelector('text=¿Qué materia enseñas?');
await page.screenshot({ path: `${dir}/onboarding-with-logo.png`, fullPage: false });
console.log('Onboarding captured');

// Complete onboarding to see header
await page.click('text=Matemáticas');
await page.click('text=Siguiente');
await page.waitForSelector('text=¿En qué nivel educativo?');
await page.click('text=Secundaria');
await page.click('text=Siguiente');
await page.waitForSelector('text=¿Qué tarea repites más?');
await page.click('text=Preparar mi clase');
await page.click('text=Siguiente');
await page.waitForSelector('text=¿Qué tan cómodo');
await page.click('text=Algo cómodo');
await page.click('text=Empezar');
await page.waitForSelector('text=¿Qué necesitas hoy?');
await page.screenshot({ path: `${dir}/chat-with-icon.png`, fullPage: false });
console.log('Chat with icon header captured');

await browser.close();
console.log('Done!');

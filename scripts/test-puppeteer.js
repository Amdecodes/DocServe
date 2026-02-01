const puppeteer = require('puppeteer');

(async () => {
  try {
    console.log('Checking Puppeteer installation...');
    
    // 1. Check path
    const execPath = puppeteer.executablePath();
    console.log(`Executable Path: ${execPath}`);

    // 2. Try to launch
    console.log('Attempting to launch browser...');
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const version = await browser.version();
    console.log(`✅ Success! Browser launched: ${version}`);
    
    await browser.close();
  } catch (error) {
    console.error('❌ Error: Puppeteer failed to launch.');
    console.error('Error details:', error.message);
    
    if (error.message.includes('error while loading shared libraries')) {
      console.log('\nPotential Fix: You are missing system dependencies. Check the apt-get install list provided earlier.');
    }
  }
})();

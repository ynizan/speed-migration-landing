const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:8080');
  await page.waitForLoadState('networkidle');

  // Take full page screenshot
  await page.screenshot({ path: 'brand-check-full.png', fullPage: true });

  // Check header logo
  const logo = await page.$('.logo');
  if (logo) {
    const logoBox = await logo.boundingBox();
    console.log('Logo found at:', logoBox);

    // Get logo text color
    const logoColor = await page.evaluate(() => {
      const logo = document.querySelector('.logo');
      return window.getComputedStyle(logo).color;
    });
    console.log('Logo text color:', logoColor);
  }

  // Check CTA button color
  const ctaButton = await page.$('.cta-button');
  if (ctaButton) {
    const ctaBg = await page.evaluate(() => {
      const btn = document.querySelector('.cta-button');
      return window.getComputedStyle(btn).backgroundColor;
    });
    console.log('CTA button background:', ctaBg);

    // Verify it's the correct blue (#0066FF = rgb(0, 102, 255))
    if (ctaBg === 'rgb(0, 102, 255)') {
      console.log('✓ CTA button color is correct (#0066FF)');
    } else {
      console.log('✗ CTA button color is WRONG. Expected rgb(0, 102, 255), got:', ctaBg);
    }
  }

  // Check accent color usage
  const accentElements = await page.$$('[style*="BFFF00"], [style*="bfff00"]');
  console.log('Elements with lime accent:', accentElements.length);

  // Check CSS variables
  const cssVars = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    return {
      primary: style.getPropertyValue('--color-primary').trim(),
      accent: style.getPropertyValue('--color-accent').trim(),
      primaryHover: style.getPropertyValue('--color-primary-hover').trim(),
    };
  });
  console.log('\nCSS Variables:');
  console.log('  --color-primary:', cssVars.primary);
  console.log('  --color-accent:', cssVars.accent);
  console.log('  --color-primary-hover:', cssVars.primaryHover);

  // Verify brand colors
  console.log('\nBrand Color Verification:');
  if (cssVars.primary === '#0066FF') {
    console.log('✓ Primary color is correct (#0066FF)');
  } else {
    console.log('✗ Primary color is WRONG. Expected #0066FF, got:', cssVars.primary);
  }

  if (cssVars.accent === '#BFFF00') {
    console.log('✓ Accent color is correct (#BFFF00 lime)');
  } else {
    console.log('✗ Accent color is WRONG. Expected #BFFF00, got:', cssVars.accent);
  }

  // Take header screenshot
  const header = await page.$('.site-header');
  if (header) {
    await header.screenshot({ path: 'brand-check-header.png' });
    console.log('\nHeader screenshot saved to brand-check-header.png');
  }

  await browser.close();
  console.log('\nFull page screenshot saved to brand-check-full.png');
})();

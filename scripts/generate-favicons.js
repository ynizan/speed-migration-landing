const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = 'static';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Source SVG
const svgContent = `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M28 4L12 26H22L18 44L36 20H26L28 4Z" fill="#0066FF"/>
</svg>`;

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
];

async function generateFavicons() {
  const svgBuffer = Buffer.from(svgContent);

  for (const { name, size } of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(OUTPUT_DIR, name));

    console.log(`✓ ${name}`);
  }

  // Generate ICO (use 32x32 PNG as favicon.ico - browsers accept PNG)
  await sharp(svgBuffer)
    .resize(32, 32)
    .toFile(path.join(OUTPUT_DIR, 'favicon.ico'));
  console.log('✓ favicon.ico');

  // Safari pinned tab (black version)
  const safariSvg = `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <path d="M28 4L12 26H22L18 44L36 20H26L28 4Z" fill="black"/>
</svg>`;
  fs.writeFileSync(path.join(OUTPUT_DIR, 'safari-pinned-tab.svg'), safariSvg);
  console.log('✓ safari-pinned-tab.svg');

  // Web manifest
  const manifest = {
    name: "Flows123",
    short_name: "Flows123",
    icons: [
      { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" }
    ],
    theme_color: "#0066FF",
    background_color: "#FFFFFF",
    display: "standalone"
  };
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'site.webmanifest'),
    JSON.stringify(manifest, null, 2)
  );
  console.log('✓ site.webmanifest');

  console.log('\nDone! Add the HTML snippet to your <head>');
}

generateFavicons().catch(console.error);

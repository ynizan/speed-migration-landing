/**
 * Brand Compliance Tests for Flows123
 * Run with: npm test -- --grep "Brand Compliance"
 */

const fs = require('fs');
const path = require('path');

// Load brand tokens
const colors = require('../../brand/tokens/colors.json');

describe('Brand Compliance', () => {

  describe('Color Usage', () => {
    const cssFiles = [
      'static/css/styles.css',
    ];

    const approvedColors = [
      colors.brand.primary,
      colors.brand.accent,
      colors.brand.black,
      colors.brand.white,
      colors.gray['100'],
      colors.gray['300'],
      colors.gray['500'],
      colors.gray['700'],
      colors.semantic.success,
      colors.semantic.warning,
      colors.semantic.error,
      colors.derived.primaryLight,
      colors.derived.primaryDark,
    ].map(c => c.toLowerCase());

    test('all colors in CSS should be from approved palette', () => {
      cssFiles.forEach(file => {
        const filePath = path.join(__dirname, '../../', file);
        if (!fs.existsSync(filePath)) return;

        const content = fs.readFileSync(filePath, 'utf8');

        // Extract hex colors
        const hexPattern = /#[0-9A-Fa-f]{6}\b/g;
        const foundColors = content.match(hexPattern) || [];

        const unapprovedColors = [];
        foundColors.forEach(color => {
          const isApproved = approvedColors.includes(color.toLowerCase()) ||
                            color.toLowerCase() === '#e5e5e5' || // border exception
                            color.toLowerCase() === '#f0f0f0' || // skeleton loader
                            color.toLowerCase() === '#e5e5e5';   // shimmer

          if (!isApproved) {
            unapprovedColors.push(color);
          }
        });

        if (unapprovedColors.length > 0) {
          console.warn(`Unapproved colors found in ${file}:`, [...new Set(unapprovedColors)]);
        }

        expect(unapprovedColors.length).toBe(0);
      });
    });

    test('logo should never have more than 2 colors', () => {
      const assetsDir = path.join(__dirname, '../../brand/assets');
      if (!fs.existsSync(assetsDir)) return;

      const logoFiles = fs.readdirSync(assetsDir)
        .filter(f => f.startsWith('logo-') && f.endsWith('.svg'));

      logoFiles.forEach(file => {
        const content = fs.readFileSync(path.join(assetsDir, file), 'utf8');

        // Extract fill colors
        const fillPattern = /fill=["']#[0-9A-Fa-f]{6}["']/g;
        const fills = content.match(fillPattern) || [];
        const uniqueFills = [...new Set(fills)];

        expect(uniqueFills.length).toBeLessThanOrEqual(2);
      });
    });
  });

  describe('Logo Spacing', () => {
    test('logo gap should be 6px in CSS', () => {
      const cssPath = path.join(__dirname, '../../static/css/styles.css');
      if (!fs.existsSync(cssPath)) return;

      const cssContent = fs.readFileSync(cssPath, 'utf8');

      // Check for gap property in logo class
      const hasCorrectGap = cssContent.includes('gap: 6px');

      expect(hasCorrectGap).toBe(true);
    });
  });

  describe('Typography', () => {
    test('font-family should include Manrope', () => {
      const cssPath = path.join(__dirname, '../../static/css/styles.css');
      if (!fs.existsSync(cssPath)) return;

      const cssContent = fs.readFileSync(cssPath, 'utf8');

      expect(cssContent).toContain('Manrope');
    });

    test('font weights should be correct', () => {
      const typographyPath = path.join(__dirname, '../../brand/tokens/typography.css');
      if (!fs.existsSync(typographyPath)) return;

      const typographyCSS = fs.readFileSync(typographyPath, 'utf8');

      expect(typographyCSS).toContain('--font-weight-bold: 800');
      expect(typographyCSS).toContain('--font-weight-semibold: 600');
      expect(typographyCSS).toContain('--font-weight-regular: 400');
    });
  });

  describe('Approved Color Combinations', () => {
    const approvedCombos = colors.approvedCombinations;

    test('all logo variants use approved combinations', () => {
      const assetsDir = path.join(__dirname, '../../brand/assets');
      if (!fs.existsSync(assetsDir)) return;

      const logoFiles = fs.readdirSync(assetsDir)
        .filter(f => f.startsWith('logo-') && f.endsWith('.svg'));

      logoFiles.forEach(file => {
        const content = fs.readFileSync(path.join(assetsDir, file), 'utf8');

        // Extract the fill color
        const fillMatch = content.match(/fill=["']#([0-9A-Fa-f]{6})["']/);
        if (fillMatch) {
          const fillColor = `#${fillMatch[1]}`.toUpperCase();

          // Check if this is an approved foreground color
          const isApproved = approvedCombos.some(
            combo => combo.foreground.toUpperCase() === fillColor
          );

          expect(isApproved).toBe(true);
        }
      });
    });
  });
});

describe('Asset Integrity', () => {

  test('all required logo variants exist', () => {
    const assetsDir = path.join(__dirname, '../../brand/assets');
    if (!fs.existsSync(assetsDir)) return;

    const requiredAssets = [
      'logo-horizontal-blue.svg',
      'logo-horizontal-white.svg',
      'logo-horizontal-black.svg',
      'logo-stacked-blue.svg',
      'logo-stacked-white.svg',
      'logo-stacked-black.svg',
      'icon-blue.svg',
      'icon-white.svg',
      'icon-black.svg',
      'icon-lime.svg',
    ];

    requiredAssets.forEach(asset => {
      const exists = fs.existsSync(path.join(assetsDir, asset));
      expect(exists).toBe(true);
    });
  });

  test('SVG files are optimized (under 2KB)', () => {
    const assetsDir = path.join(__dirname, '../../brand/assets');
    if (!fs.existsSync(assetsDir)) return;

    const svgFiles = fs.readdirSync(assetsDir)
      .filter(f => f.endsWith('.svg'));

    svgFiles.forEach(file => {
      const stats = fs.statSync(path.join(assetsDir, file));
      const sizeKB = stats.size / 1024;

      expect(sizeKB).toBeLessThan(2);
    });
  });
});

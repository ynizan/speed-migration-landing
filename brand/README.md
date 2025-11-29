# Flows123 Brand Guidelines

Quick reference for the Flows123 brand system. For full visual reference, see `flows123-brand-guide-v2.html`.

## Quick Start

### Colors

```css
/* Primary Colors */
--color-primary: #0066FF;    /* Electric Blue */
--color-accent: #BFFF00;     /* Lime Accent */
--color-black: #0A0A0A;      /* Rich Black */
--color-white: #FFFFFF;      /* White */

/* Gray Scale */
--color-gray-100: #F5F5F5;   /* Light backgrounds */
--color-gray-300: #D4D4D4;   /* Borders */
--color-gray-500: #737373;   /* Secondary text */
--color-gray-700: #404040;   /* Body text */
```

### Typography

- **Font**: Manrope (Google Fonts)
- **Weights**: 400 (body), 600 (semibold), 800 (bold/logo)
- **Logo**: Always use weight 800 with `-0.02em` letter spacing

```css
font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

## Logo Rules

### 1. Maximum 2 Colors
The logo must NEVER use more than 2 colors.

**Approved combinations:**
| Background | Logo Color | Use Case |
|------------|------------|----------|
| White | Blue | Default, light UI |
| Black | White | Dark mode |
| Blue | White | Brand-heavy sections |
| Lime | Black | Accent, highlights |
| Black | Lime | Accent on dark |
| Blue | Black | Alternative |

**FORBIDDEN:**
- Blue icon + black text + lime accent (3 colors)
- Any gradient on the logo

### 2. Tight Logo Spacing
Gap between lightning bolt and text: **exactly 6px**

### 3. Logo Sizing

| Context | Icon Size | Text Size |
|---------|-----------|-----------|
| Header/Nav | 32px | 20px |
| Hero | 48px | 32px |
| Footer | 28px | 18px |
| Favicon | 16-32px | N/A |

## Assets

### Logo Files
- `assets/logo-horizontal-*.svg` - Horizontal logo variants
- `assets/logo-stacked-*.svg` - Square/social media variants
- `assets/icon-*.svg` - Lightning bolt icon only

### Design Tokens
- `tokens/colors.css` - CSS custom properties
- `tokens/colors.json` - JSON for tooling
- `tokens/typography.css` - Font definitions

## Usage

### HTML Logo Example

```html
<a href="/" class="logo">
    <span class="logo-icon">
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M28 4L12 26H22L18 44L36 20H26L28 4Z" fill="#0066FF"/>
        </svg>
    </span>
    <span class="logo-text">flows123</span>
</a>
```

### CSS Logo Styles

```css
.logo {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: #0066FF;
}

.logo-icon {
    width: 32px;
    height: 32px;
}
```

### Font Loading

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

```css
@font-face {
    font-family: 'Manrope';
    font-display: swap;
    src: url('https://fonts.gstatic.com/s/manrope/v15/xn7gYHE41ni1AdIRggexSg.woff2') format('woff2');
}
```

## Common Mistakes

1. Using 3+ colors in logo
2. Increasing logo spacing beyond 6px
3. Wrong font weight (use 800, not 700)
4. Forgetting `font-display: swap`
5. Using Inter instead of Manrope
6. Hardcoding colors instead of CSS variables

# LightLoad - Speed Migration Landing Page

A lightning-fast static landing page built with Python + Jinja2, deployed to Cloudflare Pages.

## Performance Targets

| Metric | Target |
|--------|--------|
| PageSpeed Score | 95+ |
| LCP | < 2.0s |
| INP | < 100ms |
| CLS | 0 |
| Total Page Size | < 500KB |
| TTFB | < 200ms |

## Project Structure

```
/
├── build.py                 # Static site generator
├── requirements.txt         # Python dependencies
├── /templates               # Jinja2 templates
│   ├── base.html
│   ├── index.html
│   ├── /partials
│   └── /pages
├── /static                  # Static assets
│   ├── /css
│   ├── /js
│   └── /images
├── /dist                    # Build output (gitignored)
└── /.github/workflows       # CI/CD
```

## Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Build the site
python build.py

# Preview locally
python -m http.server -d dist 8000
```

Then open http://localhost:8000

## Deployment

Pushes to `main` automatically deploy to Cloudflare Pages via GitHub Actions.

### Required Secrets

Configure these in GitHub repository settings:

- `CLOUDFLARE_API_TOKEN` - Cloudflare API token with Pages edit permissions
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID

## Tech Stack

- **Build**: Python 3.11 + Jinja2
- **Hosting**: Cloudflare Pages (300+ edge locations)
- **CI/CD**: GitHub Actions
- **Styling**: Vanilla CSS (mobile-first, system fonts)
- **JavaScript**: Vanilla JS (< 3KB minified)

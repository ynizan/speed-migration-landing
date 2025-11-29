#!/usr/bin/env python3
"""
Static Site Generator for Speed Migration Landing Page
Generates optimized static HTML from Jinja2 templates.
"""

import os
import shutil
from datetime import datetime
from pathlib import Path
from jinja2 import Environment, FileSystemLoader

# =============================================================================
# CONFIGURATION
# =============================================================================

SITE_CONFIG = {
    # Core site info
    "site_name": "flows123",
    "site_url": "https://speed-migration.pages.dev",
    "site_description": "Migrate your slow AI-generated website to lightning-fast static hosting. 7x faster loading, better SEO, higher conversions.",

    # SEO
    "default_title": "Migrate Your Slow AI Website | 7x Faster Loading | Flows123",
    "default_og_image": "/images/og-image.png",
    "twitter_handle": "",

    # Business info (for structured data)
    "business_name": "Flows123",
    "business_type": "SoftwareApplication",

    # Build info
    "build_date": datetime.now().isoformat(),
    "year": datetime.now().year,
}

# Pages to build: (template_path, output_path, page_specific_config)
PAGES = [
    {
        "template": "index.html",
        "output": "index.html",
        "config": {
            "title": "Migrate Your Slow AI Website | 7x Faster Loading",
            "description": "Your Bolt.new site loads in 20 seconds. We make it load in 2.6. Free speed audit.",
            "canonical": "/",
            "priority": "1.0",
            "changefreq": "weekly",
        }
    },
    {
        "template": "pages/privacy.html",
        "output": "privacy/index.html",
        "config": {
            "title": "Privacy Policy | Flows123",
            "description": "Privacy policy for Flows123 website migration service.",
            "canonical": "/privacy/",
            "priority": "0.3",
            "changefreq": "monthly",
        }
    },
    {
        "template": "pages/terms.html",
        "output": "terms/index.html",
        "config": {
            "title": "Terms of Service | Flows123",
            "description": "Terms of service for Flows123 website migration service.",
            "canonical": "/terms/",
            "priority": "0.3",
            "changefreq": "monthly",
        }
    },
    {
        "template": "pages/thank-you.html",
        "output": "thank-you/index.html",
        "config": {
            "title": "Thanks! We're Analyzing Your Site | LightLoad",
            "description": "Your migration analysis is on its way.",
            "canonical": "/thank-you/",
            "priority": "0.1",
            "changefreq": "monthly",
        }
    },
]

# Speed comparison data (used in templates)
SPEED_DATA = {
    "competitors": [
        {"name": "Base44", "lcp": "20.0s", "score": 29, "status": "severe", "label": "Severe SEO penalty"},
        {"name": "Lovable", "lcp": "~15s", "score": 35, "status": "severe", "label": "Severe penalty"},
        {"name": "Bolt.new", "lcp": "~12s", "score": 40, "status": "bad", "label": "Ranking penalty"},
        {"name": "Wix", "lcp": "9.8s", "score": 67, "status": "moderate", "label": "Moderate penalty"},
    ],
    "ours": {"name": "After Migration", "lcp": "2.6s", "score": 94, "status": "good", "label": "Ranking boost"},
    "improvement_factor": "7.4x",
}

# =============================================================================
# BUILD FUNCTIONS
# =============================================================================

def clean_dist():
    """Remove and recreate dist directory."""
    dist = Path("dist")
    if dist.exists():
        shutil.rmtree(dist)
    dist.mkdir()
    print("  Cleaned dist/")

def copy_static_assets():
    """Copy static files to dist."""
    static_src = Path("static")
    static_dst = Path("dist")

    if not static_src.exists():
        print("  Warning: No static/ directory found")
        return

    for item in static_src.iterdir():
        if item.is_dir():
            shutil.copytree(item, static_dst / item.name)
        else:
            shutil.copy2(item, static_dst / item.name)

    print("  Copied static assets")

def build_pages(env):
    """Render all pages from templates."""
    for page in PAGES:
        # Merge site config with page config
        context = {
            **SITE_CONFIG,
            **page["config"],
            "speed_data": SPEED_DATA,
            "current_path": page["config"]["canonical"],
        }

        # Render template
        template = env.get_template(page["template"])
        html = template.render(**context)

        # Write output
        output_path = Path("dist") / page["output"]
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(html)

        print(f"  Built {page['output']}")

def generate_sitemap():
    """Generate sitemap.xml from PAGES config."""
    sitemap_entries = []

    for page in PAGES:
        url = SITE_CONFIG["site_url"].rstrip("/") + page["config"]["canonical"]
        entry = f"""  <url>
    <loc>{url}</loc>
    <lastmod>{SITE_CONFIG["build_date"][:10]}</lastmod>
    <changefreq>{page["config"]["changefreq"]}</changefreq>
    <priority>{page["config"]["priority"]}</priority>
  </url>"""
        sitemap_entries.append(entry)

    sitemap = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{chr(10).join(sitemap_entries)}
</urlset>"""

    Path("dist/sitemap.xml").write_text(sitemap)
    print("  Generated sitemap.xml")

def generate_robots():
    """Generate robots.txt."""
    robots = f"""User-agent: *
Allow: /

Sitemap: {SITE_CONFIG["site_url"]}/sitemap.xml"""

    Path("dist/robots.txt").write_text(robots)
    print("  Generated robots.txt")

def main():
    """Main build process."""
    print("\nBuilding static site...\n")

    # Setup Jinja2
    env = Environment(
        loader=FileSystemLoader("templates"),
        autoescape=True,
        trim_blocks=True,
        lstrip_blocks=True,
    )

    # Build steps
    clean_dist()
    copy_static_assets()
    build_pages(env)
    generate_sitemap()
    generate_robots()

    print("\nBuild complete! Output in /dist\n")
    print(f"   Pages built: {len(PAGES)}")
    print(f"   Site URL: {SITE_CONFIG['site_url']}")
    print("\n   Run 'python -m http.server -d dist 8000' to preview locally\n")

if __name__ == "__main__":
    main()

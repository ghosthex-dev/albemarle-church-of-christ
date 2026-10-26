# Albemarle Church of Christ — Modernized Web Application

> **"New Testament Christianity — Pure and Simple"**  
> Physical Location: 24790 South Business 52, Albemarle, NC 28001  
> Established: June 1949 • Dedicated Building: August 6, 1961

---

## 1. Project Overview & Legacy Migration Summary

The legacy website for the **Albemarle Church of Christ** (`https://www.thelordsway.com/albemarlecoc/`) relied on deprecated late-1990s HTML framesets (`<frameset rows="96">` and nested ASP frame containers), causing complete breakage on mobile devices, modern accessibility readers, and modern browser navigation.

This repository contains a **complete ground-up modernization and data extraction** that preserves 100% of the congregation's original content, history, doctrine, sermon catalog, leadership contacts, and service schedule while transforming it into a high-performance, WCAG 2.1 AA accessible, mobile-first web application.

---

## 2. Architecture & File Structure

```
albemarle-church/
├── index.html                     # Semantic, accessible modern web application
├── README.md                      # Documentation, replacement guide & architecture
├── assets/
│   ├── css/
│   │   └── styles.css             # Accessibility scale, high contrast, print styles
│   ├── js/
│   │   └── app.js                 # Countdown, sermon player, calendar generator, guestbook
│   ├── data/
│   │   └── church-data.json       # Complete structured JSON export of all church content
│   ├── images/                    # Clean modern SVG placeholder illustrations
│   │   ├── church-logo.svg        # Custom open Bible & cross emblem
│   │   ├── church-building.svg    # Exterior building illustration (1200x800)
│   │   ├── sanctuary-interior.svg # Sanctuary & communion table illustration (1200x800)
│   │   ├── leader-curtis-parker.svg # Minister avatar placeholder (400x400)
│   │   ├── leader-tim-pinkston.svg  # Elder avatar placeholder (400x400)
│   │   └── leader-chris-harward.svg # Elder avatar placeholder (400x400)
│   └── legacy/                    # Preserved authentic photos from the original server
│       ├── IMG_1334.JPG           # Original church building photo
│       ├── Parkers.jpg            # Original minister thumbnail
│       └── house_under_construction_199958.jpg # Original 1961 building construction photo
```

### Architecture Highlights:
- **Zero Heavy Dependencies / Pure Static Ready:** Built with clean semantic HTML5, modern Tailwind CSS (via official CDN), and vanilla ES6+ JavaScript. No Node.js build step or complex compiler required. It can be opened directly in any browser (`file:///`) or hosted on any modern static host.
- **Data Portability:** All congregation details are exported into `assets/data/church-data.json` for future expansion into React, Vue, Next.js, or church CMS platforms.

---

## 3. Preserved Congregational Data Audit

| Section | Preserved Content |
| :--- | :--- |
| **Identity** | Albemarle Church of Christ (Church of Christ at Albemarle), Slogan: *"New Testament Christianity — Pure and Simple"* |
| **Meeting Times** | **Sunday Bible Class:** 10:00 AM<br>**Sunday Morning Worship:** 11:00 AM<br>**Sunday Evening Worship:** 6:00 PM<br>**Wednesday Bible Study:** 6:30 PM |
| **Contact Info** | **Physical:** 24790 South Business 52, Albemarle, NC 28001 (Highway 52 South at Ross Drive)<br>**Mailing:** PO Box 245, Albemarle, NC 28001<br>**Phone / Fax:** (704) 982-9814 |
| **Leadership** | **Curtis Parker:** Shepherd / Preacher / Elder — Phone: (704) 795-8716<br>**Tim Pinkston:** Shepherd / Elder — Phone: (980) 621-9505<br>**Chris Harward:** Shepherd / Elder — Phone: (704) 322-0701 |
| **Core Beliefs** | Full original text preserved word-for-word:<br>• **John 4:24** & **Colossians 3:17**<br>• God's Eternal Love & Clear Terms (Adam & Eve through Christ)<br>• Satisfied with being "Christians Only" (the descriptive New Testament names)<br>• Simple, God-centered worship governed by apostolic authority |
| **Congregational History** | Complete chronological history preserved:<br>• **June 1949:** Albemarle Hotel dining room (J.D. Burton, Odell Hood)<br>• **1953:** Kannapolis worship connection<br>• **1954:** Room over Riff's store downtown (D.L. Taylor)<br>• **1956:** Roger Hindrix, first full-time minister (Salisbury Hwy across from P&D)<br>• **1958–1960:** Frank R. Milton, membership grows to 23<br>• **August 6, 1961:** First meeting in the new $35,000 building on Hwy 52 South |
| **Sermon Catalog** | Complete 10-sermon catalog (Curtis Parker, Tim Pinkston, Grady Stanford) with interactive in-browser audio player, time scrubbing, search, and category filter |
| **Live Stream Ministry** | Embedded YouTube live stream player (`https://www.youtube-nocookie.com/embed/live_stream?channel=UCGJ4ACTkITS7JLZr11_A0CQ`), channel link (`@AlbemarlechurchofChrist`), and interactive feed switcher between live broadcast and recent Sunday worship / Bible study streams |
| **Events** | Gospel Meeting (*"Christ and Him Crucified"*, 1 Cor. 2:1-2), Ladies Luncheon & Bible Study (*"Love More Sin Less"*), Vacation Bible School (VBS), Fall Fellowship |
| **Guestbook** | Preserved visitor messages (Mandy, Donna Roberson) with interactive new entry capability |

---

## 4. Senior & Elderly Accessibility Features (WCAG 2.1 AA)

1. **4-Stage Font Scaler:** Header controls for `[A-]` (small), `[A]` (normal), `[A+]` (large), and `[A++]` (extra large) that scale the entire UI proportionally. User preferences persist across sessions in `localStorage`.
2. **High-Contrast Mode:** High-contrast toggle applying pure `#000000` text, high-visibility borders, and distinct button highlights.
3. **Senior-Friendly Touch Targets:** Minimum 44×44px button and link touch targets with high-contrast outlines for mobile screens and trembling fingers.
4. **Offline Bulletin Printing:** Includes dedicated `@media print` styling so elderly members who do not browse online can print a clean 1-page paper bulletin with the service times, address, map, and elder phone numbers (`window.print()`).
5. **Real-Time Next Service Countdown:** Dynamically calculates the next upcoming service (e.g. *"Sunday Morning Worship in 2 days, 4 hours"*) and renders an alert badge.
6. **One-Click iCalendar (.ics) Downloads:** Lets users add any service or event directly to their iPhone, Google, or Outlook calendar with standard recurring RFC-5545 `.ics` export.

---

## 5. Photography Replacement Guide

The site is currently styled with custom SVG architectural illustrations. When high-resolution photography is ready, simply replace the files in `assets/images/`:

| Placeholder File | Recommended Real Asset | Recommended Resolution |
| :--- | :--- | :--- |
| `assets/images/church-building.svg` | High-res exterior photograph of the church building, sign, and steeple | **1200 × 800 px** (JPG/WebP) |
| `assets/images/sanctuary-interior.svg` | Photo of the auditorium, pulpit, and communion table | **1200 × 800 px** (JPG/WebP) |
| `assets/images/leader-curtis-parker.svg` | Portrait photo of Minister Curtis Parker | **400 × 400 px** (JPG/WebP) |
| `assets/images/leader-tim-pinkston.svg` | Portrait photo of Elder Tim Pinkston | **400 × 400 px** (JPG/WebP) |
| `assets/images/leader-chris-harward.svg` | Portrait photo of Elder Chris Harward | **400 × 400 px** (JPG/WebP) |

*Note: The original archival photos downloaded from the legacy server are preserved in `assets/legacy/` for historical reference.*

---

## 6. How to Run & Deploy

### Quick Local Preview
Double-click `index.html` in your file explorer, or launch a quick local web server using Python:

```bash
cd "C:\Users\tnapi\.gemini\antigravity\scratch\albemarle-church"
python -m http.server 8000
```
Then visit `http://localhost:8000` in any web browser.

### Free Static Hosting Options
Because this codebase is 100% static, you can deploy it for free in seconds:
- **GitHub Pages:** Push to a GitHub repository and turn on Pages in repository settings.
- **Cloudflare Pages / Netlify / Vercel:** Drag and drop the `albemarle-church` folder onto the Netlify or Cloudflare Pages dashboard for instant worldwide HTTPS deployment.

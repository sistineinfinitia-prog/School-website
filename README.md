# IB Computer Science | Emirates International School (EIS)

Official department portal for **IB Diploma Programme Computer Science (SL & HL)** at **Emirates International School**.

## Architecture & Pages

- **Unified Design System** (`assets/css/site.css` & `assets/js/site.js`):
  - **Zen Atelier** typographic hierarchy (`Newsreader` display serif, `Inter` body copy, `JetBrains Mono` technical metadata) with `1px` architectural hairlines and `2px` radii.
  - **Soft Slate & Lilac** default theme (`data-theme="lilac"`), plus 4 additional persistent palettes (`monochrome`, `crimson`, `matcha`, `clay`) and an undulating **Ribbon Waves** `<canvas>` background engine (`data-texture="animated" | "static"`).
- **Integrated Pages & Architecture**:
  - [`index.html`](index.html): Landing page with IA Criterion B checkpoint callout, expandable syllabus modules, featured interactive exam question, live department notices, and content status checklist.
  - [`pages/deadlines.html`](pages/deadlines.html): Official assessment calendar & deadlines hub with countdown badges, cohort filtering, syllabus topic checklists, and client-side RFC 5545 iCalendar (.ics) export.
  - [`pages/curriculum.html`](pages/curriculum.html): Unified **Curriculum & Courses** hub consolidating course modules (Theme A, Theme B, HL ADS, HL OOP, IA, Case Study), Year 1 & Year 2 pacing roadmaps, official benchmarks (`Scheme of Work 2027.xlsx`, `Syllabus Tracker.xlsx`, `Scope and Sequence.docx`), and SL/HL assessment weightings.
  - [`pages/practice.html`](pages/practice.html): Interactive 12-question SL/HL Exam Question Bank with keyword search, topic filtering (`?topic=architecture`, `systems`, `networks`, `databases`, `algorithms`, `oop`, `ai`), and click-to-reveal official mark schemes.
  - [`pages/resources.html`](pages/resources.html): Searchable Department Resource Hub and Teacher Drops featuring curated Coursework &amp; Lab Spotlights (Interactive Networks Lab, Python 2026 Guide, Theory Questions &amp; Mark Scheme, Mini Project) and indexing all **151 student classroom files** (`PDF`, `PPTX`, `DOCX`, `XLSX`, `HTML`).
  - [`pages/ia.html`](pages/ia.html): 30-mark Internal Assessment guide with Criteria A–E rubric, 7-video tutorial playlist, official IA guide PDF preview, and assessed student coursework exemplar.
  - [`pages/case-study.html`](pages/case-study.html): Paper 1 Section B Case Study (*The Perfect Chatbot*) with RAKT Insurance architecture notes, AI practice question links, and embedded official booklet reader.
  - [`pages/about-us.html`](pages/about-us.html): Emirates International School Computer Science faculty and ambassador directory (**Neha Siddiqui**, **Anish Dongarkar**, **Rudolph Babaran**).
  - [`pages/admin.html`](pages/admin.html): Faculty administration portal for publishing live Firebase notices and accessing all 20 staff Weekly Unit Planning files.

## Rebuilding the Resource Manifest

When adding or renaming files inside `resources/`, regenerate `data/resources.json`:

```bash
node scripts/build-resources.mjs
```

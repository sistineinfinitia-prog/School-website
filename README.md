# IB Computer Science | Emirates International School (EIS)

Official department portal for **IB Diploma Programme Computer Science (SL & HL)** at **Emirates International School**.

## Architecture & Pages

- **Unified Design System** (`assets/css/site.css` & `assets/js/site.js`):
  - **Zen Atelier** typographic hierarchy (`Newsreader` display serif, `Inter` body copy, `JetBrains Mono` technical metadata) with `1px` architectural hairlines and `2px` radii.
  - **Soft Slate & Lilac** default theme (`data-theme="lilac"`), plus 4 additional persistent palettes (`monochrome`, `crimson`, `matcha`, `clay`) and an undulating **Ribbon Waves** `<canvas>` background engine (`data-texture="animated" | "static"`).
- **11 Integrated Pages**:
  - [`index.html`](index.html): Landing page with IA Criterion B checkpoint callout, expandable syllabus modules, featured interactive exam question, live department notices, and content status checklist.
  - [`pages/courses.html`](pages/courses.html): Course modules overview across Theme A, Theme B, HL Abstract Data Structures, HL Advanced OOP, IA, and Paper 3 Case Study.
  - [`pages/practice.html`](pages/practice.html): Interactive 12-question SL/HL Exam Question Bank with keyword search, topic filtering (`?topic=architecture`, `systems`, `networks`, `databases`, `algorithms`, `oop`, `ai`), and click-to-reveal official mark schemes.
  - [`pages/curriculum.html`](pages/curriculum.html): Year 1 & Year 2 pacing roadmap, official benchmarks (`Scheme of Work 2027.xlsx`, `Syllabus Tracker.xlsx`, `Scope and Sequence.docx`), and SL/HL assessment weightings.
  - [`pages/theme-a.html`](pages/theme-a.html): Theme A hub (*System Fundamentals, Networks, Databases & Machine Learning*) with searchable access to all **70 Theme A files** and the interactive 85-minute networking lab.
  - [`pages/theme-b.html`](pages/theme-b.html): Theme B hub (*Computational Thinking, Python & OOP*) with searchable access to all **48 Theme B files**, Python manuals, and OOP slide decks.
  - [`pages/ia.html`](pages/ia.html): 30-mark Internal Assessment guide with Criteria A–E rubric, 7-video tutorial playlist, official IA guide PDF preview, and assessed student coursework exemplar.
  - [`pages/case-study.html`](pages/case-study.html): Paper 3 HL Case Study (*The Perfect Chatbot*) with RAKT Insurance architecture notes, AI practice question links, and embedded official booklet reader.
  - [`pages/resources.html`](pages/resources.html): Searchable, filterable Department Resource Vault indexing all **131 student classroom files** (`PDF`, `PPTX`, `DOCX`, `XLSX`, `HTML`).
  - [`pages/about-us.html`](pages/about-us.html): Emirates International School Computer Science faculty and ambassador directory (**Neha Siddiqui**, **Anish Dongarkar**, **Rudolph Babaren**).
  - [`pages/admin.html`](pages/admin.html): Faculty administration portal for publishing live Firebase notices and accessing all 20 staff Weekly Unit Planning files.

## Rebuilding the Resource Manifest

When adding or renaming files inside `resources/`, regenerate `data/resources.json`:

```bash
node scripts/build-resources.mjs
```

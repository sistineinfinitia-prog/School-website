import json
import os

# Load syllabus data
with open(r'C:\Users\Rudolph\Documents\website\github repo\data\syllabus.json', 'r', encoding='utf-8') as f:
    units = json.load(f)

# Generate collapsible syllabus markup: Units AND Subtopics are details elements!
html_parts = []
for u in units:
    u_code = u['code']
    u_name = u['name']
    u_theme = u['theme']
    u_paper = u['paper']
    u_cohort = u['cohort']
    u_hours_sl = u['hoursSL']
    u_hours_hl = u['hoursHL']
    u_desc = u['description']
    u_id = u['id']
    u_hub = u['hub']
    
    theme_slug = 'theme-a' if 'Theme A' in u_theme else 'theme-b'
    cohort_slug = 'dp1' if 'DP1' in u_cohort else 'dp2'
    level_slug = 'hl' if u['isHLOnly'] else 'sl hl'
    
    hours_label = f"SL: {u_hours_sl}h &bull; HL: {u_hours_hl}h" if u_hours_sl > 0 else f"HL Only: {u_hours_hl}h"
    
    html_parts.append(f'''
<details class="unit" id="{u_id}" data-unit="{u_id}" data-theme="{theme_slug}" data-cohort="{cohort_slug}" data-level="{level_slug}" open>
    <summary>
        <span class="unit-code">{u_code}</span>
        <div class="unit-info">
            <span class="unit-name">{u_name}</span>
            <span class="unit-theme">{u_theme} &bull; <strong style="color:var(--accent);">{u_cohort}</strong></span>
        </div>
        <div class="unit-meta">
            <span class="pill pill-accent">{u_paper}</span>
            <span class="pill">{hours_label}</span>
            <span class="pill">{u['totalStatements']} Statements</span>
            <span class="chev" aria-hidden="true"></span>
        </div>
    </summary>
    <div class="unit-body">
        <div class="unit-desc-row">
            <p class="unit-desc">{u_desc}</p>
            <div class="unit-quicklinks">
                <a class="btn btn-sm" href="{u_hub}">Subject Notes &amp; Slides &rarr;</a>
                <a class="btn btn-sm" href="practice.html?topic={u_id}">Practice Questions &rarr;</a>
            </div>
        </div>
''')

    for st in u['subtopics']:
        st_code = st['code']
        st_title = st['title']
        st_is_hl = st['isHLOnly']
        st_level_class = "subtopic-hl" if st_is_hl else "subtopic-sl"
        st_badge = '<span class="pill pill-hl">HL Extension</span>' if st_is_hl else '<span class="pill">Core Subtopic</span>'
        
        # Each subtopic is an interactive collapsible <details> accordion!
        html_parts.append(f'''
        <details class="subtopic-block {st_level_class}" data-subtopic="{st_code}" open>
            <summary class="subtopic-bar" title="Click to collapse or expand {st_code} statements">
                <div class="subtopic-title-wrap">
                    <span class="subtopic-code-badge">{st_code}</span>
                    <h3 class="subtopic-title">{st_title}</h3>
                </div>
                <div class="subtopic-tags">
                    {st_badge}
                    <span class="subtopic-count-pill">{len(st['statements'])} Objectives</span>
                    <span class="subtopic-chev" aria-hidden="true"></span>
                </div>
            </summary>
            <ul class="statements-list">
''')
        
        for item in st['statements']:
            item_code = item['code']
            item_stmt = item['statement']
            item_lvl = item['level']
            is_hl_item = (item_lvl == 'HL')
            
            item_level_class = "stmt-hl" if is_hl_item else "stmt-sl"
            level_pill = '<span class="pill pill-hl">HL Only</span>' if is_hl_item else '<span class="pill pill-sl">SL &amp; HL</span>'
            
            html_parts.append(f'''
                <li class="statement-item {item_level_class}" data-level="{item_lvl.lower()}" data-cohort="{cohort_slug}" data-theme="{theme_slug}" data-code="{item_code.lower()}">
                    <div class="statement-col-code">
                        <span class="statement-code">{item_code}</span>
                    </div>
                    <div class="statement-col-text">
                        <p class="statement-text">{item_stmt}</p>
                    </div>
                    <div class="statement-col-meta">
                        {level_pill}
                        <span class="pill pill-cohort">{u_cohort.split()[0]}</span>
                    </div>
                </li>
''')

        html_parts.append('''
            </ul>
        </details>
''')

    html_parts.append('''
    </div>
</details>
''')

syllabus_markup = '\n'.join(html_parts)

page_html = '''<!DOCTYPE html>
<html lang="en" data-theme="lilac" data-texture="animated" data-base="../">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{PAGE_TITLE} | IB Computer Science &mdash; Emirates International School</title>
    <meta name="description" content="Official IB DP Computer Science complete syllabus covering all 8 topics, 21 subtopics, and 114 learning statements for Standard Level (SL) and Higher Level (HL).">
    <script>
        (function () {
            try {
                var t = localStorage.getItem('eis_cs_theme');
                var x = localStorage.getItem('eis_cs_texture');
                var um = localStorage.getItem('eis_cs_user_mode') || 'system';
                var f = localStorage.getItem('eis_cs_focus');
                var d = localStorage.getItem('eis_cs_density');
                if (t) document.documentElement.setAttribute('data-theme', t);
                if (x) document.documentElement.setAttribute('data-texture', x);
                if (f) document.documentElement.setAttribute('data-focus', f);
                if (d) document.documentElement.setAttribute('data-density', d);
                document.documentElement.setAttribute('data-user-mode', um);
                var m = localStorage.getItem('eis_cs_mode');
                if (um === 'system' || (m !== 'light' && m !== 'dark')) {
                    m = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
                }
                document.documentElement.setAttribute('data-mode', m);
            } catch (e) {
                document.documentElement.setAttribute('data-mode', window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
            }
        })();
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../assets/css/site.css">
    <link rel="stylesheet" href="../assets/css/curriculum.css">
</head>
<body>
    <a class="skip-link" href="#main">Skip to main content</a>
    <canvas class="ribbons" id="interactive-canvas" aria-hidden="true"></canvas>

        <header class="site-header">
        <div class="wrap">
            <a href="../index.html" class="brand">
                <span class="brand-name">
                    <span class="brand-full">COMPUTER SCIENCE</span>
                    <span class="brand-short">CS</span>
                </span>
                <span class="brand-sep" aria-hidden="true">|</span>
                <span class="brand-sub">
                    <span class="brand-full">EMIRATES INTERNATIONAL SCHOOL MEADOWS</span>
                    <span class="brand-short">EIS MEADOWS</span>
                </span>
            </a>

            <div class="header-right">
                <nav class="site-nav" id="site-nav" aria-label="Primary">
                    <ul class="nav-list">
                        <li><a href="../index.html">Home</a></li>
                        <li><a href="curriculum.html" aria-current="page">Syllabus</a></li>
                        <li><a href="practice.html">Practice</a></li>
                        <li><a href="deadlines.html">Deadlines</a></li>
                        <li><a href="resources.html">Resources</a></li>
                    </ul>
                </nav>

                <div class="header-tools" id="header-tools"></div>
            </div>
        </div>
    </header>

    <main id="main" class="wrap">
        <section class="hero">
            <h1 class="display">
                {HERO_TITLE}
            </h1>
            <p class="lead">
                IBDP Computer Science Syllabus Covering ALL 8 topics with 21 subtopics and 114 official learning statements for both Standard Level (SL) and Higher Level (HL)
            </p>

            <!-- Segmented Control Bar (Image 4 UI - Clean without Key Downloads) -->
            <div class="segmented-nav-wrap">
                <div class="segmented-control" role="tablist" aria-label="Curriculum Navigation Tabs">
                    <button type="button" class="segmented-btn active" role="tab" aria-selected="true" data-tab="sec-syllabus">
                        <span class="seg-num">01</span>
                        <span class="seg-label">Syllabus &amp; Topics</span>
                        <span class="seg-badge">114</span>
                    </button>
                    <button type="button" class="segmented-btn" role="tab" aria-selected="false" data-tab="sec-assessment">
                        <span class="seg-num">02</span>
                        <span class="seg-label">Assessment &amp; Weightings</span>
                    </button>
                    <button type="button" class="segmented-btn" role="tab" aria-selected="false" data-tab="sec-roadmap">
                        <span class="seg-num">03</span>
                        <span class="seg-label">DP1 &amp; DP2 Roadmap</span>
                    </button>
                    <button type="button" class="segmented-btn" role="tab" aria-selected="false" data-tab="sec-docs">
                        <span class="seg-num">04</span>
                        <span class="seg-label">Benchmarks &amp; Files</span>
                    </button>
                    <button type="button" class="segmented-btn" role="tab" aria-selected="false" data-tab="all">
                        <span class="seg-label">View All</span>
                    </button>
                </div>
            </div>
        </section>

        <!-- Section 01: Main Syllabus & All Topics (Collapsible Subtopics like A1.1) -->
        <section class="section curriculum-section-tab" id="sec-syllabus" aria-labelledby="sec-syllabus-head">
            <div class="section-label">
                <span>01</span>Syllabus
            </div>
            <div class="section-body">
                <div class="section-head">
                    <div>
                        <h2 class="h1" id="sec-syllabus-head">Main Syllabus &amp; Learning Objectives</h2>
                        <p class="sub">
                            The complete IB Diploma syllabus required across both years. Click any topic or subtopic (e.g. A1.1) to collapse or expand its statements. Filter dynamically by course level (SL vs HL) or DP cohort (DP1 vs DP2).
                        </p>
                    </div>
                </div>

                <!-- Interactive Syllabus Control Panel -->
                <div class="syllabus-toolbar" role="region" aria-label="Syllabus Filter and Search Controls">
                    <!-- Level Filter (SL / HL) -->
                    <div class="filter-row">
                        <span class="filter-label">LEVEL</span>
                        <div class="filter-group" id="filter-level-group">
                            <button type="button" class="filter-btn active" data-filter-level="all" aria-pressed="true">All Levels (114)</button>
                            <button type="button" class="filter-btn" data-filter-level="sl" aria-pressed="false">Standard Level (70)</button>
                            <button type="button" class="filter-btn" data-filter-level="hl" aria-pressed="false">Higher Level (44)</button>
                        </div>
                    </div>

                    <!-- Cohort Filter (DP1 / DP2) -->
                    <div class="filter-row">
                        <span class="filter-label">COHORT</span>
                        <div class="filter-group" id="filter-cohort-group">
                            <button type="button" class="filter-btn active" data-filter-cohort="all" aria-pressed="true">Both Years (DP1 &amp; DP2)</button>
                            <button type="button" class="filter-btn" data-filter-cohort="dp1" aria-pressed="false">DP1</button>
                            <button type="button" class="filter-btn" data-filter-cohort="dp2" aria-pressed="false">DP2</button>
                        </div>
                    </div>

                    <!-- Theme Filter (Theme A / Theme B) -->
                    <div class="filter-row">
                        <span class="filter-label">THEME</span>
                        <div class="filter-group" id="filter-theme-group">
                            <button type="button" class="filter-btn active" data-filter-theme="all" aria-pressed="true">All Themes</button>
                            <button type="button" class="filter-btn" data-filter-theme="theme-a" aria-pressed="false">Theme A: Concepts (Paper 1)</button>
                            <button type="button" class="filter-btn" data-filter-theme="theme-b" aria-pressed="false">Theme B: Computational (Paper 2)</button>
                        </div>
                    </div>

                    <!-- Search Input & Quick Controls -->
                    <div class="search-row">
                        <span class="filter-label">SEARCH</span>
                        <input type="text" id="syllabus-search" class="syllabus-search-input" placeholder="Search statements..." aria-label="Search syllabus statements">
                    </div>

                    <!-- Live Stats Bar & Actions -->
                    <div class="syllabus-stats-bar">
                        <div class="stats-counter">
                            Showing <strong id="visible-statement-count">114</strong> of 114 statements (<strong id="visible-unit-count">8</strong> topics)
                        </div>
                        <div class="stats-actions">
                            <button type="button" class="btn btn-sm" id="btn-expand-all" data-action="collapse" aria-label="Collapse all topics">Collapse All Topics</button>
                            <button type="button" class="btn btn-sm" id="btn-collapse-all" data-action="collapse" aria-label="Collapse all subtopics">Collapse All Subtopics</button>
                        </div>
                    </div>
                </div>

                <!-- Main Syllabus Accordion Topics Container -->
                <div class="syllabus-units-container" id="syllabus-container">
                    {SYLLABUS_MARKUP}
                </div>
            </div>
        </section>

        <!-- Section 02: Assessment Architecture & Paper Weightings -->
        <section class="section curriculum-section-tab tab-hidden" id="sec-assessment" aria-labelledby="sec-assessment-head">
            <div class="section-label">
                <span>02</span>Assessment
            </div>
            <div class="section-body">
                <div class="section-head">
                    <div>
                        <h2 class="h1" id="sec-assessment-head">SL &amp; HL Assessment Architecture &amp; Paper Weightings</h2>
                        <p class="sub">
                            Official assessment components from the IB Computer Science Subject Guide (First Assessment 2027), including durations, marks, weightings, and the Paper 3 Case Study specification.
                        </p>
                    </div>
                </div>

                <!-- Elevated Black Transparent Panel (With generous non-touching columns) -->
                <div class="assessment-panel">
                    <div class="assessment-panel-header">
                        <div class="assessment-panel-title-wrap">
                            <span class="pill pill-accent">Official Architecture</span>
                            <h3 class="assessment-panel-heading">Examination Components &amp; Pacing Breakdown</h3>
                        </div>
                        <div class="assessment-panel-meta">
                            <span>First Assessment 2027 &bull; SL 150 Hours &bull; HL 240 Hours</span>
                        </div>
                    </div>

                    <div class="assessment-table-responsive">
                        <table class="assessment-table" aria-label="Official Assessment Components and Weightings">
                            <thead>
                                <tr>
                                    <th scope="col" class="th-component">Component</th>
                                    <th scope="col" class="th-scope">Format, Duration &amp; Syllabus Scope</th>
                                    <th scope="col" class="th-weight">SL Weight</th>
                                    <th scope="col" class="th-weight">HL Weight</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Paper 1 -->
                                <tr>
                                    <td class="td-component">
                                        <div class="comp-title">Paper 1</div>
                                        <span class="pill pill-accent comp-pill">Theme A + Case Study</span>
                                        <span class="comp-type">External Examination</span>
                                    </td>
                                    <td class="td-scope">
                                        <div class="scope-title">Concepts of Computer Science</div>
                                        <div class="scope-lead">
                                            Assesses Theme A: A1 Computer Fundamentals, A2 Networks, A3 Databases, and A4 Machine Learning.
                                        </div>
                                        <div class="breakdown-cards">
                                            <div class="breakdown-card">
                                                <span class="breakdown-tag">Section A</span>
                                                <span class="breakdown-text">Compulsory extended-response questions on Theme A topics (38 marks SL / HL equivalent).</span>
                                            </div>
                                            <div class="breakdown-card">
                                                <span class="breakdown-tag">Section B</span>
                                                <span class="breakdown-text">Short- and extended-response questions linked to the pre-seen Case Study stimulus (12 marks SL / extended for HL).</span>
                                            </div>
                                        </div>
                                        <div class="scope-timing">
                                            <span>SL: 1 hour 15 min (50 marks)</span>
                                            <span class="timing-sep">&bull;</span>
                                            <span>HL: 2 hours 00 min (80 marks)</span>
                                        </div>
                                    </td>
                                    <td class="td-weight">
                                        <div class="weight-metric">
                                            <span class="weight-pct">35%</span>
                                            <div class="weight-bar-wrap">
                                                <div class="weight-bar-fill" style="width: 35%;"></div>
                                            </div>
                                            <span class="weight-marks">50 Marks</span>
                                            <span class="weight-time">1h 15m</span>
                                        </div>
                                    </td>
                                    <td class="td-weight">
                                        <div class="weight-metric">
                                            <span class="weight-pct">40%</span>
                                            <div class="weight-bar-wrap">
                                                <div class="weight-bar-fill" style="width: 40%;"></div>
                                            </div>
                                            <span class="weight-marks">80 Marks</span>
                                            <span class="weight-time">2h 00m</span>
                                        </div>
                                    </td>
                                </tr>

                                <!-- Paper 2 -->
                                <tr>
                                    <td class="td-component">
                                        <div class="comp-title">Paper 2</div>
                                        <span class="pill comp-pill">Theme B (Python)</span>
                                        <span class="comp-type">External Examination</span>
                                    </td>
                                    <td class="td-scope">
                                        <div class="scope-title">Computational Thinking &amp; Problem-Solving</div>
                                        <div class="scope-lead">
                                            Assesses Theme B: B1 Computational Thinking, B2 Programming Fundamentals, B3 Object-Oriented Programming (OOP), and B4 Abstract Data Types (ADTs, HL only) in Python.
                                        </div>
                                        <div class="breakdown-cards">
                                            <div class="breakdown-card">
                                                <span class="breakdown-tag tag-logic">Algorithmic</span>
                                                <span class="breakdown-text">Dedicated non-coding algorithmic thinking question testing logic, decomposition, and problem abstraction.</span>
                                            </div>
                                            <div class="breakdown-card">
                                                <span class="breakdown-tag tag-code">Practical</span>
                                                <span class="breakdown-text">Hands-on coding questions testing Big O efficiency, search/sort algorithms, OOP hierarchies, and recursive algorithms (HL).</span>
                                            </div>
                                        </div>
                                        <div class="scope-timing">
                                            <span>SL: 1 hour 15 min (50 marks)</span>
                                            <span class="timing-sep">&bull;</span>
                                            <span>HL: 2 hours 00 min (80 marks)</span>
                                        </div>
                                    </td>
                                    <td class="td-weight">
                                        <div class="weight-metric">
                                            <span class="weight-pct">35%</span>
                                            <div class="weight-bar-wrap">
                                                <div class="weight-bar-fill" style="width: 35%;"></div>
                                            </div>
                                            <span class="weight-marks">50 Marks</span>
                                            <span class="weight-time">1h 15m</span>
                                        </div>
                                    </td>
                                    <td class="td-weight">
                                        <div class="weight-metric">
                                            <span class="weight-pct">40%</span>
                                            <div class="weight-bar-wrap">
                                                <div class="weight-bar-fill" style="width: 40%;"></div>
                                            </div>
                                            <span class="weight-marks">80 Marks</span>
                                            <span class="weight-time">2h 00m</span>
                                        </div>
                                    </td>
                                </tr>

                                <!-- Internal Assessment -->
                                <tr>
                                    <td class="td-component">
                                        <div class="comp-title">IA</div>
                                        <span class="pill comp-pill">Coursework</span>
                                        <span class="comp-type">Internal Assessment</span>
                                    </td>
                                    <td class="td-scope">
                                        <div class="scope-title">The Computational Solution (30 Marks)</div>
                                        <div class="scope-lead">
                                            Authentic computational software product developed to solve a real-world client need. Internally assessed by faculty and externally moderated by the IB.
                                        </div>
                                        <div class="ia-criteria-list">
                                            <div class="ia-crit-row">
                                                <span class="crit-badge">Criterion A</span>
                                                <span class="crit-name">Planning &amp; Client Consultation</span>
                                                <span class="crit-marks">6 marks</span>
                                            </div>
                                            <div class="ia-crit-row">
                                                <span class="crit-badge">Criterion B</span>
                                                <span class="crit-name">System Overview &amp; Record of Tasks</span>
                                                <span class="crit-marks">6 marks</span>
                                            </div>
                                            <div class="ia-crit-row">
                                                <span class="crit-badge">Criterion C</span>
                                                <span class="crit-name">Development &amp; Computational Algorithmic Thinking</span>
                                                <span class="crit-marks">8 marks</span>
                                            </div>
                                            <div class="ia-crit-row">
                                                <span class="crit-badge">Criterion D</span>
                                                <span class="crit-name">Functionality &amp; Screencast Video Demonstration</span>
                                                <span class="crit-marks">4 marks</span>
                                            </div>
                                            <div class="ia-crit-row">
                                                <span class="crit-badge">Criterion E</span>
                                                <span class="crit-name">Evaluation, Client Feedback &amp; Future Recommendations</span>
                                                <span class="crit-marks">6 marks</span>
                                            </div>
                                        </div>
                                        <div class="scope-timing">
                                            <span>Compulsory for all candidates &bull; 35 recommended teaching hours</span>
                                        </div>
                                    </td>
                                    <td class="td-weight">
                                        <div class="weight-metric">
                                            <span class="weight-pct weight-ia">30%</span>
                                            <div class="weight-bar-wrap">
                                                <div class="weight-bar-fill bar-ia" style="width: 30%;"></div>
                                            </div>
                                            <span class="weight-marks">30 Marks</span>
                                            <span class="weight-time">35 Hours</span>
                                        </div>
                                    </td>
                                    <td class="td-weight">
                                        <div class="weight-metric">
                                            <span class="weight-pct weight-ia">20%</span>
                                            <div class="weight-bar-wrap">
                                                <div class="weight-bar-fill bar-ia" style="width: 20%;"></div>
                                            </div>
                                            <span class="weight-marks">30 Marks</span>
                                            <span class="weight-time">35 Hours</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td class="td-component">
                                        <div class="comp-title" style="font-size:0.95rem;">TOTAL</div>
                                    </td>
                                    <td class="td-scope">
                                        <div style="font-weight:600; color:var(--text); font-size:0.9rem;">
                                            Total Recommended Teaching Time: SL 150 Hours &bull; HL 240 Hours
                                        </div>
                                    </td>
                                    <td class="td-weight">
                                        <div class="weight-metric">
                                            <span class="weight-pct" style="font-size:1.15rem;">100%</span>
                                            <span class="weight-marks">130 Marks Total</span>
                                        </div>
                                    </td>
                                    <td class="td-weight">
                                        <div class="weight-metric">
                                            <span class="weight-pct" style="font-size:1.15rem;">100%</span>
                                            <span class="weight-marks">190 Marks Total</span>
                                        </div>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                <!-- Redesigned Paper 3 Callout Card (Requirement 4: Non-codey, Warm Editorial Design, Renamed Button) -->
                <aside class="paper-3-callout" role="note" aria-label="Paper 3 Case Study Distinction">
                    <div class="paper-3-info">
                        <div class="paper-3-header-row">
                            <span class="paper-3-pill">Higher Level (HL) Specification</span>
                            <span style="font-size:0.8rem; color:var(--text-3);">&bull; Exam Component</span>
                        </div>
                        <h3 class="paper-3-title">Paper 3: Pre-Seen Case Study Examination</h3>
                        <p class="paper-3-desc">
                            In-depth investigation of current developments, emerging technologies, and ethical dilemmas based on the annually published IB stimulus scenario (<em>The Perfect Chatbot: RAKT Insurance Scenario</em>).
                        </p>
                        <div class="paper-3-note-banner">
                            <span><strong>Important:</strong> This component is strictly for Paper 3 &mdash; Higher Level (HL) candidates only.</span>
                        </div>
                    </div>
                    <div class="paper-3-action">
                        <a class="btn btn-primary" href="case-study.html">
                            <span>Open Paper 3 Case Study</span>
                            <span class="arrow" aria-hidden="true">&rarr;</span>
                        </a>
                    </div>
                </aside>
            </div>
        </section>

        <!-- Section 03: Visual Two-Year Progression Roadmap (Requirement 2: Enhanced Visual Timeline) -->
        <section class="section curriculum-section-tab tab-hidden" id="sec-roadmap" aria-labelledby="sec-roadmap-head">
            <div class="section-label">
                <span>03</span>Progression
            </div>
            <div class="section-body">
                <div class="section-head">
                    <div>
                        <h2 class="h1" id="sec-roadmap-head">Two-Year Scope &amp; Sequence: DP1 &amp; DP2 Roadmap</h2>
                        <p class="sub">
                            Chronological sequencing across the two-year Diploma Programme at Emirates International School, synchronizing lesson plans, weekly pacing, and milestone deliverables.
                        </p>
                    </div>
                </div>

                <div class="progression-overview-bar">
                    <div><span>Academic Pacing:</span> <strong>Two Complete Years</strong> &bull; <strong>4 Terms Per Year</strong> &bull; <strong>180 Planned Lessons</strong></div>
                    <div><span>Assessment Architecture:</span> <strong>5 IA Criteria Checkpoints</strong> &bull; <strong>3 Written Papers</strong></div>
                </div>

                <!-- Dual-Track Visual Timeline Grid -->
                <div class="timeline-grid">
                    <!-- Year 1: DP1 Column -->
                    <div class="timeline-cohort-col">
                        <div class="timeline-cohort-header">
                            <div>
                                <span class="cohort-badge-main">DP1 &bull; Class of 2027</span>
                                <h3 class="cohort-title-main">Year 1: Foundations &amp; Core Programming</h3>
                            </div>
                            <span class="pill pill-sl">Year 12</span>
                        </div>

                        <div class="timeline-track">
                            <!-- Term 1 -->
                            <div class="timeline-card">
                                <div class="timeline-node"><div class="timeline-node-inner"></div></div>
                                <div class="timeline-card-head">
                                    <span class="timeline-term-tag">Term 1</span>
                                    <span class="timeline-date-tag">September &ndash; October</span>
                                </div>
                                <h4 class="timeline-card-title">B2: Programming Fundamentals &amp; Python Constructs</h4>
                                <div class="timeline-topic-pills">
                                    <span class="timeline-pill">B2.1 Fundamentals</span>
                                    <span class="timeline-pill">B2.3 Constructs</span>
                                    <span class="timeline-pill">Python</span>
                                </div>
                                <p class="timeline-card-desc">Environment setup (VS Code, GitHub), data types, string manipulation, conditionals (if/elif/else), repetition loops (for/while), functions, and tracing.</p>
                                <div class="timeline-milestone-badge badge-exam">Diagnostic Coding Baseline &bull; Week 4</div>
                            </div>

                            <!-- Term 2 -->
                            <div class="timeline-card">
                                <div class="timeline-node"><div class="timeline-node-inner"></div></div>
                                <div class="timeline-card-head">
                                    <span class="timeline-term-tag">Term 2</span>
                                    <span class="timeline-date-tag">November &ndash; December</span>
                                </div>
                                <h4 class="timeline-card-title">B1: Computational Thinking &amp; B3: Single-Class OOP</h4>
                                <div class="timeline-topic-pills">
                                    <span class="timeline-pill">B1.1 Thinking</span>
                                    <span class="timeline-pill">B3.1 OOP Basics</span>
                                    <span class="timeline-pill">Flowcharts</span>
                                </div>
                                <p class="timeline-card-desc">Problem decomposition, abstraction, flowchart logic, class structure, constructors, instance variables, encapsulation, and unit testing.</p>
                                <div class="timeline-milestone-badge badge-ia">IA Problem Identification &bull; Criterion A Launch</div>
                            </div>

                            <!-- Term 3 -->
                            <div class="timeline-card">
                                <div class="timeline-node"><div class="timeline-node-inner"></div></div>
                                <div class="timeline-card-head">
                                    <span class="timeline-term-tag">Term 3</span>
                                    <span class="timeline-date-tag">January &ndash; March</span>
                                </div>
                                <h4 class="timeline-card-title">B4: ADTs (HL Only) &amp; A3: Relational Databases</h4>
                                <div class="timeline-topic-pills">
                                    <span class="timeline-pill pill-amber">B4.1 ADTs (HL)</span>
                                    <span class="timeline-pill">A3.1-A3.3 Databases</span>
                                    <span class="timeline-pill">SQL</span>
                                </div>
                                <p class="timeline-card-desc">Linked lists, binary search trees (BSTs), sets, relational database modeling, ERDs, 1NF–3NF normalization, and multi-table SQL queries.</p>
                                <div class="timeline-milestone-badge">Database Design Practical Challenge</div>
                            </div>

                            <!-- Term 4 & Summer -->
                            <div class="timeline-card">
                                <div class="timeline-node"><div class="timeline-node-inner"></div></div>
                                <div class="timeline-card-head">
                                    <span class="timeline-term-tag">Term 4 &amp; Summer</span>
                                    <span class="timeline-date-tag">April &ndash; August</span>
                                </div>
                                <h4 class="timeline-card-title">Year 12 Timed Assessments &amp; IA Prototype Drafting</h4>
                                <div class="timeline-topic-pills">
                                    <span class="timeline-pill pill-emerald">Summative Exams</span>
                                    <span class="timeline-pill pill-emerald">IA Criteria A&ndash;C</span>
                                </div>
                                <p class="timeline-card-desc">End-of-Year exams; client consultation, Criterion A planning, Criterion B system architecture &amp; record of tasks, and first working prototype.</p>
                                <div class="timeline-milestone-badge badge-critical">IA Criteria A&ndash;C First Draft Submission</div>
                            </div>
                        </div>
                    </div>

                    <!-- Year 2: DP2 Column -->
                    <div class="timeline-cohort-col">
                        <div class="timeline-cohort-header">
                            <div>
                                <span class="cohort-badge-main">DP2 &bull; Class of 2026/2027</span>
                                <h3 class="cohort-title-main">Year 2: Systems, AI, Networks &amp; Finals</h3>
                            </div>
                            <span class="pill pill-hl">Year 13</span>
                        </div>

                        <div class="timeline-track">
                            <!-- Term 1 -->
                            <div class="timeline-card">
                                <div class="timeline-node"><div class="timeline-node-inner"></div></div>
                                <div class="timeline-card-head">
                                    <span class="timeline-term-tag">Term 1</span>
                                    <span class="timeline-date-tag">September &ndash; October</span>
                                </div>
                                <h4 class="timeline-card-title">A1: Computer Fundamentals &amp; A4: Machine Learning</h4>
                                <div class="timeline-topic-pills">
                                    <span class="timeline-pill">A1 Systems</span>
                                    <span class="timeline-pill">A4 ML Core</span>
                                    <span class="timeline-pill">Logic Gates</span>
                                </div>
                                <p class="timeline-card-desc">Von Neumann CPU architecture, GPU functions, cache memory, logic gates, truth tables, OS scheduling, and introductory machine learning algorithms.</p>
                                <div class="timeline-milestone-badge badge-exam">Paper 1 Diagnostic &bull; Logic Circuits</div>
                            </div>

                            <!-- Term 2 -->
                            <div class="timeline-card">
                                <div class="timeline-node"><div class="timeline-node-inner"></div></div>
                                <div class="timeline-card-head">
                                    <span class="timeline-term-tag">Term 2</span>
                                    <span class="timeline-date-tag">November &ndash; December</span>
                                </div>
                                <h4 class="timeline-card-title">A4: ML Deep Dive, A2: Networks &amp; Final IA Submission</h4>
                                <div class="timeline-topic-pills">
                                    <span class="timeline-pill pill-amber">A4.3 ANNs &amp; CNNs (HL)</span>
                                    <span class="timeline-pill">A2 Networks</span>
                                    <span class="timeline-pill pill-emerald">IA Complete</span>
                                </div>
                                <p class="timeline-card-desc">Deep learning architectures, hyperparameter tuning; packet switching, TCP/IP, network security; final submission of IA Criterion D &amp; E with video demonstration.</p>
                                <div class="timeline-milestone-badge badge-critical">CRITICAL: Official IA Final Submission (Criterion A&ndash;E)</div>
                            </div>

                            <!-- Term 3 -->
                            <div class="timeline-card">
                                <div class="timeline-node"><div class="timeline-node-inner"></div></div>
                                <div class="timeline-card-head">
                                    <span class="timeline-term-tag">Term 3</span>
                                    <span class="timeline-date-tag">January &ndash; March</span>
                                </div>
                                <h4 class="timeline-card-title">Paper 3 Case Study Seminars &amp; Full Mock Exams</h4>
                                <div class="timeline-topic-pills">
                                    <span class="timeline-pill pill-amber">Paper 3 Case Study</span>
                                    <span class="timeline-pill">Full Mocks</span>
                                    <span class="timeline-pill">Diagnostic Drill</span>
                                </div>
                                <p class="timeline-card-desc">Intensive analysis of pre-seen Case Study ("The Perfect Chatbot"), full mock examinations under real timed conditions, and past paper mastery drills.</p>
                                <div class="timeline-milestone-badge badge-exam">Full IB Mock Examinations (P1, P2 &amp; P3)</div>
                            </div>

                            <!-- Term 4 -->
                            <div class="timeline-card">
                                <div class="timeline-node"><div class="timeline-node-inner"></div></div>
                                <div class="timeline-card-head">
                                    <span class="timeline-term-tag">Term 4</span>
                                    <span class="timeline-date-tag">April &ndash; May</span>
                                </div>
                                <h4 class="timeline-card-title">Official IB External Diploma Examinations</h4>
                                <div class="timeline-topic-pills">
                                    <span class="timeline-pill pill-emerald">IB External Papers</span>
                                    <span class="timeline-pill">Official Graduation</span>
                                </div>
                                <p class="timeline-card-desc">Final IB Diploma written examinations for Paper 1 (Concepts &amp; Case Study), Paper 2 (Computational Thinking &amp; Python), and Paper 3 (HL Only).</p>
                                <div class="timeline-milestone-badge badge-critical">Official IB Examination Session (May)</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Section 04: Official Benchmarks & Pacing Documents (Requirement 3: Pre-rendered static vault, zero fetch errors) -->
        <section class="section curriculum-section-tab tab-hidden" id="sec-docs" aria-labelledby="sec-docs-head">
            <div class="section-label">
                <span>04</span>Benchmarks
            </div>
            <div class="section-body">
                <div class="section-head">
                    <div>
                        <h2 class="h1" id="sec-docs-head">Official IB &amp; Department Planning Benchmarks</h2>
                        <p class="sub">
                            Authoritative syllabus trackers, schemes of work, scope and sequence plans, and the official IB subject guide.
                        </p>
                    </div>
                </div>

                <div class="benchmarks-panel">
                    <p class="benchmarks-lead-text">
                        Download official IB curriculum guides, two-year course pacing frameworks, lesson planners, and student milestone trackers. All documents are directly accessible offline or in your browser.
                    </p>

                    <div class="files">
                        <!-- File 1: Official Subject Guide -->
                        <div class="file">
                            <div class="file-main">
                                <span class="file-ext">PDF</span>
                                <div>
                                    <div class="file-name">IB Computer Science Subject Guide (First Assessment 2027)</div>
                                    <span class="file-path">Official 67-page International Baccalaureate curriculum guide, assessment outlines, and learning specifications &bull; 3.05 MB</span>
                                </div>
                            </div>
                            <div class="file-actions">
                                <span class="status-badge ready">Official Guide</span>
                                <a class="btn btn-primary btn-sm" href="../resources/Curriculum/ib-compsci-guide-en-2025.pdf" target="_blank" rel="noopener">Open PDF</a>
                            </div>
                        </div>

                        <!-- File 2: Official Syllabus Poster -->
                        <div class="file">
                            <div class="file-main">
                                <span class="file-ext">PDF</span>
                                <div>
                                    <div class="file-name">Official IBDP Computer Science Syllabus Poster (2025&ndash;2027)</div>
                                    <span class="file-path">High-resolution visual overview of themes, conceptual inquiries, and topics &bull; 164 KB</span>
                                </div>
                            </div>
                            <div class="file-actions">
                                <span class="status-badge ready">Ready</span>
                                <a class="btn btn-primary btn-sm" href="../resources/Curriculum/ib-compsci-poster-2025.pdf" target="_blank" rel="noopener">Open PDF</a>
                            </div>
                        </div>

                        <!-- File 3: Scheme of Work 2027 -->
                        <div class="file">
                            <div class="file-main">
                                <span class="file-ext">XLSX</span>
                                <div>
                                    <div class="file-name">Scheme of Work 2027 (SoW IB Computer Science 2027)</div>
                                    <span class="file-path">Official EIS two-year weekly teaching schedule, stream allocations (Stream A / Stream B), and lesson hours &bull; 31 KB</span>
                                </div>
                            </div>
                            <div class="file-actions">
                                <span class="status-badge ready">Ready</span>
                                <a class="btn btn-primary btn-sm" href="../resources/SoW%20IB%20Computer%20Science%202027.xlsx" download>Download XLSX</a>
                            </div>
                        </div>

                        <!-- File 4: Syllabus Tracker -->
                        <div class="file">
                            <div class="file-main">
                                <span class="file-ext">XLSX</span>
                                <div>
                                    <div class="file-name">Syllabus Tracker for HL &amp; SL Students (2025&ndash;2027)</div>
                                    <span class="file-path">Complete student self-assessment checklist covering all 114 SL and HL learning objectives &bull; 42 KB</span>
                                </div>
                            </div>
                            <div class="file-actions">
                                <span class="status-badge ready">Ready</span>
                                <a class="btn btn-primary btn-sm" href="../resources/Weekly%20Unit%20planning/2025%20Syllabus%20tracker%20for%20HL_sl%20students.xlsx" download>Download XLSX</a>
                            </div>
                        </div>

                        <!-- File 5: Scope & Sequence -->
                        <div class="file">
                            <div class="file-main">
                                <span class="file-ext">DOCX</span>
                                <div>
                                    <div class="file-name">Scope and Sequence &mdash; Lesson Planning (180 Lessons)</div>
                                    <span class="file-path">Two-year lesson focus breakdown mapping 180 individual lessons to syllabus statements &bull; 48 KB</span>
                                </div>
                            </div>
                            <div class="file-actions">
                                <span class="status-badge ready">Ready</span>
                                <a class="btn btn-primary btn-sm" href="../resources/Scope%20and%20sequence%20-%20LESSON%20PLANNING.docx" download>Download DOCX</a>
                            </div>
                        </div>

                        <!-- File 6: Year 1 Unit Planner -->
                        <div class="file">
                            <div class="file-main">
                                <span class="file-ext">DOCX</span>
                                <div>
                                    <div class="file-name">Year 1 Unit Planner (Semester 1, 2026&ndash;2027)</div>
                                    <span class="file-path">Detailed 19-week programming and algorithms unit plan, inquiry questions, and assessment rubrics &bull; 28 KB</span>
                                </div>
                            </div>
                            <div class="file-actions">
                                <span class="status-badge ready">Ready</span>
                                <a class="btn btn-primary btn-sm" href="../resources/Copy%20of%2026-27%20Year%201%20Sem%201%20unit%20planner.docx" download>Download DOCX</a>
                            </div>
                        </div>

                        <!-- File 7: DP CS Curriculum Roadmap -->
                        <div class="file">
                            <div class="file-main">
                                <span class="file-ext">XLSX</span>
                                <div>
                                    <div class="file-name">DP Computer Science Curriculum Roadmap (2025&ndash;2026)</div>
                                    <span class="file-path">Department curriculum mapping, pacing targets, and internal assessment submission calendar &bull; 31 KB</span>
                                </div>
                            </div>
                            <div class="file-actions">
                                <span class="status-badge ready">Ready</span>
                                <a class="btn btn-primary btn-sm" href="../resources/Curriculum/DP%20CS%20Curriculum%20(2025-26).xlsx" download>Download XLSX</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>

        <footer class="site-footer">
        <div class="wrap">
            <div class="footer-grid">
                <div>
                    <div class="footer-title">Computer Science &bull; EIS</div>
                    <p>
                        IB Diploma Programme Computer Science (SL &amp; HL) at Emirates International School Meadows. Department lead &amp; inquiries: <a href="mailto:Siddiquin@eischools.ae">Neha Siddiqui (Siddiquin@eischools.ae)</a>.
                    </p>
                </div>
                <div>
                    <div class="footer-title">Navigation</div>
                    <ul>
                        <li><a href="deadlines.html">Deadlines &amp; Announcements</a></li>
                        <li><a href="practice.html">Practice Question Bank</a></li>
                        <li><a href="curriculum.html">Syllabus</a></li>
                        <li><a href="ia.html">Internal Assessment (IA)</a></li>
                        <li><a href="case-study.html">Case Study (Paper 1 Section B)</a></li>
                        <li><a href="resources.html">Resources &amp; Worksheets</a></li>
                    </ul>
                </div>
                <div>
                    <div class="footer-title">Department Team &amp; Ambassadors</div>
                    <ul>
                        <li><a href="mailto:Siddiquin@eischools.ae">Neha Siddiqui &mdash; Head of CS</a></li>
                        <li><a href="mailto:anishdongarkar@gmail.com">Anish Dongarkar &mdash; Tech Ambassador</a></li>
                        <li><a href="mailto:rudolphmacrinebabaran@gmail.com">Rudolph Babaran &mdash; AI Ambassador</a></li>
                        <li><a href="about-us.html">About the Department</a></li>
                        <li><a href="admin.html">Faculty Administration Portal</a></li>
                    </ul>
                </div>
            </div>

            <div class="footer-base">
                <span>&copy; 2026 Computer Science Department &bull; Emirates International School (IB DP World School)</span>
                <span>Theme A &bull; Theme B &bull; IA &bull; Paper 1 Section B</span>
            </div>
        </div>
    </footer>

    <script src="../assets/js/site.js" defer></script>
    <script>
        // Segmented Section Tab Switcher (01-04 + View All)
        document.addEventListener('DOMContentLoaded', function () {
            var tabButtons = document.querySelectorAll('.segmented-control .segmented-btn');
            var sectionTabs = document.querySelectorAll('.curriculum-section-tab');

            function switchSection(targetId) {
                tabButtons.forEach(function (btn) {
                    var isMatch = (btn.getAttribute('data-tab') === targetId);
                    btn.classList.toggle('active', isMatch);
                    btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
                });

                if (targetId === 'all') {
                    sectionTabs.forEach(function (sec) { sec.classList.remove('tab-hidden'); });
                } else {
                    sectionTabs.forEach(function (sec) {
                        if (sec.id === targetId) {
                            sec.classList.remove('tab-hidden');
                        } else {
                            sec.classList.add('tab-hidden');
                        }
                    });
                }
            }

            tabButtons.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    var targetId = btn.getAttribute('data-tab');
                    switchSection(targetId);
                    if (targetId !== 'all') {
                        history.replaceState(null, '', '#' + targetId);
                    } else {
                        history.replaceState(null, '', window.location.pathname);
                    }
                });
            });

            // Robust Deep-Link & Section Tab Router
            function handleCurriculumHash() {
                var rawHash = window.location.hash.replace(/^#/, '');
                if (!rawHash) {
                    switchSection('sec-syllabus');
                    return;
                }
                var currentHash = rawHash.toLowerCase();

                // 1. Check for Syllabus Unit Deep-Links (a1..a4, b1..b4)
                var unitRegex = /^[ab][1-4]$/i;
                if (unitRegex.test(currentHash)) {
                    switchSection('sec-syllabus');
                    var unitEl = document.getElementById(currentHash);
                    if (unitEl) {
                        unitEl.open = true;
                        if (unitEl.classList.contains('is-hidden')) {
                            unitEl.classList.remove('is-hidden');
                        }
                        setTimeout(function () {
                            unitEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 80);
                    }
                    return;
                }

                // 2. Check for Theme Shortcuts (e.g. from about-us.html #theme-b)
                if (currentHash === 'theme-b') {
                    switchSection('sec-syllabus');
                    var b1 = document.getElementById('b1');
                    if (b1) {
                        b1.open = true;
                        setTimeout(function () { b1.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 80);
                    }
                    return;
                }
                if (currentHash === 'theme-a') {
                    switchSection('sec-syllabus');
                    var a1 = document.getElementById('a1');
                    if (a1) {
                        a1.open = true;
                        setTimeout(function () { a1.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 80);
                    }
                    return;
                }

                // 3. Check for Section Tabs (sec-syllabus, sec-assessment, sec-roadmap, sec-docs, all)
                var matchingTab = document.querySelector('.rv-tabs-nav .rv-tab-btn[data-tab="' + currentHash + '"]');
                var matchingSection = document.querySelector('.curriculum-section-tab#' + currentHash);
                if (matchingTab || matchingSection || currentHash === 'all') {
                    switchSection(currentHash);
                    return;
                }

                // 4. Fallback for any other valid element ID on the page
                var targetEl = document.getElementById(rawHash);
                if (targetEl) {
                    var parentSec = targetEl.closest('.curriculum-section-tab');
                    if (parentSec) switchSection(parentSec.id);
                    if (typeof targetEl.open !== 'undefined') targetEl.open = true;
                    setTimeout(function () { targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 80);
                } else {
                    switchSection('sec-syllabus');
                }
            }

            // Execute on initial DOM load
            handleCurriculumHash();

            // React dynamically to browser back/forward or anchor clicks
            window.addEventListener('hashchange', handleCurriculumHash);

            // Interactive Syllabus Filtering, Cohort Toggling, and Live Search
            var activeLevel = 'all';
            var activeCohort = 'all';
            var activeTheme = 'all';
            var searchQuery = '';

            var searchInput = document.getElementById('syllabus-search');
            var visibleStatementCountEl = document.getElementById('visible-statement-count');
            var visibleUnitCountEl = document.getElementById('visible-unit-count');

            var levelButtons = document.querySelectorAll('#filter-level-group .filter-btn');
            var cohortButtons = document.querySelectorAll('#filter-cohort-group .filter-btn');
            var themeButtons = document.querySelectorAll('#filter-theme-group .filter-btn');

            var units = document.querySelectorAll('.syllabus-units-container .unit');
            var subtopics = document.querySelectorAll('.subtopic-block');

            function applyFilters() {
                var q = searchQuery.trim().toLowerCase();
                var visibleStatements = 0;
                var visibleUnits = 0;

                units.forEach(function (unit) {
                    var unitCohort = unit.getAttribute('data-cohort');
                    var unitTheme = unit.getAttribute('data-theme');
                    var unitMatchesTheme = (activeTheme === 'all' || unitTheme === activeTheme);
                    var unitMatchesCohort = (activeCohort === 'all' || unitCohort === activeCohort);
                    
                    var unitVisibleStatements = 0;

                    var unitSubtopics = unit.querySelectorAll('.subtopic-block');
                    unitSubtopics.forEach(function (subBlock) {
                        var subItems = subBlock.querySelectorAll('.statement-item');
                        var subVisibleCount = 0;

                        subItems.forEach(function (item) {
                            var itemLvl = item.getAttribute('data-level');
                            var itemCohort = item.getAttribute('data-cohort');
                            var itemTheme = item.getAttribute('data-theme');
                            var itemCode = (item.getAttribute('data-code') || '').toLowerCase();
                            var itemText = item.querySelector('.statement-text').textContent.toLowerCase();

                            var matchesLevel = true;
                            if (activeLevel === 'sl') {
                                matchesLevel = (itemLvl === 'sl');
                            } else if (activeLevel === 'hl') {
                                matchesLevel = true;
                            }

                            var matchesCohort = (activeCohort === 'all' || itemCohort === activeCohort);
                            var matchesTheme = (activeTheme === 'all' || itemTheme === activeTheme);

                            var matchesSearch = true;
                            if (q.length > 0) {
                                matchesSearch = itemCode.includes(q) || itemText.includes(q);
                            }

                            if (matchesLevel && matchesCohort && matchesTheme && matchesSearch) {
                                item.classList.remove('is-hidden');
                                subVisibleCount++;
                                unitVisibleStatements++;
                                visibleStatements++;
                            } else {
                                item.classList.add('is-hidden');
                            }
                        });

                        if (subVisibleCount > 0) {
                            subBlock.classList.remove('is-hidden');
                            // If searching, ensure matching subtopics are automatically opened!
                            if (q.length > 0) {
                                subBlock.setAttribute('open', '');
                            }
                        } else {
                            subBlock.classList.add('is-hidden');
                        }
                    });

                    if (unitVisibleStatements > 0 && unitMatchesTheme && unitMatchesCohort) {
                        unit.classList.remove('is-hidden');
                        if (q.length > 0) {
                            unit.setAttribute('open', '');
                        }
                        visibleUnits++;
                    } else {
                        unit.classList.add('is-hidden');
                    }
                });

                if (visibleStatementCountEl) visibleStatementCountEl.textContent = visibleStatements;
                if (visibleUnitCountEl) visibleUnitCountEl.textContent = visibleUnits;
                updateButtonsState();
            }

            levelButtons.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    levelButtons.forEach(function (b) { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
                    btn.classList.add('active');
                    btn.setAttribute('aria-pressed', 'true');
                    activeLevel = btn.getAttribute('data-filter-level');
                    applyFilters();
                });
            });

            cohortButtons.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    cohortButtons.forEach(function (b) { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
                    btn.classList.add('active');
                    btn.setAttribute('aria-pressed', 'true');
                    activeCohort = btn.getAttribute('data-filter-cohort');
                    applyFilters();
                });
            });

            themeButtons.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    themeButtons.forEach(function (b) { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
                    btn.classList.add('active');
                    btn.setAttribute('aria-pressed', 'true');
                    activeTheme = btn.getAttribute('data-filter-theme');
                    applyFilters();
                });
            });

            if (searchInput) {
                searchInput.addEventListener('input', function () {
                    searchQuery = searchInput.value;
                    applyFilters();
                });
            }

            // Topics & Subtopics Toggle Controls
            var btnTopicToggle = document.getElementById('btn-toggle-units') || document.getElementById('btn-expand-all');
            var btnSubtopicToggle = document.getElementById('btn-toggle-subtopics') || document.getElementById('btn-collapse-all');

            function getVisibleUnits() {
                return Array.from(units).filter(function (u) {
                    return !u.classList.contains('is-hidden');
                });
            }

            function getVisibleSubtopics() {
                return Array.from(subtopics).filter(function (st) {
                    return !st.classList.contains('is-hidden');
                });
            }

            function updateButtonsState() {
                var curUnits = getVisibleUnits();
                if (curUnits.length > 0 && btnTopicToggle) {
                    var openUnits = curUnits.filter(function (u) { return u.hasAttribute('open'); }).length;
                    var currentTopicAction = btnTopicToggle.getAttribute('data-action');

                    if (openUnits === curUnits.length) {
                        btnTopicToggle.textContent = 'Collapse All Topics';
                        btnTopicToggle.setAttribute('data-action', 'collapse');
                        btnTopicToggle.setAttribute('aria-label', 'Collapse all topics');
                    } else if (openUnits === 0) {
                        btnTopicToggle.textContent = 'Expand All Topics';
                        btnTopicToggle.setAttribute('data-action', 'expand');
                        btnTopicToggle.setAttribute('aria-label', 'Expand all topics');
                    } else if (!currentTopicAction) {
                        var shouldCollapse = openUnits >= Math.ceil(curUnits.length / 2);
                        btnTopicToggle.textContent = shouldCollapse ? 'Collapse All Topics' : 'Expand All Topics';
                        btnTopicToggle.setAttribute('data-action', shouldCollapse ? 'collapse' : 'expand');
                        btnTopicToggle.setAttribute('aria-label', shouldCollapse ? 'Collapse all topics' : 'Expand all topics');
                    }
                }

                var curSubtopics = getVisibleSubtopics();
                if (curSubtopics.length > 0 && btnSubtopicToggle) {
                    var openSubtopics = curSubtopics.filter(function (st) { return st.hasAttribute('open'); }).length;
                    var currentSubtopicAction = btnSubtopicToggle.getAttribute('data-action');

                    if (openSubtopics === curSubtopics.length) {
                        btnSubtopicToggle.textContent = 'Collapse All Subtopics';
                        btnSubtopicToggle.setAttribute('data-action', 'collapse');
                        btnSubtopicToggle.setAttribute('aria-label', 'Collapse all subtopics');
                    } else if (openSubtopics === 0) {
                        btnSubtopicToggle.textContent = 'Expand All Subtopics';
                        btnSubtopicToggle.setAttribute('data-action', 'expand');
                        btnSubtopicToggle.setAttribute('aria-label', 'Expand all subtopics');
                    } else if (!currentSubtopicAction) {
                        var shouldCollapseSub = openSubtopics >= Math.ceil(curSubtopics.length / 2);
                        btnSubtopicToggle.textContent = shouldCollapseSub ? 'Collapse All Subtopics' : 'Expand All Subtopics';
                        btnSubtopicToggle.setAttribute('data-action', shouldCollapseSub ? 'collapse' : 'expand');
                        btnSubtopicToggle.setAttribute('aria-label', shouldCollapseSub ? 'Collapse all subtopics' : 'Expand all subtopics');
                    }
                }
            }

            var updateRafId = null;
            function scheduleButtonsUpdate() {
                if (updateRafId) cancelAnimationFrame(updateRafId);
                updateRafId = requestAnimationFrame(function () {
                    updateButtonsState();
                });
            }

            if (btnTopicToggle) {
                btnTopicToggle.addEventListener('click', function () {
                    var curUnits = getVisibleUnits();
                    var action = btnTopicToggle.getAttribute('data-action');
                    if (!action) {
                        var anyOpen = curUnits.some(function (u) { return u.hasAttribute('open'); });
                        action = anyOpen ? 'collapse' : 'expand';
                    }

                    if (action === 'collapse') {
                        curUnits.forEach(function (u) { u.removeAttribute('open'); });
                        btnTopicToggle.textContent = 'Expand All Topics';
                        btnTopicToggle.setAttribute('data-action', 'expand');
                        btnTopicToggle.setAttribute('aria-label', 'Expand all topics');
                    } else {
                        // Expand topics ONLY; subtopics are kept as is
                        curUnits.forEach(function (u) { u.setAttribute('open', ''); });
                        btnTopicToggle.textContent = 'Collapse All Topics';
                        btnTopicToggle.setAttribute('data-action', 'collapse');
                        btnTopicToggle.setAttribute('aria-label', 'Collapse all topics');
                    }
                });
            }

            if (btnSubtopicToggle) {
                btnSubtopicToggle.addEventListener('click', function () {
                    var curSubtopics = getVisibleSubtopics();
                    var action = btnSubtopicToggle.getAttribute('data-action');
                    if (!action) {
                        var anyOpen = curSubtopics.some(function (st) { return st.hasAttribute('open'); });
                        action = anyOpen ? 'collapse' : 'expand';
                    }

                    if (action === 'collapse') {
                        curSubtopics.forEach(function (st) { st.removeAttribute('open'); });
                        btnSubtopicToggle.textContent = 'Expand All Subtopics';
                        btnSubtopicToggle.setAttribute('data-action', 'expand');
                        btnSubtopicToggle.setAttribute('aria-label', 'Expand all subtopics');
                    } else {
                        curSubtopics.forEach(function (st) { st.setAttribute('open', ''); });
                        // Ensure parent units are open so expanded subtopics are visible
                        var curUnits = getVisibleUnits();
                        curUnits.forEach(function (u) { u.setAttribute('open', ''); });
                        if (btnTopicToggle) {
                            btnTopicToggle.textContent = 'Collapse All Topics';
                            btnTopicToggle.setAttribute('data-action', 'collapse');
                            btnTopicToggle.setAttribute('aria-label', 'Collapse all topics');
                        }
                        btnSubtopicToggle.textContent = 'Collapse All Subtopics';
                        btnSubtopicToggle.setAttribute('data-action', 'collapse');
                        btnSubtopicToggle.setAttribute('aria-label', 'Collapse all subtopics');
                    }
                });
            }

            var syllabusContainer = document.getElementById('syllabus-container');
            if (syllabusContainer) {
                syllabusContainer.addEventListener('toggle', scheduleButtonsUpdate, true);
            }

            applyFilters();
        });
    </script>
</body>
</html>
'''

# Generate curriculum.html
curriculum_content = page_html.replace('{PAGE_TITLE}', 'Curriculum &amp; Main Syllabus')
curriculum_content = curriculum_content.replace('{HERO_TITLE}', 'Curriculum &amp; Main Syllabus')
curriculum_content = curriculum_content.replace('{SYLLABUS_MARKUP}', syllabus_markup)

curriculum_path = r'C:\Users\Rudolph\Documents\website\github repo\pages\curriculum.html'
with open(curriculum_path, 'w', encoding='utf-8') as f:
    f.write(curriculum_content)
print(f"Updated {curriculum_path} ({len(curriculum_content)} bytes)")


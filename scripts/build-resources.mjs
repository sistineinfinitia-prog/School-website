#!/usr/bin/env node
/**
 * Builds data/resources.json from the contents of the resources/ folder.
 *
 * GitHub Pages cannot list folder contents, so the site reads this manifest
 * to show every file in the library, theme pages and admin page.
 *
 * Run it from the repository root after adding, renaming or deleting files:
 *
 *     node scripts/build-resources.mjs
 */

import { readdir, stat, writeFile } from 'node:fs/promises';
import { join, extname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const RESOURCES_DIR = join(ROOT, 'resources');
const OUTPUT = join(ROOT, 'data', 'resources.json');

// Files the library should never list.
const IGNORED = new Set(['.ds_store', 'thumbs.db', 'desktop.ini', '.gitkeep']);

// Friendlier titles for folders whose names on disk are hard to read.
// Keys are paths relative to resources/, using forward slashes.
const FOLDER_TITLES = {
    'Curriculum': 'Curriculum Documents',
    'IA': 'Internal Assessment',
    'Overall Practice Papers': 'Practice Papers',
    'Revision Folder': 'Revision Kits',
    'Revision Folder/Theme A/A1 -Database': 'Relational vs Non-Relational Databases',
    'Theme A/A1 _Computer Fundamentals': 'A1 Computer Fundamentals',
    'Theme A/A1 _Computer Fundamentals/1- Concepts of Computer Science': 'A1.1 Core Concepts of Computer Science',
    'Theme A/A1 _Computer Fundamentals/A1': 'A1.1 Computer Hardware & Operation',
    'Theme A/A1 _Computer Fundamentals/A1.2': 'A1.2 Data Representation & Computer Logic',
    'Theme A/A1 _Computer Fundamentals/Operating System ,Control System and Translators': 'A1.3 & A1.4 Operating Systems, Control Systems & Translation',
    'Theme A/A2 _ Networks': 'A2 Computer Networks',
    'Theme A/A3 _ Database': 'A3 Relational Databases & SQL',
    'Theme A/Mini Project': 'Mini Project & IA Readiness',
    'Theme B/B1  _ Computational Thinking': 'B1 Computational Thinking',
    'Theme B/B2- Programming': 'B2 Programming in Python',
    'Theme B/B2- Programming/B2.2 Data Structures': 'B2.2 Data Structures, Searching & Sorting',
    'Theme B/B2- Programming/B2.3 Programming Constructs': 'B2.3 & B2.5 Programming Constructs & File I/O',
    'Theme B/B3 oops': 'B3 Object-Oriented Programming (OOP)',
    'Theme B/Python Basics': 'Python Fundamentals & Exercises',
    'Weekly Unit planning': 'Weekly Unit Planning',
    'Weekly Unit planning/PPT': 'IB Subject Guide Reference',
    'Weekly Unit planning/Unit planning -Weekly': 'Semester 1 Weekly Unit Plans (Weeks 1–16)',
};

// Explicit human-readable titles for cryptic or abbreviated filenames.
const FILE_TITLES = {
    'Copy of 26-27 Year 1 Sem 1 unit planner.docx': '2026–2027 Year 1 Semester 1 Unit Planner',
    'Error log - Python Programming.pdf': 'Python Programming Error Log & Debugging Reference',
    'Lesson2_GitHub_Deployment.pptx': 'Lesson 2: GitHub Repository & Pages Deployment',
    'Scope and sequence - LESSON PLANNING.docx': 'Scope and Sequence: Lesson Planning Overview',
    'SoW IB Computer Science 2027.xlsx': 'Scheme of Work: IB Computer Science 2027',
    'Curriculum/DP CS Curriculum (2025-26).xlsx': 'DP Computer Science Curriculum Roadmap (2025–2026)',
    'Curriculum/ib-compsci-guide-en-2025.pdf': 'Official IBDP Computer Science Subject Guide',
    'Curriculum/ib-compsci-poster-2025.pdf': 'Official IBDP Computer Science Syllabus Poster',
    'IA/Computer Science Assessed Student Work 2027 (1).pdf': 'IB Assessed Student Coursework Exemplar (2027 Syllabus)',
    'Overall Practice Papers/IB Computer Science Worksheet.docx': 'Comprehensive IB Computer Science Practice Paper',
    'Revision Folder/Theme A/A1 -Database/Activity- Relational vs NonRelational Scenarios.pdf': 'Activity: Relational vs Non-Relational Database Scenarios',
    'Revision Folder/Theme A/A1 -Database/RelationalVsNonRelational_Lesson.pptx': 'Relational vs Non-Relational Databases Lesson',
    'Revision Folder/Theme A/A1 -Database/ScenarioAnswers.pptx': 'Database Architecture Scenarios: Worked Answers',
    'Theme A/answers_.docx': 'Theme A & B Core Theory: Worked Answers',
    'Theme A/B1,B2 -Programming.docx': 'B1 & B2 Computational Thinking and Programming Workbook',
    'Theme A/Theory Questions -B1,B2.docx': 'B1 & B2 Core Theory Problem Set',
    'Theme A/A1 _Computer Fundamentals/1- Concepts of Computer Science/A.3.2.2 Entity relational database.pdf': 'A3.2.2 Entity-Relationship Database Design',
    'Theme A/A1 _Computer Fundamentals/1- Concepts of Computer Science/A1.1.1.docx': 'A1.1.1 Computer Hardware & Components Notes',
    'Theme A/A1 _Computer Fundamentals/1- Concepts of Computer Science/A1.1.2.pdf': 'A1.1.2 Processor Architecture & Machine Cycle Guide',
    'Theme A/A1 _Computer Fundamentals/A1/A1.1.1.pptx': 'A1.1.1 Computer Hardware & System Operation',
    'Theme A/A1 _Computer Fundamentals/A1/Case Study Research - CPU ,GPU, MACHINE CYCLE , Primary memory.docx': 'Case Study Research: CPU, GPU, Machine Cycle & Primary Memory',
    'Theme A/A1 _Computer Fundamentals/A1/Copy of GPU  .pptx': 'GPU Architecture & Parallel Processing (Reference Deck)',
    'Theme A/A1 _Computer Fundamentals/A1/CPU Simulations Activity_ Inside the Silicon Brain.docx': 'CPU Simulation Lab: Inside the Silicon Brain',
    'Theme A/A1 _Computer Fundamentals/A1/CS -Template .pptx': 'Computer Science Presentation Template',
    'Theme A/A1 _Computer Fundamentals/A1/Exam Style Questions_.docx': 'A1.1 Hardware & Architecture Exam-Style Questions',
    'Theme A/A1 _Computer Fundamentals/A1/GPU  .pptx': 'GPU Architecture & Parallel Processing',
    'Theme A/A1 _Computer Fundamentals/A1/GPU -Worksheet.docx': 'GPU Architecture Student Worksheet',
    'Theme A/A1 _Computer Fundamentals/A1/Primary and Secondary Memory_.docx': 'Primary and Secondary Memory Hierarchy Worksheet',
    'Theme A/A1 _Computer Fundamentals/A1.2/A 1.2.1-2 Representing Data.pptx': 'A1.2.1–2 Representing Data in Binary & Hexadecimal',
    'Theme A/A1 _Computer Fundamentals/A1.2/Logic Daigrams.pdf': 'Boolean Logic Gate Diagrams Reference',
    'Theme A/A1 _Computer Fundamentals/Operating System ,Control System and Translators/HL - Translation.pptx': 'A1.4 (HL) Compilers, Interpreters & Translation',
    'Theme A/A1 _Computer Fundamentals/Operating System ,Control System and Translators/Navigating_Digital_Worlds_Operating_Syst_worksheet.pdf': 'Operating Systems Student Worksheet',
    'Theme A/A1 _Computer Fundamentals/Operating System ,Control System and Translators/Operating system.pdf': 'A1.3 Operating Systems Core Notes',
    'Theme A/A2 _ Networks/networking_lesson_85min.html': 'Interactive 85-Minute Computer Networking Lab',
    'Theme A/A2 _ Networks/IB_CS_Networks_Question_Paper.docx': 'IB Computer Science Networks Examination Paper',
    'Theme A/A3 _ Database/Copy of Entity relationship diagrams.pptx': 'Entity-Relationship Diagrams (ERD) Design',
    'Theme A/A3 _ Database/Database Programming -A3.3.1.pptx': 'A3.3.1 Database Programming in SQL',
    'Theme A/A3 _ Database/REVISION.pptx': 'A3 Databases Comprehensive Revision Deck',
    'Theme A/A3 _ Database/SQL.pptx': 'Structured Query Language (SQL) Fundamentals',
    'Theme B/Simple Calculator -Project.pptx': 'Applied Python Project: Modular Calculator',
    'Theme B/B1  _ Computational Thinking/36 Computational Thinking.pptx': 'B1.1 Approaches to Computational Thinking',
    'Theme B/B2- Programming/B1.pptx': 'B1 & B2 Algorithmic Thinking to Python Overview',
    'Theme B/B2- Programming/B2.pptx': 'B2 Programming Fundamentals & Constructs',
    'Theme B/B2- Programming/L2_.pptx': 'Lesson 2: Python Variables, Operators & Control Flow',
    'Theme B/B2- Programming/Practice -EOU.docx': 'B2 End-of-Unit Programming Assessment Practice',
    'Theme B/B2- Programming/B2.2 Data Structures/IB EXAM STYLE SEARCHING AND SORTING QUESTIONS.docx': 'IB Exam-Style Searching and Sorting Questions',
    'Theme B/B2- Programming/B2.2 Data Structures/linearSearch.docx': 'Linear Search Algorithm Worksheet',
    'Theme B/B2- Programming/B2.2 Data Structures/List and 2D Lists -Worksheet.docx': '1D Lists and 2D Lists Student Worksheet',
    'Theme B/B2- Programming/B2.2 Data Structures/sorting.docx': 'Sorting Algorithms (Bubble & Selection) Notes',
    'Theme B/B2- Programming/B2.2 Data Structures/SORTING.pptx': 'Sorting Algorithms (Bubble & Selection) Presentation',
    'Theme B/B2- Programming/B2.3 Programming Constructs/B.2.31.docx': 'B2.3.1 Programming Constructs & Sequence Worksheet',
    'Theme B/B3 oops/B312_Designing_Classes_Extended.pptx': 'B3.1.2 Designing Classes (Extended Lecture)',
    'Theme B/B3 oops/B312_Student_Worksheet.docx': 'B3.1.2 Designing Classes Student Worksheet',
    'Theme B/B3 oops/classess and instantiation.pdf': 'Classes and Object Instantiation in Python',
    'Theme B/B3 oops/encapsulation_python.pptx': 'Encapsulation and Information Hiding in Python',
    'Theme B/B3 oops/oop_classes_instantiation.pptx': 'OOP Classes and Instantiation Presentation',
    'Theme B/Python Basics/if statements.docx': 'Conditional Selection (if / elif / else) Worksheet',
    'Theme B/Python Basics/Practice and Excercise sheet.docx': 'Python Programming Practice & Exercise Sheet',
    'Weekly Unit planning/2025 Syllabus tracker for HL_sl students.xlsx': 'IBDP Syllabus Progress Tracker: HL & SL Students',
    'Weekly Unit planning/2025 Syllabus tracker for SL students.xlsx': 'IBDP Syllabus Progress Tracker: SL Students',
    'Weekly Unit planning/khda calendar mapping.docx': 'KHDA Academic Calendar Curriculum Mapping',
    'Weekly Unit planning/PPT/computer-science-guide-en_d6bfa415-6ca6-41f2-85ab-8aeb046f51fb (1).pdf': 'Official IBDP Computer Science Guide (Faculty Reference)',
    'Weekly Unit planning/Unit planning -Weekly/26-27 Year 1 Sem 1 unit planner.docx': '2026–2027 Year 1 Semester 1 Master Unit Planner',
};

const toPosix = (p) => p.split(sep).join('/');

/** Cleans filenames into readable academic titles when not explicitly mapped. */
function tidy(name, relPath) {
    if (relPath && FILE_TITLES[relPath]) return FILE_TITLES[relPath];

    let s = name
        .replace(/\u00a0/g, ' ')
        .replace(/_/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/\s+([,.])/g, '$1')
        .replace(/,(\S)/g, ', $1')
        // Normalize syllabus codes like "A 1.2.4", "B 3.1.1", "A2 1 2", "B3 1 1", "B 2 5 1"
        .replace(/\b([AB])\s+(\d)\.(\d)\.(\d)\b/g, '$1$2.$3.$4')
        .replace(/\b([AB])(\d)\s+(\d)\s+(\d)\b/g, '$1$2.$3.$4')
        .replace(/\b([AB])\s+(\d)\s+(\d)\s+(\d)\b/g, '$1$2.$3.$4')
        .replace(/\b([AB])\s+(\d)\.(\d)\b/g, '$1$2.$3')
        .replace(/\s*-\s*/g, ': ')
        .replace(/[\s\-.: ]+$/g, '')
        .trim();

    // Clean "Year 1 Sem 1 Week N unit plan"
    s = s.replace(/^Year 1 Sem 1 Week (\d+) unit plan$/i, 'Year 1 Semester 1: Week $1 Unit Plan');
    return s;
}

async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name, 'en', { numeric: true, sensitivity: 'base' }));

    const rel = toPosix(relative(RESOURCES_DIR, dir));
    const folder = {
        name: rel ? rel.split('/').pop() : '',
        path: rel,
        title: FOLDER_TITLES[rel] || tidy(rel.split('/').pop() || 'Resources'),
        files: [],
        folders: [],
    };

    for (const entry of entries) {
        if (entry.name.startsWith('.') || IGNORED.has(entry.name.toLowerCase())) continue;
        const full = join(dir, entry.name);

        if (entry.isDirectory()) {
            const child = await walk(full);
            if (child.count > 0) folder.folders.push(child);
        } else if (entry.isFile()) {
            const ext = extname(entry.name).slice(1).toLowerCase();
            const { size } = await stat(full);
            const relFile = toPosix(relative(RESOURCES_DIR, full));
            const stem = entry.name.slice(0, entry.name.length - (ext ? ext.length + 1 : 0));
            folder.files.push({
                name: entry.name,
                title: tidy(stem, relFile),
                ext,
                size,
                path: relFile,
            });
        }
    }

    folder.count = folder.files.length + folder.folders.reduce((n, f) => n + f.count, 0);
    return folder;
}

const tree = await walk(RESOURCES_DIR);
const manifest = {
    note: 'Generated by scripts/build-resources.mjs. Do not edit by hand.',
    generated: new Date().toISOString(),
    count: tree.count,
    tree,
};

await writeFile(OUTPUT, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
console.log(`Wrote ${toPosix(relative(ROOT, OUTPUT))} with ${tree.count} files.`);

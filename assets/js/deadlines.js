        (function () {
            var deadlines = [];
            var announcements = [];
            var currentMonth = 10; // November (0-indexed: 10)
            var currentYear = 2026;
            var selectedDate = null;
            var activeType = 'all';
            var activeCohort = 'all';
            var searchQuery = '';
            var activeView = 'all'; // 'all' | 'deadlines' | 'announcements'
            var isMonthPickerOpen = false;
            var filterByActiveMonth = true;

            var containerAll = document.getElementById('all-container');
            var containerDeadlines = document.getElementById('deadlines-container');
            var containerAnnouncements = document.getElementById('announcements-container');
            var resultsCount = document.getElementById('results-count');
            var activeDateIndicator = document.getElementById('active-date-indicator');
            var toggleAllMonthsBtn = document.getElementById('toggle-all-months-btn');
            var monthLabel = document.getElementById('calendar-month-label');
            var daysGrid = document.getElementById('calendar-days-grid');
            var calendarDaysContainer = document.getElementById('calendar-days-container');
            var calendarMonthsContainer = document.getElementById('calendar-months-container');
            var calToggleMonthsBtn = document.getElementById('cal-toggle-months');
            var searchInput = document.getElementById('content-search');

            // Rescued iCalendar (.ics) RFC 5545 Export
            var exportIcalBtn = document.getElementById('export-ical-btn');
            if (exportIcalBtn) {
                exportIcalBtn.addEventListener('click', function () {
                    var icsLines = [
                        'BEGIN:VCALENDAR',
                        'VERSION:2.0',
                        'PRODID:-//Emirates International School//IB Computer Science//EN',
                        'CALSCALE:GREGORIAN',
                        'METHOD:PUBLISH'
                    ];

                    deadlines.forEach(function (d) {
                        var dt = (d.date || '').replace(/-/g, '');
                        icsLines.push('BEGIN:VEVENT');
                        icsLines.push('UID:' + d.id + '@eischools.ae');
                        icsLines.push('DTSTAMP:' + dt + 'T090000Z');
                        icsLines.push('DTSTART;VALUE=DATE:' + dt);
                        icsLines.push('SUMMARY:' + (d.title || ''));
                        icsLines.push('DESCRIPTION:' + (d.description || '').replace(/\n/g, ' '));
                        icsLines.push('LOCATION:' + (d.location || 'Emirates International School Meadows'));
                        icsLines.push('END:VEVENT');
                    });

                    icsLines.push('END:VCALENDAR');
                    var blob = new Blob([icsLines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
                    var url = URL.createObjectURL(blob);
                    var link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'IB_Computer_Science_Deadlines_2026.ics');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                });
            }
            var btnViewAll = document.getElementById('view-all-btn');
            var btnViewDeadlines = document.getElementById('view-deadlines-btn');
            var btnViewAnnouncements = document.getElementById('view-announcements-btn');

            // Modal elements
            var modalOverlay = document.getElementById('details-modal');
            var modalCloseBtn = document.getElementById('modal-close-btn');
            var modalTitle = document.getElementById('modal-title');
            var modalTypeBadge = document.getElementById('modal-type-badge');
            var modalCohortBadge = document.getElementById('modal-cohort-badge');
            var modalCountdownPill = document.getElementById('modal-countdown-pill');
            var modalMetaRow = document.getElementById('modal-meta-row');
            var modalDescription = document.getElementById('modal-description');
            var modalTopicsGrid = document.getElementById('modal-topics-grid');
            var modalDeliverablesText = document.getElementById('modal-deliverables-text');
            var modalResourcesList = document.getElementById('modal-resources-list');

            var monthNames = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            var shortMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            var fallbackDeadlines = [
                {
                    "id": "dl-00",
                    "title": "Paper 1 Diagnostic Assessment: Logic Gates & Truth Tables",
                    "type": "exam",
                    "typeName": "Diagnostic Exam",
                    "cohort": "Year 1 (SL/HL)",
                    "date": "2026-10-15",
                    "time": "09:15 GST",
                    "weight": "Diagnostic Baseline",
                    "description": "Baseline evaluation testing Boolean logic simplification, combinational circuit schematics, and truth table construction.",
                    "topics": [
                        { "code": "A.1", "name": "Logic Gates & Truth Tables (AND, OR, NOT, XOR, NAND)", "link": "resources.html?topic=Theme A" },
                        { "code": "A.1", "name": "Boolean Algebra & Circuit Simplification", "link": "resources.html?topic=Theme A" }
                    ],
                    "deliverables": "Individual assessment paper in Class Lab 2. Closed book.",
                    "resources": [
                        { "title": "Theme A Notes", "url": "resources.html?topic=Theme A" },
                        { "title": "Theory Questions Worksheet (DOCX)", "url": "../resources/Theme A/Theory Questions -B1,B2.docx" }
                    ]
                },
                {
                    "id": "dl-01",
                    "title": "Paper 1 Unit Test: Computer Fundamentals & Networks",
                    "type": "exam",
                    "typeName": "Unit Test",
                    "cohort": "Year 1 (SL/HL)",
                    "date": "2026-11-05",
                    "time": "08:30 GST",
                    "weight": "15% Term Grade",
                    "description": "Formal written exam assessing internal computer architecture, instruction pipelining, Boolean logic circuit design, and packet network models.",
                    "topics": [
                        { "code": "A.1", "name": "CPU Registers (PC, MAR, MDR, CIR, ACC)", "link": "resources.html?topic=Theme A" },
                        { "code": "A.1", "name": "Fetch-Decode-Execute Cycle & Bus Architecture", "link": "resources.html?topic=Theme A" },
                        { "code": "A.1", "name": "Logic Gates & Truth Tables (AND, OR, NOT, XOR, NAND)", "link": "resources.html?topic=Theme A" },
                        { "code": "A.1", "name": "Primary vs Secondary Memory (RAM, ROM, Virtual Memory)", "link": "resources.html?topic=Theme A" },
                        { "code": "A.2", "name": "Packet Switching vs Circuit Switching", "link": "resources.html?topic=Theme A" },
                        { "code": "A.2", "name": "OSI 7-Layer vs TCP/IP Protocol Stack", "link": "resources.html?topic=Theme A" }
                    ],
                    "deliverables": "Bring black pens, pencils, and ruler. No calculators permitted.",
                    "resources": [
                        { "title": "Theme A Notes", "url": "resources.html?topic=Theme A" },
                        { "title": "Architecture Practice Questions", "url": "practice.html?topic=architecture" }
                    ]
                },
                {
                    "id": "dl-02",
                    "title": "Internal Assessment: Criterion B Architecture & Test Plan",
                    "type": "ia",
                    "typeName": "IA Milestone",
                    "cohort": "Year 2 (SL/HL)",
                    "date": "2026-11-14",
                    "time": "23:59 GST",
                    "weight": "6 Marks (Coursework)",
                    "description": "Submit complete system flowcharts, algorithmic pseudocode, UML class diagram, data persistence structure, and a comprehensive test plan table traceable to Criterion A.",
                    "topics": [
                        { "code": "Crit B", "name": "System Architecture & High-Level Flowchart", "link": "ia.html" },
                        { "code": "Crit B", "name": "UML Class Diagram & Modular Decomposition", "link": "ia.html" },
                        { "code": "Crit B", "name": "Test Plan Table (Normal, Boundary, Erroneous Cases)", "link": "ia.html" },
                        { "code": "Crit B", "name": "Chronological Record of Tasks (Table 1)", "link": "ia.html" }
                    ],
                    "deliverables": "PDF submission to ManageBac & Google Classroom with measurable pass/fail test columns.",
                    "resources": [
                        { "title": "30-Mark IA Rubric Guide", "url": "ia.html" },
                        { "title": "Assessed Student Work Exemplar (PDF)", "url": "../resources/IA/Computer Science Assessed Student Work 2027 (1).pdf" }
                    ]
                },
                {
                    "id": "dl-03",
                    "title": "Python OOP Mini-Project: Interactive Simulation Deck",
                    "type": "project",
                    "typeName": "Other",
                    "cohort": "Year 1 (SL/HL)",
                    "date": "2026-11-22",
                    "time": "16:00 GST",
                    "weight": "10% Practical Grade",
                    "description": "Develop a modular Python application featuring class hierarchies, data encapsulation, file persistence, and interactive user command handling.",
                    "topics": [
                        { "code": "B.2", "name": "Subroutines, Modular Design & File Handling", "link": "resources.html?topic=Theme B" },
                        { "code": "B.3", "name": "Classes, Constructors (__init__), and Encapsulation", "link": "resources.html?topic=Theme B" },
                        { "code": "B.3", "name": "Inheritance Hierarchies & Method Overriding", "link": "resources.html?topic=Theme B" },
                        { "code": "B.3", "name": "Defensive Programming & Input Validation", "link": "resources.html?topic=Theme B" }
                    ],
                    "deliverables": "Push clean Python (.py) source code with docstrings to your repository and submit link to ManageBac.",
                    "resources": [
                        { "title": "Theme B Slides & Worksheets", "url": "resources.html?topic=Theme B" },
                        { "title": "OOP Practice Questions", "url": "practice.html?topic=oop" }
                    ]
                },
                {
                    "id": "dl-04",
                    "title": "HL Case Study Seminar: The Perfect Chatbot Pipeline Review",
                    "type": "announcement",
                    "typeName": "Announcement",
                    "cohort": "Year 2 (HL Only)",
                    "date": "2026-11-28",
                    "time": "14:15 GST",
                    "weight": "Paper 1 Section B Preparation",
                    "description": "Collaborative technical dissection of the RAKT Insurance conversational AI case study booklet. Focus on transformer latency, RAG pipelines, and token embeddings.",
                    "topics": [
                        { "code": "CS.1", "name": "Natural Language Processing (NLP) & Tokenization", "link": "case-study.html" },
                        { "code": "CS.2", "name": "Retrieval-Augmented Generation (RAG) Architecture", "link": "case-study.html" },
                        { "code": "CS.3", "name": "Vector Embeddings & Semantic Search Similarity", "link": "case-study.html" },
                        { "code": "CS.4", "name": "AI Ethics: Bias, Hallucinations, and Data Privacy", "link": "case-study.html" }
                    ],
                    "deliverables": "Annotated case study booklet with 3 prepared discussion points on RAKT customer support transition.",
                    "resources": [
                        { "title": "Case Study Dossier Hub", "url": "case-study.html" },
                        { "title": "AI Practice Questions Bank", "url": "practice.html?topic=ai" }
                    ]
                },
                {
                    "id": "dl-05",
                    "title": "Paper 2 Mock Examination: Computational Thinking & Algorithms",
                    "type": "exam",
                    "typeName": "Mock Exam",
                    "cohort": "Year 2 (SL/HL)",
                    "date": "2026-12-10",
                    "time": "09:00 GST",
                    "weight": "Term 1 Final Mock",
                    "description": "Comprehensive Paper 2 simulation covering algorithm tracing, pseudocode formulation, data structures, and Big-O efficiency analysis.",
                    "topics": [
                        { "code": "B.1", "name": "Pseudocode Conventions & Algorithm Trace Tables", "link": "resources.html?topic=Theme B" },
                        { "code": "B.2", "name": "Searching (Linear/Binary) & Sorting (Bubble/Selection)", "link": "resources.html?topic=Theme B" },
                        { "code": "B.2", "name": "Big-O Time & Space Complexity Analysis", "link": "resources.html?topic=Theme B" },
                        { "code": "B.4", "name": "Abstract Data Types: Stacks, Queues & Linked Lists (HL)", "link": "resources.html?topic=Theme B" }
                    ],
                    "deliverables": "Official IB DP Paper 2 examination paper format (SL: 1h 30m / HL: 2h 10m).",
                    "resources": [
                        { "title": "Algorithms Practice Bank", "url": "practice.html?topic=algorithms" }
                    ]
                },
                {
                    "id": "dl-06",
                    "title": "Internal Assessment: Criterion C First Working Prototype",
                    "type": "ia",
                    "typeName": "IA Milestone",
                    "cohort": "Year 2 (SL/HL)",
                    "date": "2026-12-18",
                    "time": "18:00 GST",
                    "weight": "Criterion C Progress Check",
                    "description": "Demonstrate a functioning core prototype exhibiting complex algorithmic techniques matching Criterion B specifications.",
                    "topics": [
                        { "code": "Crit C", "name": "Algorithmic Complexity & Modular Python Code", "link": "ia.html" },
                        { "code": "Crit C", "name": "Data Storage Persistence (SQLite or JSON files)", "link": "ia.html" }
                    ],
                    "deliverables": "Live code demonstration during class appointment and push working prototype branch to GitHub.",
                    "resources": [
                        { "title": "IA Guide & Exemplars", "url": "ia.html" }
                    ]
                }
            ];

            var fallbackAnnouncements = [
                {
                    "id": "mock-exam-seating-2026",
                    "date": "2026-12-01",
                    "title": "Paper 2 Mock Exam Seating Plan & Formula Reference",
                    "description": "The seating arrangement for the December 10 mock examination in the Main Hall is now finalized. Please review your designated desk number and ensure your approved calculator is reset.",
                    "category": "Mock Exam",
                    "driveLink": "practice.html"
                },
                {
                    "id": "crit-b-peer-review",
                    "date": "2026-11-16",
                    "title": "Internal Assessment Criterion B Peer Review Sessions",
                    "description": "Criterion B architecture submissions will undergo paired peer reviews during laboratory sessions this Thursday. Bring your printed test plan matrices with boundary cases.",
                    "category": "IA Checkpoint",
                    "driveLink": "ia.html"
                },
                {
                    "id": "midterm-schedule-clinics",
                    "date": "2026-11-02",
                    "title": "Term 1 Mid-Term Assessment Schedule & Revision Clinics",
                    "description": "Revision clinics for Paper 1 Unit Tests will be held during lunch hours in Room 214. Drop in for targeted walkthroughs on CPU bus architecture and Boolean Karnaugh maps.",
                    "category": "Revision Clinic",
                    "driveLink": "curriculum.html"
                },
                {
                    "id": "ia-criterion-b-c",
                    "date": "2026-10-18",
                    "title": "Internal Assessment Criterion B & C Checkpoint",
                    "description": "Submit your problem decomposition, system architecture diagram, and initial algorithm flowcharts before the end of week. Every design specification must trace directly to a measurable success criterion in Criterion A.",
                    "category": "IA Checkpoint",
                    "driveLink": "ia.html"
                },
                {
                    "id": "syllabus-2027-resources",
                    "date": "2026-10-12",
                    "title": "Theme A & Theme B Resource Vault Updated",
                    "description": "All 151 department slide decks, Python worksheets, SQL normalization labs, and past paper mark schemes are now indexed and searchable directly from the Resource Vault.",
                    "category": "Curriculum",
                    "driveLink": "resources.html"
                },
                {
                    "id": "paper-3-case-study",
                    "date": "2026-10-04",
                    "title": "HL Case Study Seminar: The Perfect Chatbot",
                    "description": "Higher Level candidates should annotate the RAKT Insurance case study booklet ahead of our seminar on natural language processing pipelines, transformer latency, and dataset bias.",
                    "category": "HL Seminar",
                    "driveLink": "case-study.html"
                }
            ];

            function formatCountdown(dateStr) {
                if (!dateStr) return { text: 'No date', status: 'normal', warning: false, overdue: false };
                var today = new Date(2026, 9, 25); // Academic term anchor: Oct 25, 2026
                var target = new Date(dateStr + 'T23:59:59');
                var diffDays = Math.ceil((target - today) / (1000 * 60 * 60 * 24));

                if (diffDays < 0) {
                    var daysAgo = Math.abs(diffDays);
                    return {
                        text: 'Overdue / Closed (' + daysAgo + 'd ago)',
                        status: 'overdue',
                        warning: false,
                        overdue: true
                    };
                }
                if (diffDays === 0) return { text: 'Due Today', status: 'urgent', warning: true, overdue: false };
                if (diffDays === 1) return { text: 'Due Tomorrow', status: 'urgent', warning: true, overdue: false };
                if (diffDays <= 7) return { text: 'Due in ' + diffDays + ' days', status: 'urgent', warning: true, overdue: false };
                return { text: 'Due in ' + diffDays + ' days', status: 'normal', warning: false, overdue: false };
            }

            function getBadgeClass(type) {
                if (type === 'exam') return 'badge-exam';
                if (type === 'ia') return 'badge-ia';
                if (type === 'project' || type === 'other') return 'badge-other';
                return 'badge-seminar';
            }

            function getCohortDisplay(cohortStr) {
                if (!cohortStr) return 'All';
                if (cohortStr.indexOf('Year 1') !== -1) return 'Y12';
                if (cohortStr.indexOf('Year 2') !== -1) return 'Y13';
                return 'Both';
            }

            function matchesType(itemType, filterType) {
                if (filterType === 'all') return true;
                if (filterType === 'exam') return itemType === 'exam';
                if (filterType === 'ia') return itemType === 'ia';
                if (filterType === 'other') return itemType === 'project' || itemType === 'other';
                if (filterType === 'announcement') return itemType === 'announcement' || itemType === 'seminar';
                return itemType === filterType;
            }

            function renderMonthPicker() {
                calendarMonthsContainer.innerHTML = '';
                shortMonthNames.forEach(function (mName, idx) {
                    var btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = 'month-picker-btn' + (idx === currentMonth ? ' active' : '');
                    btn.textContent = mName;
                    btn.addEventListener('click', function () {
                        currentMonth = idx;
                        isMonthPickerOpen = false;
                        filterByActiveMonth = true;
                        selectedDate = null;
                        if (activeDateIndicator) {
                            activeDateIndicator.style.display = 'none';
                            activeDateIndicator.textContent = '';
                        }
                        updateMonthPickerView();
                        renderCalendar();
                        renderContent();
                    });
                    calendarMonthsContainer.appendChild(btn);
                });
            }

            function updateMonthPickerView() {
                if (isMonthPickerOpen) {
                    calendarDaysContainer.hidden = true;
                    calendarMonthsContainer.hidden = false;
                    renderMonthPicker();
                } else {
                    calendarDaysContainer.hidden = false;
                    calendarMonthsContainer.hidden = true;
                }
            }

            calToggleMonthsBtn.addEventListener('click', function () {
                isMonthPickerOpen = !isMonthPickerOpen;
                updateMonthPickerView();
            });

            function renderCalendar() {
                monthLabel.textContent = monthNames[currentMonth] + ' ' + currentYear;
                daysGrid.innerHTML = '';

                var firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
                var startCol = (firstDayIndex + 6) % 7;
                var totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

                for (var i = 0; i < startCol; i++) {
                    var empty = document.createElement('div');
                    empty.className = 'calendar-cell is-empty';
                    daysGrid.appendChild(empty);
                }

                for (var day = 1; day <= totalDays; day++) {
                    var cell = document.createElement('button');
                    cell.type = 'button';
                    cell.className = 'calendar-cell';
                    var dayStr = (day < 10 ? '0' : '') + day;
                    var monthStr = ((currentMonth + 1) < 10 ? '0' : '') + (currentMonth + 1);
                    var fullDateStr = currentYear + '-' + monthStr + '-' + dayStr;

                    if (fullDateStr === selectedDate) {
                        cell.classList.add('is-selected');
                    }
                    if (currentYear === 2026 && currentMonth === 9 && day === 25) {
                        cell.classList.add('is-today');
                    }

                    var numSpan = document.createElement('span');
                    numSpan.textContent = String(day);
                    cell.appendChild(numSpan);

                    var dayEvents = deadlines.filter(function (item) {
                        if (item.date !== fullDateStr) return false;
                        if (!matchesType(item.type, activeType)) return false;
                        if (activeCohort !== 'all' && !item.cohort.includes(activeCohort)) return false;
                        return true;
                    });
                    var dayAnnouncements = announcements.filter(function (item) {
                        return item.date === fullDateStr;
                    });

                    if (dayEvents.length > 0) {
                        if (dayEvents.length === 1) {
                            var evType = dayEvents[0].type;
                            if (evType === 'exam') cell.classList.add('has-exam');
                            else if (evType === 'ia') cell.classList.add('has-ia');
                            else if (evType === 'project' || evType === 'other') cell.classList.add('has-other');
                            else if (evType === 'announcement' || evType === 'seminar') cell.classList.add('has-announcement');
                        } else {
                            cell.classList.add('has-multiple');
                        }
                    } else if (dayAnnouncements.length > 0 && (activeType === 'all' || activeType === 'announcement')) {
                        cell.classList.add('has-announcement');
                    }

                    (function (dStr) {
                        cell.addEventListener('click', function () {
                            if (selectedDate === dStr) {
                                selectedDate = null;
                                if (activeDateIndicator) {
                                    activeDateIndicator.style.display = 'none';
                                    activeDateIndicator.textContent = '';
                                }
                            } else {
                                selectedDate = dStr;
                                if (activeDateIndicator) {
                                    activeDateIndicator.style.display = 'inline-block';
                                    activeDateIndicator.textContent = 'Filtered: ' + dStr;
                                }
                            }
                            renderCalendar();
                            renderContent();
                        });
                    })(fullDateStr);

                    daysGrid.appendChild(cell);
                }
            }

            window.openDetailsModal = function (itemId) {
                var item = deadlines.find(function (d) { return d.id === itemId; });
                if (!item) return;

                modalTitle.textContent = item.title;
                modalTypeBadge.className = getBadgeClass(item.type);
                modalTypeBadge.textContent = item.typeName || 'Deliverable';
                modalCohortBadge.textContent = getCohortDisplay(item.cohort);

                var cd = formatCountdown(item.date);
                modalCountdownPill.className = 'deadline-countdown-pill' + (cd.overdue ? ' is-overdue' : (cd.warning ? ' is-urgent' : ''));
                modalCountdownPill.textContent = cd.text;

                modalMetaRow.textContent = 'Due ' + item.date + ' at ' + item.time + ' (Dubai Time) • Weight: ' + item.weight;
                modalDescription.textContent = item.description;

                modalTopicsGrid.innerHTML = '';
                if (item.topics && item.topics.length > 0) {
                    item.topics.forEach(function (topic) {
                        var chip = document.createElement('a');
                        chip.className = 'topic-chip';
                        chip.href = topic.link;
                        chip.innerHTML = '<span class="topic-code-badge">' + topic.code + '</span><span>' + topic.name + '</span>';
                        modalTopicsGrid.appendChild(chip);
                    });
                    document.getElementById('modal-topics-section').hidden = false;
                } else {
                    document.getElementById('modal-topics-section').hidden = true;
                }

                modalDeliverablesText.textContent = item.deliverables || 'Standard classroom submission.';

                modalResourcesList.innerHTML = '';
                if (item.resources && item.resources.length > 0) {
                    item.resources.forEach(function (res) {
                        var a = document.createElement('a');
                        a.href = res.url;
                        a.className = 'btn btn-sm';
                        a.innerHTML = '<span>' + res.title + '</span><span class="arrow" aria-hidden="true">&rarr;</span>';
                        modalResourcesList.appendChild(a);
                    });
                    document.getElementById('modal-resources-section').hidden = false;
                } else {
                    document.getElementById('modal-resources-section').hidden = true;
                }

                modalOverlay.hidden = false;
                setTimeout(function () { modalOverlay.classList.add('is-open'); }, 10);
            };

            function closeModal() {
                modalOverlay.classList.remove('is-open');
                setTimeout(function () { modalOverlay.hidden = true; }, 200);
            }

            modalCloseBtn.addEventListener('click', closeModal);
            modalOverlay.addEventListener('click', function (e) {
                if (e.target === modalOverlay) closeModal();
            });
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && modalOverlay.classList.contains('is-open')) {
                    closeModal();
                }
            });

            function createDeadlineCard(item) {
                var card = document.createElement('article');
                card.className = 'deadline-card-minimal';
                card.id = item.id;
                card.setAttribute('data-deadline-id', item.id);
                var cd = formatCountdown(item.date);
                if (cd.warning) card.classList.add('is-urgent');
                if (cd.overdue) card.classList.add('is-overdue');

                var topBar = document.createElement('div');
                topBar.className = 'card-top-bar';

                var metaGroup = document.createElement('div');
                metaGroup.className = 'card-top-meta';
                metaGroup.innerHTML =
                    '<span class="' + getBadgeClass(item.type) + '">' + (item.typeName || 'Deliverable') + '</span>' +
                    '<span class="pill-cohort-tag">' + getCohortDisplay(item.cohort) + '</span>';

                var cdPill = document.createElement('span');
                cdPill.className = 'deadline-countdown-pill' + (cd.overdue ? ' is-overdue' : (cd.warning ? ' is-urgent' : ''));
                cdPill.textContent = cd.text;
                cdPill.setAttribute('title', 'Due: ' + item.date + ' at ' + item.time + ' (Dubai Time)');

                topBar.appendChild(metaGroup);
                topBar.appendChild(cdPill);
                card.appendChild(topBar);

                var titleH3 = document.createElement('h3');
                titleH3.className = 'deadline-title-clean';
                titleH3.textContent = item.title;
                card.appendChild(titleH3);

                var subline = document.createElement('p');
                subline.className = 'card-subline';
                subline.innerHTML = '<strong>Weight:</strong> ' + item.weight;
                card.appendChild(subline);

                var desc = document.createElement('p');
                desc.className = 'card-desc-clean';
                desc.textContent = item.description;
                card.appendChild(desc);

                var foot = document.createElement('div');
                foot.className = 'card-foot-clean';

                var topicCount = item.topics ? item.topics.length : 0;
                var topicSummary = document.createElement('span');
                topicSummary.style.fontSize = '0.78rem';
                topicSummary.style.color = 'var(--text-3)';
                topicSummary.style.fontFamily = 'var(--font-mono)';
                topicSummary.textContent = topicCount + ' syllabus topic' + (topicCount === 1 ? '' : 's');

                var moreBtn = document.createElement('button');
                moreBtn.type = 'button';
                moreBtn.className = 'btn-details';
                moreBtn.innerHTML = '<span>Details &amp; Topics</span><span class="arrow" aria-hidden="true">&rarr;</span>';
                moreBtn.addEventListener('click', function () {
                    openDetailsModal(item.id);
                });

                foot.appendChild(topicSummary);
                foot.appendChild(moreBtn);
                card.appendChild(foot);

                return card;
            }

            function createAnnouncementCard(a) {
                var art = document.createElement('article');
                art.className = 'deadline-card-minimal';

                var topBar = document.createElement('div');
                topBar.className = 'card-top-bar';

                var cd = formatCountdown(a.date);
                if (cd.warning) art.classList.add('is-urgent');
                if (cd.overdue) art.classList.add('is-overdue');

                topBar.innerHTML =
                    '<div class="card-top-meta">' +
                        '<span class="badge-seminar">' + (a.category || 'Notice') + '</span>' +
                        '<span class="pill-cohort-tag">Faculty Notice</span>' +
                    '</div>' +
                    '<span class="deadline-countdown-pill' + (cd.overdue ? ' is-overdue' : '') + '" style="cursor:default;" title="Published: ' + a.date + '">' + (cd.overdue ? a.date + ' (Past)' : a.date) + '</span>';

                var h3 = document.createElement('h3');
                h3.className = 'deadline-title-clean';
                h3.textContent = a.title;

                var p = document.createElement('p');
                p.className = 'card-desc-clean';
                p.textContent = a.description || a.content || '';

                art.appendChild(topBar);
                art.appendChild(h3);
                art.appendChild(p);

                if (a.driveLink) {
                    var foot = document.createElement('div');
                    foot.className = 'card-foot-clean';
                    var linkA = document.createElement('a');
                    var cleanHref = /^https?:\/\//i.test(a.driveLink)
                        ? a.driveLink
                        : a.driveLink.replace(/^pages\//, '').replace(/^\.?\//, '');
                    if (/^https?:\/\//i.test(a.driveLink)) {
                        linkA.target = '_blank';
                        linkA.rel = 'noopener';
                    }
                    linkA.href = cleanHref;
                    linkA.className = 'btn-details';
                    linkA.style.textDecoration = 'none';
                    linkA.innerHTML = '<span>Open Resource</span><span class="arrow" aria-hidden="true">&rarr;</span>';
                    foot.appendChild(document.createElement('span'));
                    foot.appendChild(linkA);
                    art.appendChild(foot);
                }

                return art;
            }

            function getFilteredDeadlines() {
                var activeMonthPrefix = currentYear + '-' + ((currentMonth + 1) < 10 ? '0' : '') + (currentMonth + 1);
                return deadlines.filter(function (item) {
                    if (!matchesType(item.type, activeType)) return false;
                    if (activeCohort !== 'all' && !item.cohort.includes(activeCohort)) return false;

                    if (selectedDate) {
                        if (item.date !== selectedDate) return false;
                    } else if (filterByActiveMonth) {
                        if (!item.date.startsWith(activeMonthPrefix)) return false;
                    }

                    if (searchQuery) {
                        var q = searchQuery.toLowerCase();
                        var matchTitle = item.title.toLowerCase().indexOf(q) !== -1;
                        var matchDesc = (item.description || '').toLowerCase().indexOf(q) !== -1;
                        var matchTopics = item.topics && item.topics.some(function (t) {
                            return t.name.toLowerCase().indexOf(q) !== -1 || t.code.toLowerCase().indexOf(q) !== -1;
                        });
                        if (!matchTitle && !matchDesc && !matchTopics) return false;
                    }
                    return true;
                });
            }

            function getFilteredAnnouncements() {
                var activeMonthPrefix = currentYear + '-' + ((currentMonth + 1) < 10 ? '0' : '') + (currentMonth + 1);
                if (activeType !== 'all' && activeType !== 'announcement') return [];

                return announcements.filter(function (item) {
                    if (selectedDate) {
                        if (item.date !== selectedDate) return false;
                    } else if (filterByActiveMonth) {
                        if (item.date && !item.date.startsWith(activeMonthPrefix)) return false;
                    }

                    if (searchQuery) {
                        var q = searchQuery.toLowerCase();
                        var matchTitle = (item.title || '').toLowerCase().indexOf(q) !== -1;
                        var matchDesc = (item.description || item.content || '').toLowerCase().indexOf(q) !== -1;
                        if (!matchTitle && !matchDesc) return false;
                    }
                    return true;
                });
            }

            function updateResultsHeader(count) {
                if (toggleAllMonthsBtn) {
                    toggleAllMonthsBtn.innerHTML = filterByActiveMonth
                        ? '<span>View All Months</span>'
                        : '<span>Filter: ' + monthNames[currentMonth] + '</span>';
                }

                var countText = 'Showing ' + count;
                if (selectedDate) {
                    countText += ' on ' + selectedDate;
                } else if (filterByActiveMonth) {
                    countText += ' in ' + monthNames[currentMonth] + ' ' + currentYear;
                } else {
                    countText += ' (All Months)';
                }
                resultsCount.textContent = countText;
            }

            function renderAll() {
                containerAll.innerHTML = '';
                var filteredD = getFilteredDeadlines();
                var filteredA = getFilteredAnnouncements();
                var total = filteredD.length + filteredA.length;

                updateResultsHeader(total);

                if (total === 0) {
                    var emptyDiv = document.createElement('div');
                    emptyDiv.className = 'panel';
                    emptyDiv.style.textAlign = 'center';
                    emptyDiv.style.padding = '36px 20px';
                    emptyDiv.innerHTML =
                        '<h3 class="h2" style="margin-bottom:6px;">No items found</h3>' +
                        '<p class="sub" style="margin-bottom:14px;">' +
                        (filterByActiveMonth ? 'No deliverables or announcements for ' + monthNames[currentMonth] + ' ' + currentYear + ' with active filters.' : 'Try adjusting your search or filters.') +
                        '</p>' +
                        (filterByActiveMonth ? '<button type="button" class="btn btn-sm" id="empty-all-view-all-btn"><span>View All Months</span><span class="arrow">&rarr;</span></button>' : '');
                    containerAll.appendChild(emptyDiv);

                    var emptyBtn = document.getElementById('empty-all-view-all-btn');
                    if (emptyBtn) {
                        emptyBtn.addEventListener('click', function () {
                            filterByActiveMonth = false;
                            renderContent();
                        });
                    }
                    return;
                }

                var combined = [];
                filteredD.forEach(function (d) { combined.push({ kind: 'deadline', date: d.date, data: d }); });
                filteredA.forEach(function (a) { combined.push({ kind: 'announcement', date: a.date, data: a }); });
                combined.sort(function (a, b) { return a.date.localeCompare(b.date); });

                combined.forEach(function (entry) {
                    if (entry.kind === 'deadline') {
                        containerAll.appendChild(createDeadlineCard(entry.data));
                    } else {
                        containerAll.appendChild(createAnnouncementCard(entry.data));
                    }
                });
            }

            function renderDeadlines() {
                containerDeadlines.innerHTML = '';
                var filtered = getFilteredDeadlines();

                updateResultsHeader(filtered.length);

                if (filtered.length === 0) {
                    var emptyDiv = document.createElement('div');
                    emptyDiv.className = 'panel';
                    emptyDiv.style.textAlign = 'center';
                    emptyDiv.style.padding = '36px 20px';
                    emptyDiv.innerHTML =
                        '<h3 class="h2" style="margin-bottom:6px;">No deadlines found</h3>' +
                        '<p class="sub" style="margin-bottom:14px;">' +
                        (filterByActiveMonth ? 'No deliverables scheduled for ' + monthNames[currentMonth] + ' ' + currentYear + ' with active filters.' : 'Try adjusting your search or filters.') +
                        '</p>' +
                        (filterByActiveMonth ? '<button type="button" class="btn btn-sm" id="empty-view-all-btn"><span>View All Months</span><span class="arrow">&rarr;</span></button>' : '');
                    containerDeadlines.appendChild(emptyDiv);

                    var emptyBtn = document.getElementById('empty-view-all-btn');
                    if (emptyBtn) {
                        emptyBtn.addEventListener('click', function () {
                            filterByActiveMonth = false;
                            renderContent();
                        });
                    }
                    return;
                }

                filtered.forEach(function (item) {
                    containerDeadlines.appendChild(createDeadlineCard(item));
                });
            }

            function renderAnnouncements() {
                containerAnnouncements.innerHTML = '';
                var filtered = getFilteredAnnouncements();

                updateResultsHeader(filtered.length);

                if (filtered.length === 0) {
                    var emptyDiv = document.createElement('div');
                    emptyDiv.className = 'panel';
                    emptyDiv.style.textAlign = 'center';
                    emptyDiv.style.padding = '36px 20px';
                    emptyDiv.innerHTML =
                        '<h3 class="h2" style="margin-bottom:6px;">No announcements found</h3>' +
                        '<p class="sub" style="margin-bottom:14px;">' +
                        (filterByActiveMonth ? 'No faculty bulletins published for ' + monthNames[currentMonth] + ' ' + currentYear + '.' : 'Check back later for new bulletins.') +
                        '</p>' +
                        (filterByActiveMonth ? '<button type="button" class="btn btn-sm" id="empty-ann-view-all-btn"><span>View All Months</span><span class="arrow">&rarr;</span></button>' : '');
                    containerAnnouncements.appendChild(emptyDiv);

                    var emptyAnnBtn = document.getElementById('empty-ann-view-all-btn');
                    if (emptyAnnBtn) {
                        emptyAnnBtn.addEventListener('click', function () {
                            filterByActiveMonth = false;
                            renderContent();
                        });
                    }
                    return;
                }

                filtered.forEach(function (a) {
                    containerAnnouncements.appendChild(createAnnouncementCard(a));
                });
            }

            function renderContent() {
                btnViewAll.classList.toggle('active', activeView === 'all');
                btnViewAll.classList.toggle('is-active', activeView === 'all');
                btnViewAll.setAttribute('aria-selected', activeView === 'all' ? 'true' : 'false');
                btnViewDeadlines.classList.toggle('active', activeView === 'deadlines');
                btnViewDeadlines.classList.toggle('is-active', activeView === 'deadlines');
                btnViewDeadlines.setAttribute('aria-selected', activeView === 'deadlines' ? 'true' : 'false');
                btnViewAnnouncements.classList.toggle('active', activeView === 'announcements');
                btnViewAnnouncements.classList.toggle('is-active', activeView === 'announcements');
                btnViewAnnouncements.setAttribute('aria-selected', activeView === 'announcements' ? 'true' : 'false');

                var badgeAll = document.getElementById('badge-all-count');
                var badgeDl = document.getElementById('badge-deadlines-count');
                var badgeAnn = document.getElementById('badge-announcements-count');
                if (badgeAll) badgeAll.textContent = String(deadlines.length + announcements.length);
                if (badgeDl) badgeDl.textContent = String(deadlines.length);
                if (badgeAnn) badgeAnn.textContent = String(announcements.length);

                if (activeView === 'all') {
                    containerAll.hidden = false;
                    containerDeadlines.hidden = true;
                    containerAnnouncements.hidden = true;
                    renderAll();
                } else if (activeView === 'deadlines') {
                    containerAll.hidden = true;
                    containerDeadlines.hidden = false;
                    containerAnnouncements.hidden = true;
                    renderDeadlines();
                } else {
                    containerAll.hidden = true;
                    containerDeadlines.hidden = true;
                    containerAnnouncements.hidden = false;
                    renderAnnouncements();
                }
            }

            btnViewAll.addEventListener('click', function () {
                activeView = 'all';
                searchInput.placeholder = 'Search all deadlines and announcements';
                renderContent();
            });

            btnViewDeadlines.addEventListener('click', function () {
                activeView = 'deadlines';
                searchInput.placeholder = 'Search deadlines, exams, or topics';
                renderContent();
            });

            btnViewAnnouncements.addEventListener('click', function () {
                activeView = 'announcements';
                searchInput.placeholder = 'Search announcements';
                renderContent();
            });

            document.getElementById('cal-prev').addEventListener('click', function () {
                if (currentMonth === 0) { currentMonth = 11; currentYear--; }
                else { currentMonth--; }
                selectedDate = null;
                filterByActiveMonth = true;
                if (activeDateIndicator) {
                    activeDateIndicator.style.display = 'none';
                    activeDateIndicator.textContent = '';
                }
                if (isMonthPickerOpen) renderMonthPicker();
                renderCalendar();
                renderContent();
            });

            document.getElementById('cal-next').addEventListener('click', function () {
                if (currentMonth === 11) { currentMonth = 0; currentYear++; }
                else { currentMonth++; }
                selectedDate = null;
                filterByActiveMonth = true;
                if (activeDateIndicator) {
                    activeDateIndicator.style.display = 'none';
                    activeDateIndicator.textContent = '';
                }
                if (isMonthPickerOpen) renderMonthPicker();
                renderCalendar();
                renderContent();
            });

            if (toggleAllMonthsBtn) {
                toggleAllMonthsBtn.addEventListener('click', function () {
                    filterByActiveMonth = !filterByActiveMonth;
                    selectedDate = null;
                    if (activeDateIndicator) {
                        activeDateIndicator.style.display = 'none';
                        activeDateIndicator.textContent = '';
                    }
                    renderCalendar();
                    renderContent();
                });
            }

            document.querySelectorAll('[data-cohort]').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    document.querySelectorAll('[data-cohort]').forEach(function (b) { b.classList.remove('active'); });
                    btn.classList.add('active');
                    activeCohort = btn.getAttribute('data-cohort');
                    renderCalendar();
                    renderContent();
                });
            });

            document.querySelectorAll('[data-type]').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    document.querySelectorAll('[data-type]').forEach(function (b) { b.classList.remove('active'); });
                    btn.classList.add('active');
                    activeType = btn.getAttribute('data-type');
                    renderCalendar();
                    renderContent();
                });
            });

            document.getElementById('reset-filters-btn').addEventListener('click', function () {
                activeType = 'all';
                activeCohort = 'all';
                selectedDate = null;
                searchQuery = '';
                searchInput.value = '';
                filterByActiveMonth = true;
                if (activeDateIndicator) {
                    activeDateIndicator.style.display = 'none';
                    activeDateIndicator.textContent = '';
                }
                document.querySelectorAll('[data-cohort]').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-cohort') === 'all'); });
                document.querySelectorAll('[data-type]').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-type') === 'all'); });
                renderCalendar();
                renderContent();
            });

            searchInput.addEventListener('input', function (e) {
                searchQuery = e.target.value.trim();
                renderContent();
            });

            // Handles query parameters (?tab=, ?id=) and hash anchors (#dl-*, #deadlines, #announcements)
            function handleDeadlinesRouting() {
                var urlParams = new URLSearchParams(window.location.search);
                var tabParam = (urlParams.get('tab') || '').toLowerCase();
                var rawHash = window.location.hash.replace(/^#/, '');
                var lowerHash = rawHash.toLowerCase();

                // 1. Process Tab Selection (?tab= or #tab)
                var targetTab = tabParam || (lowerHash === 'deadlines' || lowerHash === 'announcements' || lowerHash === 'all' ? lowerHash : null);
                if (targetTab === 'deadlines' && btnViewDeadlines) {
                    btnViewDeadlines.click();
                } else if (targetTab === 'announcements' && btnViewAnnouncements) {
                    btnViewAnnouncements.click();
                } else if (targetTab === 'all' && btnViewAll) {
                    btnViewAll.click();
                }

                // 2. Process Modal Deep-Links (?id=dl-* or #dl-*)
                var targetId = urlParams.get('id');
                if (!targetId && rawHash) {
                    if (rawHash.startsWith('dl-') || deadlines.some(function (d) { return d.id === rawHash; })) {
                        targetId = rawHash;
                    }
                }

                if (targetId) {
                    var targetItem = deadlines.find(function (d) { return d.id === targetId; });
                    if (targetItem) {
                        // If deadlines tab is not active, ensure we switch to all or deadlines to show the card
                        if (activeView === 'announcements' && btnViewAll) {
                            btnViewAll.click();
                        }

                        // Align calendar month & year
                        if (targetItem.date) {
                            var p = targetItem.date.split('-');
                            if (p.length === 3) {
                                currentYear = parseInt(p[0], 10);
                                currentMonth = parseInt(p[1], 10) - 1;
                                renderCalendar();
                                renderContent();
                            }
                        }

                        // Highlight card & open modal
                        setTimeout(function () {
                            var cardEl = document.getElementById(targetId) || document.querySelector('[data-deadline-id="' + targetId + '"]');
                            if (cardEl) {
                                cardEl.classList.add('deadline-card-highlighted');
                                cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                            if (typeof window.openDetailsModal === 'function') {
                                window.openDetailsModal(targetId);
                            }
                        }, 120);
                    }
                }
            }

            Promise.all([
                fetch('../data/deadlines.json').then(function (r) { return r.json(); }).catch(function () { return fallbackDeadlines; }),
                fetch('../data/announcements.json').then(function (r) { return r.json(); }).catch(function () { return fallbackAnnouncements; })
            ]).then(function (results) {
                deadlines = results[0] && results[0].length ? results[0] : fallbackDeadlines;
                announcements = results[1] && results[1].length ? results[1] : fallbackAnnouncements;
                renderCalendar();
                renderContent();

                handleDeadlinesRouting();
            });

            window.addEventListener('hashchange', handleDeadlinesRouting);
        })();

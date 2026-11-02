(function () {
    var deadlines = [];
    var announcements = [];

    // Live system clock anchor (with fallback to Nov 2026 if outside academic year)
    var realNow = new Date();
    var todayYear = realNow.getFullYear();
    var todayMonth = realNow.getMonth();
    var todayDay = realNow.getDate();

    var currentMonth = todayMonth;
    var currentYear = todayYear;
    var selectedDate = null;
    var activeType = 'all';
    var activeCohort = 'all';
    var searchQuery = '';
    var activeView = 'all'; // 'all' | 'deadlines' | 'announcements'
    var isMonthPickerOpen = false;
    var filterByActiveMonth = true;
    var currentModalItemId = null;

    var COHORT_STORAGE_KEY = 'eis_cs_deadlines_cohort';
    var COMPLETED_STORAGE_KEY = 'eis_cs_completed_deadlines';

    // Load saved cohort & completed IDs
    var completedIds = [];
    try {
        var savedCohort = localStorage.getItem(COHORT_STORAGE_KEY);
        if (savedCohort === 'all' || savedCohort === 'Year 1' || savedCohort === 'Year 2') {
            activeCohort = savedCohort;
        }
        var rawCompleted = localStorage.getItem(COMPLETED_STORAGE_KEY);
        if (rawCompleted) {
            var parsed = JSON.parse(rawCompleted);
            if (Array.isArray(parsed)) completedIds = parsed;
        }
    } catch (e) {}

    // DOM Elements
    var containerAll = document.getElementById('all-container');
    var containerDeadlines = document.getElementById('deadlines-container');
    var containerAnnouncements = document.getElementById('announcements-container');
    var upNextBanner = document.getElementById('up-next-banner');
    var resultsCount = document.getElementById('results-count');
    var activeDateIndicator = document.getElementById('active-date-indicator');
    var completionSummaryPill = document.getElementById('completion-summary-pill');
    var toggleAllMonthsBtn = document.getElementById('toggle-all-months-btn');
    var monthLabel = document.getElementById('calendar-month-label');
    var daysGrid = document.getElementById('calendar-days-grid');
    var calendarDaysContainer = document.getElementById('calendar-days-container');
    var calendarMonthsContainer = document.getElementById('calendar-months-container');
    var calToggleMonthsBtn = document.getElementById('cal-toggle-months');
    var calTodayBtn = document.getElementById('cal-today');
    var searchInput = document.getElementById('content-search');
    var exportIcalBtn = document.getElementById('export-ical-btn');
    var exportIcalLabel = document.getElementById('export-ical-label');
    var cohortSavedHint = document.getElementById('cohort-saved-hint');

    var btnViewAll = document.getElementById('view-all-btn');
    var btnViewDeadlines = document.getElementById('view-deadlines-btn');
    var btnViewAnnouncements = document.getElementById('view-announcements-btn');

    // Modal Elements
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
    var modalCompleteBtn = document.getElementById('modal-complete-btn');
    var modalCompleteLabel = document.getElementById('modal-complete-label');
    var modalSingleIcsBtn = document.getElementById('modal-single-ics-btn');

    var monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    var shortMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var shortDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    var ARROW_SVG = '<svg class="arrow" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';

    var fallbackDeadlines = (typeof window !== 'undefined' && window.DataService && typeof window.DataService.getDeadlines === 'function')
        ? window.DataService.getDeadlines()
        : [];
    var fallbackAnnouncements = (typeof window !== 'undefined' && window.DataService && typeof window.DataService.getAnnouncements === 'function')
        ? window.DataService.getAnnouncements()
        : [];

    function isCompleted(id) {
        return completedIds.indexOf(id) !== -1;
    }

    function toggleCompleted(id) {
        if (!id) return;
        var idx = completedIds.indexOf(id);
        if (idx === -1) {
            completedIds.push(id);
        } else {
            completedIds.splice(idx, 1);
        }
        try {
            localStorage.setItem(COMPLETED_STORAGE_KEY, JSON.stringify(completedIds));
        } catch (e) {}
        renderCalendar();
        renderContent();
        if (currentModalItemId === id) {
            syncModalCompleteButton(id);
        }
    }

    function parseDateParts(dateStr) {
        if (!dateStr) return null;
        var parts = dateStr.split('-');
        if (parts.length !== 3) return null;
        var y = parseInt(parts[0], 10);
        var m = parseInt(parts[1], 10) - 1;
        var d = parseInt(parts[2], 10);
        var dateObj = new Date(y, m, d);
        return {
            year: y,
            monthIndex: m,
            day: d,
            dayStr: (d < 10 ? '0' : '') + d,
            shortMonth: shortMonthNames[m] || '',
            fullMonth: monthNames[m] || '',
            dow: shortDayNames[dateObj.getDay()] || '',
            formattedShort: (shortMonthNames[m] || '') + ' ' + d + ', ' + y
        };
    }

    function formatCountdown(dateStr, itemId) {
        if (itemId && isCompleted(itemId)) {
            return { text: 'Completed', status: 'done', warning: false, overdue: false, done: true };
        }
        if (!dateStr) return { text: 'No date', status: 'normal', warning: false, overdue: false, done: false };

        var todayMidnight = new Date(todayYear, todayMonth, todayDay);
        var p = parseDateParts(dateStr);
        if (!p) return { text: dateStr, status: 'normal', warning: false, overdue: false, done: false };

        var targetMidnight = new Date(p.year, p.monthIndex, p.day);
        var diffDays = Math.round((targetMidnight - todayMidnight) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            var daysAgo = Math.abs(diffDays);
            return {
                text: daysAgo === 1 ? 'Closed yesterday' : 'Past (' + daysAgo + 'd ago)',
                status: 'overdue',
                warning: false,
                overdue: true,
                done: false
            };
        }
        if (diffDays === 0) return { text: 'Due Today', status: 'urgent', warning: true, overdue: false, done: false };
        if (diffDays === 1) return { text: 'Due Tomorrow', status: 'urgent', warning: true, overdue: false, done: false };
        if (diffDays <= 7) return { text: 'Due in ' + diffDays + ' days', status: 'urgent', warning: true, overdue: false, done: false };
        return { text: 'Due in ' + diffDays + ' days', status: 'normal', warning: false, overdue: false, done: false };
    }

    function getBadgeClass(type) {
        if (type === 'exam') return 'badge-exam';
        if (type === 'ia') return 'badge-ia';
        if (type === 'project' || type === 'other') return 'badge-other';
        return 'badge-seminar';
    }

    function getDotClass(type) {
        if (type === 'exam') return 'dot-exam';
        if (type === 'ia') return 'dot-ia';
        if (type === 'project' || type === 'other') return 'dot-other';
        return 'dot-announcement';
    }

    function getCohortDisplay(cohortStr) {
        if (!cohortStr) return 'All Years';
        if (cohortStr.indexOf('Year 1') !== -1 && cohortStr.indexOf('Year 2') === -1) {
            return cohortStr.indexOf('HL Only') !== -1 ? 'Y12 HL' : 'Y12 (SL/HL)';
        }
        if (cohortStr.indexOf('Year 2') !== -1 && cohortStr.indexOf('Year 1') === -1) {
            return cohortStr.indexOf('HL Only') !== -1 ? 'Y13 (HL Only)' : 'Y13 (SL/HL)';
        }
        return 'All Years';
    }

    function matchesType(itemType, filterType) {
        if (filterType === 'all') return true;
        if (filterType === 'exam') return itemType === 'exam';
        if (filterType === 'ia') return itemType === 'ia';
        if (filterType === 'other') return itemType === 'project' || itemType === 'other';
        if (filterType === 'announcement') return itemType === 'announcement' || itemType === 'seminar';
        return itemType === filterType;
    }

    function matchesCohort(itemCohort, filterCohort) {
        if (filterCohort === 'all' || !itemCohort) return true;
        return itemCohort.indexOf(filterCohort) !== -1;
    }

    function resolveTopicHref(topic) {
        var rawCode = (topic.code || '').replace(/\./g, '').toLowerCase();
        if (/^[ab][1-4]$/.test(rawCode)) {
            return 'curriculum.html#' + rawCode;
        }
        if (rawCode.indexOf('cs') !== -1) {
            return 'case-study.html';
        }
        if (rawCode.indexOf('crit') !== -1) {
            return 'ia.html#criteria';
        }
        return topic.link || 'resources.html';
    }

    // RFC 5545 iCalendar Generator (supports exact Dubai GST times & single/filtered export)
    function buildIcsEventLines(d) {
        var dt = (d.date || '').replace(/-/g, '');
        var timeMatch = (d.time || '').match(/(\d{1,2}):(\d{2})/);
        var dtStartLine = 'DTSTART;VALUE=DATE:' + dt;
        var dtEndLine = '';

        if (timeMatch) {
            var hh = ('0' + parseInt(timeMatch[1], 10)).slice(-2);
            var mm = timeMatch[2];
            dtStartLine = 'DTSTART;TZID=Asia/Dubai:' + dt + 'T' + hh + mm + '00';
            var endHour = Math.min(23, parseInt(timeMatch[1], 10) + 1);
            var endHh = ('0' + endHour).slice(-2);
            dtEndLine = 'DTEND;TZID=Asia/Dubai:' + dt + 'T' + endHh + mm + '00';
        }

        var descParts = [];
        if (d.cohort) descParts.push('Cohort: ' + d.cohort);
        if (d.weight) descParts.push('Weight: ' + d.weight);
        if (d.description) descParts.push(d.description);
        if (d.deliverables) descParts.push('Requirements: ' + d.deliverables);

        var lines = [
            'BEGIN:VEVENT',
            'UID:' + (d.id || Date.now()) + '@eischools.ae',
            'DTSTAMP:' + dt + 'T080000Z',
            dtStartLine
        ];
        if (dtEndLine) lines.push(dtEndLine);
        lines.push('SUMMARY:[IB CS] ' + (d.title || 'Assessment'));
        lines.push('DESCRIPTION:' + descParts.join(' | ').replace(/\r?\n/g, ' '));
        lines.push('LOCATION:' + (d.location || 'Emirates International School Meadows'));
        lines.push('END:VEVENT');
        return lines;
    }

    function triggerIcsDownload(itemsToExport, filename) {
        var icsLines = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Emirates International School//IB Computer Science//EN',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
            'X-WR-CALNAME:IB Computer Science (EIS Meadows)',
            'X-WR-TIMEZONE:Asia/Dubai'
        ];

        itemsToExport.forEach(function (d) {
            var evLines = buildIcsEventLines(d);
            evLines.forEach(function (l) { icsLines.push(l); });
        });

        icsLines.push('END:VCALENDAR');
        var blob = new Blob([icsLines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename || 'IB_Computer_Science_Deadlines_2026.ics');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    if (exportIcalBtn) {
        exportIcalBtn.addEventListener('click', function () {
            var list = deadlines.filter(function (d) {
                return matchesCohort(d.cohort, activeCohort);
            });
            var suffix = activeCohort === 'Year 1' ? '_Y12' : (activeCohort === 'Year 2' ? '_Y13' : '');
            triggerIcsDownload(list, 'IB_CS_Deadlines' + suffix + '_2026.ics');
        });
    }

    function updateExportButtonLabel() {
        if (!exportIcalLabel) return;
        if (activeCohort === 'Year 1') {
            exportIcalLabel.textContent = 'Export Y12 iCal (.ics)';
        } else if (activeCohort === 'Year 2') {
            exportIcalLabel.textContent = 'Export Y13 iCal (.ics)';
        } else {
            exportIcalLabel.textContent = 'Export iCal (.ics)';
        }
    }

    // Month Picker
    function countItemsInMonth(year, monthIndex) {
        var prefix = year + '-' + ((monthIndex + 1) < 10 ? '0' : '') + (monthIndex + 1);
        var dCount = deadlines.filter(function (d) {
            return d.date && d.date.indexOf(prefix) === 0 &&
                matchesType(d.type, activeType) &&
                matchesCohort(d.cohort, activeCohort);
        }).length;
        var aCount = (activeType === 'all' || activeType === 'announcement')
            ? announcements.filter(function (a) { return a.date && a.date.indexOf(prefix) === 0; }).length
            : 0;
        return dCount + aCount;
    }

    function renderMonthPicker() {
        calendarMonthsContainer.innerHTML = '';
        shortMonthNames.forEach(function (mName, idx) {
            var count = countItemsInMonth(currentYear, idx);
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'month-picker-btn' + (idx === currentMonth ? ' active is-active' : '');
            btn.innerHTML =
                '<span>' + mName + '</span>' +
                '<span class="month-picker-count">' + (count > 0 ? count + (count === 1 ? ' item' : ' items') : '—') + '</span>';
            btn.addEventListener('click', function () {
                currentMonth = idx;
                isMonthPickerOpen = false;
                filterByActiveMonth = true;
                clearSelectedDate();
                updateMonthPickerView();
                renderCalendar();
                renderContent();
            });
            calendarMonthsContainer.appendChild(btn);
        });
    }

    function updateMonthPickerView() {
        if (calToggleMonthsBtn) {
            calToggleMonthsBtn.setAttribute('aria-expanded', isMonthPickerOpen ? 'true' : 'false');
        }
        if (isMonthPickerOpen) {
            calendarDaysContainer.hidden = true;
            calendarMonthsContainer.hidden = false;
            renderMonthPicker();
        } else {
            calendarDaysContainer.hidden = false;
            calendarMonthsContainer.hidden = true;
        }
    }

    if (calToggleMonthsBtn) {
        calToggleMonthsBtn.addEventListener('click', function () {
            isMonthPickerOpen = !isMonthPickerOpen;
            updateMonthPickerView();
        });
    }

    function clearSelectedDate() {
        selectedDate = null;
        if (activeDateIndicator) {
            activeDateIndicator.hidden = true;
            activeDateIndicator.textContent = '';
        }
    }

    if (activeDateIndicator) {
        activeDateIndicator.addEventListener('click', function () {
            clearSelectedDate();
            renderCalendar();
            renderContent();
        });
    }

    // Render Interactive Calendar with Clean Event Dots
    function renderCalendar() {
        monthLabel.textContent = monthNames[currentMonth] + ' ' + currentYear;
        daysGrid.innerHTML = '';

        var firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
        var startCol = (firstDayIndex + 6) % 7; // Monday start
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
            if (currentYear === todayYear && currentMonth === todayMonth && day === todayDay) {
                cell.classList.add('is-today');
            }

            var numSpan = document.createElement('span');
            numSpan.className = 'calendar-cell-num';
            numSpan.textContent = String(day);
            cell.appendChild(numSpan);

            var dayEvents = deadlines.filter(function (item) {
                if (item.date !== fullDateStr) return false;
                if (!matchesType(item.type, activeType)) return false;
                if (!matchesCohort(item.cohort, activeCohort)) return false;
                return true;
            });
            var dayAnnouncements = (activeType === 'all' || activeType === 'announcement')
                ? announcements.filter(function (item) { return item.date === fullDateStr; })
                : [];

            var dotContainer = document.createElement('div');
            dotContainer.className = 'calendar-dots';

            var tooltipTitles = [];
            var dotsAdded = 0;

            dayEvents.forEach(function (ev) {
                tooltipTitles.push(ev.title);
                if (dotsAdded < 3) {
                    var dot = document.createElement('span');
                    dot.className = 'cal-dot ' + getDotClass(ev.type);
                    dotContainer.appendChild(dot);
                    dotsAdded++;
                }
            });

            dayAnnouncements.forEach(function (ann) {
                tooltipTitles.push('Notice: ' + ann.title);
                if (dotsAdded < 3) {
                    var dot = document.createElement('span');
                    dot.className = 'cal-dot dot-announcement';
                    dotContainer.appendChild(dot);
                    dotsAdded++;
                }
            });

            if (tooltipTitles.length > 0) {
                cell.classList.add('has-events');
                cell.setAttribute('title', tooltipTitles.join('\n'));
            }

            cell.appendChild(dotContainer);

            (function (dStr) {
                cell.addEventListener('click', function () {
                    if (selectedDate === dStr) {
                        clearSelectedDate();
                    } else {
                        selectedDate = dStr;
                        var parsed = parseDateParts(dStr);
                        if (activeDateIndicator) {
                            activeDateIndicator.hidden = false;
                            activeDateIndicator.innerHTML = '<span>Date: ' + (parsed ? parsed.formattedShort : dStr) + ' &times;</span>';
                        }
                    }
                    renderCalendar();
                    renderContent();
                });
            })(fullDateStr);

            daysGrid.appendChild(cell);
        }
    }

    // Modal Details Dialog
    function syncModalCompleteButton(itemId) {
        if (!modalCompleteBtn || !modalCompleteLabel) return;
        var done = isCompleted(itemId);
        modalCompleteBtn.classList.toggle('is-completed', done);
        modalCompleteLabel.textContent = done ? 'Completed (Click to Undo)' : 'Mark as Completed';
    }

    window.openDetailsModal = function (itemId) {
        var item = deadlines.find(function (d) { return d.id === itemId; });
        if (!item) return;
        currentModalItemId = itemId;

        modalTitle.textContent = item.title;
        modalTypeBadge.className = getBadgeClass(item.type);
        modalTypeBadge.textContent = item.typeName || 'Deliverable';
        modalCohortBadge.textContent = getCohortDisplay(item.cohort);

        var cd = formatCountdown(item.date, item.id);
        modalCountdownPill.className = 'deadline-countdown-pill' +
            (cd.done ? ' is-done' : (cd.overdue ? ' is-overdue' : (cd.warning ? ' is-urgent' : '')));
        modalCountdownPill.textContent = cd.text;

        var p = parseDateParts(item.date);
        var formattedDate = p ? (p.dow + ', ' + p.formattedShort) : item.date;

        modalMetaRow.innerHTML =
            '<div class="modal-spec-item">' +
                '<span class="modal-spec-label">Date &amp; Time</span>' +
                '<span class="modal-spec-value">' + formattedDate + ' &bull; ' + (item.time || 'TBA') + '</span>' +
            '</div>' +
            '<div class="modal-spec-item">' +
                '<span class="modal-spec-label">Location / Format</span>' +
                '<span class="modal-spec-value">' + (item.location || 'Classroom Submission') + '</span>' +
            '</div>' +
            '<div class="modal-spec-item">' +
                '<span class="modal-spec-label">Assessment Weight</span>' +
                '<span class="modal-spec-value">' + (item.weight || 'Coursework') + '</span>' +
            '</div>';

        modalDescription.textContent = item.description;

        modalTopicsGrid.innerHTML = '';
        if (item.topics && item.topics.length > 0) {
            item.topics.forEach(function (topic) {
                var chip = document.createElement('a');
                chip.className = 'topic-chip';
                chip.href = resolveTopicHref(topic);
                chip.title = 'Explore ' + topic.code + ' in Syllabus';
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
                a.innerHTML = '<span>' + res.title + '</span>' + ARROW_SVG;
                modalResourcesList.appendChild(a);
            });
            document.getElementById('modal-resources-section').hidden = false;
        } else {
            document.getElementById('modal-resources-section').hidden = true;
        }

        syncModalCompleteButton(item.id);

        modalOverlay.hidden = false;
        setTimeout(function () { modalOverlay.classList.add('is-open'); }, 10);
    };

    if (modalCompleteBtn) {
        modalCompleteBtn.addEventListener('click', function () {
            if (currentModalItemId) {
                toggleCompleted(currentModalItemId);
                var item = deadlines.find(function (d) { return d.id === currentModalItemId; });
                if (item) {
                    var cd = formatCountdown(item.date, item.id);
                    modalCountdownPill.className = 'deadline-countdown-pill' +
                        (cd.done ? ' is-done' : (cd.overdue ? ' is-overdue' : (cd.warning ? ' is-urgent' : '')));
                    modalCountdownPill.textContent = cd.text;
                }
            }
        });
    }

    if (modalSingleIcsBtn) {
        modalSingleIcsBtn.addEventListener('click', function () {
            if (!currentModalItemId) return;
            var item = deadlines.find(function (d) { return d.id === currentModalItemId; });
            if (item) {
                triggerIcsDownload([item], (item.id || 'deadline') + '_IB_CS.ics');
            }
        });
    }

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

    // Up Next Spotlight Banner
    function renderUpNextBanner() {
        if (!upNextBanner) return;
        if (activeView === 'announcements') {
            upNextBanner.hidden = true;
            return;
        }

        var todayIso = todayYear + '-' + ((todayMonth + 1) < 10 ? '0' : '') + (todayMonth + 1) + '-' + (todayDay < 10 ? '0' : '') + todayDay;
        var upcoming = deadlines
            .filter(function (d) {
                if (!d.date || d.date < todayIso) return false;
                if (isCompleted(d.id)) return false;
                if (!matchesCohort(d.cohort, activeCohort)) return false;
                return true;
            })
            .sort(function (a, b) { return a.date.localeCompare(b.date); });

        if (upcoming.length === 0) {
            upNextBanner.hidden = true;
            return;
        }

        var nextItem = upcoming[0];
        var cd = formatCountdown(nextItem.date, nextItem.id);
        var p = parseDateParts(nextItem.date);
        var dateLabel = p ? (p.dow + ', ' + p.shortMonth + ' ' + p.day) : nextItem.date;

        upNextBanner.hidden = false;
        upNextBanner.innerHTML =
            '<div class="up-next-left">' +
                '<div class="up-next-eyebrow">' +
                    '<span class="up-next-pulse" aria-hidden="true"></span>' +
                    '<span>Next Milestone &bull; ' + cd.text + '</span>' +
                '</div>' +
                '<h2 class="up-next-title">' + nextItem.title + '</h2>' +
                '<div class="up-next-meta">' +
                    dateLabel + ' at ' + (nextItem.time || 'TBA') + ' &bull; ' + (nextItem.location || 'EIS Meadows') + ' &bull; ' + getCohortDisplay(nextItem.cohort) +
                '</div>' +
            '</div>' +
            '<div class="up-next-actions">' +
                '<button type="button" class="btn-up-next" data-open-id="' + nextItem.id + '">' +
                    '<span>View Specs</span>' +
                    ARROW_SVG +
                '</button>' +
            '</div>';

        var openBtn = upNextBanner.querySelector('[data-open-id]');
        if (openBtn) {
            openBtn.addEventListener('click', function () {
                window.openDetailsModal(nextItem.id);
            });
        }
    }

    // Create Editorial 2-Column Deadline Card
    function createDeadlineCard(item) {
        var card = document.createElement('article');
        card.className = 'deadline-card-minimal';
        card.id = item.id;
        card.setAttribute('data-deadline-id', item.id);

        var cd = formatCountdown(item.date, item.id);
        if (cd.warning) card.classList.add('is-urgent');
        if (cd.overdue) card.classList.add('is-overdue');
        if (cd.done) card.classList.add('is-completed');

        var p = parseDateParts(item.date) || { shortMonth: 'TBA', dayStr: '--', dow: '---', formattedShort: item.date };

        // Left Column: Date Block
        var dateBlock = document.createElement('div');
        dateBlock.className = 'card-date-block';
        dateBlock.innerHTML =
            '<span class="date-block-month">' + p.shortMonth + '</span>' +
            '<span class="date-block-day">' + p.dayStr + '</span>' +
            '<span class="date-block-dow">' + p.dow + '</span>';
        card.appendChild(dateBlock);

        // Right Column: Content Body
        var bodyCol = document.createElement('div');
        bodyCol.className = 'card-body-col';

        // Top Row: Badges + Countdown & Check Button
        var headerRow = document.createElement('div');
        headerRow.className = 'card-header-row';

        var metaGroup = document.createElement('div');
        metaGroup.className = 'card-top-meta';
        metaGroup.innerHTML =
            '<span class="' + getBadgeClass(item.type) + '">' + (item.typeName || 'Deliverable') + '</span>' +
            '<span class="pill-cohort-tag">' + getCohortDisplay(item.cohort) + '</span>';

        var statusActions = document.createElement('div');
        statusActions.className = 'card-status-actions';

        var cdPill = document.createElement('span');
        cdPill.className = 'deadline-countdown-pill' +
            (cd.done ? ' is-done' : (cd.overdue ? ' is-overdue' : (cd.warning ? ' is-urgent' : '')));
        cdPill.textContent = cd.text;

        var checkBtn = document.createElement('button');
        checkBtn.type = 'button';
        checkBtn.className = 'btn-check-complete' + (cd.done ? ' is-checked' : '');
        checkBtn.setAttribute('aria-label', cd.done ? 'Mark as incomplete' : 'Mark as completed');
        checkBtn.setAttribute('title', cd.done ? 'Completed (Click to undo)' : 'Mark milestone as completed');
        checkBtn.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        checkBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleCompleted(item.id);
        });

        statusActions.appendChild(cdPill);
        statusActions.appendChild(checkBtn);
        headerRow.appendChild(metaGroup);
        headerRow.appendChild(statusActions);
        bodyCol.appendChild(headerRow);

        // Title
        var titleH3 = document.createElement('h3');
        titleH3.className = 'deadline-title-clean';
        titleH3.textContent = item.title;
        titleH3.addEventListener('click', function () {
            window.openDetailsModal(item.id);
        });
        bodyCol.appendChild(titleH3);

        // Scannable Specs Strip (Time, Location, Weight visible immediately)
        var specsStrip = document.createElement('div');
        specsStrip.className = 'card-specs-strip';
        specsStrip.innerHTML =
            '<span class="spec-item">' +
                '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>' +
                '<span>' + (item.time || 'TBA') + '</span>' +
            '</span>' +
            (item.location ? (
                '<span class="spec-item">' +
                    '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>' +
                    '<span>' + item.location + '</span>' +
                '</span>'
            ) : '') +
            (item.weight ? (
                '<span class="spec-item">' +
                    '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>' +
                    '<span>' + item.weight + '</span>' +
                '</span>'
            ) : '');
        bodyCol.appendChild(specsStrip);

        // Description
        var desc = document.createElement('p');
        desc.className = 'card-desc-clean';
        desc.textContent = item.description;
        bodyCol.appendChild(desc);

        // Footer: Inline Syllabus Topic Chips + Details Button
        var foot = document.createElement('div');
        foot.className = 'card-foot-clean';

        var topicsWrap = document.createElement('div');
        topicsWrap.className = 'card-topics-preview';
        var topics = item.topics || [];
        var maxPreview = 3;

        topics.slice(0, maxPreview).forEach(function (topic) {
            var chip = document.createElement('a');
            chip.className = 'topic-chip';
            chip.href = resolveTopicHref(topic);
            chip.title = topic.code + ': ' + topic.name;
            var shortName = topic.name.length > 28 ? topic.name.slice(0, 26) + '…' : topic.name;
            chip.innerHTML = '<span class="topic-code-badge">' + topic.code + '</span><span>' + shortName + '</span>';
            topicsWrap.appendChild(chip);
        });

        if (topics.length > maxPreview) {
            var moreSpan = document.createElement('span');
            moreSpan.className = 'topic-chip-more';
            moreSpan.textContent = '+' + (topics.length - maxPreview) + ' more';
            topicsWrap.appendChild(moreSpan);
        }

        var moreBtn = document.createElement('button');
        moreBtn.type = 'button';
        moreBtn.className = 'btn-details';
        moreBtn.innerHTML = '<span>Specs &amp; Materials</span>' + ARROW_SVG;
        moreBtn.addEventListener('click', function () {
            window.openDetailsModal(item.id);
        });

        foot.appendChild(topicsWrap);
        foot.appendChild(moreBtn);
        bodyCol.appendChild(foot);

        card.appendChild(bodyCol);
        return card;
    }

    // Create Editorial Faculty Bulletin Card
    function createAnnouncementCard(a) {
        var art = document.createElement('article');
        art.className = 'announcement-card';
        if (a.id) art.id = a.id;

        var p = parseDateParts(a.date);
        var pubDate = p ? ('Published ' + p.formattedShort) : (a.date || '');

        var header = document.createElement('div');
        header.className = 'announcement-header';
        header.innerHTML =
            '<div class="card-top-meta">' +
                '<span class="badge-seminar">' +
                    '<svg class="badge-icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>' +
                    '<span>' + (a.category || 'Faculty Bulletin') + '</span>' +
                '</span>' +
                '<span class="pill-cohort-tag">Department Notice</span>' +
            '</div>' +
            '<span class="announcement-date">' + pubDate + '</span>';

        var h3 = document.createElement('h3');
        h3.className = 'announcement-title';
        h3.textContent = a.title;

        var desc = document.createElement('p');
        desc.className = 'card-desc-clean';
        desc.textContent = a.description || a.content || '';

        art.appendChild(header);
        art.appendChild(h3);
        art.appendChild(desc);

        if (a.driveLink) {
            var foot = document.createElement('div');
            foot.className = 'announcement-foot';
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
            linkA.innerHTML = '<span>Open Resource</span>' + ARROW_SVG;
            foot.appendChild(linkA);
            art.appendChild(foot);
        }

        return art;
    }

    // Filtering
    function getFilteredDeadlines(ignoreViewScope) {
        var activeMonthPrefix = currentYear + '-' + ((currentMonth + 1) < 10 ? '0' : '') + (currentMonth + 1);
        return deadlines.filter(function (item) {
            if (!matchesType(item.type, activeType)) return false;
            if (!matchesCohort(item.cohort, activeCohort)) return false;

            if (!ignoreViewScope) {
                if (selectedDate) {
                    if (item.date !== selectedDate) return false;
                } else if (filterByActiveMonth) {
                    if (!item.date || item.date.indexOf(activeMonthPrefix) !== 0) return false;
                }
            }

            if (searchQuery) {
                var q = searchQuery.toLowerCase();
                var matchTitle = (item.title || '').toLowerCase().indexOf(q) !== -1;
                var matchDesc = (item.description || '').toLowerCase().indexOf(q) !== -1;
                var matchLoc = (item.location || '').toLowerCase().indexOf(q) !== -1;
                var matchTopics = item.topics && item.topics.some(function (t) {
                    return t.name.toLowerCase().indexOf(q) !== -1 || t.code.toLowerCase().indexOf(q) !== -1;
                });
                if (!matchTitle && !matchDesc && !matchLoc && !matchTopics) return false;
            }
            return true;
        });
    }

    function getFilteredAnnouncements(ignoreViewScope) {
        var activeMonthPrefix = currentYear + '-' + ((currentMonth + 1) < 10 ? '0' : '') + (currentMonth + 1);
        if (activeType !== 'all' && activeType !== 'announcement') return [];

        return announcements.filter(function (item) {
            if (!ignoreViewScope) {
                if (selectedDate) {
                    if (item.date !== selectedDate) return false;
                } else if (filterByActiveMonth) {
                    if (item.date && item.date.indexOf(activeMonthPrefix) !== 0) return false;
                }
            }

            if (searchQuery) {
                var q = searchQuery.toLowerCase();
                var matchTitle = (item.title || '').toLowerCase().indexOf(q) !== -1;
                var matchDesc = (item.description || item.content || '').toLowerCase().indexOf(q) !== -1;
                var matchCat = (item.category || '').toLowerCase().indexOf(q) !== -1;
                if (!matchTitle && !matchDesc && !matchCat) return false;
            }
            return true;
        });
    }

    function updateResultsHeader(count) {
        if (toggleAllMonthsBtn) {
            toggleAllMonthsBtn.classList.toggle('is-active', !filterByActiveMonth && !selectedDate);
            toggleAllMonthsBtn.innerHTML = filterByActiveMonth
                ? '<span>View All Months</span>'
                : '<span>Filter: ' + monthNames[currentMonth] + ' Only</span>';
        }

        var countText = 'Showing ' + count + (count === 1 ? ' item' : ' items');
        if (selectedDate) {
            var p = parseDateParts(selectedDate);
            countText += ' on ' + (p ? p.formattedShort : selectedDate);
        } else if (filterByActiveMonth) {
            countText += ' in ' + monthNames[currentMonth] + ' ' + currentYear;
        } else {
            countText += ' across all months';
        }
        resultsCount.textContent = countText;

        if (completionSummaryPill) {
            var cohortDeadlines = deadlines.filter(function (d) { return matchesCohort(d.cohort, activeCohort); });
            var doneCount = cohortDeadlines.filter(function (d) { return isCompleted(d.id); }).length;
            if (doneCount > 0) {
                completionSummaryPill.hidden = false;
                completionSummaryPill.innerHTML = '<span class="completion-pill">&#10003; ' + doneCount + ' / ' + cohortDeadlines.length + ' completed</span>';
            } else {
                completionSummaryPill.hidden = true;
            }
        }
    }

    // Group entries by YYYY-MM when showing multiple months
    function renderGroupedEntries(container, entries) {
        if (filterByActiveMonth || selectedDate) {
            entries.forEach(function (entry) {
                container.appendChild(entry.kind === 'deadline' ? createDeadlineCard(entry.data) : createAnnouncementCard(entry.data));
            });
            return;
        }

        var groups = {};
        var groupOrder = [];
        entries.forEach(function (entry) {
            var ym = (entry.date || '').slice(0, 7) || 'Unknown';
            if (!groups[ym]) {
                groups[ym] = [];
                groupOrder.push(ym);
            }
            groups[ym].push(entry);
        });

        groupOrder.forEach(function (ym) {
            var section = document.createElement('div');
            section.className = 'month-group-section';

            var parts = ym.split('-');
            var label = ym;
            if (parts.length === 2) {
                var mIdx = parseInt(parts[1], 10) - 1;
                label = (monthNames[mIdx] || ym) + ' ' + parts[0];
            }

            var groupItems = groups[ym];
            var header = document.createElement('div');
            header.className = 'month-group-header';
            header.innerHTML =
                '<h3 class="month-group-title">' + label + '</h3>' +
                '<span class="month-group-line"></span>' +
                '<span class="month-group-count">' + groupItems.length + (groupItems.length === 1 ? ' item' : ' items') + '</span>';
            section.appendChild(header);

            groupItems.forEach(function (entry) {
                section.appendChild(entry.kind === 'deadline' ? createDeadlineCard(entry.data) : createAnnouncementCard(entry.data));
            });

            container.appendChild(section);
        });
    }

    function renderEmptyState(container, title, subtitle) {
        var emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-feed-state';
        emptyDiv.innerHTML =
            '<h3 class="empty-feed-title">' + title + '</h3>' +
            '<p class="empty-feed-sub">' + subtitle + '</p>' +
            (filterByActiveMonth ? '<button type="button" class="btn btn-sm empty-view-all-trigger"><span>View All Months</span>' + ARROW_SVG + '</button>' : '');
        container.appendChild(emptyDiv);

        var btn = emptyDiv.querySelector('.empty-view-all-trigger');
        if (btn) {
            btn.addEventListener('click', function () {
                filterByActiveMonth = false;
                clearSelectedDate();
                renderContent();
            });
        }
    }

    function renderAll() {
        containerAll.innerHTML = '';
        var filteredD = getFilteredDeadlines(false);
        var filteredA = getFilteredAnnouncements(false);
        var total = filteredD.length + filteredA.length;

        updateResultsHeader(total);

        if (total === 0) {
            renderEmptyState(
                containerAll,
                'No items scheduled for this view',
                filterByActiveMonth
                    ? 'No deliverables or bulletins found in ' + monthNames[currentMonth] + ' ' + currentYear + ' with your current filters.'
                    : 'Try clearing your search query or resetting category filters.'
            );
            return;
        }

        var combined = [];
        filteredD.forEach(function (d) { combined.push({ kind: 'deadline', date: d.date, data: d }); });
        filteredA.forEach(function (a) { combined.push({ kind: 'announcement', date: a.date, data: a }); });
        combined.sort(function (a, b) { return (a.date || '').localeCompare(b.date || ''); });

        renderGroupedEntries(containerAll, combined);
    }

    function renderDeadlines() {
        containerDeadlines.innerHTML = '';
        var filtered = getFilteredDeadlines(false);

        updateResultsHeader(filtered.length);

        if (filtered.length === 0) {
            renderEmptyState(
                containerDeadlines,
                'No deadlines found',
                filterByActiveMonth
                    ? 'No assessments or IA checkpoints scheduled in ' + monthNames[currentMonth] + ' ' + currentYear + '.'
                    : 'Try adjusting your cohort or category filter.'
            );
            return;
        }

        var entries = filtered
            .slice()
            .sort(function (a, b) { return (a.date || '').localeCompare(b.date || ''); })
            .map(function (d) { return { kind: 'deadline', date: d.date, data: d }; });

        renderGroupedEntries(containerDeadlines, entries);
    }

    function renderAnnouncements() {
        containerAnnouncements.innerHTML = '';
        var filtered = getFilteredAnnouncements(false);

        updateResultsHeader(filtered.length);

        if (filtered.length === 0) {
            renderEmptyState(
                containerAnnouncements,
                'No announcements found',
                filterByActiveMonth
                    ? 'No faculty notices published in ' + monthNames[currentMonth] + ' ' + currentYear + '.'
                    : 'Try clearing your search filter.'
            );
            return;
        }

        var entries = filtered
            .slice()
            .sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); })
            .map(function (a) { return { kind: 'announcement', date: a.date, data: a }; });

        renderGroupedEntries(containerAnnouncements, entries);
    }

    function renderContent() {
        btnViewAll.classList.toggle('active', activeView === 'all');
        btnViewAll.setAttribute('aria-selected', activeView === 'all' ? 'true' : 'false');
        btnViewDeadlines.classList.toggle('active', activeView === 'deadlines');
        btnViewDeadlines.setAttribute('aria-selected', activeView === 'deadlines' ? 'true' : 'false');
        btnViewAnnouncements.classList.toggle('active', activeView === 'announcements');
        btnViewAnnouncements.setAttribute('aria-selected', activeView === 'announcements' ? 'true' : 'false');

        // Dynamic tab badge counts matching active filters
        var currentD = getFilteredDeadlines(false);
        var currentA = getFilteredAnnouncements(false);
        var badgeAll = document.getElementById('badge-all-count');
        var badgeDl = document.getElementById('badge-deadlines-count');
        var badgeAnn = document.getElementById('badge-announcements-count');
        if (badgeAll) badgeAll.textContent = String(currentD.length + currentA.length);
        if (badgeDl) badgeDl.textContent = String(currentD.length);
        if (badgeAnn) badgeAnn.textContent = String(currentA.length);

        updateExportButtonLabel();
        renderUpNextBanner();

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

    // View Tab Listeners
    btnViewAll.addEventListener('click', function () {
        activeView = 'all';
        searchInput.placeholder = 'Search by title, syllabus code (e.g. A.1, Crit B), or keyword...';
        renderContent();
    });

    btnViewDeadlines.addEventListener('click', function () {
        activeView = 'deadlines';
        searchInput.placeholder = 'Search deadlines, exams, rooms, or syllabus topics...';
        renderContent();
    });

    btnViewAnnouncements.addEventListener('click', function () {
        activeView = 'announcements';
        searchInput.placeholder = 'Search faculty announcements...';
        renderContent();
    });

    // Calendar Navigation
    document.getElementById('cal-prev').addEventListener('click', function () {
        if (currentMonth === 0) { currentMonth = 11; currentYear--; }
        else { currentMonth--; }
        clearSelectedDate();
        filterByActiveMonth = true;
        if (isMonthPickerOpen) renderMonthPicker();
        renderCalendar();
        renderContent();
    });

    document.getElementById('cal-next').addEventListener('click', function () {
        if (currentMonth === 11) { currentMonth = 0; currentYear++; }
        else { currentMonth++; }
        clearSelectedDate();
        filterByActiveMonth = true;
        if (isMonthPickerOpen) renderMonthPicker();
        renderCalendar();
        renderContent();
    });

    if (calTodayBtn) {
        calTodayBtn.addEventListener('click', function () {
            currentYear = todayYear;
            currentMonth = todayMonth;
            isMonthPickerOpen = false;
            filterByActiveMonth = true;
            clearSelectedDate();
            updateMonthPickerView();
            renderCalendar();
            renderContent();
        });
    }

    if (toggleAllMonthsBtn) {
        toggleAllMonthsBtn.addEventListener('click', function () {
            filterByActiveMonth = !filterByActiveMonth;
            clearSelectedDate();
            renderCalendar();
            renderContent();
        });
    }

    // Sync initial cohort button state from localStorage
    function syncFilterButtonsUI() {
        document.querySelectorAll('[data-cohort]').forEach(function (b) {
            b.classList.toggle('active', b.getAttribute('data-cohort') === activeCohort);
        });
        document.querySelectorAll('[data-type]').forEach(function (b) {
            b.classList.toggle('active', b.getAttribute('data-type') === activeType);
        });
    }
    syncFilterButtonsUI();

    document.querySelectorAll('[data-cohort]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            activeCohort = btn.getAttribute('data-cohort');
            syncFilterButtonsUI();
            try {
                localStorage.setItem(COHORT_STORAGE_KEY, activeCohort);
                if (cohortSavedHint) {
                    cohortSavedHint.classList.add('is-visible');
                    setTimeout(function () { cohortSavedHint.classList.remove('is-visible'); }, 1400);
                }
            } catch (e) {}
            if (isMonthPickerOpen) renderMonthPicker();
            renderCalendar();
            renderContent();
        });
    });

    document.querySelectorAll('[data-type]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            activeType = btn.getAttribute('data-type');
            syncFilterButtonsUI();
            if (isMonthPickerOpen) renderMonthPicker();
            renderCalendar();
            renderContent();
        });
    });

    document.getElementById('reset-filters-btn').addEventListener('click', function () {
        activeType = 'all';
        activeCohort = 'all';
        clearSelectedDate();
        searchQuery = '';
        searchInput.value = '';
        filterByActiveMonth = true;
        try {
            localStorage.setItem(COHORT_STORAGE_KEY, 'all');
        } catch (e) {}
        syncFilterButtonsUI();
        if (isMonthPickerOpen) renderMonthPicker();
        renderCalendar();
        renderContent();
    });

    searchInput.addEventListener('input', function (e) {
        searchQuery = e.target.value.trim();
        if (searchQuery.length > 0 && filterByActiveMonth) {
            // Automatically search across all months when typing a query
            filterByActiveMonth = false;
        }
        renderContent();
    });

    // Deep-Link Routing (?tab=, ?id=, #dl-*)
    function handleDeadlinesRouting() {
        var urlParams = new URLSearchParams(window.location.search);
        var tabParam = (urlParams.get('tab') || '').toLowerCase();
        var rawHash = window.location.hash.replace(/^#/, '');
        var lowerHash = rawHash.toLowerCase();

        var targetTab = tabParam || (lowerHash === 'deadlines' || lowerHash === 'announcements' || lowerHash === 'all' ? lowerHash : null);
        if (targetTab === 'deadlines' && btnViewDeadlines) {
            btnViewDeadlines.click();
        } else if (targetTab === 'announcements' && btnViewAnnouncements) {
            btnViewAnnouncements.click();
        } else if (targetTab === 'all' && btnViewAll) {
            btnViewAll.click();
        }

        var targetId = urlParams.get('id');
        if (!targetId && rawHash) {
            if (rawHash.indexOf('dl-') === 0 || deadlines.some(function (d) { return d.id === rawHash; })) {
                targetId = rawHash;
            }
        }

        if (targetId) {
            var targetItem = deadlines.find(function (d) { return d.id === targetId; });
            if (targetItem) {
                if (activeView === 'announcements' && btnViewAll) {
                    btnViewAll.click();
                }

                if (targetItem.date) {
                    var p = targetItem.date.split('-');
                    if (p.length === 3) {
                        currentYear = parseInt(p[0], 10);
                        currentMonth = parseInt(p[1], 10) - 1;
                        renderCalendar();
                        renderContent();
                    }
                }

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

    function markDeadlinesAsSeen() {
        try {
            var allIds = [];
            (deadlines || []).forEach(function (d) { if (d.id) allIds.push(d.id); });
            (announcements || []).forEach(function (a) { if (a.id) allIds.push(a.id); });
            if (allIds.length > 0) {
                localStorage.setItem('eis_seen_deadlines_ids', JSON.stringify(allIds));
            }
        } catch (e) {}
    }

    // Ensure initial calendar month has data if current real month has none
    function alignInitialMonthToData() {
        var countNow = countItemsInMonth(currentYear, currentMonth);
        if (countNow === 0 && deadlines.length > 0) {
            currentYear = 2026;
            currentMonth = 10; // Default to Nov 2026 if visiting outside the schedule range
        }
    }

    function initDeadlinesData() {
        if (typeof window !== 'undefined' && window.DataService && typeof window.DataService.getDeadlines === 'function') {
            deadlines = window.DataService.getDeadlines();
            announcements = window.DataService.getAnnouncements();
            alignInitialMonthToData();
            renderCalendar();
            renderContent();
            handleDeadlinesRouting();
            markDeadlinesAsSeen();

            if (exportIcalBtn) {
                exportIcalBtn.style.display = window.DataService.isFeatureEnabled('icalExport') ? '' : 'none';
            }

            window.DataService.subscribe('deadlines', function (updated) {
                deadlines = updated;
                renderCalendar();
                renderContent();
            });
            window.DataService.subscribe('announcements', function (updated) {
                announcements = updated;
                renderCalendar();
                renderContent();
            });
            window.DataService.onSettingsChange(function () {
                if (exportIcalBtn) {
                    exportIcalBtn.style.display = window.DataService.isFeatureEnabled('icalExport') ? '' : 'none';
                }
            });
        } else {
            Promise.all([
                fetch('../data/deadlines.json').then(function (r) { return r.json(); }).catch(function () { return fallbackDeadlines; }),
                fetch('../data/announcements.json').then(function (r) { return r.json(); }).catch(function () { return fallbackAnnouncements; })
            ]).then(function (results) {
                deadlines = results[0] && results[0].length ? results[0] : fallbackDeadlines;
                announcements = results[1] && results[1].length ? results[1] : fallbackAnnouncements;
                alignInitialMonthToData();
                renderCalendar();
                renderContent();
                handleDeadlinesRouting();
                markDeadlinesAsSeen();
            });
        }
    }

    initDeadlinesData();
    window.addEventListener('hashchange', handleDeadlinesRouting);
})();

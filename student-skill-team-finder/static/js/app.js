/**
 * app.js - Core Application Controller
 * SkillSync - Student Skill & Project Team Finder
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize State
    let appData = StorageManager.loadData();
    let currentTab = "teammates";
    let currentDashboardSubtab = "profile";
    let activeChatStudentId = null;

    // Builder Studio State
    let studioRequiredSkills = ["React", "Python", "Figma / UI/UX Design", "Docker"];
    let rosterSlots = [
        { slotId: 0, roleName: "Project Lead", studentId: appData.currentUser.id },
        { slotId: 1, roleName: "Frontend & UI", studentId: "std_2" }, // David Chen
        { slotId: 2, roleName: "AI / Backend", studentId: "std_1" }, // Priya Sharma
        { slotId: 3, roleName: "DevOps / Specialist", studentId: null }
    ];

    // Filter states
    const teammateFilters = {
        query: "",
        domain: "All Domains",
        skill: "All Skills",
        availability: "All Availability",
        college: "All Colleges",
        sortBy: "match"
    };

    const projectFilters = {
        query: "",
        category: "All Categories",
        status: "All"
    };

    // DOM Elements
    const elements = {
        themeToggleBtn: document.getElementById("themeToggleBtn"),
        themeIcon: document.getElementById("themeIcon"),
        navLinks: document.querySelectorAll(".nav-link"),
        viewSections: document.querySelectorAll(".view-section"),
        globalHeroSearch: document.getElementById("globalHeroSearch"),
        quickTags: document.querySelectorAll(".quick-tag"),

        // Teammates View
        teammatesGrid: document.getElementById("teammatesGrid"),
        teammateCount: document.getElementById("teammateCount"),
        filterDomain: document.getElementById("filterDomain"),
        filterSkill: document.getElementById("filterSkill"),
        filterCollege: document.getElementById("filterCollege"),
        filterAvailability: document.getElementById("filterAvailability"),
        searchTeammate: document.getElementById("searchTeammate"),
        sortTeammate: document.getElementById("sortTeammate"),
        resetTeammateFiltersBtn: document.getElementById("resetTeammateFiltersBtn"),

        // Projects View
        projectsGrid: document.getElementById("projectsGrid"),
        projectCount: document.getElementById("projectCount"),
        filterProjectCategory: document.getElementById("filterProjectCategory"),
        filterProjectStatus: document.getElementById("filterProjectStatus"),
        searchProject: document.getElementById("searchProject"),
        btnOpenPostProject: document.getElementById("btnOpenPostProject"),

        // Studio View
        studioSkillPicker: document.getElementById("studioSkillPicker"),
        rosterSlotsGrid: document.getElementById("rosterSlotsGrid"),
        studioCandidatesList: document.getElementById("studioCandidatesList"),
        teamCoverageScore: document.getElementById("teamCoverageScore"),
        missingSkillsWrap: document.getElementById("missingSkillsWrap"),
        copyRosterSummaryBtn: document.getElementById("copyRosterSummaryBtn"),
        clearRosterBtn: document.getElementById("clearRosterBtn"),

        // Dashboard View
        dashboardSubtabs: document.querySelectorAll(".subtab-btn"),
        dashSubtabProfile: document.getElementById("dashSubtabProfile"),
        dashSubtabRequests: document.getElementById("dashSubtabRequests"),
        dashSubtabBookmarks: document.getElementById("dashSubtabBookmarks"),
        dashSubtabMyProjects: document.getElementById("dashSubtabMyProjects"),
        profileForm: document.getElementById("profileForm"),
        profileSkillsList: document.getElementById("profileSkillsList"),
        btnAddSkillToProfile: document.getElementById("btnAddSkillToProfile"),
        newSkillName: document.getElementById("newSkillName"),
        newSkillLevel: document.getElementById("newSkillLevel"),
        requestsListContainer: document.getElementById("requestsListContainer"),
        bookmarksStudentsGrid: document.getElementById("bookmarksStudentsGrid"),
        bookmarksProjectsGrid: document.getElementById("bookmarksProjectsGrid"),
        myProjectsGrid: document.getElementById("myProjectsGrid"),
        requestsBadgeCounter: document.getElementById("requestsBadgeCounter"),
        resetDemoBtn: document.getElementById("resetDemoBtn"),

        // Modals
        studentModal: document.getElementById("studentModal"),
        studentModalBody: document.getElementById("studentModalBody"),
        projectModal: document.getElementById("projectModal"),
        projectModalBody: document.getElementById("projectModalBody"),
        postProjectModal: document.getElementById("postProjectModal"),
        postProjectForm: document.getElementById("postProjectForm"),
        inviteModal: document.getElementById("inviteModal"),
        inviteStudentName: document.getElementById("inviteStudentName"),
        inviteProjectSelect: document.getElementById("inviteProjectSelect"),
        inviteMessage: document.getElementById("inviteMessage"),
        btnSendInvite: document.getElementById("btnSendInvite"),

        // Chat Drawer
        chatDrawer: document.getElementById("chatDrawer"),
        chatDrawerAvatar: document.getElementById("chatDrawerAvatar"),
        chatDrawerName: document.getElementById("chatDrawerName"),
        chatDrawerRole: document.getElementById("chatDrawerRole"),
        chatCloseBtn: document.getElementById("chatCloseBtn"),
        chatMessages: document.getElementById("chatMessages"),
        chatInput: document.getElementById("chatInput"),
        chatSendBtn: document.getElementById("chatSendBtn"),

        // Toast Container
        toastContainer: document.getElementById("toastContainer")
    };

    // =========================================================================
    // 2. Theme Management
    // =========================================================================
    function initTheme() {
        const savedTheme = localStorage.getItem("skillsync_theme") || "dark";
        document.documentElement.setAttribute("data-theme", savedTheme);
        updateThemeIcon(savedTheme);
    }

    function toggleTheme() {
        const current = document.documentElement.getAttribute("data-theme") || "dark";
        const target = current === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", target);
        localStorage.setItem("skillsync_theme", target);
        updateThemeIcon(target);
        showToast(`Switched to ${target} mode`, "info");
    }

    function updateThemeIcon(theme) {
        if (!elements.themeIcon) return;
        if (theme === "light") {
            elements.themeIcon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
        } else {
            elements.themeIcon.innerHTML = `
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            `;
        }
    }

    // =========================================================================
    // 3. Matchmaking Algorithm
    // =========================================================================
    function calculateStudentMatch(student, requiredSkills) {
        if (!requiredSkills || requiredSkills.length === 0) {
            return { score: 100, matchedSkills: [] };
        }

        const studentSkillMap = {};
        student.skills.forEach(s => {
            studentSkillMap[s.name.toLowerCase()] = s.level;
        });

        let totalPoints = 0;
        const matchedSkills = [];

        requiredSkills.forEach(req => {
            const reqKey = req.toLowerCase();
            if (studentSkillMap[reqKey]) {
                const level = studentSkillMap[reqKey];
                let weight = 0.7;
                if (level === "Expert") weight = 1.0;
                else if (level === "Advanced") weight = 0.85;
                else if (level === "Intermediate") weight = 0.65;

                totalPoints += weight;
                matchedSkills.push({ name: req, level });
            }
        });

        const scorePercent = Math.min(100, Math.round((totalPoints / requiredSkills.length) * 100));
        return { score: scorePercent, matchedSkills };
    }

    // =========================================================================
    // 4. View Routing & Tabs
    // =========================================================================
    function switchTab(tabId) {
        currentTab = tabId;
        elements.navLinks.forEach(link => {
            link.classList.toggle("active", link.dataset.tab === tabId);
        });
        elements.viewSections.forEach(section => {
            section.classList.toggle("active", section.id === `view-${tabId}`);
        });

        window.scrollTo({ top: 0, behavior: "smooth" });

        if (tabId === "teammates") renderTeammates();
        else if (tabId === "projects") renderProjects();
        else if (tabId === "builder") renderStudio();
        else if (tabId === "dashboard") renderDashboard();
    }

    function switchDashboardSubtab(subtab) {
        currentDashboardSubtab = subtab;
        elements.dashboardSubtabs.forEach(btn => {
            btn.classList.toggle("active", btn.dataset.subtab === subtab);
        });

        elements.dashSubtabProfile.style.display = subtab === "profile" ? "block" : "none";
        elements.dashSubtabRequests.style.display = subtab === "requests" ? "block" : "none";
        elements.dashSubtabBookmarks.style.display = subtab === "bookmarks" ? "block" : "none";
        elements.dashSubtabMyProjects.style.display = subtab === "myprojects" ? "block" : "none";

        if (subtab === "requests") renderRequests();
        else if (subtab === "bookmarks") renderBookmarks();
        else if (subtab === "myprojects") renderMyProjects();
        else if (subtab === "profile") populateProfileForm();
    }

    // =========================================================================
    // 5. Render Teammates Directory
    // =========================================================================
    function renderTeammates() {
        const query = teammateFilters.query.toLowerCase().trim();
        const domain = teammateFilters.domain;
        const skill = teammateFilters.skill;
        const college = teammateFilters.college;
        const avail = teammateFilters.availability;
        const sortBy = teammateFilters.sortBy;

        // Current user skills for match score reference
        const mySkillNames = appData.currentUser.skills.map(s => s.name);

        let filtered = appData.students.filter(student => {
            // Text search
            if (query) {
                const matchName = student.name.toLowerCase().includes(query);
                const matchRole = student.role.toLowerCase().includes(query);
                const matchBio = student.bio.toLowerCase().includes(query);
                const matchSkill = student.skills.some(s => s.name.toLowerCase().includes(query));
                if (!matchName && !matchRole && !matchBio && !matchSkill) return false;
            }

            // Domain filter
            if (domain !== "All Domains" && student.primaryDomain !== domain) return false;

            // Skill filter
            if (skill !== "All Skills") {
                const hasSkill = student.skills.some(s => s.name.toLowerCase() === skill.toLowerCase());
                if (!hasSkill) return false;
            }

            // College filter
            if (college !== "All Colleges" && student.college !== college) return false;

            // Availability filter
            if (avail !== "All Availability" && student.availability !== avail) return false;

            return true;
        });

        // Compute match against current user's complement
        filtered = filtered.map(s => {
            const matchInfo = calculateStudentMatch(s, ["React", "Python", "Figma / UI/UX Design", "Docker"]);
            return { ...s, matchScore: matchInfo.score };
        });

        // Sorting
        if (sortBy === "match") {
            filtered.sort((a, b) => b.matchScore - a.matchScore);
        } else if (sortBy === "rating") {
            filtered.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
        } else if (sortBy === "projects") {
            filtered.sort((a, b) => (b.projectsCount || 0) - (a.projectsCount || 0));
        } else if (sortBy === "name") {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        }

        elements.teammateCount.textContent = `Showing ${filtered.length} student candidate${filtered.length === 1 ? "" : "s"}`;

        if (filtered.length === 0) {
            elements.teammatesGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🔍</div>
                    <h3>No Matching Students Found</h3>
                    <p>Try clearing filters or search for different skills like "React", "Python", or "Figma".</p>
                    <button class="btn btn-secondary btn-sm" id="emptyClearBtn">Reset Filters</button>
                </div>
            `;
            const emptyBtn = document.getElementById("emptyClearBtn");
            if (emptyBtn) emptyBtn.addEventListener("click", resetTeammateFilters);
            return;
        }

        elements.teammatesGrid.innerHTML = filtered.map(student => {
            const isBookmarked = appData.bookmarks.students.includes(student.id);
            const availClass = student.availability === "Actively Looking" ? "avail-looking" :
                               student.availability === "Open to Offers" ? "avail-open" : "avail-busy";
            const statusDotClass = student.availability === "Actively Looking" ? "active" :
                                   student.availability === "Open to Offers" ? "open" : "busy";

            const skillChipsHtml = student.skills.slice(0, 5).map(sk => {
                const dotClass = sk.level === "Expert" ? "dot-expert" : sk.level === "Advanced" ? "dot-advanced" : "dot-intermediate";
                return `
                    <span class="skill-chip">
                        <span class="skill-dot ${dotClass}"></span>
                        ${sk.name}
                    </span>
                `;
            }).join("");

            const extraSkillsCount = student.skills.length > 5 ? `<span class="skill-chip">+${student.skills.length - 5} more</span>` : "";

            return `
                <div class="student-card" data-id="${student.id}">
                    <button class="star-btn ${isBookmarked ? "bookmarked" : ""}" data-id="${student.id}" title="${isBookmarked ? "Remove Bookmark" : "Save Student"}">
                        ★
                    </button>
                    <div class="card-top">
                        <div class="avatar-wrapper">
                            <img src="${student.avatar}" alt="${student.name}" class="avatar-img" />
                            <span class="status-dot ${statusDotClass}"></span>
                        </div>
                        <div class="student-meta">
                            <h3>${student.name}</h3>
                            <div class="student-role">${student.role}</div>
                            <div class="student-college">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
                                ${student.college} • ${student.semester}
                            </div>
                        </div>
                    </div>

                    <p class="student-bio">"${student.bio}"</p>

                    <div class="skills-container">
                        ${skillChipsHtml}
                        ${extraSkillsCount}
                    </div>

                    <div class="card-footer">
                        <span class="availability-badge ${availClass}">
                            ● ${student.availability}
                        </span>
                        <div style="display:flex; gap:6px;">
                            <button class="btn btn-secondary btn-sm btn-view-profile" data-id="${student.id}">
                                Profile
                            </button>
                            <button class="btn btn-outline btn-sm btn-open-chat" data-id="${student.id}" title="Send Direct Message">
                                💬
                            </button>
                            <button class="btn btn-primary btn-sm btn-invite-team" data-id="${student.id}">
                                Invite
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join("");

        // Attach Card Event Listeners
        attachTeammateCardListeners();
    }

    function attachTeammateCardListeners() {
        // Bookmark toggle
        elements.teammatesGrid.querySelectorAll(".star-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                toggleStudentBookmark(id);
            });
        });

        // View Profile Modal
        elements.teammatesGrid.querySelectorAll(".btn-view-profile").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id;
                openStudentProfileModal(id);
            });
        });

        // Open Chat Drawer
        elements.teammatesGrid.querySelectorAll(".btn-open-chat").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id;
                openChatWithStudent(id);
            });
        });

        // Invite to Team Modal
        elements.teammatesGrid.querySelectorAll(".btn-invite-team").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id;
                openInviteModal(id);
            });
        });
    }

    function toggleStudentBookmark(studentId) {
        const idx = appData.bookmarks.students.indexOf(studentId);
        if (idx > -1) {
            appData.bookmarks.students.splice(idx, 1);
            showToast("Student removed from bookmarks", "info");
        } else {
            appData.bookmarks.students.push(studentId);
            showToast("Student saved to bookmarks!", "success");
        }
        StorageManager.saveData(appData);
        renderTeammates();
        if (currentDashboardSubtab === "bookmarks") renderBookmarks();
    }

    function resetTeammateFilters() {
        teammateFilters.query = "";
        teammateFilters.domain = "All Domains";
        teammateFilters.skill = "All Skills";
        teammateFilters.college = "All Colleges";
        teammateFilters.availability = "All Availability";
        teammateFilters.sortBy = "match";

        elements.searchTeammate.value = "";
        elements.filterDomain.value = "All Domains";
        elements.filterSkill.value = "All Skills";
        elements.filterCollege.value = "All Colleges";
        elements.filterAvailability.value = "All Availability";
        elements.sortTeammate.value = "match";

        renderTeammates();
    }

    // =========================================================================
    // 6. Render Projects & Hackathon Openings
    // =========================================================================
    function renderProjects() {
        const query = projectFilters.query.toLowerCase().trim();
        const cat = projectFilters.category;
        const status = projectFilters.status;

        let filtered = appData.projects.filter(proj => {
            if (query) {
                const matchTitle = proj.title.toLowerCase().includes(query);
                const matchDesc = proj.description.toLowerCase().includes(query);
                const matchLead = proj.leadName.toLowerCase().includes(query);
                const matchSkill = proj.requiredSkills.some(s => s.toLowerCase().includes(query));
                if (!matchTitle && !matchDesc && !matchLead && !matchSkill) return false;
            }

            if (cat !== "All Categories" && proj.category !== cat) return false;
            if (status !== "All" && proj.status !== status) return false;

            return true;
        });

        elements.projectCount.textContent = `Showing ${filtered.length} active project opening${filtered.length === 1 ? "" : "s"}`;

        if (filtered.length === 0) {
            elements.projectsGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">💡</div>
                    <h3>No Projects Matching Filters</h3>
                    <p>Be the first to post a new project vacancy or change your search keywords!</p>
                    <button class="btn btn-primary btn-sm" id="btnEmptyPost">Post New Project</button>
                </div>
            `;
            const emptyPost = document.getElementById("btnEmptyPost");
            if (emptyPost) emptyPost.addEventListener("click", () => openPostProjectModal());
            return;
        }

        elements.projectsGrid.innerHTML = filtered.map(proj => {
            const isBookmarked = appData.bookmarks.projects.includes(proj.id);
            const currentCount = proj.currentMembers ? proj.currentMembers.length : 1;
            const progressPercent = Math.min(100, Math.round((currentCount / proj.teamSize) * 100));

            const memberAvatarsHtml = (proj.currentMembers || []).map(m => `
                <img src="${m.avatar}" title="${m.name} (${m.role})" alt="${m.name}" />
            `).join("");

            const skillPillsHtml = proj.requiredSkills.map(sk => `
                <span class="skill-chip highlight">${sk}</span>
            `).join("");

            const isAlreadyMember = (proj.currentMembers || []).some(m => m.name === appData.currentUser.name);
            const isFull = currentCount >= proj.teamSize;

            let joinBtnHtml = `<button class="btn btn-primary btn-sm btn-apply-proj" data-id="${proj.id}">Apply to Join</button>`;
            if (isAlreadyMember) {
                joinBtnHtml = `<span class="availability-badge avail-looking">✓ You're in</span>`;
            } else if (isFull) {
                joinBtnHtml = `<button class="btn btn-secondary btn-sm" disabled>Team Full</button>`;
            }

            return `
                <div class="project-card" data-id="${proj.id}">
                    <button class="star-btn ${isBookmarked ? "bookmarked" : ""}" data-id="${proj.id}" title="${isBookmarked ? "Remove Bookmark" : "Save Project"}">
                        ★
                    </button>
                    <div>
                        <span class="project-category-badge">${proj.category}</span>
                        <h3>${proj.title}</h3>
                        <p class="project-desc">${proj.description}</p>

                        <div class="team-progress-bar-wrap">
                            <div class="progress-info">
                                <span>Team Size: <strong>${currentCount}/${proj.teamSize} members</strong></span>
                                <span>${progressPercent}% Complete</span>
                            </div>
                            <div class="progress-track">
                                <div class="progress-fill" style="width: ${progressPercent}%;"></div>
                            </div>
                        </div>

                        <div class="positions-needed">
                            <strong>Looking for:</strong> ${Array.isArray(proj.availablePositions) ? proj.availablePositions.join(", ") : proj.availablePositions}
                        </div>

                        <div class="skills-container" style="margin-bottom: 14px;">
                            ${skillPillsHtml}
                        </div>
                    </div>

                    <div class="card-footer">
                        <div class="project-members-preview">
                            <div class="member-avatar-stack">
                                ${memberAvatarsHtml}
                            </div>
                        </div>
                        <div style="display:flex; gap:8px;">
                            <button class="btn btn-secondary btn-sm btn-proj-details" data-id="${proj.id}">
                                Details
                            </button>
                            ${joinBtnHtml}
                        </div>
                    </div>
                </div>
            `;
        }).join("");

        // Attach Project Card Event Listeners
        attachProjectCardListeners();
    }

    function attachProjectCardListeners() {
        elements.projectsGrid.querySelectorAll(".star-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                toggleProjectBookmark(btn.dataset.id);
            });
        });

        elements.projectsGrid.querySelectorAll(".btn-proj-details").forEach(btn => {
            btn.addEventListener("click", () => {
                openProjectModal(btn.dataset.id);
            });
        });

        elements.projectsGrid.querySelectorAll(".btn-apply-proj").forEach(btn => {
            btn.addEventListener("click", () => {
                openProjectModal(btn.dataset.id, true);
            });
        });
    }

    function toggleProjectBookmark(projectId) {
        const idx = appData.bookmarks.projects.indexOf(projectId);
        if (idx > -1) {
            appData.bookmarks.projects.splice(idx, 1);
            showToast("Project removed from bookmarks", "info");
        } else {
            appData.bookmarks.projects.push(projectId);
            showToast("Project saved to bookmarks!", "success");
        }
        StorageManager.saveData(appData);
        renderProjects();
        if (currentDashboardSubtab === "bookmarks") renderBookmarks();
    }

    // =========================================================================
    // 7. Smart Matcher & Team Builder Studio
    // =========================================================================
    function renderStudio() {
        // 1. Render Skill Picker
        elements.studioSkillPicker.innerHTML = appData.masterSkills.map(sk => {
            const isSelected = studioRequiredSkills.includes(sk);
            return `
                <button class="skill-pick-btn ${isSelected ? "selected" : ""}" data-skill="${sk}">
                    ${isSelected ? "✓ " : "+ "}${sk}
                </button>
            `;
        }).join("");

        elements.studioSkillPicker.querySelectorAll(".skill-pick-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const sk = btn.dataset.skill;
                if (studioRequiredSkills.includes(sk)) {
                    if (studioRequiredSkills.length <= 1) {
                        showToast("Please keep at least 1 required skill", "warning");
                        return;
                    }
                    studioRequiredSkills = studioRequiredSkills.filter(s => s !== sk);
                } else {
                    if (studioRequiredSkills.length >= 8) {
                        showToast("Maximum 8 required skills recommended for optimal matching", "warning");
                        return;
                    }
                    studioRequiredSkills.push(sk);
                }
                renderStudio();
            });
        });

        // 2. Render Roster Slots
        elements.rosterSlotsGrid.innerHTML = rosterSlots.map(slot => {
            if (slot.studentId) {
                // Find student (or current user)
                let occupant = null;
                if (slot.studentId === appData.currentUser.id) occupant = appData.currentUser;
                else occupant = appData.students.find(s => s.id === slot.studentId);

                if (!occupant) return "";

                const isLeader = slot.slotId === 0;

                return `
                    <div class="roster-slot-card filled">
                        <span class="slot-role-tag">${slot.roleName}</span>
                        ${!isLeader ? `<button class="slot-remove-btn" data-slot="${slot.slotId}" title="Remove member">✕</button>` : ""}
                        <img src="${occupant.avatar}" alt="${occupant.name}" class="slot-avatar" />
                        <div class="slot-name">${occupant.name}</div>
                        <div class="slot-sub">${occupant.course || "Student"}</div>
                        <div style="display:flex; flex-wrap:wrap; gap:4px; justify-content:center;">
                            ${occupant.skills.slice(0, 3).map(s => `<span class="skill-chip" style="font-size:0.7rem; padding:2px 6px;">${s.name}</span>`).join("")}
                        </div>
                    </div>
                `;
            } else {
                return `
                    <div class="roster-slot-card empty">
                        <span class="slot-role-tag">${slot.roleName}</span>
                        <div style="color:var(--text-muted); font-size:1.8rem; margin-bottom:8px;">+</div>
                        <div style="font-size:0.9rem; font-weight:600; color:var(--text-secondary); margin-bottom:4px;">Open Slot</div>
                        <div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:12px;">Add candidate from list</div>
                    </div>
                `;
            }
        }).join("");

        // Attach slot remove listener
        elements.rosterSlotsGrid.querySelectorAll(".slot-remove-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const slotId = parseInt(btn.dataset.slot, 10);
                rosterSlots[slotId].studentId = null;
                renderStudio();
                showToast("Member removed from roster", "info");
            });
        });

        // 3. Compute Team Coverage & Missing Skills
        const rosterStudents = rosterSlots
            .filter(slot => slot.studentId !== null)
            .map(slot => {
                if (slot.studentId === appData.currentUser.id) return appData.currentUser;
                return appData.students.find(s => s.id === slot.studentId);
            })
            .filter(Boolean);

        const coveredSkillsMap = new Set();
        rosterStudents.forEach(st => {
            st.skills.forEach(sk => coveredSkillsMap.add(sk.name.toLowerCase()));
        });

        const missing = [];
        studioRequiredSkills.forEach(req => {
            if (!coveredSkillsMap.has(req.toLowerCase())) {
                missing.push(req);
            }
        });

        const coveragePercent = Math.min(100, Math.round(((studioRequiredSkills.length - missing.length) / studioRequiredSkills.length) * 100));
        elements.teamCoverageScore.textContent = `${coveragePercent}%`;

        if (missing.length === 0) {
            elements.missingSkillsWrap.innerHTML = `
                <div style="color:var(--accent-emerald); font-size:0.88rem; font-weight:600; display:flex; align-items:center; gap:6px;">
                    ✓ Perfect coverage! All required stack competencies are covered.
                </div>
            `;
        } else {
            elements.missingSkillsWrap.innerHTML = `
                <div style="color:var(--accent-amber); font-size:0.82rem; margin-bottom:6px; font-weight:600;">
                    Missing from current roster:
                </div>
                <div style="display:flex; flex-wrap:wrap; gap:6px;">
                    ${missing.map(m => `<span class="skill-chip" style="background:rgba(245,158,11,0.15); border-color:rgba(245,158,11,0.3); color:var(--accent-amber);">⚠️ ${m}</span>`).join("")}
                </div>
            `;
        }

        // 4. Render Ranked Matching Candidates
        const occupiedIds = rosterSlots.map(s => s.studentId).filter(Boolean);
        const candidates = appData.students.filter(s => !occupiedIds.includes(s.id));

        const scoredCandidates = candidates.map(s => {
            const match = calculateStudentMatch(s, studioRequiredSkills);
            return { ...s, matchScore: match.score, matchedSkills: match.matchedSkills };
        });

        scoredCandidates.sort((a, b) => b.matchScore - a.matchScore);

        elements.studioCandidatesList.innerHTML = scoredCandidates.map(c => {
            const scoreClass = c.matchScore >= 75 ? "score-high" : c.matchScore >= 45 ? "score-med" : "score-low";
            const emptySlotAvailable = rosterSlots.some(s => s.studentId === null);

            return `
                <div class="candidate-item-card">
                    <div class="candidate-info-left">
                        <img src="${c.avatar}" alt="${c.name}" />
                        <div>
                            <div style="font-weight:700; font-size:0.95rem;">${c.name}</div>
                            <div style="font-size:0.8rem; color:var(--text-muted);">${c.role}</div>
                            <div style="display:flex; gap:4px; margin-top:4px; flex-wrap:wrap;">
                                ${c.matchedSkills.map(m => `<span class="skill-chip highlight" style="font-size:0.72rem; padding:2px 6px;">✓ ${m.name}</span>`).join("")}
                            </div>
                        </div>
                    </div>
                    <div style="display:flex; align-items:center; gap:12px;">
                        <span class="match-score-pill ${scoreClass}">
                            ${c.matchScore}% Match
                        </span>
                        ${emptySlotAvailable ? `
                            <button class="btn btn-primary btn-sm btn-assign-slot" data-id="${c.id}">
                                + Add to Team
                            </button>
                        ` : `
                            <button class="btn btn-secondary btn-sm" disabled title="All 4 slots filled">
                                Squad Full
                            </button>
                        `}
                    </div>
                </div>
            `;
        }).join("");

        // Attach assign listeners
        elements.studioCandidatesList.querySelectorAll(".btn-assign-slot").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id;
                // Find first empty slot
                const emptySlot = rosterSlots.find(s => s.studentId === null);
                if (emptySlot) {
                    emptySlot.studentId = id;
                    renderStudio();
                    showToast("Candidate drafted to team roster!", "success");
                }
            });
        });
    }

    function copyRosterSummary() {
        const teamMembers = rosterSlots
            .filter(s => s.studentId !== null)
            .map(s => {
                const person = s.studentId === appData.currentUser.id ? appData.currentUser : appData.students.find(st => st.id === s.studentId);
                return `• ${s.roleName}: ${person.name} (${person.role})`;
            }).join("\n");

        const text = `🏆 SkillSync Dream Team Roster\nRequired Stack: ${studioRequiredSkills.join(", ")}\n\nSquad Members:\n${teamMembers}\n\nGenerated via SkillSync Team Finder`;

        navigator.clipboard.writeText(text).then(() => {
            showToast("Team roster summary copied to clipboard!", "success");
        }).catch(() => {
            showToast("Failed to copy roster summary", "warning");
        });
    }

    function clearRoster() {
        rosterSlots.forEach((slot, index) => {
            if (index !== 0) slot.studentId = null; // Keep project lead
        });
        renderStudio();
        showToast("Roster reset to team lead", "info");
    }

    // =========================================================================
    // 8. Dashboard Views (Profile, Requests, Bookmarks, My Projects)
    // =========================================================================
    function renderDashboard() {
        updateRequestsBadge();
        switchDashboardSubtab(currentDashboardSubtab);
    }

    function updateRequestsBadge() {
        const pendingIncoming = appData.requests.filter(r => r.type === "incoming" && r.status === "Pending").length;
        if (elements.requestsBadgeCounter) {
            elements.requestsBadgeCounter.textContent = pendingIncoming;
            elements.requestsBadgeCounter.style.display = pendingIncoming > 0 ? "inline-block" : "none";
        }
    }

    function populateProfileForm() {
        const u = appData.currentUser;
        document.getElementById("profileFullName").value = u.name;
        document.getElementById("profileCollege").value = u.college;
        document.getElementById("profileCourse").value = u.course;
        document.getElementById("profileBranch").value = u.branch;
        document.getElementById("profileSemester").value = u.semester;
        document.getElementById("profileAvailability").value = u.availability;
        document.getElementById("profileBio").value = u.bio;
        document.getElementById("profileExperience").value = u.experience;
        document.getElementById("profileGithub").value = u.github;
        document.getElementById("profileLinkedin").value = u.linkedin;
        document.getElementById("profileAvatarPreview").src = u.avatar;

        renderProfileSkillsList();
    }

    function renderProfileSkillsList() {
        elements.profileSkillsList.innerHTML = appData.currentUser.skills.map((sk, idx) => {
            const dot = sk.level === "Expert" ? "dot-expert" : sk.level === "Advanced" ? "dot-advanced" : "dot-intermediate";
            return `
                <span class="skill-chip">
                    <span class="skill-dot ${dot}"></span>
                    ${sk.name} (${sk.level})
                    <button type="button" class="btn-remove-skill" data-idx="${idx}" style="background:none; border:none; color:var(--accent-rose); cursor:pointer; margin-left:4px;">✕</button>
                </span>
            `;
        }).join("");

        elements.profileSkillsList.querySelectorAll(".btn-remove-skill").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = parseInt(btn.dataset.idx, 10);
                appData.currentUser.skills.splice(idx, 1);
                StorageManager.saveData(appData);
                renderProfileSkillsList();
            });
        });
    }

    function saveUserProfile(e) {
        e.preventDefault();
        const u = appData.currentUser;
        u.name = document.getElementById("profileFullName").value.trim();
        u.college = document.getElementById("profileCollege").value.trim();
        u.course = document.getElementById("profileCourse").value.trim();
        u.branch = document.getElementById("profileBranch").value.trim();
        u.semester = document.getElementById("profileSemester").value.trim();
        u.availability = document.getElementById("profileAvailability").value;
        u.bio = document.getElementById("profileBio").value.trim();
        u.experience = document.getElementById("profileExperience").value.trim();
        u.github = document.getElementById("profileGithub").value.trim();
        u.linkedin = document.getElementById("profileLinkedin").value.trim();

        StorageManager.saveData(appData);
        showToast("Profile changes saved successfully!", "success");

        // Update nav avatar pill
        const navPillName = document.querySelector(".profile-pill span");
        if (navPillName) navPillName.textContent = u.name;
    }

    function addSkillToProfile() {
        const name = elements.newSkillName.value.trim();
        const level = elements.newSkillLevel.value;
        if (!name) {
            showToast("Please enter a skill name", "warning");
            return;
        }

        const existing = appData.currentUser.skills.find(s => s.name.toLowerCase() === name.toLowerCase());
        if (existing) {
            existing.level = level;
            showToast(`Updated ${name} to ${level}`, "info");
        } else {
            appData.currentUser.skills.push({ name, level, category: "Technical" });
            showToast(`Added ${name} to your profile skills`, "success");
        }

        elements.newSkillName.value = "";
        StorageManager.saveData(appData);
        renderProfileSkillsList();
    }

    function renderRequests() {
        if (!appData.requests || appData.requests.length === 0) {
            elements.requestsListContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📬</div>
                    <h3>No Active Join Requests</h3>
                    <p>Apply to project openings or post your own project to receive team join applications!</p>
                </div>
            `;
            return;
        }

        elements.requestsListContainer.innerHTML = appData.requests.map(req => {
            const isIncoming = req.type === "incoming";
            const statusClass = req.status === "Accepted" ? "avail-looking" : req.status === "Rejected" ? "avail-busy" : "avail-open";

            return `
                <div class="request-card" data-req-id="${req.id}">
                    <div class="request-person">
                        <img src="${isIncoming ? req.applicantAvatar : req.leadAvatar}" alt="User Avatar" />
                        <div class="request-content">
                            <h4>
                                ${isIncoming ? `${req.applicantName} wants to join` : `Application to ${req.leadName}'s project`}
                                <span style="font-weight:400; color:var(--brand-primary);">"${req.projectTitle}"</span>
                            </h4>
                            <p><strong>Role:</strong> ${req.roleApplied}</p>
                            <p style="font-style:italic;">"${req.message}"</p>
                            <span class="request-meta-tag">Received: ${req.date}</span>
                        </div>
                    </div>

                    <div class="request-actions">
                        ${isIncoming && req.status === "Pending" ? `
                            <button class="btn btn-secondary btn-sm btn-decline-req" data-req-id="${req.id}">Decline</button>
                            <button class="btn btn-accent btn-sm btn-accept-req" data-req-id="${req.id}">Accept & Add to Team</button>
                        ` : `
                            <span class="availability-badge ${statusClass}">
                                ● ${req.status}
                            </span>
                        `}
                    </div>
                </div>
            `;
        }).join("");

        // Attach Accept/Decline Listeners
        elements.requestsListContainer.querySelectorAll(".btn-accept-req").forEach(btn => {
            btn.addEventListener("click", () => {
                handleRequestAction(btn.dataset.reqId, "Accepted");
            });
        });

        elements.requestsListContainer.querySelectorAll(".btn-decline-req").forEach(btn => {
            btn.addEventListener("click", () => {
                handleRequestAction(btn.dataset.reqId, "Rejected");
            });
        });
    }

    function handleRequestAction(reqId, newStatus) {
        const req = appData.requests.find(r => r.id === reqId);
        if (!req) return;

        req.status = newStatus;

        if (newStatus === "Accepted") {
            // Add applicant to the project's current members
            const project = appData.projects.find(p => p.id === req.projectId);
            if (project) {
                if (!project.currentMembers) project.currentMembers = [];
                const alreadyIn = project.currentMembers.some(m => m.name === req.applicantName);
                if (!alreadyIn) {
                    project.currentMembers.push({
                        name: req.applicantName,
                        role: req.roleApplied,
                        avatar: req.applicantAvatar
                    });
                }
            }
            showToast(`Accepted ${req.applicantName}! Added to ${project ? project.title : "team"}.`, "success");
        } else {
            showToast("Application marked as declined.", "info");
        }

        StorageManager.saveData(appData);
        updateRequestsBadge();
        renderRequests();
    }

    function renderBookmarks() {
        // Students
        const bookmarkedStudents = appData.students.filter(s => appData.bookmarks.students.includes(s.id));
        if (bookmarkedStudents.length === 0) {
            elements.bookmarksStudentsGrid.innerHTML = `
                <div class="empty-state">
                    <p>No saved students yet. Click the star icon on any student profile to bookmark them!</p>
                </div>
            `;
        } else {
            elements.bookmarksStudentsGrid.innerHTML = bookmarkedStudents.map(student => `
                <div class="candidate-item-card">
                    <div class="candidate-info-left">
                        <img src="${student.avatar}" alt="${student.name}" />
                        <div>
                            <div style="font-weight:700;">${student.name}</div>
                            <div style="font-size:0.82rem; color:var(--text-muted);">${student.role}</div>
                            <div style="font-size:0.78rem; color:var(--text-secondary); margin-top:2px;">${student.college}</div>
                        </div>
                    </div>
                    <div style="display:flex; gap:8px;">
                        <button class="btn btn-secondary btn-sm btn-view-profile" data-id="${student.id}">View</button>
                        <button class="btn btn-outline btn-sm star-btn bookmarked" data-id="${student.id}">★</button>
                    </div>
                </div>
            `).join("");

            elements.bookmarksStudentsGrid.querySelectorAll(".btn-view-profile").forEach(b => {
                b.addEventListener("click", () => openStudentProfileModal(b.dataset.id));
            });
            elements.bookmarksStudentsGrid.querySelectorAll(".star-btn").forEach(b => {
                b.addEventListener("click", () => toggleStudentBookmark(b.dataset.id));
            });
        }

        // Projects
        const bookmarkedProjects = appData.projects.filter(p => appData.bookmarks.projects.includes(p.id));
        if (bookmarkedProjects.length === 0) {
            elements.bookmarksProjectsGrid.innerHTML = `
                <div class="empty-state">
                    <p>No saved projects yet. Click the star icon on any project opening to bookmark it!</p>
                </div>
            `;
        } else {
            elements.bookmarksProjectsGrid.innerHTML = bookmarkedProjects.map(proj => `
                <div class="candidate-item-card">
                    <div>
                        <span class="project-category-badge" style="margin-bottom:4px;">${proj.category}</span>
                        <div style="font-weight:700;">${proj.title}</div>
                        <div style="font-size:0.82rem; color:var(--text-muted);">Lead: ${proj.leadName} (${proj.college})</div>
                    </div>
                    <div style="display:flex; gap:8px;">
                        <button class="btn btn-secondary btn-sm btn-proj-details" data-id="${proj.id}">Details</button>
                        <button class="btn btn-outline btn-sm star-btn bookmarked" data-id="${proj.id}">★</button>
                    </div>
                </div>
            `).join("");

            elements.bookmarksProjectsGrid.querySelectorAll(".btn-proj-details").forEach(b => {
                b.addEventListener("click", () => openProjectModal(b.dataset.id));
            });
            elements.bookmarksProjectsGrid.querySelectorAll(".star-btn").forEach(b => {
                b.addEventListener("click", () => toggleProjectBookmark(b.dataset.id));
            });
        }
    }

    function renderMyProjects() {
        const myProjects = appData.projects.filter(p => p.leadEmail === "alex@campus.edu" || p.leadName === appData.currentUser.name);

        if (myProjects.length === 0) {
            elements.myProjectsGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🚀</div>
                    <h3>You haven't posted any projects yet</h3>
                    <p>Assemble your dream hackathon squad by publishing your project vacancy now.</p>
                    <button class="btn btn-primary btn-sm" id="btnDashPostProj">Post a Project</button>
                </div>
            `;
            const btn = document.getElementById("btnDashPostProj");
            if (btn) btn.addEventListener("click", () => openPostProjectModal());
            return;
        }

        elements.myProjectsGrid.innerHTML = myProjects.map(proj => `
            <div class="project-card" style="margin-bottom:16px;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                    <span class="project-category-badge">${proj.category}</span>
                    <span class="availability-badge avail-looking">● Status: ${proj.status}</span>
                </div>
                <h3>${proj.title}</h3>
                <p class="project-desc">${proj.description}</p>
                <div class="positions-needed">
                    <strong>Vacancies:</strong> ${Array.isArray(proj.availablePositions) ? proj.availablePositions.join(", ") : proj.availablePositions}
                </div>
                <div class="card-footer">
                    <div style="font-size:0.85rem; color:var(--text-muted);">
                        Team: <strong>${proj.currentMembers ? proj.currentMembers.length : 1}/${proj.teamSize} members</strong>
                    </div>
                    <div style="display:flex; gap:8px;">
                        <button class="btn btn-secondary btn-sm btn-proj-details" data-id="${proj.id}">View Details</button>
                    </div>
                </div>
            </div>
        `).join("");

        elements.myProjectsGrid.querySelectorAll(".btn-proj-details").forEach(b => {
            b.addEventListener("click", () => openProjectModal(b.dataset.id));
        });
    }

    // =========================================================================
    // 9. Modals (Student Profile, Project Details, Post Project, Invite)
    // =========================================================================
    function openStudentProfileModal(studentId) {
        const student = appData.students.find(s => s.id === studentId);
        if (!student) return;

        const skillsHtml = student.skills.map(sk => `
            <div style="display:flex; align-items:center; justify-content:space-between; background:var(--bg-input); padding:8px 12px; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
                <span style="font-weight:600; font-size:0.9rem;">${sk.name}</span>
                <span class="availability-badge ${sk.level === "Expert" ? "avail-looking" : sk.level === "Advanced" ? "avail-open" : "avail-busy"}" style="font-size:0.75rem;">
                    ${sk.level}
                </span>
            </div>
        `).join("");

        elements.studentModalBody.innerHTML = `
            <div style="display:flex; align-items:center; gap:20px; margin-bottom:24px; flex-wrap:wrap;">
                <img src="${student.avatar}" alt="${student.name}" style="width:84px; height:84px; border-radius:var(--radius-md); object-fit:cover; border:2px solid var(--brand-primary);" />
                <div>
                    <h2 style="font-size:1.45rem; font-weight:800; margin-bottom:4px;">${student.name}</h2>
                    <div style="color:var(--brand-primary); font-weight:600; font-size:0.95rem; margin-bottom:4px;">${student.role}</div>
                    <div style="color:var(--text-muted); font-size:0.85rem;">${student.college} • ${student.course} (${student.branch})</div>
                </div>
            </div>

            <div style="margin-bottom:20px;">
                <h4 style="font-size:0.95rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;">About</h4>
                <p style="font-size:0.95rem; color:var(--text-secondary); line-height:1.6;">${student.bio}</p>
            </div>

            <div style="margin-bottom:20px;">
                <h4 style="font-size:0.95rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;">Notable Experience & Achievements</h4>
                <p style="font-size:0.92rem; color:var(--text-secondary); background:var(--bg-input); padding:12px; border-radius:var(--radius-sm); border:1px solid var(--border-color);">${student.experience || "Active contributor in college tech chapters and hackathons."}</p>
            </div>

            <div style="margin-bottom:24px;">
                <h4 style="font-size:0.95rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:10px;">Core Skills & Proficiencies</h4>
                <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(200px, 1fr)); gap:10px;">
                    ${skillsHtml}
                </div>
            </div>

            <div style="display:flex; align-items:center; justify-content:space-between; border-top:1px solid var(--border-color); padding-top:18px; flex-wrap:wrap; gap:12px;">
                <div style="display:flex; gap:12px;">
                    ${student.github ? `<a href="${student.github}" target="_blank" class="btn btn-secondary btn-sm">GitHub ↗</a>` : ""}
                    ${student.linkedin ? `<a href="${student.linkedin}" target="_blank" class="btn btn-secondary btn-sm">LinkedIn ↗</a>` : ""}
                </div>
                <div style="display:flex; gap:8px;">
                    <button class="btn btn-outline btn-sm btn-modal-chat" data-id="${student.id}">💬 Direct Message</button>
                    <button class="btn btn-primary btn-sm btn-modal-invite" data-id="${student.id}">+ Invite to Team</button>
                </div>
            </div>
        `;

        // Attach buttons in modal
        elements.studentModalBody.querySelector(".btn-modal-chat").addEventListener("click", () => {
            closeModal(elements.studentModal);
            openChatWithStudent(student.id);
        });

        elements.studentModalBody.querySelector(".btn-modal-invite").addEventListener("click", () => {
            closeModal(elements.studentModal);
            openInviteModal(student.id);
        });

        openModal(elements.studentModal);
    }

    function openProjectModal(projectId, autoFocusApply = false) {
        const proj = appData.projects.find(p => p.id === projectId);
        if (!proj) return;

        const currentCount = proj.currentMembers ? proj.currentMembers.length : 1;
        const isFull = currentCount >= proj.teamSize;
        const isAlreadyMember = (proj.currentMembers || []).some(m => m.name === appData.currentUser.name);

        const membersHtml = (proj.currentMembers || []).map(m => `
            <div style="display:flex; align-items:center; gap:10px; background:var(--bg-input); padding:8px 12px; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
                <img src="${m.avatar}" alt="${m.name}" style="width:36px; height:36px; border-radius:50%; object-fit:cover;" />
                <div>
                    <div style="font-weight:700; font-size:0.88rem;">${m.name}</div>
                    <div style="font-size:0.75rem; color:var(--brand-primary);">${m.role}</div>
                </div>
            </div>
        `).join("");

        elements.projectModalBody.innerHTML = `
            <div style="margin-bottom:20px;">
                <span class="project-category-badge">${proj.category}</span>
                <h2 style="font-size:1.45rem; font-weight:800; margin:8px 0 4px;">${proj.title}</h2>
                <div style="color:var(--text-muted); font-size:0.85rem;">Posted by ${proj.leadName} (${proj.college}) • Target: ${proj.eventTarget || "College Hackathon"}</div>
            </div>

            <div style="margin-bottom:20px;">
                <h4 style="font-size:0.95rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;">Project Brief & Problem Statement</h4>
                <p style="font-size:0.95rem; color:var(--text-secondary); line-height:1.6;">${proj.description}</p>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:24px;">
                <div>
                    <h4 style="font-size:0.92rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:8px;">Open Positions</h4>
                    <div class="positions-needed" style="margin-bottom:0;">
                        ${Array.isArray(proj.availablePositions) ? proj.availablePositions.join(", ") : proj.availablePositions}
                    </div>
                </div>
                <div>
                    <h4 style="font-size:0.92rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:8px;">Required Tech Stack</h4>
                    <div style="display:flex; flex-wrap:wrap; gap:6px;">
                        ${proj.requiredSkills.map(sk => `<span class="skill-chip highlight">${sk}</span>`).join("")}
                    </div>
                </div>
            </div>

            <div style="margin-bottom:24px;">
                <h4 style="font-size:0.92rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:10px;">
                    Current Team Members (${currentCount}/${proj.teamSize})
                </h4>
                <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(220px, 1fr)); gap:10px;">
                    ${membersHtml}
                </div>
            </div>

            ${!isAlreadyMember && !isFull ? `
                <div style="border-top:1px solid var(--border-color); padding-top:20px;">
                    <h4 style="font-size:1.05rem; font-weight:700; margin-bottom:12px;">Submit Application to Join Team</h4>
                    <form id="applyProjectForm">
                        <div class="form-group">
                            <label>Role you want to take up:</label>
                            <input type="text" id="applyRoleInput" class="form-control" placeholder="e.g. Frontend UI Developer" required />
                        </div>
                        <div class="form-group">
                            <label>Why you'd be a great teammate (short note to project lead):</label>
                            <textarea id="applyMessageInput" class="form-control" rows="3" placeholder="Highlight your relevant skills, recent projects, or passion for this topic..." required></textarea>
                        </div>
                        <div style="display:flex; justify-content:flex-end;">
                            <button type="submit" class="btn btn-primary">Send Join Request 🚀</button>
                        </div>
                    </form>
                </div>
            ` : isAlreadyMember ? `
                <div style="background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.3); border-radius:var(--radius-md); padding:14px; text-align:center; color:var(--accent-emerald); font-weight:600;">
                    ✓ You are already confirmed as an active team member of this project!
                </div>
            ` : `
                <div style="background:rgba(245,158,11,0.1); border:1px solid rgba(245,158,11,0.3); border-radius:var(--radius-md); padding:14px; text-align:center; color:var(--accent-amber); font-weight:600;">
                    This team has reached maximum capacity (${proj.teamSize}/${proj.teamSize} slots filled).
                </div>
            `}
        `;

        const applyForm = elements.projectModalBody.querySelector("#applyProjectForm");
        if (applyForm) {
            applyForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const role = document.getElementById("applyRoleInput").value.trim();
                const message = document.getElementById("applyMessageInput").value.trim();

                const newRequest = {
                    id: `req_${Date.now()}`,
                    type: "outgoing",
                    projectId: proj.id,
                    projectTitle: proj.title,
                    leadName: proj.leadName,
                    leadAvatar: proj.leadAvatar,
                    roleApplied: role,
                    message: message,
                    status: "Pending",
                    date: "Just now"
                };

                appData.requests.unshift(newRequest);
                StorageManager.saveData(appData);

                closeModal(elements.projectModal);
                showToast(`Application sent to ${proj.leadName} for "${proj.title}"!`, "success");
            });

            if (autoFocusApply) {
                setTimeout(() => {
                    const roleInput = document.getElementById("applyRoleInput");
                    if (roleInput) roleInput.focus();
                }, 300);
            }
        }

        openModal(elements.projectModal);
    }

    function openPostProjectModal() {
        elements.postProjectForm.reset();
        openModal(elements.postProjectModal);
    }

    function handlePostProjectSubmit(e) {
        e.preventDefault();
        const title = document.getElementById("newProjectTitle").value.trim();
        const category = document.getElementById("newProjectCategory").value;
        const teamSize = parseInt(document.getElementById("newProjectSize").value, 10) || 4;
        const target = document.getElementById("newProjectTarget").value.trim() || "Hackathon / College Project";
        const positions = document.getElementById("newProjectPositions").value.trim();
        const skillsRaw = document.getElementById("newProjectSkills").value.trim();
        const desc = document.getElementById("newProjectDesc").value.trim();

        const requiredSkills = skillsRaw.split(",")
            .map(s => s.trim())
            .filter(Boolean);

        const newProject = {
            id: `proj_${Date.now()}`,
            title: title,
            category: category,
            leadName: appData.currentUser.name,
            leadAvatar: appData.currentUser.avatar,
            leadEmail: "alex@campus.edu",
            college: appData.currentUser.college,
            description: desc,
            eventTarget: target,
            teamSize: teamSize,
            currentMembers: [
                {
                    name: appData.currentUser.name,
                    role: "Project Lead",
                    avatar: appData.currentUser.avatar
                }
            ],
            availablePositions: positions.split(",").map(p => p.trim()),
            requiredSkills: requiredSkills.length > 0 ? requiredSkills : ["Python", "React", "Git & GitHub"],
            status: "Open",
            createdDate: "Just now",
            views: 1
        };

        appData.projects.unshift(newProject);
        StorageManager.saveData(appData);

        closeModal(elements.postProjectModal);
        showToast("Your project has been posted to the board!", "success");

        if (currentTab === "projects") renderProjects();
        else switchTab("projects");
    }

    function openInviteModal(studentId) {
        const student = appData.students.find(s => s.id === studentId);
        if (!student) return;

        elements.inviteStudentName.textContent = student.name;

        // Populate projects where user is lead
        const userProjects = appData.projects.filter(p => p.leadEmail === "alex@campus.edu" || p.leadName === appData.currentUser.name);

        if (userProjects.length === 0) {
            elements.inviteProjectSelect.innerHTML = `<option value="">You haven't posted any projects yet</option>`;
            elements.btnSendInvite.disabled = true;
        } else {
            elements.inviteProjectSelect.innerHTML = userProjects.map(p => `
                <option value="${p.id}">${p.title} (${p.category})</option>
            `).join("");
            elements.btnSendInvite.disabled = false;
        }

        elements.btnSendInvite.onclick = () => {
            const projId = elements.inviteProjectSelect.value;
            const message = elements.inviteMessage.value.trim();
            if (!projId) {
                showToast("Please select a project", "warning");
                return;
            }

            closeModal(elements.inviteModal);
            showToast(`Invitation sent to ${student.name}!`, "success");
        };

        openModal(elements.inviteModal);
    }

    function openModal(modalEl) {
        if (!modalEl) return;
        modalEl.classList.add("open");
        document.body.style.overflow = "hidden";
    }

    function closeModal(modalEl) {
        if (!modalEl) return;
        modalEl.classList.remove("open");
        document.body.style.overflow = "";
    }

    // =========================================================================
    // 10. Direct Messaging / Chat Drawer
    // =========================================================================
    function openChatWithStudent(studentId) {
        const student = appData.students.find(s => s.id === studentId);
        if (!student) return;

        activeChatStudentId = studentId;
        elements.chatDrawerAvatar.src = student.avatar;
        elements.chatDrawerName.textContent = student.name;
        elements.chatDrawerRole.textContent = student.role;

        // Load existing messages or initialize
        if (!appData.chats[studentId]) {
            appData.chats[studentId] = [
                {
                    sender: student.name,
                    text: `Hey! I saw your profile on SkillSync. Let's collaborate if you're forming a team!`,
                    time: "Just now",
                    isMe: false
                }
            ];
            StorageManager.saveData(appData);
        }

        renderChatMessages();
        elements.chatDrawer.classList.add("open");
        elements.chatInput.focus();
    }

    function renderChatMessages() {
        const history = appData.chats[activeChatStudentId] || [];
        elements.chatMessages.innerHTML = history.map(msg => `
            <div class="chat-bubble ${msg.isMe ? "me" : "them"}">
                <div>${msg.text}</div>
                <div class="chat-time">${msg.time}</div>
            </div>
        `).join("");
        elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
    }

    function sendChatMessage() {
        const text = elements.chatInput.value.trim();
        if (!text || !activeChatStudentId) return;

        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        appData.chats[activeChatStudentId].push({
            sender: "You",
            text: text,
            time: timeStr,
            isMe: true
        });

        elements.chatInput.value = "";
        renderChatMessages();
        StorageManager.saveData(appData);

        // Realistic Simulated Reply after 1.2s
        const student = appData.students.find(s => s.id === activeChatStudentId);
        const replyResponses = [
            `That sounds awesome! I have experience with that tech stack. Let me know what specific role you need me on!`,
            `Great idea! Count me in. Do you have a GitHub repository or Figma wireframe we can look over?`,
            `Thanks for reaching out! I'd love to jump on a quick Discord or Google Meet call to sync up on goals.`,
            `Sounds like a winning project concept! Let's build it together for the hackathon!`
        ];

        setTimeout(() => {
            if (activeChatStudentId === student.id) {
                const randomReply = replyResponses[Math.floor(Math.random() * replyResponses.length)];
                appData.chats[activeChatStudentId].push({
                    sender: student.name,
                    text: randomReply,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isMe: false
                });
                StorageManager.saveData(appData);
                renderChatMessages();
            }
        }, 1200);
    }

    // =========================================================================
    // 11. Toast System
    // =========================================================================
    function showToast(message, type = "info") {
        const toast = document.createElement("div");
        toast.className = `toast ${type}`;

        const icon = type === "success" ? "✓" : type === "warning" ? "⚠️" : "ℹ";
        toast.innerHTML = `<span style="font-weight:bold;">${icon}</span> <span>${message}</span>`;

        elements.toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateX(-20px)";
            toast.style.transition = "all 0.3s ease";
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    }

    // =========================================================================
    // 12. Setup Event Listeners & Initialize
    // =========================================================================
    function setupEventListeners() {
        // Theme Toggle
        elements.themeToggleBtn.addEventListener("click", toggleTheme);

        // Nav Links
        elements.navLinks.forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                switchTab(link.dataset.tab);
            });
        });

        // Brand Logo to Home
        document.querySelector(".brand-logo").addEventListener("click", () => {
            switchTab("teammates");
        });

        // Profile pill to Dashboard
        document.querySelector(".profile-pill").addEventListener("click", () => {
            switchTab("dashboard");
            switchDashboardSubtab("profile");
        });

        // Global Hero Search
        elements.globalHeroSearch.addEventListener("input", (e) => {
            const val = e.target.value;
            teammateFilters.query = val;
            projectFilters.query = val;
            if (currentTab === "teammates") renderTeammates();
            else if (currentTab === "projects") renderProjects();
        });

        // Quick tags under hero
        elements.quickTags.forEach(tag => {
            tag.addEventListener("click", () => {
                const skill = tag.dataset.skill;
                teammateFilters.skill = skill;
                elements.filterSkill.value = skill;
                switchTab("teammates");
                renderTeammates();
                showToast(`Filtered students skilled in ${skill}`, "info");
            });
        });

        // Teammates Filters
        elements.filterDomain.addEventListener("change", (e) => {
            teammateFilters.domain = e.target.value;
            renderTeammates();
        });
        elements.filterSkill.addEventListener("change", (e) => {
            teammateFilters.skill = e.target.value;
            renderTeammates();
        });
        elements.filterCollege.addEventListener("change", (e) => {
            teammateFilters.college = e.target.value;
            renderTeammates();
        });
        elements.filterAvailability.addEventListener("change", (e) => {
            teammateFilters.availability = e.target.value;
            renderTeammates();
        });
        elements.searchTeammate.addEventListener("input", (e) => {
            teammateFilters.query = e.target.value;
            renderTeammates();
        });
        elements.sortTeammate.addEventListener("change", (e) => {
            teammateFilters.sortBy = e.target.value;
            renderTeammates();
        });
        elements.resetTeammateFiltersBtn.addEventListener("click", resetTeammateFilters);

        // Projects Filters
        elements.filterProjectCategory.addEventListener("change", (e) => {
            projectFilters.category = e.target.value;
            renderProjects();
        });
        elements.filterProjectStatus.addEventListener("change", (e) => {
            projectFilters.status = e.target.value;
            renderProjects();
        });
        elements.searchProject.addEventListener("input", (e) => {
            projectFilters.query = e.target.value;
            renderProjects();
        });
        elements.btnOpenPostProject.addEventListener("click", openPostProjectModal);
        elements.postProjectForm.addEventListener("submit", handlePostProjectSubmit);

        // Studio actions
        elements.copyRosterSummaryBtn.addEventListener("click", copyRosterSummary);
        elements.clearRosterBtn.addEventListener("click", clearRoster);

        // Dashboard Subtabs
        elements.dashboardSubtabs.forEach(btn => {
            btn.addEventListener("click", () => {
                switchDashboardSubtab(btn.dataset.subtab);
            });
        });

        elements.profileForm.addEventListener("submit", saveUserProfile);
        elements.btnAddSkillToProfile.addEventListener("click", addSkillToProfile);

        // Reset Demo Data
        elements.resetDemoBtn.addEventListener("click", () => {
            if (confirm("Reset all data to default demo state? This will clear custom changes.")) {
                appData = StorageManager.resetToDefault();
                showToast("Application data reset to fresh demo defaults", "info");
                switchTab("teammates");
                renderTeammates();
            }
        });

        // Chat Drawer Actions
        elements.chatCloseBtn.addEventListener("click", () => {
            elements.chatDrawer.classList.remove("open");
        });
        elements.chatSendBtn.addEventListener("click", sendChatMessage);
        elements.chatInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") sendChatMessage();
        });

        // Modal Close Buttons & Backdrop Clicks
        document.querySelectorAll(".modal-overlay").forEach(overlay => {
            overlay.addEventListener("click", (e) => {
                if (e.target === overlay) closeModal(overlay);
            });
        });
        document.querySelectorAll(".modal-close-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const modal = btn.closest(".modal-overlay");
                if (modal) closeModal(modal);
            });
        });

        // Keydown Escape closes open modal or chat
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                document.querySelectorAll(".modal-overlay.open").forEach(m => closeModal(m));
                elements.chatDrawer.classList.remove("open");
            }
        });
    }

    // Populate Dynamic Filter Dropdowns from Dataset
    function populateDropdowns() {
        // Skill filter
        elements.filterSkill.innerHTML = `<option value="All Skills">All Skills</option>` +
            appData.masterSkills.map(s => `<option value="${s}">${s}</option>`).join("");

        // Project Category filter
        elements.filterProjectCategory.innerHTML = appData.categories.map(c => `
            <option value="${c}">${c}</option>
        `).join("");

        // Colleges
        const colleges = Array.from(new Set(appData.students.map(s => s.college)));
        elements.filterCollege.innerHTML = `<option value="All Colleges">All Colleges</option>` +
            colleges.map(c => `<option value="${c}">${c}</option>`).join("");
    }

    // Boot the application
    initTheme();
    populateDropdowns();
    setupEventListeners();
    updateRequestsBadge();
    switchTab("teammates");
});

# SkillSync — Student Skill & Project Team Finder 🚀

> **Connect skills. Form dream teams. Build winning hackathons & college projects.**

SkillSync is a modern, responsive web platform designed specifically for college students, hackathon competitors, and capstone teams to discover complementary peers, assemble balanced squads, and post project vacancies.

Built with **HTML5, CSS3, and Vanilla JavaScript (ES6+)**, SkillSync is 100% offline-ready, requiring zero build tools or complex environment setups. A companion Python Flask & SQLite backend is also included.

---

## 🌟 Key Features

### 1. 🔍 Student Skill Directory (Find Teammates)
- **Multi-criteria Filtering**: Filter candidates by Domain (Frontend, Backend, AI/ML, UI/UX, Cloud, IoT, Web3), College, specific Skill, or Availability status.
- **Smart Sorting**: Sort by compatibility match score, top rating, or project experience.
- **Instant Search**: Fuzzy search across names, tech competencies, and bio keywords.
- **Student Badges**: Skill chips color-coded by proficiency (Expert, Advanced, Intermediate) with availability status indicators (*Actively Looking*, *Open to Offers*).

### 2. 💡 Project & Hackathon Vacancies (Explore Projects)
- Browse open projects looking for teammates across Web Development, AI/Machine Learning, IoT & Robotics, Blockchain, and DevOps.
- **Team Capacity Progress Bar**: Visually tracks current vs. required squad size (e.g. 2/4 members).
- **One-Click Applications**: Send structured join requests with target role and custom pitch directly to the project lead.
- **Post a Project Modal**: Publish your own team opening in seconds.

### 3. 🧠 Smart Matcher & Dream Team Builder Studio
- **Dynamic Compatibility Algorithm**: Select your required project tech stack; the matchmaking engine calculates real-time overlap percentages for all students.
- **4-Slot Roster Bench**: Interactive lineup builder (Project Lead, Frontend & UI, Backend & AI, DevOps/Specialist) allowing you to draft and swap members.
- **Squad Competency Radar & Gap Analysis**: Automatically warns you of missing skills (e.g., *"⚠️ Docker missing from current roster"*) and computes overall stack coverage.
- **Copy Team Summary**: Exports your squad roster and required tech stack to the clipboard for sharing on WhatsApp or Discord.

### 4. 👤 Collaboration Hub & My Dashboard
- **Profile Editor**: Update your degree, semester, college, bio, GitHub/LinkedIn links, and availability.
- **Skill Tagger**: Dynamically add and remove skills with proficiency ratings.
- **Requests Manager**: Review incoming team applications with **Accept & Add to Team** or **Decline** buttons, and monitor outgoing applications.
- **Bookmarks**: Quick access to starred students and favorite projects.

### 5. 💬 Interactive Peer Messaging Drawer
- Slide-over real-time chat interface to message prospective teammates directly.
- Realistic simulated conversational replies to test collaboration flows.

### 6. 🌓 Modern UI & Polish
- Seamless **Dark & Light Mode** toggle with local storage persistence.
- Sleek glassmorphism aesthetic, atmospheric glow blobs, and responsive layout for mobile and desktop screens.
- **Persistent Data**: Changes and applications are saved locally via `localStorage`. A **"Reset Demo Data"** button lets you restore initial states anytime.

---

## 🚀 How to Run the Website

### Option 1: Instant Browser Launch (Recommended — Zero Setup)
1. Navigate to the project directory:
   ```
   C:\Users\mohda\.gemini\antigravity\scratch\student-skill-team-finder
   ```
2. Double-click **`index.html`** or right-click and choose **Open with > Chrome / Edge / Firefox**.
3. That's it! The full application runs directly in your browser with all interactive features enabled.

### Option 2: Full-Stack Python Flask Server (Optional)
If you have Python installed:
```bash
cd C:\Users\mohda\.gemini\antigravity\scratch\student-skill-team-finder
pip install -r requirements.txt
python database.py    # Seeds the SQLite database
python app.py         # Starts the Flask server at http://127.0.0.1:5000
```

---

## 📁 Project Structure

```
student-skill-team-finder/
├── index.html              # Standalone web application (Open directly in browser)
├── css/
│   └── style.css           # Modern design system (Dark/Light theme, glassmorphism)
├── js/
│   ├── data.js             # Initial dataset & LocalStorage state manager
│   └── app.js              # Application controller, matchmaking algorithm & UI logic
├── static/                 # Static assets for Flask deployment
│   ├── css/style.css
│   └── js/
│       ├── data.js
│       └── app.js
├── templates/
│   └── index.html          # Jinja2 Flask template
├── database/
│   └── students.db         # SQLite database file
├── database.py             # SQLite schema and demonstration seeding script
├── app.py                  # Optional Flask REST API server
├── requirements.txt        # Flask dependencies
└── README.md               # Documentation
```

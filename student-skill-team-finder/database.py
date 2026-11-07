"""
database.py - Database connection, schema definition, and seeding for
Student Skill & Project Team Finder.
"""

import os
import sqlite3
from werkzeug.security import generate_password_hash

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "database", "students.db")


def get_db_connection():
    """Establish and return an SQLite connection with Row factory and foreign keys enabled."""
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn


def init_db():
    """Create all necessary tables for the application if they do not exist."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT DEFAULT 'student',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)

    # 2. Student Profiles table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS student_profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER UNIQUE NOT NULL,
            full_name TEXT NOT NULL,
            avatar TEXT DEFAULT 'avatar-1.png',
            college_name TEXT NOT NULL,
            course TEXT NOT NULL,
            branch TEXT NOT NULL,
            semester TEXT NOT NULL,
            bio TEXT,
            experience TEXT,
            github_url TEXT,
            linkedin_url TEXT,
            availability TEXT DEFAULT 'Actively Looking',
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        );
    """)

    # 3. Skills master table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS skills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL COLLATE NOCASE,
            category TEXT NOT NULL CHECK (category IN ('Technical', 'Non-Technical'))
        );
    """)

    # 4. Student Skills (association table)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS student_skills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            skill_id INTEGER NOT NULL,
            proficiency TEXT DEFAULT 'Intermediate',
            UNIQUE(student_id, skill_id),
            FOREIGN KEY (student_id) REFERENCES student_profiles (id) ON DELETE CASCADE,
            FOREIGN KEY (skill_id) REFERENCES skills (id) ON DELETE CASCADE
        );
    """)

    # 5. Projects table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            owner_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            category TEXT NOT NULL,
            team_size INTEGER NOT NULL DEFAULT 4,
            available_positions TEXT NOT NULL,
            status TEXT DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Completed')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
        );
    """)

    # 6. Project Required Skills (association table)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS project_required_skills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER NOT NULL,
            skill_id INTEGER NOT NULL,
            UNIQUE(project_id, skill_id),
            FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
            FOREIGN KEY (skill_id) REFERENCES skills (id) ON DELETE CASCADE
        );
    """)

    # 7. Join Requests table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS join_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER NOT NULL,
            student_id INTEGER NOT NULL,
            role_applied TEXT,
            message TEXT,
            status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Accepted', 'Rejected')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(project_id, student_id),
            FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
            FOREIGN KEY (student_id) REFERENCES users (id) ON DELETE CASCADE
        );
    """)

    # 8. Project Members table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS project_members (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            role TEXT DEFAULT 'Member',
            joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(project_id, user_id),
            FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        );
    """)

    # 9. In-App Notifications table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            type TEXT DEFAULT 'info',
            link TEXT,
            is_read INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        );
    """)

    conn.commit()
    conn.close()
    print("Database tables initialized successfully.")


def seed_database():
    """Populate database with rich initial sample data for students, skills, projects, and requests."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # Only seed if no users exist
    cursor.execute("SELECT COUNT(*) as count FROM users;")
    if cursor.fetchone()["count"] > 0:
        conn.close()
        return

    print("Seeding database with realistic demonstration data...")

    # Master list of skills
    master_skills = [
        # Technical
        ("Python", "Technical"),
        ("JavaScript", "Technical"),
        ("React", "Technical"),
        ("Flask", "Technical"),
        ("Node.js", "Technical"),
        ("Django", "Technical"),
        ("TypeScript", "Technical"),
        ("HTML5 & CSS3", "Technical"),
        ("SQL & SQLite", "Technical"),
        ("MongoDB", "Technical"),
        ("PyTorch", "Technical"),
        ("TensorFlow", "Technical"),
        ("Scikit-Learn", "Technical"),
        ("Data Visualization", "Technical"),
        ("Docker", "Technical"),
        ("Kubernetes", "Technical"),
        ("AWS", "Technical"),
        ("Git & GitHub", "Technical"),
        ("Flutter", "Technical"),
        ("React Native", "Technical"),
        ("C++", "Technical"),
        ("Embedded Systems & IoT", "Technical"),
        ("Solidity", "Technical"),
        ("Cybersecurity", "Technical"),
        ("Figma / UI/UX Design", "Technical"),
        # Non-Technical
        ("Project Management", "Non-Technical"),
        ("Public Speaking & Pitching", "Non-Technical"),
        ("Technical Writing & Documentation", "Non-Technical"),
        ("Team Leadership", "Non-Technical"),
        ("Agile & Scrum", "Non-Technical"),
        ("Problem Solving", "Non-Technical"),
        ("UI/UX Research", "Non-Technical"),
    ]

    for name, cat in master_skills:
        cursor.execute("INSERT OR IGNORE INTO skills (name, category) VALUES (?, ?);", (name, cat))

    conn.commit()

    # Pre-calculated password hash for 'password123'
    hashed_pwd = generate_password_hash("password123")

    # Sample Students List
    students_data = [
        {
            "email": "alex@campus.edu",
            "full_name": "Alex Rivera",
            "avatar": "avatar-alex",
            "college_name": "Apex Institute of Technology",
            "course": "B.Tech",
            "branch": "Computer Science & Engineering",
            "semester": "6th Semester",
            "bio": "Passionate Full-Stack Developer interested in scalable web architecture, clean API design, and environmental tech solutions.",
            "experience": "Built an open-source student course planner used by 800+ college peers. Interned as Backend Intern at NextGen Software.",
            "github_url": "https://github.com/alexrivera-dev",
            "linkedin_url": "https://linkedin.com/in/alex-rivera-tech",
            "availability": "Actively Looking",
            "skills": [
                ("Python", "Expert"),
                ("Flask", "Advanced"),
                ("React", "Advanced"),
                ("JavaScript", "Advanced"),
                ("SQL & SQLite", "Advanced"),
                ("Git & GitHub", "Expert"),
                ("Team Leadership", "Advanced"),
                ("Agile & Scrum", "Intermediate"),
            ],
        },
        {
            "email": "priya@campus.edu",
            "full_name": "Priya Sharma",
            "avatar": "avatar-priya",
            "college_name": "Metro Institute of Technology",
            "course": "B.Tech",
            "branch": "Artificial Intelligence & Data Science",
            "semester": "6th Semester",
            "bio": "AI & Deep Learning researcher focusing on Computer Vision and NLP. Eager to solve real-world problems with robust machine learning models.",
            "experience": "Published a research paper on YOLOv8 object detection for campus surveillance. Won 2nd place in Smart India Hackathon.",
            "github_url": "https://github.com/priyasharma-ai",
            "linkedin_url": "https://linkedin.com/in/priya-sharma-ai",
            "availability": "Actively Looking",
            "skills": [
                ("Python", "Expert"),
                ("PyTorch", "Advanced"),
                ("TensorFlow", "Advanced"),
                ("Scikit-Learn", "Expert"),
                ("Data Visualization", "Advanced"),
                ("SQL & SQLite", "Intermediate"),
                ("Technical Writing & Documentation", "Advanced"),
                ("Problem Solving", "Expert"),
            ],
        },
        {
            "email": "david@campus.edu",
            "full_name": "David Chen",
            "avatar": "avatar-david",
            "college_name": "National College of Engineering",
            "course": "B.Tech",
            "branch": "Information Technology",
            "semester": "4th Semester",
            "bio": "Frontend designer & Cross-Platform Mobile Engineer. Obsessed with micro-interactions, responsive accessibility, and design systems.",
            "experience": "Created 3 production-ready mobile apps on Flutter and designed 10+ Figma web app kits for local startups.",
            "github_url": "https://github.com/davidchen-ui",
            "linkedin_url": "https://linkedin.com/in/davidchen-design",
            "availability": "Open to Offers",
            "skills": [
                ("Flutter", "Advanced"),
                ("React Native", "Intermediate"),
                ("Figma / UI/UX Design", "Expert"),
                ("HTML5 & CSS3", "Expert"),
                ("JavaScript", "Advanced"),
                ("UI/UX Research", "Advanced"),
                ("Public Speaking & Pitching", "Intermediate"),
            ],
        },
        {
            "email": "sara@campus.edu",
            "full_name": "Sara Jenkins",
            "avatar": "avatar-sara",
            "college_name": "Apex Institute of Technology",
            "course": "B.Tech",
            "branch": "Computer Science & Engineering",
            "semester": "8th Semester",
            "bio": "Cloud DevOps enthusiast and infrastructure automation specialist. Passionate about Kubernetes, CI/CD pipelines, and cloud reliability.",
            "experience": "Maintained Kubernetes staging clusters during my summer cloud internship at CloudSprint Systems.",
            "github_url": "https://github.com/sarajenkins-ops",
            "linkedin_url": "https://linkedin.com/in/sara-jenkins-cloud",
            "availability": "Actively Looking",
            "skills": [
                ("Docker", "Expert"),
                ("Kubernetes", "Advanced"),
                ("AWS", "Advanced"),
                ("Python", "Intermediate"),
                ("Git & GitHub", "Expert"),
                ("Project Management", "Advanced"),
                ("Team Leadership", "Advanced"),
            ],
        },
        {
            "email": "rohan@campus.edu",
            "full_name": "Rohan Patel",
            "avatar": "avatar-rohan",
            "college_name": "Federal Institute of Science & Technology",
            "course": "B.Tech",
            "branch": "Electronics & Communication",
            "semester": "4th Semester",
            "bio": "Hardware-software integration specialist working with ESP32, Raspberry Pi, and edge IoT algorithms.",
            "experience": "Built a smart greenhouse sensor system monitoring humidity, soil pH, and solar automated misting.",
            "github_url": "https://github.com/rohanpatel-iot",
            "linkedin_url": "https://linkedin.com/in/rohanpatel-embedded",
            "availability": "Open to Offers",
            "skills": [
                ("C++", "Advanced"),
                ("Embedded Systems & IoT", "Expert"),
                ("Python", "Advanced"),
                ("SQL & SQLite", "Intermediate"),
                ("Problem Solving", "Advanced"),
            ],
        },
        {
            "email": "elena@campus.edu",
            "full_name": "Elena Rostova",
            "avatar": "avatar-elena",
            "college_name": "Metro Institute of Technology",
            "course": "B.Sc",
            "branch": "Data Science & Analytics",
            "semester": "6th Semester",
            "bio": "Data storyteller who translates complex dataset anomalies into intuitive visual dashboards and predictive insights.",
            "experience": "Analyzed metropolitan public transport datasets for predictive delay mitigation; presented findings at IEEE student symposium.",
            "github_url": "https://github.com/elena-data",
            "linkedin_url": "https://linkedin.com/in/elena-rostova-data",
            "availability": "Actively Looking",
            "skills": [
                ("Python", "Advanced"),
                ("SQL & SQLite", "Expert"),
                ("Data Visualization", "Expert"),
                ("Scikit-Learn", "Advanced"),
                ("Technical Writing & Documentation", "Expert"),
            ],
        },
        {
            "email": "marcus@campus.edu",
            "full_name": "Marcus Vance",
            "avatar": "avatar-marcus",
            "college_name": "National College of Engineering",
            "course": "B.Tech",
            "branch": "Computer Science & Engineering",
            "semester": "8th Semester",
            "bio": "Security researcher and Web3 developer passionate about decentralized governance and cryptography-verified credentials.",
            "experience": "Conducted smart contract security audits for campus club DAO; achieved Top 5% in National Cyber CTF.",
            "github_url": "https://github.com/marcusvance-sec",
            "linkedin_url": "https://linkedin.com/in/marcus-vance-cyber",
            "availability": "Busy / Unavailable",
            "skills": [
                ("Solidity", "Advanced"),
                ("Cybersecurity", "Expert"),
                ("Python", "Intermediate"),
                ("Git & GitHub", "Advanced"),
                ("Public Speaking & Pitching", "Advanced"),
            ],
        },
        {
            "email": "amina@campus.edu",
            "full_name": "Amina Diallo",
            "avatar": "avatar-amina",
            "college_name": "Apex Institute of Technology",
            "course": "B.Tech",
            "branch": "Information Technology",
            "semester": "4th Semester",
            "bio": "Modern web craftswoman specializing in TypeScript, animated UI component libraries, and performant web applications.",
            "experience": "Freelance frontend engineer building high-conversion interfaces; contributor to Tailwind CSS community templates.",
            "github_url": "https://github.com/aminadiallo-dev",
            "linkedin_url": "https://linkedin.com/in/amina-diallo-web",
            "availability": "Actively Looking",
            "skills": [
                ("TypeScript", "Expert"),
                ("React", "Expert"),
                ("HTML5 & CSS3", "Expert"),
                ("JavaScript", "Expert"),
                ("Figma / UI/UX Design", "Advanced"),
                ("Agile & Scrum", "Intermediate"),
            ],
        },
    ]

    # Map skill name to ID
    cursor.execute("SELECT id, name FROM skills;")
    skill_map = {row["name"].lower(): row["id"] for row in cursor.fetchall()}

    user_ids = {}
    profile_ids = {}

    for s in students_data:
        cursor.execute(
            "INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?);",
            (s["email"], hashed_pwd, "student"),
        )
        uid = cursor.lastrowid
        user_ids[s["email"]] = uid

        cursor.execute(
            """INSERT INTO student_profiles 
               (user_id, full_name, avatar, college_name, course, branch, semester, bio, experience, github_url, linkedin_url, availability)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);""",
            (
                uid,
                s["full_name"],
                s["avatar"],
                s["college_name"],
                s["course"],
                s["branch"],
                s["semester"],
                s["bio"],
                s["experience"],
                s["github_url"],
                s["linkedin_url"],
                s["availability"],
            ),
        )
        pid = cursor.lastrowid
        profile_ids[uid] = pid

        # Insert student skills
        for sk_name, prof in s["skills"]:
            sk_id = skill_map.get(sk_name.lower())
            if sk_id:
                cursor.execute(
                    "INSERT OR IGNORE INTO student_skills (student_id, skill_id, proficiency) VALUES (?, ?, ?);",
                    (pid, sk_id, prof),
                )

    conn.commit()

    # Sample Projects
    projects_data = [
        {
            "owner_email": "alex@campus.edu",
            "title": "EcoTrack: Campus Carbon & Energy Audit Dashboard",
            "description": "An automated campus sustainability tracking platform that aggregates energy consumption metrics, waste management data, and solar generation telemetry into a real-time analytics dashboard with gamified sustainability leaderboards.",
            "category": "Web Development",
            "team_size": 4,
            "available_positions": "Frontend UI Developer, Data Analyst, Cloud Deployer",
            "status": "Open",
            "required_skills": ["Python", "Flask", "React", "Data Visualization", "Docker"],
            "initial_members": [
                ("alex@campus.edu", "Project Lead & Full-Stack Architect"),
                ("elena@campus.edu", "Data Analyst & Insights"),
            ],
        },
        {
            "owner_email": "priya@campus.edu",
            "title": "Smart Vision: Automated Contactless Attendance System",
            "description": "An edge AI-powered facial recognition attendance system designed for lecture halls. Features multi-camera stream processing, anti-spoofing liveness detection, and instant synchronization with student management portals.",
            "category": "AI / Machine Learning",
            "team_size": 4,
            "available_positions": "Computer Vision Engineer, Backend API Developer, Mobile App Engineer",
            "status": "Open",
            "required_skills": ["Python", "PyTorch", "TensorFlow", "Flask", "Flutter"],
            "initial_members": [
                ("priya@campus.edu", "ML & Vision Lead"),
            ],
        },
        {
            "owner_email": "sara@campus.edu",
            "title": "DevSphere: Multi-Cloud Automated CI/CD Canary Testing",
            "description": "A developer-focused container orchestration utility that provisions lightweight preview environments per GitHub pull request, runs automated regression tests, and manages zero-downtime canary rollouts on Kubernetes.",
            "category": "Cloud & DevOps",
            "team_size": 3,
            "available_positions": "Kubernetes Specialist, Python Automation Scripting, Documentation Lead",
            "status": "Open",
            "required_skills": ["Docker", "Kubernetes", "AWS", "Python", "Technical Writing & Documentation"],
            "initial_members": [
                ("sara@campus.edu", "DevOps Lead"),
            ],
        },
        {
            "owner_email": "rohan@campus.edu",
            "title": "AgriSense: Smart Edge Sensor Mesh for Precision Agriculture",
            "description": "A low-power LoRaWAN sensor network coupled with microcontrollers to monitor soil moisture, leaf wetness, and ambient micro-climates, providing automated irrigation scheduling via an intuitive mobile app.",
            "category": "IoT & Embedded",
            "team_size": 3,
            "available_positions": "Firmware Developer, Mobile App Developer",
            "status": "Open",
            "required_skills": ["Embedded Systems & IoT", "C++", "Flutter", "Python"],
            "initial_members": [
                ("rohan@campus.edu", "Hardware & Firmware Lead"),
                ("david@campus.edu", "Mobile UI Lead"),
            ],
        },
        {
            "owner_email": "marcus@campus.edu",
            "title": "VeriCred: Blockchain Academic Credential Verification",
            "description": "A decentralized verification protocol for college transcripts, course diplomas, and hackathon certificates using smart contracts and verifiable credentials, preventing academic forgery.",
            "category": "Cybersecurity",
            "team_size": 4,
            "available_positions": "Smart Contract Auditor, Web3 Frontend Integrator",
            "status": "Open",
            "required_skills": ["Solidity", "Cybersecurity", "React", "TypeScript"],
            "initial_members": [
                ("marcus@campus.edu", "Smart Contract Architect"),
                ("amina@campus.edu", "Web3 Frontend Engineer"),
            ],
        },
    ]

    project_id_map = {}

    for p in projects_data:
        owner_id = user_ids[p["owner_email"]]
        cursor.execute(
            """INSERT INTO projects (owner_id, title, description, category, team_size, available_positions, status)
               VALUES (?, ?, ?, ?, ?, ?, ?);""",
            (owner_id, p["title"], p["description"], p["category"], p["team_size"], p["available_positions"], p["status"]),
        )
        proj_id = cursor.lastrowid
        project_id_map[p["title"]] = proj_id

        # Insert required skills
        for sk in p["required_skills"]:
            sk_id = skill_map.get(sk.lower())
            if sk_id:
                cursor.execute(
                    "INSERT OR IGNORE INTO project_required_skills (project_id, skill_id) VALUES (?, ?);",
                    (proj_id, sk_id),
                )

        # Insert initial members
        for member_email, role in p["initial_members"]:
            m_uid = user_ids[member_email]
            cursor.execute(
                "INSERT OR IGNORE INTO project_members (project_id, user_id, role) VALUES (?, ?, ?);",
                (proj_id, m_uid, role),
            )

    conn.commit()

    # Sample Join Requests
    # 1. David Chen requesting to join EcoTrack as Frontend UI Developer
    proj1_id = project_id_map["EcoTrack: Campus Carbon & Energy Audit Dashboard"]
    david_uid = user_ids["david@campus.edu"]
    alex_uid = user_ids["alex@campus.edu"]

    cursor.execute(
        """INSERT OR IGNORE INTO join_requests (project_id, student_id, role_applied, message, status)
           VALUES (?, ?, ?, ?, ?);""",
        (
            proj1_id,
            david_uid,
            "Frontend UI Developer",
            "Hi Alex! I have extensive experience in responsive UI design and React component systems. I'd love to craft the dashboard visualization screens for EcoTrack!",
            "Pending",
        ),
    )

    # 2. Amina Diallo requesting to join Smart Vision
    proj2_id = project_id_map["Smart Vision: Automated Contactless Attendance System"]
    amina_uid = user_ids["amina@campus.edu"]
    priya_uid = user_ids["priya@campus.edu"]

    cursor.execute(
        """INSERT OR IGNORE INTO join_requests (project_id, student_id, role_applied, message, status)
           VALUES (?, ?, ?, ?, ?);""",
        (
            proj2_id,
            amina_uid,
            "Mobile App Engineer",
            "Hey Priya, I love this project concept. I have built cross-platform React Native and Flutter attendance interfaces before and would be thrilled to join.",
            "Pending",
        ),
    )

    # Initial Notifications
    # Notification for Alex regarding David's join request
    cursor.execute(
        """INSERT INTO notifications (user_id, title, message, type, link, is_read)
           VALUES (?, ?, ?, ?, ?, ?);""",
        (
            alex_uid,
            "New Team Join Request",
            "David Chen has requested to join 'EcoTrack' as Frontend UI Developer.",
            "request",
            "/requests",
            0,
        ),
    )

    # Welcome notifications
    cursor.execute(
        """INSERT INTO notifications (user_id, title, message, type, link, is_read)
           VALUES (?, ?, ?, ?, ?, ?);""",
        (
            alex_uid,
            "Welcome to Student Skill Finder!",
            "Your profile is active. Check out the dashboard for smart teammates matching your project requirements.",
            "system",
            "/dashboard",
            0,
        ),
    )

    cursor.execute(
        """INSERT INTO notifications (user_id, title, message, type, link, is_read)
           VALUES (?, ?, ?, ?, ?, ?);""",
        (
            priya_uid,
            "New Team Join Request",
            "Amina Diallo has requested to join 'Smart Vision' as Mobile App Engineer.",
            "request",
            "/requests",
            0,
        ),
    )

    conn.commit()
    conn.close()
    print("Database seeding completed successfully!")


if __name__ == "__main__":
    init_db()
    seed_database()

/**
 * data.js - Initial Seed Data and LocalStorage State Manager
 * SkillSync - Student Skill & Project Team Finder
 */

const DEFAULT_DATA = {
    currentUser: {
        id: "user_current",
        name: "Alex Rivera",
        role: "Full-Stack Developer",
        college: "Apex Institute of Technology",
        course: "B.Tech",
        branch: "Computer Science & Engineering",
        semester: "6th Semester",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
        bio: "Passionate Full-Stack Developer interested in scalable web architecture, clean API design, and environmental tech solutions. Always ready for high-impact hackathons!",
        experience: "Built an open-source student course planner used by 800+ college peers. Interned as Backend Intern at NextGen Software. SIH 2024 Finalist.",
        github: "https://github.com/alexrivera-dev",
        linkedin: "https://linkedin.com/in/alex-rivera-tech",
        availability: "Actively Looking",
        primaryDomain: "Full Stack Web",
        skills: [
            { name: "Python", level: "Expert", category: "Technical" },
            { name: "Flask", level: "Advanced", category: "Technical" },
            { name: "React", level: "Advanced", category: "Technical" },
            { name: "JavaScript", level: "Advanced", category: "Technical" },
            { name: "SQL & SQLite", level: "Advanced", category: "Technical" },
            { name: "Git & GitHub", level: "Expert", category: "Technical" },
            { name: "Docker", level: "Intermediate", category: "Technical" },
            { name: "Team Leadership", level: "Advanced", category: "Non-Technical" },
            { name: "Agile & Scrum", level: "Intermediate", category: "Non-Technical" }
        ]
    },

    students: [
        {
            id: "std_1",
            name: "Priya Sharma",
            role: "AI / ML Researcher & Vision Specialist",
            college: "Metro Institute of Technology",
            course: "B.Tech",
            branch: "Artificial Intelligence & Data Science",
            semester: "6th Semester",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80",
            bio: "AI & Deep Learning researcher focusing on Computer Vision, YOLOv8, and NLP. Eager to solve real-world problems with robust machine learning models.",
            experience: "Published a research paper on YOLOv8 object detection for campus surveillance. Won 2nd place in Smart India Hackathon 2024.",
            github: "https://github.com/priyasharma-ai",
            linkedin: "https://linkedin.com/in/priya-sharma-ai",
            availability: "Actively Looking",
            primaryDomain: "AI / Machine Learning",
            rating: 4.9,
            projectsCount: 6,
            skills: [
                { name: "Python", level: "Expert", category: "Technical" },
                { name: "PyTorch", level: "Advanced", category: "Technical" },
                { name: "TensorFlow", level: "Advanced", category: "Technical" },
                { name: "Scikit-Learn", level: "Expert", category: "Technical" },
                { name: "Data Visualization", level: "Advanced", category: "Technical" },
                { name: "OpenCV", level: "Advanced", category: "Technical" },
                { name: "Technical Writing", level: "Advanced", category: "Non-Technical" },
                { name: "Problem Solving", level: "Expert", category: "Non-Technical" }
            ]
        },
        {
            id: "std_2",
            name: "David Chen",
            role: "UI/UX Designer & Flutter Mobile Dev",
            college: "National College of Engineering",
            course: "B.Tech",
            branch: "Information Technology",
            semester: "4th Semester",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
            bio: "Frontend designer & Cross-Platform Mobile Engineer. Obsessed with micro-interactions, responsive accessibility, and polished design systems.",
            experience: "Created 3 production-ready mobile apps on Flutter and designed 10+ Figma web app kits for local campus startups.",
            github: "https://github.com/davidchen-ui",
            linkedin: "https://linkedin.com/in/davidchen-design",
            availability: "Open to Offers",
            primaryDomain: "Mobile & UI/UX",
            rating: 4.8,
            projectsCount: 7,
            skills: [
                { name: "Flutter", level: "Advanced", category: "Technical" },
                { name: "Figma / UI/UX Design", level: "Expert", category: "Technical" },
                { name: "HTML5 & CSS3", level: "Expert", category: "Technical" },
                { name: "JavaScript", level: "Advanced", category: "Technical" },
                { name: "React Native", level: "Intermediate", category: "Technical" },
                { name: "UI/UX Research", level: "Advanced", category: "Non-Technical" },
                { name: "Public Speaking", level: "Intermediate", category: "Non-Technical" }
            ]
        },
        {
            id: "std_3",
            name: "Sara Jenkins",
            role: "Cloud DevOps & Infrastructure Engineer",
            college: "Apex Institute of Technology",
            course: "B.Tech",
            branch: "Computer Science & Engineering",
            semester: "8th Semester",
            avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80",
            bio: "Cloud DevOps enthusiast and infrastructure automation specialist. Passionate about Kubernetes, CI/CD pipelines, Terraform, and cloud reliability.",
            experience: "Maintained Kubernetes staging clusters during summer cloud internship at CloudSprint Systems. AWS Certified Cloud Practitioner.",
            github: "https://github.com/sarajenkins-ops",
            linkedin: "https://linkedin.com/in/sara-jenkins-cloud",
            availability: "Actively Looking",
            primaryDomain: "Cloud & DevOps",
            rating: 4.9,
            projectsCount: 5,
            skills: [
                { name: "Docker", level: "Expert", category: "Technical" },
                { name: "Kubernetes", level: "Advanced", category: "Technical" },
                { name: "AWS", level: "Advanced", category: "Technical" },
                { name: "Python", level: "Intermediate", category: "Technical" },
                { name: "Git & GitHub", level: "Expert", category: "Technical" },
                { name: "Linux Administration", level: "Advanced", category: "Technical" },
                { name: "Project Management", level: "Advanced", category: "Non-Technical" },
                { name: "Team Leadership", level: "Advanced", category: "Non-Technical" }
            ]
        },
        {
            id: "std_4",
            name: "Rohan Patel",
            role: "IoT, Embedded Systems & Robotics Engineer",
            college: "Federal Institute of Science & Technology",
            course: "B.Tech",
            branch: "Electronics & Communication",
            semester: "4th Semester",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80",
            bio: "Hardware-software integration specialist working with ESP32, Arduino, Raspberry Pi, and edge IoT telemetry algorithms.",
            experience: "Built a smart greenhouse sensor system monitoring humidity, soil pH, and solar automated misting with real-time MQTT feed.",
            github: "https://github.com/rohanpatel-iot",
            linkedin: "https://linkedin.com/in/rohanpatel-embedded",
            availability: "Open to Offers",
            primaryDomain: "IoT & Hardware",
            rating: 4.7,
            projectsCount: 4,
            skills: [
                { name: "C++", level: "Advanced", category: "Technical" },
                { name: "Embedded Systems & IoT", level: "Expert", category: "Technical" },
                { name: "Python", level: "Advanced", category: "Technical" },
                { name: "MQTT & LoRa", level: "Advanced", category: "Technical" },
                { name: "Circuit Design", level: "Intermediate", category: "Technical" },
                { name: "Problem Solving", level: "Advanced", category: "Non-Technical" }
            ]
        },
        {
            id: "std_5",
            name: "Elena Rostova",
            role: "Data Analyst & Business Intelligence Specialist",
            college: "Metro Institute of Technology",
            course: "B.Sc",
            branch: "Data Science & Analytics",
            semester: "6th Semester",
            avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80",
            bio: "Data storyteller who translates complex dataset anomalies into intuitive visual dashboards and predictive business insights.",
            experience: "Analyzed metropolitan public transport datasets for predictive delay mitigation; presented findings at IEEE student symposium.",
            github: "https://github.com/elena-data",
            linkedin: "https://linkedin.com/in/elena-rostova-data",
            availability: "Actively Looking",
            primaryDomain: "Data Science & Analytics",
            rating: 4.8,
            projectsCount: 8,
            skills: [
                { name: "Python", level: "Advanced", category: "Technical" },
                { name: "SQL & SQLite", level: "Expert", category: "Technical" },
                { name: "Data Visualization", level: "Expert", category: "Technical" },
                { name: "Tableau & PowerBI", level: "Advanced", category: "Technical" },
                { name: "Scikit-Learn", level: "Advanced", category: "Technical" },
                { name: "Technical Writing", level: "Expert", category: "Non-Technical" }
            ]
        },
        {
            id: "std_6",
            name: "Marcus Vance",
            role: "Cybersecurity & Blockchain Smart Contracts",
            college: "National College of Engineering",
            course: "B.Tech",
            branch: "Computer Science & Engineering",
            semester: "8th Semester",
            avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=250&q=80",
            bio: "Security researcher and Web3 developer passionate about decentralized governance, penetration testing, and cryptography-verified credentials.",
            experience: "Conducted smart contract security audits for campus club DAO; achieved Top 5% in National Cyber CTF challenge.",
            github: "https://github.com/marcusvance-sec",
            linkedin: "https://linkedin.com/in/marcus-vance-cyber",
            availability: "Open to Offers",
            primaryDomain: "Cybersecurity & Web3",
            rating: 4.9,
            projectsCount: 5,
            skills: [
                { name: "Solidity", level: "Advanced", category: "Technical" },
                { name: "Cybersecurity", level: "Expert", category: "Technical" },
                { name: "Python", level: "Intermediate", category: "Technical" },
                { name: "Git & GitHub", level: "Advanced", category: "Technical" },
                { name: "Cryptography", level: "Advanced", category: "Technical" },
                { name: "Public Speaking", level: "Advanced", category: "Non-Technical" }
            ]
        },
        {
            id: "std_7",
            name: "Amina Diallo",
            role: "Frontend Craftswoman & React / TypeScript Specialist",
            college: "Apex Institute of Technology",
            course: "B.Tech",
            branch: "Information Technology",
            semester: "4th Semester",
            avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=250&q=80",
            bio: "Modern web craftswoman specializing in TypeScript, animated UI component libraries, and performant web applications with slick aesthetics.",
            experience: "Freelance frontend engineer building high-conversion interfaces; contributor to popular open-source Tailwind CSS community templates.",
            github: "https://github.com/aminadiallo-dev",
            linkedin: "https://linkedin.com/in/amina-diallo-web",
            availability: "Actively Looking",
            primaryDomain: "Frontend Web",
            rating: 4.9,
            projectsCount: 6,
            skills: [
                { name: "TypeScript", level: "Expert", category: "Technical" },
                { name: "React", level: "Expert", category: "Technical" },
                { name: "HTML5 & CSS3", level: "Expert", category: "Technical" },
                { name: "JavaScript", level: "Expert", category: "Technical" },
                { name: "Tailwind CSS", level: "Expert", category: "Technical" },
                { name: "Figma / UI/UX Design", level: "Advanced", category: "Technical" },
                { name: "Agile & Scrum", level: "Intermediate", category: "Non-Technical" }
            ]
        },
        {
            id: "std_8",
            name: "Karan Verma",
            role: "Backend Architect & Cloud Systems Engineer",
            college: "Federal Institute of Science & Technology",
            course: "B.Tech",
            branch: "Computer Science & Engineering",
            semester: "6th Semester",
            avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=250&q=80",
            bio: "Microservices enthusiast, high-concurrency database designer, and Go/Node.js practitioner with an appetite for distributed systems.",
            experience: "Developed a distributed caching tier reducing campus portal response time by 60%. Active competitive programmer (Codeforces Candidate Master).",
            github: "https://github.com/karanverma-core",
            linkedin: "https://linkedin.com/in/karanverma-backend",
            availability: "Actively Looking",
            primaryDomain: "Backend & Systems",
            rating: 4.8,
            projectsCount: 5,
            skills: [
                { name: "Node.js", level: "Expert", category: "Technical" },
                { name: "Python", level: "Advanced", category: "Technical" },
                { name: "MongoDB", level: "Advanced", category: "Technical" },
                { name: "SQL & SQLite", level: "Expert", category: "Technical" },
                { name: "Docker", level: "Advanced", category: "Technical" },
                { name: "Redis", level: "Advanced", category: "Technical" },
                { name: "Problem Solving", level: "Expert", category: "Non-Technical" }
            ]
        }
    ],

    projects: [
        {
            id: "proj_1",
            title: "EcoTrack: Campus Carbon & Energy Audit Dashboard",
            category: "Web Development",
            leadName: "Alex Rivera",
            leadAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
            leadEmail: "alex@campus.edu",
            college: "Apex Institute of Technology",
            description: "An automated campus sustainability tracking platform that aggregates energy consumption metrics, waste management data, and solar telemetry into a real-time analytics dashboard with gamified sustainability leaderboards.",
            eventTarget: "Smart India Hackathon 2025",
            teamSize: 4,
            currentMembers: [
                { name: "Alex Rivera", role: "Project Lead & Full-Stack Architect", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80" },
                { name: "Elena Rostova", role: "Data Analyst & Insights", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80" }
            ],
            availablePositions: ["Frontend UI Developer", "Cloud Deployer"],
            requiredSkills: ["React", "Python", "Flask", "Data Visualization", "Docker"],
            status: "Open",
            createdDate: "2 days ago",
            views: 142
        },
        {
            id: "proj_2",
            title: "SmartVision: Automated Contactless Attendance System",
            category: "AI / Machine Learning",
            leadName: "Priya Sharma",
            leadAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80",
            leadEmail: "priya@campus.edu",
            college: "Metro Institute of Technology",
            description: "An edge AI-powered facial recognition attendance system designed for university lecture halls. Features multi-camera stream processing, anti-spoofing liveness detection, and instant sync with student management ERP.",
            eventTarget: "National AI Innovation Challenge",
            teamSize: 4,
            currentMembers: [
                { name: "Priya Sharma", role: "ML & Vision Lead", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80" }
            ],
            availablePositions: ["Backend API Developer", "Mobile App Engineer", "UI Designer"],
            requiredSkills: ["Python", "PyTorch", "TensorFlow", "Flutter", "Flask"],
            status: "Open",
            createdDate: "Just now",
            views: 218
        },
        {
            id: "proj_3",
            title: "AgriSense: Smart LoRa Edge Sensor Mesh for Precision Farming",
            category: "IoT & Hardware",
            leadName: "Rohan Patel",
            leadAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80",
            leadEmail: "rohan@campus.edu",
            college: "Federal Institute of Science & Technology",
            description: "A low-power LoRaWAN sensor network coupled with microcontrollers to monitor soil moisture, leaf temperature, and ambient micro-climates, providing automated drip irrigation scheduling via an offline-first mobile app.",
            eventTarget: "AgroTech Capstone 2025",
            teamSize: 3,
            currentMembers: [
                { name: "Rohan Patel", role: "Hardware & Firmware Lead", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80" },
                { name: "David Chen", role: "Mobile UI Lead", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80" }
            ],
            availablePositions: ["Cloud Backend Developer"],
            requiredSkills: ["Embedded Systems & IoT", "C++", "Flutter", "Python"],
            status: "Open",
            createdDate: "1 day ago",
            views: 95
        },
        {
            id: "proj_4",
            title: "VeriCred: Blockchain Academic Credential Verification",
            category: "Cybersecurity & Web3",
            leadName: "Marcus Vance",
            leadAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=250&q=80",
            leadEmail: "marcus@campus.edu",
            college: "National College of Engineering",
            description: "A decentralized verification protocol for college transcripts, course diplomas, and hackathon awards using zero-knowledge proofs and smart contracts to eradicate credential fraud in recruitment.",
            eventTarget: "ETHIndia Hackathon",
            teamSize: 4,
            currentMembers: [
                { name: "Marcus Vance", role: "Smart Contract Architect", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=250&q=80" },
                { name: "Amina Diallo", role: "Web3 Frontend Engineer", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=250&q=80" }
            ],
            availablePositions: ["Smart Contract Auditor", "Backend Node.js Developer"],
            requiredSkills: ["Solidity", "Cybersecurity", "React", "TypeScript", "Node.js"],
            status: "Open",
            createdDate: "3 days ago",
            views: 180
        },
        {
            id: "proj_5",
            title: "DevSphere: Multi-Cloud Automated CI/CD Canary Testing",
            category: "Cloud & DevOps",
            leadName: "Sara Jenkins",
            leadAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80",
            leadEmail: "sara@campus.edu",
            college: "Apex Institute of Technology",
            description: "A developer utility that automatically provisions lightweight staging preview clusters per GitHub pull request, executes load tests, and governs zero-downtime canary rollouts on Kubernetes.",
            eventTarget: "DevOps Global Summit Hackathon",
            teamSize: 3,
            currentMembers: [
                { name: "Sara Jenkins", role: "DevOps Lead", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80" }
            ],
            availablePositions: ["Python Automation Lead", "Frontend Dashboard Developer"],
            requiredSkills: ["Docker", "Kubernetes", "AWS", "Python", "Technical Writing"],
            status: "Open",
            createdDate: "4 days ago",
            views: 110
        },
        {
            id: "proj_6",
            title: "CarePulse: Mental Wellness & Peer Support Chat Platform",
            category: "Mobile & Full Stack",
            leadName: "David Chen",
            leadAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
            leadEmail: "david@campus.edu",
            college: "National College of Engineering",
            description: "An anonymous, campus-moderated mental health listening portal combining empathetic AI check-ins with peer support groups and counselor appointment booking.",
            eventTarget: "Campus Social Good Challenge",
            teamSize: 4,
            currentMembers: [
                { name: "David Chen", role: "Product Lead & UI/UX", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80" }
            ],
            availablePositions: ["Backend Architect", "NLP Sentiment Engineer", "React Mobile Dev"],
            requiredSkills: ["Figma / UI/UX Design", "React", "Node.js", "Python", "MongoDB"],
            status: "Open",
            createdDate: "1 day ago",
            views: 165
        }
    ],

    requests: [
        {
            id: "req_1",
            type: "incoming",
            projectId: "proj_1",
            projectTitle: "EcoTrack: Campus Carbon & Energy Audit Dashboard",
            applicantName: "David Chen",
            applicantAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
            applicantRole: "UI/UX Designer & Flutter Mobile Dev",
            roleApplied: "Frontend UI Developer",
            message: "Hi Alex! I have extensive experience in responsive UI design and React component systems. I'd love to craft the dashboard visualization screens for EcoTrack!",
            skills: ["React", "HTML5 & CSS3", "Figma / UI/UX Design"],
            status: "Pending",
            date: "Today, 10:15 AM"
        },
        {
            id: "req_2",
            type: "outgoing",
            projectId: "proj_2",
            projectTitle: "SmartVision: Automated Contactless Attendance System",
            leadName: "Priya Sharma",
            leadAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80",
            roleApplied: "Backend API Developer",
            message: "Hey Priya, I can build high-performance Flask/FastAPI backend microservices and integrate database caching for the attendance pipeline.",
            status: "Pending",
            date: "Yesterday, 3:45 PM"
        }
    ],

    bookmarks: {
        students: ["std_1", "std_7"],
        projects: ["proj_2"]
    },

    chats: {
        "std_1": [
            { sender: "Priya Sharma", text: "Hey Alex! Loved your EcoTrack project proposal. Are you still seeking someone for the telemetry analytics?", time: "09:30 AM", isMe: false },
            { sender: "You", text: "Hi Priya! Yes, absolutely. Elena is on data analysis, but we'd love Computer Vision or ML insights for campus trash sorting too!", time: "09:35 AM", isMe: true },
            { sender: "Priya Sharma", text: "Awesome! I have a trained YOLOv8 model for waste classification ready. Let's sync up this afternoon!", time: "09:42 AM", isMe: false }
        ]
    },

    categories: [
        "All Categories",
        "Web Development",
        "AI / Machine Learning",
        "Mobile & UI/UX",
        "Cloud & DevOps",
        "IoT & Hardware",
        "Cybersecurity & Web3",
        "Data Science & Analytics"
    ],

    masterSkills: [
        "Python", "JavaScript", "React", "TypeScript", "Node.js", "Flask", "Django",
        "HTML5 & CSS3", "Tailwind CSS", "SQL & SQLite", "MongoDB", "PyTorch", "TensorFlow",
        "Scikit-Learn", "Data Visualization", "Docker", "Kubernetes", "AWS", "Git & GitHub",
        "Flutter", "React Native", "C++", "Embedded Systems & IoT", "Solidity", "Cybersecurity",
        "Figma / UI/UX Design", "Project Management", "Technical Writing", "Public Speaking",
        "Team Leadership", "Agile & Scrum", "Problem Solving"
    ]
};

// Storage Manager helper
class StorageManager {
    static STORAGE_KEY = "SkillSync_AppData_v1";

    static loadData() {
        try {
            const raw = localStorage.getItem(StorageManager.STORAGE_KEY);
            if (raw) {
                return JSON.parse(raw);
            }
        } catch (e) {
            console.warn("Error reading localStorage, reverting to defaults:", e);
        }
        StorageManager.saveData(DEFAULT_DATA);
        return JSON.parse(JSON.stringify(DEFAULT_DATA));
    }

    static saveData(data) {
        try {
            localStorage.setItem(StorageManager.STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error("Error saving data to localStorage:", e);
        }
    }

    static resetToDefault() {
        localStorage.removeItem(StorageManager.STORAGE_KEY);
        return StorageManager.loadData();
    }
}

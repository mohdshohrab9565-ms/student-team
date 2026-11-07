"""
app.py - Flask Web Server for SkillSync (Student Skill & Project Team Finder)
"""

import os
from flask import Flask, render_template, jsonify, request
from database import init_db, seed_database, get_db_connection

app = Flask(__name__)
app.secret_key = os.urandom(24)

# Ensure database is initialized
init_db()
seed_database()


@app.route("/")
def index():
    """Serves the main single page web application."""
    return render_template("index.html")


@app.route("/api/students", methods=["GET"])
def get_students():
    """Returns all student profiles with their skills."""
    conn = get_db_connection()
    students_cursor = conn.execute("""
        SELECT sp.*, u.email 
        FROM student_profiles sp
        JOIN users u ON sp.user_id = u.id
    """).fetchall()

    result = []
    for s in students_cursor:
        student_id = s["id"]
        skills_cursor = conn.execute("""
            SELECT sk.name, ss.proficiency, sk.category
            FROM student_skills ss
            JOIN skills sk ON ss.skill_id = sk.id
            WHERE ss.student_id = ?
        """, (student_id,)).fetchall()

        skills_list = [{"name": r["name"], "level": r["proficiency"], "category": r["category"]} for r in skills_cursor]

        result.append({
            "id": f"std_{s['id']}",
            "name": s["full_name"],
            "role": s["branch"],
            "college": s["college_name"],
            "course": s["course"],
            "branch": s["branch"],
            "semester": s["semester"],
            "avatar": s["avatar"],
            "bio": s["bio"],
            "experience": s["experience"],
            "github": s["github_url"],
            "linkedin": s["linkedin_url"],
            "availability": s["availability"],
            "skills": skills_list
        })
    conn.close()
    return jsonify(result)


@app.route("/api/projects", methods=["GET", "POST"])
def manage_projects():
    """Fetch all project openings or post a new one."""
    conn = get_db_connection()
    if request.method == "POST":
        data = request.get_json()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO projects (owner_id, title, description, category, team_size, available_positions, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            1,  # Default demo owner
            data.get("title"),
            data.get("description"),
            data.get("category"),
            data.get("teamSize", 4),
            data.get("availablePositions", ""),
            "Open"
        ))
        conn.commit()
        conn.close()
        return jsonify({"success": True, "message": "Project created successfully!"}), 201

    projects_cursor = conn.execute("SELECT * FROM projects ORDER BY created_at DESC").fetchall()
    result = []
    for p in projects_cursor:
        req_skills_cursor = conn.execute("""
            SELECT sk.name FROM project_required_skills prs
            JOIN skills sk ON prs.skill_id = sk.id
            WHERE prs.project_id = ?
        """, (p["id"],)).fetchall()

        result.append({
            "id": f"proj_{p['id']}",
            "title": p["title"],
            "description": p["description"],
            "category": p["category"],
            "teamSize": p["team_size"],
            "availablePositions": p["available_positions"].split(", "),
            "status": p["status"],
            "requiredSkills": [r["name"] for r in req_skills_cursor]
        })
    conn.close()
    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True, port=5000)

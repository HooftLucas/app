from flask import Blueprint, render_template, session, redirect, url_for
from person import User

instructor_bp = Blueprint('instructor', __name__, url_prefix='/instructor')

# Dummy users for demonstration
users = [
    User("Admin", "One", "0499123456", "admin1@example.com", "Admin Street 1", "admin", "adminpass"),
    User("Instructor", "Smith", "0499123457", "instructor1@example.com", "Instructor Lane 2", "instructor", "instructorpass"),
    User("Member", "Doe", "0499123458", "member1@example.com", "Member Road 3", "member", "memberpass"),
]

# For demo: assign instructor to members (in real app, use a field)
instructor_members = {
    "instructor1@example.com": ["member1@example.com"]
}

@instructor_bp.route('/dashboard')
def instructor_dashboard():
    if session.get('user_role') != 'instructor':
        return redirect(url_for('auth.login'))
    user_email = session.get('user_email')
    member_emails = instructor_members.get(user_email, [])
    members = [u for u in users if u.get_email() in member_emails]
    return render_template('instructor.html', members=members)
from flask import Blueprint, render_template, session, redirect, url_for
from person import User

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

# Dummy users for demonstration
users = [
    User("Admin", "One", "0499123456", "admin1@example.com", "Admin Street 1", "admin", "adminpass"),
    User("Instructor", "Smith", "0499123457", "instructor1@example.com", "Instructor Lane 2", "instructor", "instructorpass"),
    User("Member", "Doe", "0499123458", "member1@example.com", "Member Road 3", "member", "memberpass"),
]

@admin_bp.route('/dashboard')
def admin_dashboard():
    if session.get('user_role') != 'admin':
        return redirect(url_for('auth.login'))
    admins = [u for u in users if u.get_role() == "admin"]
    instructors = [u for u in users if u.get_role() == "instructor"]
    members = [u for u in users if u.get_role() == "member"]
    return render_template('admin.html', admins=admins, instructors=instructors, members=members)
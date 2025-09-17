from flask import Blueprint, render_template, request, redirect, url_for, session
from person import User

auth_bp = Blueprint('auth', __name__)

# Dummy users for demonstration
users = [
    User("Admin", "One", "0499123456", "admin1@example.com", "Admin Street 1", "admin", "adminpass"),
    User("Instructor", "Smith", "0499123457", "instructor1@example.com", "Instructor Lane 2", "instructor", "instructorpass"),
    User("Member", "Doe", "0499123458", "member1@example.com", "Member Road 3", "member", "memberpass"),
]


@auth_bp.route('/', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = next((u for u in users if u.get_email() == email and u.get_password() == password), None)
        if user:
            session['user_email'] = user.get_email()
            session['user_role'] = user.get_role()
            return redirect(url_for('auth.dashboard'))
        else:
            error = "Invalid email or password"
    return render_template('login.html', error=error)

@auth_bp.route('/dashboard')
def dashboard():
    if 'user_email' not in session:
        return redirect(url_for('auth.login'))
    user_email = session['user_email']
    user_role = session['user_role']
    admins = [u for u in users if u.get_role() == "admin"]
    instructors = [u for u in users if u.get_role() == "instructor"]
    members = [u for u in users if u.get_role() == "member"]
    instructor_members = {
        "instructor1@example.com": ["member1@example.com"]
    }
    instructor_member_objs = []
    if user_role == "instructor":
        member_emails = instructor_members.get(user_email, [])
        instructor_member_objs = [u for u in users if u.get_email() in member_emails]
    return render_template(
        'admindashboard.js',
        role=user_role,
        admins=admins,
        instructors=instructors,
        members=members,
        instructorMembers=instructor_member_objs
    )

@auth_bp.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('auth.login'))
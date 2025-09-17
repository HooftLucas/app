from flask import Blueprint, render_template, session, redirect, url_for

member_bp = Blueprint('member', __name__, url_prefix='/member')

@member_bp.route('/dashboard')
def member_dashboard():
    if session.get('user_role') != 'member':
        return redirect(url_for('auth.login'))
    return render_template('member.html')
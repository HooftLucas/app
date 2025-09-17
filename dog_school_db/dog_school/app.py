from flask import Flask
from routes.auth import auth_bp
from routes.admin import admin_bp
from routes.instructor import instructor_bp
from routes.member import member_bp

app = Flask(__name__)
app.secret_key = "your_secret_key"

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(instructor_bp)
app.register_blueprint(member_bp)

if __name__ == '__main__':
    app.run(debug=True)
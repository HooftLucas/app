from flask import Flask
from flask_cors import CORS
from routes import routes

def create_app():
    app = Flask(__name__)
    CORS(app)  # ✅ zodat frontend (React) kan praten met backend
    app.register_blueprint(routes)
    return app

def main():
    app = create_app()
    app.run(debug=True, port=5000)

if __name__ == "__main__":
    main()

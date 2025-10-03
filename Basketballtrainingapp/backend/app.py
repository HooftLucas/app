from flask import Flask
from flask_cors import CORS
from routes import routes_blueprint

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Register routes
    app.register_blueprint(routes_blueprint)
    
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)  # Changed back to port 5000
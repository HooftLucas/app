from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# In-memory storage (simple)
oefeningen = []
laatste_id = 0

@app.route('/api/oefeningen', methods=['GET'])
def get_oefeningen():
    return jsonify({'oefeningen': oefeningen})

@app.route('/api/oefeningen', methods=['POST'])
def upload_oefening():
    global laatste_id
    data = request.get_json()

    # Basic validation: require titel and doelgroep (leeftijd)
    if not data or 'titel' not in data or 'doelgroep' not in data:
        return jsonify({'error': 'Missende vereiste velden: titel en doelgroep'}), 400

    titel = data.get('titel')
    doelgroep = data.get('doelgroep')
    duur = data.get('duur')
    categorie = data.get('categorie')
    topics = data.get('topics') or data.get('topic') or []
    positions = data.get('positions') or []
    teaching_points = data.get('teaching_points') or data.get('teaching_point') or []
    beschrijving = data.get('beschrijving') or data.get('uitleg') or ''
    diagram = data.get('diagram') or []

    laatste_id += 1
    nieuwe_oefening = {
        'id': laatste_id,
        'titel': titel,
        'doelgroep': doelgroep,
        'duur': duur,
        'categorie': categorie,
        'topics': topics,
        'positions': positions,
        'teaching_points': teaching_points,
        'beschrijving': beschrijving,
        'diagram': diagram,
    }

    oefeningen.append(nieuwe_oefening)
    return jsonify({'message': 'Oefening toegevoegd', 'id': laatste_id}), 201

if __name__ == '__main__':
    app.run(debug=True, port=5000)
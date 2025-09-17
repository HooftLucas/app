from flask import Blueprint, jsonify, request
from models import Oefening

routes = Blueprint("routes", __name__)

# Dummy database
oefeningen = [
    Oefening("Dribbel zigzag", "U12", "10 min", "Dribbel", "Spelers dribbelen zigzag langs kegels."),
    Oefening("Close-out verdediging", "U16", "15 min", "Verdediging", "Oefenen op snelle close-out."),
]

@routes.route("/oefeningen", methods=["GET"])
def get_oefeningen():
    return jsonify([o.to_dict() for o in oefeningen])

@routes.route("/oefeningen", methods=["POST"])
def add_oefening():
    data = request.json
    if not data:
        return jsonify({"error": "Geen data ontvangen"}), 400

    nieuwe_oefening = Oefening(
        titel=data.get("titel"),
        doelgroep=data.get("doelgroep"),
        duur=data.get("duur"),
        thema=data.get("thema"),
        beschrijving=data.get("beschrijving")
    )
    oefeningen.append(nieuwe_oefening)
    return jsonify({"message": "Oefening toegevoegd!"}), 201

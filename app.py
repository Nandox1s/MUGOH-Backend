from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)  

FIREBASE_API_KEY = "SUA_API_KEY_AQUI"

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    senha = data.get('senha')

    if not email or not senha:
        return jsonify({"sucesso": False, "mensagem": "Email e senha são obrigatórios"}), 400

    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_API_KEY}"
    payload = {
        "email": email,
        "password": senha,
        "returnSecureToken": True
    }

    response = requests.post(url, json=payload)
    resultado = response.json()

    if "error" in resultado:
        return jsonify({"sucesso": False, "mensagem": resultado["error"]["message"]}), 401

    return jsonify({
        "sucesso": True,
        "idToken": resultado["idToken"],
        "refreshToken": resultado["refreshToken"],
        "email": resultado["email"],
        "localId": resultado["localId"]
    })

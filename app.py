from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)  

FIREBASE_API_KEY = "AIzaSyCbxtE5U6OTKco6mXRoR_n-IrraKFxecuE"

firebase_erros = {
    "EMAIL_NOT_FOUND": "E-mail não encontrado.",
    "INVALID_PASSWORD": "Senha incorreta.",
    "USER_DISABLED": "Usuário desativado.",
    "INVALID_EMAIL": "Formato de e-mail inválido.",
    "MISSING_PASSWORD": "A senha é obrigatória.",
    "TOO_MANY_ATTEMPTS_TRY_LATER": "Muitas tentativas. Tente novamente mais tarde.",
    "EMAIL_EXISTS": "Este e-mail já está cadastrado.",
    "WEAK_PASSWORD": "A senha deve ter pelo menos 6 caracteres."
}

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
        codigo = resultado["error"]["message"]
        mensagem_pt = firebase_erros.get(codigo, "Erro desconhecido.")
        return jsonify({"sucesso": False, "mensagem": mensagem_pt}), 401

    return jsonify({
        "sucesso": True,
        "idToken": resultado["idToken"],
        "refreshToken": resultado["refreshToken"],
        "email": resultado["email"],
        "localId": resultado["localId"]
    })

@app.route('/cadastro', methods=['POST'])
def cadastro():
    data = request.get_json()
    nome = data.get('nome')
    telefone = data.get('telefone')
    email = data.get('email')
    senha = data.get('senha')

    if not nome or not telefone or not email or not senha:
        return jsonify({"sucesso": False, "mensagem": "Todos os campos são obrigatórios"}), 400

    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={FIREBASE_API_KEY}"
    payload = {
        "email": email,
        "password": senha,
        "returnSecureToken": True
    }

    response = requests.post(url, json=payload)
    resultado = response.json()

    if "error" in resultado:
        codigo = resultado["error"]["message"]
        mensagem_pt = firebase_erros.get(codigo, "Erro desconhecido.")
        return jsonify({"sucesso": False, "mensagem": mensagem_pt}), 401

    return jsonify({
        "sucesso": True,
        "idToken": resultado["idToken"],
        "email": resultado["email"],
        "localId": resultado["localId"]
    })


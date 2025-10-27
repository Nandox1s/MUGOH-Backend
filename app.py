from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

FIREBASE_API_KEY = "AIzaSyDCYroYDTxM-bXJeqUmhkAPhoxqMpxtVUw"  # Insira sua chave da API do Firebase aqui
FIREBASE_DB_URL = "https://mugoh-db-default-rtdb.firebaseio.com"   # Se for usar o Realtime Database ou Firestore

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
        return jsonify({
            "sucesso": False,
            "mensagem": "Email e senha são obrigatórios"
        }), 400

    # Autenticar no Firebase Auth
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
        return jsonify({
            "sucesso": False,
            "mensagem": mensagem_pt
        }), 401

    # Login bem-sucedido
    return jsonify({
        "sucesso": True,
        "mensagem": "Login realizado com sucesso.",
        "email": resultado.get("email"),
        "idToken": resultado.get("idToken"),
        "refreshToken": resultado.get("refreshToken"),
        "localId": resultado.get("localId")
    }), 200

if __name__ == '__main__':
    app.run(debug=True)

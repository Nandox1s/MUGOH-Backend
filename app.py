from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import uuid
import os

app = Flask(__name__)
CORS(app)

FIREBASE_API_KEY = "AIzaSyDCYroYDTxM-bXJeqUmhkAPhoxqMpxtVUw"
FIREBASE_DB_URL = "https://mugoh-db-default-rtdb.firebaseio.com"
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

    return jsonify({
        "sucesso": True,
        "mensagem": "Login realizado com sucesso.",
        "email": resultado.get("email"),
        "idToken": resultado.get("idToken"),
        "refreshToken": resultado.get("refreshToken"),
        "localId": resultado.get("localId")
    }), 200

@app.route('/registro', methods=['POST'])
def registro():
    try:
        tipo = request.form.get("tipo")
        titulo = request.form.get("titulo")

        if not tipo or not titulo:
            return jsonify({"sucesso": False, "mensagem": "Título e Tipo são obrigatórios."}), 400

        estudio = request.form.get("estudio")
        diretor = request.form.get("diretor")
        genero = request.form.get("genero")
        subgenero = request.form.get("subgenero")
        estacao = request.form.get("estacao")
        data_lancamento = request.form.get("dataLancamento")
        origem = request.form.get("origem")
        temporadas = request.form.get("temporadas")
        episodios = request.form.get("episodios")
        nota = request.form.get("nota")
        avaliacao = request.form.get("avaliacao")
        sinopse = request.form.get("sinopse")

        foto = request.files.get("foto")
        foto_url = None

        if foto:
            if not os.path.exists("static/animes"):
                os.makedirs("static/animes")
            nome_arquivo = f"{uuid.uuid4().hex}_{foto.filename}"
            caminho = os.path.join("static/animes", nome_arquivo)
            foto.save(caminho)
            foto_url = f"/static/animes/{nome_arquivo}"

        anime_id = str(uuid.uuid4())

        anime = {
            "id": anime_id,
            "tipo": tipo,
            "titulo": titulo,
            "estudio": estudio,
            "diretor": diretor,
            "genero": genero,
            "subgenero": subgenero,
            "estacao": estacao,
            "dataLancamento": data_lancamento,
            "origem": origem,
            "temporadas": temporadas,
            "episodios": episodios,
            "nota": nota,
            "avaliacao": avaliacao,
            "sinopse": sinopse,
            "foto": foto_url
        }

        response = requests.post(f"{FIREBASE_DB_URL}/animes.json", json=anime)

        if response.status_code == 200:
            return jsonify({
                "sucesso": True,
                "mensagem": "Anime registrado com sucesso.",
                "id": anime_id,
                "foto": foto_url
            }), 200
        else:
            return jsonify({"sucesso": False, "mensagem": "Erro ao salvar no Firebase."}), 500

    except Exception as e:
        return jsonify({"sucesso": False, "mensagem": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

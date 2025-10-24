from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return "Backend Flask no Heroku!"

if __name__ == "__main__":
    app.run()

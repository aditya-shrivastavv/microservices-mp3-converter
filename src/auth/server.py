from flask import Flask
from flask_mysqldb import MySQL
from dotenv import load_dotenv
from utils import createJWT, decodeJWT
from config import Config
from flask import Blueprint


load_dotenv()

server = Flask(__name__)
mysql = MySQL(server)
bp = Blueprint('main', __name__)

# configurations
server.config.from_object(Config)

# routes
server.register_blueprint(bp)


if __name__ == "__main__":
    server.run(host="0.0.0.0", port=5000)

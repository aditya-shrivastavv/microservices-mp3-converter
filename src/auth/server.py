import jwt
import datetime
import os
from flask import Flask, request
from flask_mysqldb import MySQL
from dotenv import load_dotenv
from .utils import createJWT, decodeJWT

load_dotenv()

server = Flask(__name__)
mysql = MySQL(server)

# configurations
server.config["MYSQL_HOST"] = os.environ.get("MYSQL_HOST")
server.config["MYSQL_USER"] = os.environ.get("MYSQL_USER")
server.config["MYSQL_PASSWORD"] = os.environ.get("MYSQL_PASSWORD")
server.config["MYSQL_DB"] = os.environ.get("MYSQL_DB")
server.config["MYSQL_PORT"] = os.environ.get("MYSQL_PORT")


@server.route("/login", methods=["POST"])
def login():
    auth = request.authorization
    if not auth:
        return {"message": "Missing username or password"}, 401

    cur = mysql.connection.cursor()
    res = cur.execute(
        "SELECT email, password FROM users WHERE email = %s AND password = %s", (
            auth.username, auth.password, )
    )

    if res == 0:
        return {"message": "Invalid credentials"}, 401
    else:
        return createJWT(auth.username, os.environ.get("JWT_SECRET"), True)


@server.route("/validate", methods=["POST"])
def validate():
    encoded_jwt = request.headers["Authorization"]

    if not encoded_jwt:
        return {"message": "Missing token"}, 401

    encoded_jwt = encoded_jwt.split(" ")[1]

    try:
        decoded = decodeJWT(encoded_jwt, os.environ.get("JWT_SECRET"), "HS256")
        return decoded, 200
    except:
        return {"message": "Invalid token"}, 401


if __name__ == "__main__":
    server.run(host="0.0.0.0", port=5000)

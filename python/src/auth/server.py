import jwt
import datetime
import os
from flask import Flask, request
from flask_mysqldb import MySQL
from dotenv import load_dotenv

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
        "SELECT email, password FROM users WHERE email = %s", (auth.username,)
    )

    if res == 0:
        return {"message": "Invalid credentials"}, 404

    user_row = cur.fetchone()
    password = user_row[1]

    if auth.password != password:
        return {"message": "Invalid password"}, 401
    else:
        return createJWT(auth.username, os.environ.get("JWT_SECRET"), True)

import os
from flask import Flask, request
from flask_mysqldb import MySQL
import jwt
from datetime import datetime, timezone, timedelta

server = Flask(__name__)

# configurations
server.config["MYSQL_HOST"] = os.environ.get("MYSQL_HOST")
server.config["MYSQL_USER"] = os.environ.get("MYSQL_USER")
server.config["MYSQL_PASSWORD"] = os.environ.get("MYSQL_PASSWORD")
server.config["MYSQL_DB"] = os.environ.get("MYSQL_DB")
server.config["MYSQL_PORT"] = int(os.environ.get("MYSQL_PORT"))

mysql = MySQL(server)


@server.route("/register", methods=["POST"])
def register():
    auth = request.authorization
    print("auth:", auth)
    if not auth:
        return {"message": "Missing username or password"}, 401

    cur = mysql.connection.cursor()
    res = cur.execute(
        "INSERT INTO user (email, password) VALUES (%s, %s)", (
            auth.username, auth.password, )
    )
    mysql.connection.commit()

    if res == 0:
        print("register failed: User already exists")
        return {"message": "User already exists"}, 401
    else:
        print("register success")
        return createJWT(auth.username, os.environ.get("JWT_SECRET"), False)


@server.route("/login", methods=["POST"])
def login():
    auth = request.authorization
    print("auth:", auth)
    if not auth:
        return {"message": "Missing username or password"}, 401

    cur = mysql.connection.cursor()
    res = cur.execute(
        "SELECT email, password FROM user WHERE email = %s AND password = %s", (
            auth.username, auth.password, )
    )
    print("res:", res)

    if res == 0:
        print("login failed: Invalid credentials")
        return {"message": "Invalid credentials"}, 401
    else:
        print("login success")
        return createJWT(auth.username, os.environ.get("JWT_SECRET"), True)


@server.route("/validate", methods=["POST"])
def validate():
    encoded_jwt = request.headers["Authorization"]

    if not encoded_jwt:
        return {"message": "Missing token"}, 401

    encoded_jwt = encoded_jwt.split(" ")[1]
    print("encoded_jwt:", encoded_jwt)

    try:
        decoded = jwt.decode(
            encoded_jwt, os.environ.get("JWT_SECRET"), algorithms=["HS256"]
        )
    except:
        return "not authorized", 403

    return decoded, 200


def createJWT(username, secret, is_admin):
    return jwt.encode(
        {
            "username": username,
            "exp": datetime.now(tz=timezone.utc) + timedelta(days=1),
            "iat": datetime.now(tz=timezone.utc),
            "admin": is_admin,
        },
        secret,
        algorithm="HS256",
    )


if __name__ == "__main__":
    server.run(host="0.0.0.0", port=5000)

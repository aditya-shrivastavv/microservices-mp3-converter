import os
from flask import Flask
from flask_mysqldb import MySQL
from flask import request
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


# utils
def createJWT(username, secret, is_admin):
    return jwt.encode(
        {
            "username": username,
            "exp": datetime.now(timezone.utc) + timedelta(days=1),
            "iat": datetime.now(timezone.utc),   # Issued at
            "admin": is_admin
        },
        secret,
        algorithm="HS256",
    )


def decodeJWT(jwt, secret, algorithm):
    print("jwt.decode: ", jwt.decode(jwt, secret, algorithm=[algorithm]))
    return jwt.decode(jwt, secret, algorithm=[algorithm])


# routes
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
        print("Trying to decode token")
        decoded = decodeJWT(encoded_jwt, os.environ.get("JWT_SECRET"), "HS256")
        print("decoded:", decoded)
        return decoded, 200
    except:
        return {"message": "Invalid token"}, 401


if __name__ == "__main__":
    server.run(host="0.0.0.0", port=5000)

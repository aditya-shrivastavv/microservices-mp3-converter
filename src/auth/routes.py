from flask import request
from . import bp
from flask_mysqldb import MySQL
from .server import mysql
from .utils import createJWT, decodeJWT


@bp.route("/login", methods=["POST"])
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


@bp.route("/validate", methods=["POST"])
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

import jwt
from datetime import datetime, timezone, timedelta


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
    return jwt.decode(jwt, secret, algorithm=[algorithm])

import os
from flask import Flask
import gridfs
import pika
import json
from flask_pymongo import PyMongo
from auth import validate
from auth_svc import access
from storage import utils

server = Flask(__name__)
server.config["MONGO_URI"] = "mongodb://localhost:27017/storagedb"

mongo = PyMongo(server)

fs = gridfs.GridFS(mongo.db)

connection = pika.BlockingConnection(pika.ConnectionParameters('rabbitmq'))
channel = connection.channel()


@server.route("'/login", methods=["POST"])
def login():
    token, err = access.login(server)

    if not err:
        return token
    else:
        return err


@server.route("/upload", methods=["POST"])
def upload():
    access, err = validate.token(request)
    access = json.loads(access)

    if not access['admin']:
        return "not authorized", 401

    if len(request.files) != 1:
        return "exactly 1 file required", 400

    for _, f in request.files.items():
        err = utils.upload(f, fs, channel, access)

        if err:
            return err

    return "success", 200


@server.route("/download", methods=["GET"])
def download():
    pass


if __name__ == "__main__":
    server.run(host="0.0.0.0", port=8080)

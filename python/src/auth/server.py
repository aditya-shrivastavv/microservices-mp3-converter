import jwt
import datetime
import os
from flask import Flask, request
from flask_mysqldb import MySQL

server = Flask(__name__)
mysql = MySQL(server)

# configurations
server.config["MYSQL_HOST"] = os.environ.get("MYSQL_HOST")

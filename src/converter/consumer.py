import pika
import sys
import os
import time
from pymongo import MongoClient
import gridfs
from convert import to_mp3


def main():
    mongo_user = os.environ.get("MONGO_INITDB_ROOT_USERNAME")
    mongo_pass = os.environ.get("MONGO_INITDB_ROOT_PASSWORD")
    mongo_host = os.environ.get("MONGO_HOST")
    print(f"mongodb://{mongo_user}:{mongo_pass}@{mongo_host}:27017")
    client = MongoClient(
        f"mongodb://{mongo_user}:{mongo_pass}@{mongo_host}:27017")
    db_videos = client.videos
    db_mp3s = client.mp3s

    fs_videos = gridfs.GridFS(db_videos)
    fs_mp3s = gridfs.GridFS(db_mp3s)

    connection = pika.BlockingConnection(
        pika.ConnectionParameters(host='rabbitmq')
    )
    channel = connection.channel()

    def callback(chan, method, props, body):
        err = to_mp3.start(body, fs_videos, fs_mp3s, chan)
        if err:
            chan.basic_nack(delivery_tag=method.delivery_tag)
        else:
            chan.basic_ack(delivery_tag=method.delivery_tag)

    channel.basic_consume(
        queue=os.environ.get("VIDEO_QUEUE"),
        on_message_callback=callback
    )

    print("Waiting for messages. To leave: CTRL+C")
    channel.start_consuming()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("Exiting...")
        # Graceful exit
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)

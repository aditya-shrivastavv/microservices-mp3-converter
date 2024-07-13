import pika
import json


def upload(f, fs, channel, access):
    try:
        file_id = fs.put(f)
    except Exception as e:
        print(e)
        return "internal server error", 500

    message = {
        "video_file_id": str(file_id),
        "mp3_file_id": None,
        "username": access['username']
    }

    try:
        channel.basic_publish(
            exchange='',
            routing_key='video',
            body=json.dumps(message),
            properties=pika.BasicProperties(
                delivery_mode=pika.spec.PERSISTENT_DELIVERY_MODE
            )
        )
    except Exception as e:
        print(e)
        fs.delete(file_id)
        return "internal server error", 500

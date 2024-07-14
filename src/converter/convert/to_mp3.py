import pika
import json
import tempfile
import os
from bson.objectid import ObjectId
import moviepy.editor


def start(message, fs_videos, fs_mp3, channel):
    message = json.loads(message)

    # empty temp file creation
    tf = tempfile.NamedTemporaryFile()

    # video content
    out = fs_videos.get(ObjectId(message["video_fid"]))

    # add video content to empty file
    tf.write(out.read())

    # create mp3 file from temp mp4 file
    audio = moviepy.editor.VideoFileClip(tf.name).audio
    tf.close()

    # write audio to mp3 file
    tf_path = tempfile.gettempdir() + f"/{message['video_file_id']}.mp3"
    audio.write_audiofile(tf_path)

    # save file to monogodb
    with open(tf_path, "rb") as f:
        data = f.read()
        fid = fs_mp3.put(data)

    os.remove(tf_path)

    message["mp3_fid"] = str(fid)

    try:
        channel.basic_publish(
            exchange='',
            routing_key=os.environ.get("MP3_QUEUE"),
            body=json.dumps(message),
            properties=pika.BasicProperties(
                delivery_mode=pika.spec.PERSISTENT_DELIVERY_MODE
            )
        )
    except Exception as e:
        fs_mp3.delete(fid)
        return f"failed to publish message to the queue: {os.environ.get('MP3_QUEUE')}"

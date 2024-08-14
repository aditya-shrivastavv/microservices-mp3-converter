import pika
import sys
import os
from send import email


def test_rabbitmq_connection():
    try:
        connection = pika.BlockingConnection(
            pika.ConnectionParameters(host='rabbitmq')
        )
        connection.close()
        print("RabbitMQ connection successful")
    except pika.exceptions.AMQPConnectionError:
        print("Failed to connect to RabbitMQ")


def main():
    test_rabbitmq_connection()
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(host='rabbitmq')
    )
    channel = connection.channel()

    def callback(chan, method, props, body):
        err = email.notify(body)
        if err:
            chan.basic_nack(delivery_tag=method.delivery_tag)
        else:
            chan.basic_ack(delivery_tag=method.delivery_tag)

    channel.basic_consume(
        queue=os.environ.get("MP3_QUEUE"),
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

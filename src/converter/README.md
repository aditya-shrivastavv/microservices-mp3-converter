# Converter

This is the main services which serves the main purpose of the application. It convertes Mp4 to Mp3 files.

- It continously listens for the messages in the RabbitMQ queue.
- Upon receiving a message, it downloads the Mp4 file from MongoDB.
- The downloaded file is then converted to Mp3 and stored back in MongoDB.
- The message is then published to the RabbitMQ queue.

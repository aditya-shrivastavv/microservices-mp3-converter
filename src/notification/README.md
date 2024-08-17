# Notification

- This service is responsible for sending notifications to the user that the file is converted along with the file ID which the user can use to download the converted file.
- It continuously listens for the messages in the RabbitMQ queue.
- Upon receiving a message, it sends a notification to the user using the email service.
- The message is then acknowledged to the RabbitMQ queue.
- That's it.

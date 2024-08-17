# Gateway

- It is a Flask server
- Contacted by the frontend service
  
## Connections

- MongoDB - To store and retrieve Mp4 and Mp3 data
- RabbitMQ - To send and receive messages from other services

## Routes

- `/register` - To register a new user
  - Returns 401, if no username or password is provided
  - Sends the valid request to auth service to register the user
- `/login` - To login a user
  - Same as register
  - But this time the auth service returns a JWT token, it also sends the token to the user
- `/upload` - To upload a video
  - Upon request, it creates a connection to RabbitMQ
  - The token is validated by auth service
  - The files are stored in MongoDB using GridFS
  - Message is put in RabbitMQ
  - RabbitMQ connection dismissed
- `/download` - To download a video
  - Token is validated by auth service
  - The file is retrieved from MongoDB using GridFS by the file ID

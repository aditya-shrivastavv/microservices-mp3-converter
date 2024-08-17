# Auth Service

- It is a Flask server
- Contacted by the gateway service

## Connections

- MySQL - To store and retrieve user data

## Routes

- `/register` - To register a new user
  - Returns 401, if no username or password is provided
  - User data is inserted into MySQL database
- `/login` - To login a user
  - Same as register
  - But this time the user is authenticated by checking the password in MySQL
  - Returns a JWT token
- `/validate` - To validate a JWT token
  - Token is decoded
  - Returns 403, if the token is invalid
  - Returns 200, if the token is valid

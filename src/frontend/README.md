# Frontend

This is the frontend service of the project. It is a simple web application built using NextJS. It acts as the entry point for the user.

## NextJS

NextJS is a framework built on top of ReactJS. It provides a lot of features out of the box like file-based routing, server-side rendering, backend API support, etc.

## Structure

The source code is present in the `src/` directory.

- `app/` - Contains the main application code arranged as routes
- `app/api/` - Contains the API routes
- `components/` - Contains the reusable components
- `lib/` - Contains the utility functions

## Functionality

There are 4 routes in the application namely:

1. `/register` - For registering the user
2. `/login` - For logging in the user
3. `/upload` - For uploading the file
4. `/download` - For downloading the file

Easy, right? 😄

Let me come to the intresting part. How it is connected to other microservices? 🤔 It just contacts the [Gateway](../gateway/) service for forwarding the user requests.

The communication between the frontend and the gateway is not so straightforward. As the services are present inside of a kubernetes cluster you cannot send requests directly to the gateway service from the client as for that you need to expose the gateway services using a kubernetes ingress or a load balancer. But we don't want to do that. We want to keep the services private and secure. So, to make the communication possible we have to make use of NextJS API routes handlers (present in `src/app/api/`). These handlers are called from the client-side and they in turn contact the gateway service. Here is what the flow looks like:

- Sending requests:
  - Client -> NextJS API route handler -> Gateway service
- Receiving responses:
  - Gateway service -> NextJS API route handler -> Client

Due to this kind of architecture, the API route handlers do not contain any business logic. They just forward the requests to the gateway service and return the response back to the client.

I had to make it like this because to access the gateway service inside the cluster you have to use the name of the service as the hostname. But the client cannot resolve the service name as the client is outside of the cluster. So, I had to make use of the API route handlers to make the communication possible.

The gateway service is connected using the URL `http://gateway-service:8080` present in file `src/app/api/server/route.ts`. This URL is resolved inside the cluster.

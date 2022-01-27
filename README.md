# Kings-Corner

### A Modern Chess Web App

Built on the Apollo Framework for GraphQL, this project implements a full-featured chess application. Using a schema-first Graph  approach, we implement an Apollo Server, with support for services such as authentication, logging, mocking, and testing. Our frontend is React based Apollo Client, utilizing hooks and new technology such as Webpack v5 and Rome for linting.

## Frontend

Built on the Apollo Framework, the frontend uses a React based client utilizing new hooks inside of function components. Combined with the beauty of GraphQL, this allows us to construct a beautiful, easy to use interface. We support a myriad of features to attempt feature parity with current chess app implementations. Move validation and construction, saved game states and history. We also support a full featured ranking system, shop, and customizable game elements including purchasable piece and board skins.

## Backend

Again built on the Apollo Framework, the backend uses an Apollo Server built on Express. We use ES6 syntax throughout the server to match the frontend.

## Installation

### Node

We are currently using Node version `17.0.1`. This version add support for package level module enforcement. If you are using `nvm`, use the following command to activate the correct Node version.

```bash
nvm use
```

### Traditional Start

For a traditional start, install the node modules required by the project, and start both the web client and the server. The server will have production level database access.

```bash
npm install && npm start
```

### Testing

#### Mock Server

To start and test with the mock server, use the following command. The mock server is useful for constructing queries, or to test the frontend, assuming polling is not enabled for their component.

```bash
npm run mockServer
```

#### Electron

To run the Electron client instead of the web client, use the following command. Electron support is still a work in progress, please create an issue if you find any.

```bash
npm run startElectron
```

#### Docker

To run the application in a container, a Dockerfile is provided. The Dockerfile assumes you have already run the following commands in your terminal.

```bash
npm install
npm run buildServer
npm run buildWebsite
```

The image can then be run by Docker. If you would like the built image for your purposes, without modification, you can pull it from [here](https://github.com/orgs/Meta-Games-Biz/packages/container/package/kings-corner).

Or use the following command.

```bash
docker pull ghcr.io/meta-games-biz/kings-corner:latest
```

## Environment Variables

The application utilizes a `.env` file reader to obtain many system settings. The following fields are supported.

```
AUTH_KEY: The key used to encrypt and decrypt the user's session.
PASSWORD_KEY: The key used to encrypt and decrypt the user's password.
REDIS_HOST: The hostname for the redis server.
PORT: The port for the server to listen on.
MONGO_URI: The URI for the MongoDB database.
MAIL_USERNAME: The username for the mail service.
MAIL_PASSWORD: The password for the mail service.
GOOGLE_CLIENT_ID: The client ID for the Google OAuth2 service.
GOOGLE_CLIENT_SECRET: The client secret for the Google OAuth2 service.
```

#### Database

We use a MongoDB database for our application. We run this database using a command similar to this one.

```
docker run -d --name mongo -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=username -e MONGO_INITDB_ROOT_PASSWORD=password -v /Users/user/Hypergate/data:/data/db mongo:focal
```

This can then be connected to using the following URI environment variable.

```
MONGO_URI=mongodb://username:password@localhost:27017
```

Or if you are on the same Docker network, you can use the following URI.

```
MONGO_URI=mongodb://username:password@mongo:27017
```

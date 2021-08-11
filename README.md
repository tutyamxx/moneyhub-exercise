# Moneyhub API Team Technical Exercise

At Moneyhub, we make connections to banking providers to aggregate a user's account and transaction data.

For this task we ask you to write an API server that will connect with a simplified banking provider which has an endpoint to get an access token, and an end point to retrieve a user's transactions. The transactions returned are in the shape of an OpenBanking [transactions response](https://openbankinguk.github.io/read-write-api-site3/v3.1.7/resources-and-data-models/aisp/Transactions.html#uml-diagram)

Our implementation allows for pagination as specified in the specification. Where we differ is the actual URL to get the transactions.

We have begun the API server with a skeleton server and swagger document (that can be accessed from the running server on the `/docs` endpoint.)

## Banking Institution Server

The banking institution server we have written has two end points that you'll need to interact with, below is a description of both. The banking provider end points can be found on the prefixed URL of `https://obmockaspsp.moneyhub.co.uk/api`

### `POST /token`

This end point will be used to get an access token which must be used when retrieving the transactions.

The token end point will accept a request that follows an OAuth2/OpenID Connection client credentials grant. We have configured a client for you with the following details:

- `client_id`: `ba1bdcc0-60f5-4939-afc4-1b13a98dc490`
- `client_secret`: `6f1afff8-eb81-4945-8b91-a05e3d095ce3`

#### Example cURL

```bash
curl --request POST \
  --url 'https://obmockaspsp.moneyhub.co.uk/api/token?=' \
  --header 'Authorization: Basic YmExYmRjYzAtNjBmNS00OTM5LWFmYzQtMWIxM2E5OGRjNDkwOjZmMWFmZmY4LWViODEtNDk0NS04YjkxLWEwNWUzZDA5NWNlMw==' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data scope=transactions \
  --data grant_type=client_credentials
```

### `GET /users/{userId}/transactions`

This end point will return the transactions from the bank. We accept any user ID for ease of use.

The end point will expect an access token that has been returned from the token end point, which will have a scope of `transactions`.

The transactions end point allows for pagination, information for which is found in the OpenBanking specification and can be followed using the `Links` property of the response object.

## API Server

This repo represents the API server where you will be writing your code.

### `/docs`

Route containing swagger docs
### `GET /users/{userId}/transactions`

This endpoint will return the transactions retrieved from the bank and formatted according to the
swagger docs. (To be implemented)

## Requirements

You will need to implement the `GET /users/{userId}/transactions` endpoint in the api server, where you will need to:

- get an access token from the bank
- retrieve the transactions from the bank
- format the transactions according to the schema laid out in the swagger documentation

We prefer:
- Functional code
- Ramda.js (this is not a requirement but feel free to investigate)
- Unit testing

### Notes
All of your work should take place inside the `src` folder as this service represents the API server

You are free to use any packages that would help with this task

We're interested in how you break down the work and build your solution in a clean, reusable and testable manner rather than seeing a perfect example, try to only spend around *1-2 hours* working on it


## Getting Started

Please clone this service and push it to your own github (or other) public repository

On completion email a link to your repository to your contact at Moneyhub and ensure it is publicly accessible.

To develop against the api-server you will need to run the following:

```bash
npm start
or
npm run develop
```

The develop command will run nodemon allowing you to make changes without restarting

The services will try to use ports 3001

Use Postman or any API tool of your choice to trigger your endpoint (this is how we will test your new route).

You should be able to test it at `GET http://localhost:3001/users/{userId}/transactions`

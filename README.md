# Sonor app

## Installation
### Requirements

- Node.js
- npm 

### Install dependencies

`npm install`


## Usage



### Start the app

`npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### Start mock servers

To test the application at this point you need to use the server *mocked_apis_server* to serve the pearlJam mocked APIs.

Go to the *mocked_apis_server* folder and run

`npm install` 

`npm start` 

You will also need to start the keycloak server configured for this app, in the *keycloak-sonor/bin* folder, run

If you are using Windows:

`sh standalone.sh`

For Unix based systems:

`./standalone.sh`


Once the keycloak server is up, you will be able to connect to the sonor apps with the following credentials:

- Login: guest / Password: guest


### Run unit tests with jest
`npm run test`

To see the tests coverage:
`npm test -- --coverage`

### End to end tests with cypress
`npm run cypress:open`

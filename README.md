# Sonor app

## Installation
### Requirements

- Node.js (version > 10.15)
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

To test the application at this point you need to use the server *mocked_apis_server* to serve the pearlJam APIs.
You will find it at the root of this project : /mocked_apis_server

`cd ./mocked_apis_server` 

Run the following commands to install and start the server:

`npm install` 

`npm start` 


### Run unit tests with jest
`npm run test`

To see the tests coverage:
`npm test -- --coverage`

### End to end tests with cypress
`npm run cypress:open`

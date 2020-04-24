An example application built with node, express, mongodb and mongoose. It is meant to be run locally with the [spaceSoldierArmorer](https://github.com/jDman/spaceSoldierArmorer) frontend app. Both applications should be running to see this app working.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
The app runs at [http://localhost:4000](http://localhost:4000).

Note: You will need to create a database folder at the root of the project containing configuration files with your own mongodb connection string, JWT secret, and session secret. Each should be in a separate file, as follows:

#### connection-uri.js

`module.exports = 'mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<databaseName>;'`

#### jwt-secret.js

`module.exports = '<yourSecretString>;'`

#### session-secret.js

`module.exports = '<yourSecretString>;'`

### `npm test`

Launches the test runner in the interactive watch mode.<br />
Tests use [Mocha](https://mochajs.org/), [Chai](https://www.chaijs.com/) and [SinonJS](https://sinonjs.org/)

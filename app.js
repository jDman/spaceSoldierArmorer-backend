const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

const MONGODB_URI = require('./database/connection-uri');
const SESSION_KEY = require('./database/session-secret');

const app = express();

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
const csrfProtection = csrf();

app.use(bodyParser.json());

app.use(
  session({
    secret: SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use(csrfProtection);

app.use((req, res, next) => {
  res.setHeader(('Access-Control-Allow-Origin', '*'));
  res.setHeader(
    ('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  next();
});

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    app.listen(4000);
  })
  .catch(err => {
    console.log(err);
  });

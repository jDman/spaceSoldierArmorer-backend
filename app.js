const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const multer = require('multer');

const MONGODB_URI = require('./database/connection-uri');
const SESSION_KEY = require('./database/session-secret');

const armorShopRoutes = require('./routes/armorShop');
const armorAdminRoutes = require('./routes/armorAdmin');
const authRoutes = require('./routes/auth');

const User = require('./models/user');

const app = express();

const csrfProtection = csrf({
  cookie: true
});

app.use(bodyParser.json());
// app.use(cookieParser());
// app.use(csrfProtection);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  next();
});

app.use('/shop', armorShopRoutes);
app.use('/admin', armorAdminRoutes);
app.use('/auth', authRoutes);

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    return User.find();
  })
  .then(users => {
    if (users.length === 0) {
      const user = new User({
        email: 'test@test.com',
        password: 'sfsfsf',
        userName: 'Freddy',
        cart: {
          items: []
        }
      });

      return user.save();
    }
  })
  .then(() => {
    app.listen(4000);
  })
  .catch(err => {
    console.log(err);
  });

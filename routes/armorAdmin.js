const express = require('express');
const { body } = require('express-validator');

const armorAdminController = require('../controllers/armorAdmin');
const isAuthenticated = require('../middleware/is-authenticated');
const isAdmin = require('../middleware/is-admin');

const router = express.Router();

router.post(
  '/armor/add',
  isAuthenticated,
  isAdmin,
  [body('name').trim().isAlphanumeric()],
  armorAdminController.createArmor
);

module.exports = router;

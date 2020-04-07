const express = require('express');
// const { body } = require('express-validator');

const armorAdminController = require('../controllers/armorAdmin');
const isAuthenticated = require('../middleware/is-authenticated');

const router = express.Router();

router.post('/armor/add', isAuthenticated, armorAdminController.createArmor);

module.exports = router;

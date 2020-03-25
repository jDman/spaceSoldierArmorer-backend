const express = require('express');
// const { body } = require('express-validator');

const armorAdminController = require('../controllers/armorAdmin');

const router = express.Router();

router.post('/armor/add', armorAdminController.createArmor);

module.exports = router;

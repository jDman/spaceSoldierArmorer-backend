const express = require('express');
// const { body } = require('express-validator');

const armorShopController = require('../controllers/armorShop');
const isAuthenticated = require('../middleware/is-authenticated');

const router = express.Router();

router.get('/armor', isAuthenticated, armorShopController.getAllArmor);

router.get('/armor/:armorId', isAuthenticated, armorShopController.getArmor);

router.put('/armor/cart', isAuthenticated, armorShopController.updateCart);

module.exports = router;

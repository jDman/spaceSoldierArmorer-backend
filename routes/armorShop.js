const express = require('express');
// const { body } = require('express-validator');

const armorShopController = require('../controllers/armorShop');

const router = express.Router();

router.get('/armor', armorShopController.getAllArmor);

router.get('/armor/:armorId', armorShopController.getArmor);

router.post('/armor/cart', armorShopController.addCart);

router.put('/armor/cart/:cartId', armorShopController.updateCart);

module.exports = router;

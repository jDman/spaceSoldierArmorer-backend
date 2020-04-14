const express = require('express');
// const { body } = require('express-validator');

const armorShopController = require('../controllers/armorShop');
const isAuthenticated = require('../middleware/is-authenticated');

const router = express.Router();

router.get('/armor', isAuthenticated, armorShopController.getAllArmor);

router.get('/armor/:armorId', isAuthenticated, armorShopController.getArmor);

router.get('/armor/cart/items', isAuthenticated, armorShopController.getCart);

router.put('/armor/cart', isAuthenticated, armorShopController.updateCart);

router.post('/armor/order', isAuthenticated, armorShopController.addOrder);

router.delete(
  '/armor/cart/item',
  isAuthenticated,
  armorShopController.deleteCartItem
);

module.exports = router;

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/orders', orderController.createOrder);
//router.get('/orders/:order_id', orderController.getOrder);
router.get('/orders/:order_id/status', orderController.getOrderStatus);

module.exports = router;

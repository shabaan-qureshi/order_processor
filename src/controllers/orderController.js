const orderService = require('../services/orderService');

exports.createOrder = async (req, res) => {
  try {
    const { user_id, item_ids, total_amount } = req.body;
    const order = await orderService.createOrder(user_id, item_ids, total_amount);
    res.status(201).json(order);  
  } catch (error) {
    console.error('Error creating order:', error);  
    res.status(500).json({ error: 'Error creating order' });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    const status = await orderService.getOrder(order_id);
    res.status(200).json({ status });
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving order details' });
  }
};


exports.getOrderStatus = async (req, res) => {
  try {
    const { order_id } = req.params;
    const status = await orderService.getOrderStatus(order_id);
    res.status(200).json({ status });
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving order status' });
  }
};


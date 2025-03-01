const orderService = require('../services/orderService');

exports.getMetrics = async (req, res) => {
  try {
    const totalOrders = await orderService.getTotalOrders();
    const averageProcessingTime = await orderService.getAverageProcessingTime();
    const orderCounts = await orderService.getOrderCountsByStatus();

    const metrics = {
      total_orders: totalOrders,
      average_processing_time: averageProcessingTime,
      order_counts: orderCounts
    };

    res.status(200).json(metrics);
  } catch (error) {
    console.error('Error fetching metrics:', error);  
    res.status(500).json({ error: 'Error fetching metrics' });
  }
};

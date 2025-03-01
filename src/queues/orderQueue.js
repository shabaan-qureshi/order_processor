const async = require('async');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./orders.db');
const order_service = require('../services/orderService')

const orderQueue = async.queue(async (order) => {
  try {
    console.log(`Processing order ${order.order_id}`);

    await new Promise(resolve => setTimeout(resolve, 1000));
    await order_service.updateOrderStatusToCompleted(order.order_id);

    console.log(`Order ${order.order_id} processed successfully`);
  } catch (err) {
    console.error(`Error processing order ${order.order_id}: ${err.message}`);
    throw err;  
  }
}, 10);  

module.exports = orderQueue;


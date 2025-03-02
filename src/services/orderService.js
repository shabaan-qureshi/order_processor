const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./orders.db');

exports.createOrder = (req, res) => {
  const { user_id, item_ids, total_amount } = req.body;
  return new Promise((resolve, reject) => {
    if (!user_id || !item_ids || !total_amount) {
      return reject({ status: 400, error: 'Missing required fields: user_id, item_ids, and total_amount are required' });
    }

    if (!Array.isArray(item_ids) || item_ids.length === 0) {
      return reject({ status: 400, error: 'item_ids must be a non-empty array' });
    }

    if (typeof total_amount !== 'number' || total_amount <= 0) {
      return reject({ status: 400, error: 'total_amount must be a positive number' });
    }

    orderService.createOrder(user_id, item_ids, total_amount)
      .then(order => {
        orderQueue.push(order, (err) => {
          if (err) {
            console.error('Order processing failed:', err);
          }
        });

        resolve(order);  
      })
      .catch(err => {
        reject({ status: 500, error: 'Internal server error while creating order', details: err });
      });
  });
};



exports.getOrderStatus = (order_id) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT status FROM orders WHERE order_id = ?';
    
    db.get(query, [order_id], (err, row) => {
      if (err) {
        reject(err);  
      } else if (row) {
        resolve(row.status);  
      } else {
        resolve(null); 
      }
    });
  });
};

// Get the total number of orders processed
exports.getTotalOrders = () => {
  return new Promise((resolve, reject) => {
    db.get('SELECT COUNT(*) AS total FROM orders', [], (err, row) => {
      if (err) {
        console.error('Error fetching total orders:', err);  
        reject(err);
      } else {
        resolve(row.total);
      }
    });
  });
};

// Get the average processing time of orders
exports.getAverageProcessingTime = () => {
  return new Promise((resolve, reject) => {
    db.get(`
      SELECT AVG(
        (strftime('%s', completed_at) - strftime('%s', created_at))
      ) AS avg_processing_time
      FROM orders
      WHERE completed_at IS NOT NULL;
    `, [], (err, result) => {
      if (err) {
        console.error("Error fetching average processing time:", err);
        reject(err); // Reject the promise if there's an error
      } else {
        // Check if the result is null and handle accordingly
        if (result && result.avg_processing_time !== null) {
          resolve({ avg_processing_time: result.avg_processing_time });
        } else {
          // If no completed orders, return 0
          resolve({ avg_processing_time: 0 });
        }
      }
    });
  });
};



// Get the count of orders in each status (Pending, Processing, Completed)
exports.getOrderCountsByStatus = () => {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT status, COUNT(*) AS count
      FROM orders
      GROUP BY status
    `, [], (err, rows) => {
      if (err) {
        console.error('Error fetching order counts by status:', err); 
        reject(err);
      } else {
        const counts = {
          Pending: 0,
          Processing: 0,
          Completed: 0
        };

        rows.forEach(row => {
          counts[row.status] = row.count;
        });

        resolve(counts);
      }
    });
  });
};


// Function to update order status to 'Completed' and set completed_at
exports.updateOrderStatusToCompleted = async (order_id) => {
  const updateQuery = `
    UPDATE orders
    SET status = 'Completed', completed_at = CURRENT_TIMESTAMP
    WHERE order_id = ?`;
  
  try {
    await new Promise((resolve, reject) => {
      db.run(updateQuery, [order_id], (err) => {
        if (err) reject(err);
        resolve();
      });
    });
    console.log(`Order ${order_id} marked as completed.`);
  } catch (error) {
    console.error('Error updating order status:', error);
  }
};



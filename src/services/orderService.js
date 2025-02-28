const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./orders.db');

exports.createOrder = (user_id, item_ids, total_amount) => {
  return new Promise((resolve, reject) => {
    const order_id = 'ORD' + Math.random().toString(36).substring(2, 15).toUpperCase();
    const status = 'Pending';
    const item_ids_string = JSON.stringify(item_ids); // Convert array to string

    const query = 'INSERT INTO orders (order_id, user_id, item_ids, total_amount, status) VALUES (?, ?, ?, ?, ?)';
    db.run(query, [order_id, user_id, item_ids_string, total_amount, status], function(err) {
      if (err) {
        reject(err); 
      } else {
        resolve({ order_id, status });  
      }
    });
  });
};

// exports.getOrder = (order_id) => {
//   return new Promise((resolve, reject) => {
//     const query = 'SELECT * FROM orders WHERE order_id = ?';
    
//     db.get(query, [order_id], (err, row) => {
//       if (err) {
//         reject(err);  
//       } else if (row) {
//         resolve(row.status);  
//       } else {
//         resolve(null);  
//       }
//     });
//   });
// };

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

// Get the average processing time for orders
exports.getAverageProcessingTime = async () => {
  try {
    const result = await db.get(`
       SELECT AVG(JULIANDAY(completed_at) - JULIANDAY(created_at)) AS avg_processing_time
      FROM orders
      WHERE status = 'Completed'
    `);
    
    // Ensure that 'result' contains the expected structure
    if (result.rows && result.rows[0]) {
      return { avg_processing_time: result.rows[0].avg_processing_time_days };
    } else {
      throw new Error('No completed orders found');
    }
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
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

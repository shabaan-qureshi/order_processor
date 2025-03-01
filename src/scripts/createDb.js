const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./orders.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      order_id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      item_ids TEXT NOT NULL,
      total_amount REAL NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('Pending', 'Processing', 'Completed')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME
    );
  `);

  console.log('Orders table created or exists.');

  const orderId = 'order123';  
  const userId = 'user456';    
  const itemIds = '["item1", "item2"]';  
  const totalAmount = 150.75;  
  const status = 'Pending';  

  db.run(`
    INSERT INTO orders (order_id, user_id, item_ids, total_amount, status)
    VALUES (?, ?, ?, ?, ?)
  `, [orderId, userId, itemIds, totalAmount, status], (err) => {
    if (err) {
      console.error("Error inserting order:", err);
    } else {
      console.log("Sample order inserted.");
    }
  });
});

db.close();

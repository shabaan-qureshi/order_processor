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

  const orders = [
    { order_id: 'order001', user_id: 'user001', item_ids: '["item1"]', total_amount: 50.00, status: 'Pending', completed_at: null },
    { order_id: 'order002', user_id: 'user002', item_ids: '["item2", "item3"]', total_amount: 120.50, status: 'Completed', completed_at: '2025-02-25 12:30:00' },
    { order_id: 'order003', user_id: 'user003', item_ids: '["item4"]', total_amount: 80.99, status: 'Pending', completed_at: null },
    { order_id: 'order004', user_id: 'user004', item_ids: '["item5", "item6"]', total_amount: 200.00, status: 'Completed', completed_at: '2025-02-28 14:45:00' },
    { order_id: 'order005', user_id: 'user005', item_ids: '["item7"]', total_amount: 99.99, status: 'Pending', completed_at: null },
    { order_id: 'order006', user_id: 'user006', item_ids: '["item8", "item9"]', total_amount: 150.00, status: 'Completed', completed_at: '2025-02-27 09:15:00' },
    { order_id: 'order007', user_id: 'user007', item_ids: '["item10"]', total_amount: 60.00, status: 'Pending', completed_at: null },
    { order_id: 'order008', user_id: 'user008', item_ids: '["item11", "item12"]', total_amount: 75.25, status: 'Pending', completed_at: null },
    { order_id: 'order009', user_id: 'user009', item_ids: '["item13"]', total_amount: 145.50, status: 'Completed', completed_at: '2025-02-26 16:00:00' },
    { order_id: 'order010', user_id: 'user010', item_ids: '["item14", "item15"]', total_amount: 99.00, status: 'Pending', completed_at: null }
  ]

  orders.forEach(order => {
    db.run(`
      INSERT INTO orders (order_id, user_id, item_ids, total_amount, status)
      VALUES (?, ?, ?, ?, ?)
    `, [order.order_id, order.user_id, order.item_ids, order.total_amount, order.status], (err) => {
      if (err) {
        console.error("Error inserting order:", err);
      } else {
        console.log(`Order ${order.order_id} inserted.`);
      }
    });
  });
});

db.close();


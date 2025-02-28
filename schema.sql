CREATE TABLE IF NOT EXISTS orders (
  order_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  item_ids TEXT NOT NULL,   
  total_amount REAL NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('Pending', 'Processing', 'Completed')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME CURRENT_TIMESTAMP
);

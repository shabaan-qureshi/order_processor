# Order Processing API

This project provides an Order Processing API that allows users to create orders, check their status, and fetch system metrics.

## Setup and Running the Application

### Prerequisites
- Node.js (>= 14.x)
- npm

### Installation
```bash
# Clone the repository
git clone <YOUR_GITHUB_REPO_URL>
cd your-project-folder

# Install dependencies
npm install

# Seed the database
npm run db

# Start the API server
npm run api

# Run tests (optional)
npm run tdd
```

## API Requests and Responses

### Create an Order
#### Request
```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
        "user_id": "user1",
        "item_ids": ["item1", "item2"],
        "total_amount": 100.5
      }'
```
#### Response
```json
{
  "order_id": "123",
  "user_id": "user1",
  "item_ids": ["item1", "item2"],
  "total_amount": 100.5,
  "status": "Pending"
}
```

### Get Order Status
#### Request
```bash
curl http://localhost:3000/orders/:order_id/status
```
#### Response
```json
{
  "status": "Completed"
}
```

### Get Metrics
#### Request
```bash
curl http://localhost:3000/metrics
```
#### Response
```json
{
  "total_orders": 10,
  "average_processing_time": 5.2,
  "order_counts": {
    "Pending": 3,
    "Processing": 2,
    "Completed": 5
  }
}
```

## Design Decisions and Trade-offs
- **Queue System:** The async queue is used to simulate background order processing to ensure scalability and avoid blocking the main request thread.
- **SQLite Database:** SQLite was chosen for simplicity and easy setup for this demonstration.
- **Error Handling:** Basic error handling is implemented, but further enhancements like retry mechanisms and logging could be added.

## Assumptions
- Orders are processed sequentially within the q
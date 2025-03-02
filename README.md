# Order Processing API

This backend system manages and processes orders for an e-commerce platform. It provides RESTful APIs for order creation, status checking, and key metrics reporting (total orders, processing time, and order counts by status)

## Setup and Running the Application

### Prerequisites
- Node.js (>=6.9.0)
- npm

### Installation
```bash
# Clone the repository
git clone https://github.com/shabaan-qureshi/order_processor.git
cd order_processor

# Install dependencies
First, download and install Node.js (https://nodejs.org/en/download) for your operating system.

After installing Node.js, navigate to the project directory in your terminal and install the required dependencies:

npm install

# Verifiy installations
Ensure that Node.js and npm are correctly installed by running the following commands:

node -v
npm -v

# Seed the database
To populate the database with initial data, run the following command:

npm run db

# Start the API serve
Now, start the API server with the following command:

npm run api

# Run unit tests 
To run the unit tests and verify the functionality of the application, execute:

npm run tdd
```

## API Requests and Responses
Ensure that the API server is running (with `npm run api`).

Open two terminal windows:
One for running the server.
One for making API requests using curl. The curl commands are below:

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
- **Queue System:** async module's queue (https://caolan.github.io/async/v3/docs.html#queue) is used for handling multiple orders concurrently, but in production, we will use Kafka or Bull (with Redis) for better scalability, persistence, and retry support.

- **SQLite Database:** SQLite is used for simplicity, but we’ll migrate to PostgreSQL or MySQL in production for better scalability and availability.

- **Error Handling:** The system returns a simple error response on failure. For example, if the queue fails to mark the order as completed, we simply return error. However, in a production scenario, we need to add retry mechanisms, exponential backoff, and dead-letter queues to deal with failed requests.

- **Load Test:** To test that the system can handle 1,000 concurrent orders, we have added a test `loadTest.js` that simulates creating 1000 orders all at once. To improve the load test, we need to introduce error handling and retries, measure performance metrics like response times, stagger requests to simulate gradual load, and add assertions to check order correctness. The best solution is to use a dedicated testing tools like Artillery and monitor system resources during the test to identify bottlenecks.

- **completed_at** An extra field `completed_at` was added in the `orders` schema to represent the time when the order is marked as `completed`. This makes the average processing time easier to calculate

- **order_id and user_id:** We should use UUIDs for `order_id` and `user_id` in production as UUIDs ensure global uniqueness, scalability, and better security by preventing ID collisions and making it harder to guess valid IDs.

- **security** In production, user_id should be passed in request headers, not request body, using session tokens or JWTs for better security.

- **logging** Using console.log for basic logging is acceptable for now, but in a production environment, more robust logging and monitoring solutions would be needed for better observability and debugging.



## Assumptions
- The transition of an order from "Pending" to "Completed" is assumed to take one second, but actual time may vary based on system load, database performance, external services, queue processing, network latency, and retries.

- We assume requests will mostly succeed, with minimal error handling in place. In reality, we’d need to check for invalid parameters and handle errors more robustly like retries.

- No rate limiting, authentication, or authorization are implemented, but these would be necessary for production to secure APIs and ensure fair usage.

- The system assumes small traffic and uses a single server and database, but for higher loads, horizontal scaling and database optimization will be necessary.

- Data duplication is not an issue for the current scope of the application, as the system is designed for smaller traffic and minimal complexity.

- No need for integration or additional unit tests to further test the application at this stage





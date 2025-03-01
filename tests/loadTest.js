const request = require('supertest');
const app = require('../src/app');  

describe('Load Test for 1000 Concurrent Orders', () => {
  it('should handle 1000 concurrent orders', async () => {
    const orderRequests = [];

    for (let i = 0; i < 1000; i++) {
      orderRequests.push(
        request(app)
          .post('/orders')
          .send({
            user_id: `user${i}`,
            item_ids: [`item${i}`, `item${i+1}`],
            total_amount: 100 + (i * 0.5),
          })
      );
    }

    const responses = await Promise.all(orderRequests);

    responses.forEach(response => {
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('order_id');
    });

    // Check that 1000 orders were created
    expect(responses.length).toBe(1000);
  });
});

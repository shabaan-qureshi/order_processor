const request = require('supertest');
const app = require('../src/app');

describe('POST /orders', () => {
  it('should create a new order', async () => {
    const response = await request(app)
      .post('/orders')
      .send({
        user_id: 'user1',
        item_ids: ['item1', 'item2'],
        total_amount: 100.5
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('order_id');
  });
});

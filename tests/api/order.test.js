const request = require('supertest');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const orderRoutes = require('../../src/routes/orderRoutes')
const orderService = require('../../src/services/orderService');

jest.mock('../../src/services/orderService.js');

app.use(bodyParser.json());

app.use(orderRoutes);

describe('POST /orders', () => {
  it('should create an order and return the order details', async () => {
    const newOrder = {
      user_id: 1,
      item_ids: [101, 102],
      total_amount: 50.75,
    };

    const mockOrderResponse = {
      order_id: 'ORD123ABC',
      status: 'Pending',
    };

    orderService.createOrder.mockResolvedValue(mockOrderResponse);

    const response = await request(app)
      .post('/orders')
      .send(newOrder)
      .expect(201);

    expect(response.body).toEqual(mockOrderResponse);
    console.log(response.body)
    expect(response.body.order_id).toBeDefined();
    expect(response.body.status).toBe('Pending');
    expect(orderService.createOrder).toHaveBeenCalledWith(
      newOrder.user_id,
      newOrder.item_ids,
      newOrder.total_amount
    );
  });

  it('should return 500 if there is an error creating the order', async () => {
    const newOrder = {
      user_id: 1,
      item_ids: [101, 102],
      total_amount: 50.75,
    };

    orderService.createOrder.mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .post('/orders')
      .send(newOrder)
      .expect(500);

    expect(response.body.error).toBe('Error creating order');
  });
});

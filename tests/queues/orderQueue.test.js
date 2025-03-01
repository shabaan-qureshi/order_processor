const orderQueue = require('../../src/queues/orderQueue');
const orderService = require('../../src/services/orderService');
jest.mock('../../src/services/orderService.js'); 

describe('Order Queue', () => {
  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  test('should process orders successfully', async () => {
    const order = { order_id: 1 };
  
    orderService.updateOrderStatusToCompleted.mockResolvedValueOnce();

    await new Promise((resolve) => {
      orderQueue.push(order, (err) => {
        expect(err).toBeNull();
        resolve();
      });
    });

    expect(orderService.updateOrderStatusToCompleted).toHaveBeenCalledTimes(1);
  });

  test('should handle error when processing an order', async () => {
    const order = { order_id: 2 };

    orderService.updateOrderStatusToCompleted.mockRejectedValueOnce(new Error('Failed to update order status'));

    await new Promise((resolve) => {
      orderQueue.push(order, (err) => {
        expect(err).not.toBeNull();
        expect(err.message).toBe('Failed to update order status');
        resolve();
      });
    });

    expect(orderService.updateOrderStatusToCompleted).toHaveBeenCalledWith(2);
  });
});

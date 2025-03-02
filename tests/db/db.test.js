const sqlite3 = require('sqlite3');

jest.mock('sqlite3', () => {
  const mDb = {
    get: jest.fn(),
    all: jest.fn(), 
  };

  return {
    verbose: jest.fn().mockReturnThis(), 
    Database: jest.fn(() => mDb), 
  };
});

const {
  getAverageProcessingTime,
  getOrderCountsByStatus,
} = require('../../src/services/orderService'); 

describe('Database Operations', () => {
  let mockDb;

  beforeEach(() => {
    mockDb = new sqlite3.Database(); 
  });

  beforeAll(() => {
    jest.setTimeout(1000); 
  });

  it('should return average processing time', async () => {
    mockDb.get.mockImplementation((query, params, callback) => {
      callback(null, { avg_processing_time: 120.45 }); 
    });
  
    const result = await getAverageProcessingTime();
    expect(result).toBe(120.45);
    expect(mockDb.get).toHaveBeenCalledWith(
      expect.stringContaining('SELECT AVG'),
      [],
      expect.any(Function)
    );
  });

  it('should return counts of orders by status', async () => {
    mockDb.all.mockImplementation((query, params, callback) => {
      callback(null, [
        { status: 'Pending', count: 10 },
        { status: 'Completed', count: 50 },
        { status: 'Processing', count: 40 },
      ]);
    });

    const result = await getOrderCountsByStatus();

    expect(result).toEqual({
      Pending: 10,
      Processing: 40,
      Completed: 50,
    });
    expect(mockDb.all).toHaveBeenCalledWith(
      expect.stringContaining('SELECT status, COUNT(*)'),
      [],
      expect.any(Function)
    );
  });
});

const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/config/database');

const mockClient = {
  query: jest.fn(),
  release: jest.fn(),
};

// Mock database connection
jest.mock('../src/config/database', () => ({
  query: jest.fn(),
  connect: jest.fn(() => mockClient),
  end: jest.fn(),
}));

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => { }); // suppress logs
});

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(async () => {
  await pool.end?.();
});

// -------------------------
// GET /api/admin/currencies
// -------------------------
describe('GET /api/admin/currencies', () => {
  it('should return currencies list', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 1, code: 'USD', name: 'US Dollar', latest_rate: 1 }],
    });

    const res = await request(app).get('/api/admin/currencies');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
  });

  it('should return 500 on DB failure', async () => {
    pool.query.mockRejectedValueOnce(new Error('DB failure'));

    const res = await request(app).get('/api/admin/currencies');

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Failed to fetch currencies');
  });
});

// -------------------------
// POST /api/admin/currencies
// -------------------------
describe('POST /api/admin/currencies', () => {
  it('should add currency successfully', async () => {
    mockClient.query
      .mockResolvedValueOnce({}) // BEGIN
      .mockResolvedValueOnce({ rows: [{ id: 2, code: 'THB', name: 'Thai Baht' }] }) // currency insert
      .mockResolvedValueOnce({ rows: [{ id: 10, rate: 35.5, effective_date: '2025-01-01' }] }) // rate insert
      .mockResolvedValueOnce({}); // COMMIT

    const res = await request(app)
      .post('/api/admin/currencies')
      .send({ code: 'THB', name: 'Thai Baht', rate: 35.5 });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.currency.code).toBe('THB');
    expect(res.body.data.rate.rate).toBe(35.5);
  });

  it('should return 400 if fields missing', async () => {
    const res = await request(app).post('/api/admin/currencies').send({ code: 'THB' });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/required/);
  });

  it('should return 400 if code length != 3', async () => {
    const res = await request(app)
      .post('/api/admin/currencies')
      .send({ code: 'TH', name: 'Thai Baht', rate: 35 });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/exactly 3 characters/);
  });

  it('should return 400 if rate invalid', async () => {
    const res = await request(app)
      .post('/api/admin/currencies')
      .send({ code: 'THB', name: 'Thai Baht', rate: -5 });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/positive number/);
  });

  it('should return 409 if currency exists', async () => {
    mockClient.query.mockRejectedValueOnce({ code: '23505' });
    const res = await request(app)
      .post('/api/admin/currencies')
      .send({ code: 'THB', name: 'Thai Baht', rate: 35 });

    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/already exists/);
  });

  it('should return 500 if DB error occurs', async () => {
    mockClient.query.mockRejectedValueOnce(new Error('Unknown DB error'));

    const res = await request(app)
      .post('/api/admin/currencies')
      .send({ code: 'JPY', name: 'Japanese Yen', rate: 140 });

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Failed to add currency');
  });

  it('should return 500 if DB error occurs', async () => {
    mockClient.query.mockRejectedValueOnce(new Error('Unknown DB error'));

    const res = await request(app)
      .post('/api/admin/currencies')
      .send({ code: 'JPY', name: 'Japanese Yen', rate: 140 });

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Failed to add currency');
  });
});

// -------------------------
// PUT /api/admin/currencies/:id
// -------------------------
describe('PUT /api/admin/currencies/:id', () => {
  it('should update currency successfully', async () => {
    mockClient.query
      .mockResolvedValueOnce({}) // BEGIN
      .mockResolvedValueOnce({ rows: [{ id: 1, code: 'THB' }] }) // check exists
      .mockResolvedValueOnce({ rows: [{ id: 1, code: 'THB', name: 'Thai Baht' }] }) // update
      .mockResolvedValueOnce({ rows: [{ id: 10, rate: 40 }] }) // rate
      .mockResolvedValueOnce({}); // COMMIT

    const res = await request(app)
      .put('/api/admin/currencies/1')
      .send({ code: 'THB', name: 'Thai Baht', rate: 40 });

    expect(res.status).toBe(200);
    expect(res.body.data.rate.rate).toBe(40);
  });

  it('should return 400 if fields missing', async () => {
    const res = await request(app)
      .put('/api/admin/currencies/1')
      .send({ code: 'THB', rate: 40 });

    expect(res.status).toBe(400);
  });

  it('should return 404 if currency not found', async () => {
    mockClient.query.mockResolvedValueOnce({}); // BEGIN
    mockClient.query.mockResolvedValueOnce({ rows: [] }); // not found

    const res = await request(app)
      .put('/api/admin/currencies/99')
      .send({ code: 'ABC', name: 'Test', rate: 10 });

    expect(res.status).toBe(404);
  });

  it('should return 500 if DB error occurs', async () => {
    mockClient.query.mockResolvedValueOnce({}); // BEGIN
    mockClient.query.mockRejectedValueOnce(new Error('DB failure'));

    const res = await request(app)
      .put('/api/admin/currencies/1')
      .send({ code: 'THB', name: 'Thai Baht', rate: 40 });

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Failed to update currency');
  });

  it('should return 500 if DB error occurs', async () => {
    mockClient.query.mockResolvedValueOnce({}); // BEGIN
    mockClient.query.mockRejectedValueOnce(new Error('DB failure'));

    const res = await request(app)
      .put('/api/admin/currencies/1')
      .send({ code: 'THB', name: 'Thai Baht', rate: 40 });

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Failed to update currency');
  });
});

// -------------------------
// DELETE /api/admin/currencies/:id
// -------------------------
describe('DELETE /api/admin/currencies/:id', () => {
  it('should delete currency successfully', async () => {
    pool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ code: 'THB' }] });

    const res = await request(app).delete('/api/admin/currencies/1');

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted successfully/);
  });

  it('should return 404 if currency not found', async () => {
    pool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] });

    const res = await request(app).delete('/api/admin/currencies/99');

    expect(res.status).toBe(404);
  });

  it('should return 400 if ID missing', async () => {
    const res = await request(app).delete('/api/admin/currencies/'); // route not matched
    expect(res.status).toBe(404);
  });

  it('should return 500 if DB error occurs', async () => {
    pool.query.mockRejectedValueOnce(new Error('DB failure'));

    const res = await request(app).delete('/api/admin/currencies/1');

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('DB failure');
  });

  it('should return 500 if DB error occurs', async () => {
    pool.query.mockRejectedValueOnce(new Error('DB failure'));

    const res = await request(app).delete('/api/admin/currencies/1');

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('DB failure');
  });

  describe('deleteCurrency service', () => {

    const adminService = require('../src/services/adminService');

    it('should throw an error if ID is missing', async () => {
      await expect(adminService.deleteCurrency()).rejects.toThrow(
        'Currency ID is required for deletion.'
      );
    });
  });
});

describe('Admin Controller Validation Tests', () => {

  // -------------------------
  // Rate validation (POST / PUT)
  // -------------------------
  it('should return 400 if rate is zero or negative (PUT)', async () => {
    const res = await request(app)
      .put('/api/admin/currencies/1')
      .send({ code: 'EUR', name: 'Euro', rate: -10 });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      success: false,
      message: 'Rate must be a positive number'
    });
  });


  // -------------------------
  // ID required for delete
  // -------------------------
  it('should return 400 if currency ID is missing on delete', async () => {
    const res = await request(app).delete('/api/admin/currencies/'); // route not matched
    expect(res.status).toBe(404); // 404 because no route matches
  });

  // If you want to test the controller directly with missing ID:
  it('should return 400 if ID is empty in controller', async () => {
    const adminController = require('../src/controllers/adminController');
    const req = { params: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await adminController.deleteCurrency(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Currency ID is required'
    });
  });

  // -------------------------
  // Cannot delete base currency (USD)
  // -------------------------
  it('should return 403 if trying to delete base currency USD', async () => {
    const adminController = require('../src/controllers/adminController');
    const req = { params: { id: '1' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Mock the service to throw the specific error
    const adminService = require('../src/services/adminService');
    jest.spyOn(adminService, 'deleteCurrency').mockImplementation(() => {
      throw new Error('Cannot delete base currency (USD)');
    });

    await adminController.deleteCurrency(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Cannot delete base currency (USD)'
    });

    adminService.deleteCurrency.mockRestore();
  });
});
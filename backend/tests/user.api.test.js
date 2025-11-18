const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/config/database');

jest.mock('../src/config/database', () => ({
  query: jest.fn(),
  connect: jest.fn(() => ({
    query: jest.fn(),
    release: jest.fn(),
  })),
  end: jest.fn(),
}));

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {}); // suppress logs
});

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(async () => {
  await pool.end?.();
});

// -------------------------
// GET /api/user/currencies
// -------------------------
describe('GET /api/user/currencies', () => {
  it('should return paginated currencies', async () => {
    pool.query
      .mockResolvedValueOnce({
        rows: [
          { id: 1, code: 'USD', name: 'US Dollar', latest_rate: 1, rate_date: '2025-01-01' },
        ],
      })
      .mockResolvedValueOnce({ rows: [{ total: 1 }] });

    const res = await request(app).get('/api/user/currencies?page=1&limit=12');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.pagination.page).toBe(1);
  });

  it('should use default pagination if invalid params', async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ total: 0 }] });

    const res = await request(app).get('/api/user/currencies?page=-5&limit=500');

    expect(res.status).toBe(200);
    expect(res.body.pagination.page).toBe(1);
    expect(res.body.pagination.limit).toBe(100);
  });

  it('should return 500 if DB fails', async () => {
    pool.query.mockRejectedValue(new Error('DB failure'));

    const res = await request(app).get('/api/user/currencies');

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Failed to fetch currencies');
  });
});

// -------------------------
// GET /api/user/currencies/historical
// -------------------------
describe('GET /api/user/currencies/historical', () => {
  const date = '2025-01-01';

  it('should return historical rates', async () => {
    pool.query
      .mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            base_currency: 'USD',
            target_currency: 'THB',
            target_currency_name: 'Thai Baht',
            rate: 35.5,
            effective_date: date,
            created_at: date,
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [{ total: 1 }] });

    const res = await request(app).get(`/api/user/currencies/historical?date=${date}&page=1&limit=12`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.queryDate).toBe(date);
  });

  it('should return 400 if date missing', async () => {
    const res = await request(app).get('/api/user/currencies/historical');

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Date parameter is required/);
  });

  it('should return 400 if date invalid', async () => {
    const res = await request(app).get('/api/user/currencies/historical?date=invalid-date');

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Invalid date format/);
  });

  it('should return 500 if DB fails', async () => {
    pool.query.mockRejectedValue(new Error('DB failure'));

    const res = await request(app).get(`/api/user/currencies/historical?date=${date}`);

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Failed to fetch historical rates');
  });

    it('should handle date === null in service call', async () => {
    // Directly testing the service throws error
    const userService = require('../src/services/userService');

    await expect(userService.getHistoricalRates({ date: null })).rejects.toThrow(
      'Date parameter is required'
    );
  });
});

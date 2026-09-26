// These tests exercise the auth routes end-to-end (HTTP -> validation ->
// controller) but replace the real database with a mock, so they run fast
// and don't need a live PostgreSQL instance in CI.
jest.mock('../src/config/db', () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/config/db');

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects a request with missing fields (validation)', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'not-an-email' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it('rejects registering an email that already exists', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 1, email: 'taken@example.com' });

    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'taken@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/already exists/i);
  });

  it('creates a new user and returns a token when input is valid', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({
      id: 1,
      name: 'Test User',
      email: 'new@example.com',
      createdAt: new Date(),
    });

    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'new@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(201);
    expect(res.body.data.user.email).toBe('new@example.com');
    expect(res.body.data.token).toBeDefined();
  });
});

describe('GET /api/tasks (auth protection)', () => {
  it('rejects requests with no Authorization header', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(401);
  });
});

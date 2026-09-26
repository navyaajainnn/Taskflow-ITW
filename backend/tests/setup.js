// Runs before every test file. We set fake-but-valid env vars here so
// jwt.sign()/jwt.verify() and other env-dependent code work in tests
// without needing a real .env file or database connection.
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_EXPIRES_IN = '1h';

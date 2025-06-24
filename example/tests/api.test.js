const request = require('supertest');
const app = require('../backend/server');

/**
 * API Integration Tests
 * Tests the backend API endpoints following best practices:
 * - Integration testing with supertest
 * - Testing both success and error cases
 * - Input validation testing
 * - Response format validation
 */

describe('API Endpoints', () => {
  let server;

  beforeAll(() => {
    // Start server for testing
    server = app.listen(0); // Use random port
  });

  afterAll((done) => {
    // Clean shutdown
    server.close(done);
  });

  describe('Health Check Endpoint', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          status: 'healthy',
          uptime: expect.any(Number),
          version: expect.any(String),
          timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
        },
      });
    });
  });

  describe('API Documentation Endpoint', () => {
    it('should return API documentation', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          title: expect.any(String),
          version: expect.any(String),
          description: expect.any(String),
          endpoints: expect.any(Object),
        },
      });
    });
  });

  describe('Hello World Endpoints', () => {
    describe('GET /api/hello', () => {
      it('should return a random greeting', async () => {
        const response = await request(app)
          .get('/api/hello')
          .expect(200);

        expect(response.body).toMatchObject({
          success: true,
          data: {
            message: expect.any(String),
            timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
            source: 'api',
            greeting_id: expect.any(Number),
          },
        });

        // Message should not be empty
        expect(response.body.data.message.length).toBeGreaterThan(0);
      });

      it('should return different messages on multiple calls', async () => {
        const responses = await Promise.all([
          request(app).get('/api/hello'),
          request(app).get('/api/hello'),
          request(app).get('/api/hello'),
          request(app).get('/api/hello'),
          request(app).get('/api/hello'),
        ]);

        const messages = responses.map(r => r.body.data.message);
        const uniqueMessages = new Set(messages);

        // With 5 different greetings, we should get some variety
        // (Though randomness means this could occasionally fail)
        expect(uniqueMessages.size).toBeGreaterThan(1);
      });
    });

    describe('POST /api/hello/custom', () => {
      it('should create custom greeting with valid input', async () => {
        const response = await request(app)
          .post('/api/hello/custom')
          .send({ name: 'Alice' })
          .expect(200);

        expect(response.body).toMatchObject({
          success: true,
          data: {
            message: 'Hello, Alice!',
            name: 'Alice',
            language: 'en',
            timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
            source: 'custom',
          },
        });
      });

      it('should support different languages', async () => {
        const testCases = [
          { name: 'María', language: 'es', expected: '¡Hola, María!' },
          { name: 'Pierre', language: 'fr', expected: 'Bonjour, Pierre!' },
          { name: 'Hans', language: 'de', expected: 'Hallo, Hans!' },
          { name: 'Giuseppe', language: 'it', expected: 'Ciao, Giuseppe!' },
          { name: 'João', language: 'pt', expected: 'Olá, João!' },
        ];

        for (const testCase of testCases) {
          const response = await request(app)
            .post('/api/hello/custom')
            .send({ name: testCase.name, language: testCase.language })
            .expect(200);

          expect(response.body.data.message).toBe(testCase.expected);
        }
      });

      it('should use English as default language', async () => {
        const response = await request(app)
          .post('/api/hello/custom')
          .send({ name: 'Bob' })
          .expect(200);

        expect(response.body.data.message).toBe('Hello, Bob!');
        expect(response.body.data.language).toBe('en');
      });

      it('should fallback to English for unsupported language', async () => {
        const response = await request(app)
          .post('/api/hello/custom')
          .send({ name: 'Test', language: 'unsupported' })
          .expect(200);

        expect(response.body.data.message).toBe('Hello, Test!');
      });

      it('should validate required name field', async () => {
        const response = await request(app)
          .post('/api/hello/custom')
          .send({})
          .expect(400);

        expect(response.body).toMatchObject({
          success: false,
          error: 'Name is required and must be a string',
        });
      });

      it('should validate name type', async () => {
        const response = await request(app)
          .post('/api/hello/custom')
          .send({ name: 123 })
          .expect(400);

        expect(response.body).toMatchObject({
          success: false,
          error: 'Name is required and must be a string',
        });
      });

      it('should validate name length', async () => {
        const longName = 'a'.repeat(51);
        const response = await request(app)
          .post('/api/hello/custom')
          .send({ name: longName })
          .expect(400);

        expect(response.body).toMatchObject({
          success: false,
          error: 'Name must be 50 characters or less',
        });
      });

      it('should sanitize malicious input', async () => {
        const response = await request(app)
          .post('/api/hello/custom')
          .send({ name: '<script>alert("xss")</script>Bob' })
          .expect(200);

        // Should sanitize but still work
        expect(response.body.data.message).toBe('Hello, scriptalert("xss")/scriptBob!');
        expect(response.body.data.name).toBe('scriptalert("xss")/scriptBob');
      });

      it('should reject completely invalid names', async () => {
        const response = await request(app)
          .post('/api/hello/custom')
          .send({ name: '<<>>"&' })
          .expect(400);

        expect(response.body).toMatchObject({
          success: false,
          error: 'Name contains only invalid characters',
        });
      });
    });

    describe('GET /api/hello/languages', () => {
      it('should return supported languages', async () => {
        const response = await request(app)
          .get('/api/hello/languages')
          .expect(200);

        expect(response.body).toMatchObject({
          success: true,
          data: {
            languages: expect.arrayContaining([
              { code: 'en', name: 'English' },
              { code: 'es', name: 'Spanish' },
              { code: 'fr', name: 'French' },
            ]),
            total: expect.any(Number),
            default: 'en',
          },
        });

        expect(response.body.data.languages.length).toBeGreaterThan(0);
      });
    });

    describe('GET /api/hello/stats', () => {
      it('should return API statistics', async () => {
        const response = await request(app)
          .get('/api/hello/stats')
          .expect(200);

        expect(response.body).toMatchObject({
          success: true,
          data: {
            total_requests: expect.any(Number),
            uptime_ms: expect.any(Number),
            uptime_readable: expect.any(String),
            average_requests_per_minute: expect.any(Number),
            server_start: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
          },
        });

        expect(response.body.data.total_requests).toBeGreaterThan(0);
      });
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for unknown API endpoints', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .expect(404);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.stringContaining('API endpoint not found'),
        available_endpoints: expect.any(Array),
      });
    });

    it('should handle malformed JSON in POST requests', async () => {
      const response = await request(app)
        .post('/api/hello/custom')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400);

      // Express automatically handles malformed JSON
    });
  });

  describe('Security Headers', () => {
    it('should include security headers', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      // Check for helmet security headers
      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-frame-options');
    });
  });

  describe('CORS Configuration', () => {
    it('should handle CORS preflight requests', async () => {
      const response = await request(app)
        .options('/api/hello')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'GET')
        .expect(204);

      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });
  });
});
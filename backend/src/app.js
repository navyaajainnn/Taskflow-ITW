const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// app.js only builds and exports the Express app - it never calls .listen().
// That lets our tests import this file and hit routes with supertest
// without needing a real running server on a real port.
const app = express();

app.use(cors());
app.use(express.json()); // parses incoming JSON bodies into req.body

// Interactive API docs at /api-docs (Swagger UI)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use(notFound);
app.use(errorHandler); // must be registered last

module.exports = app;

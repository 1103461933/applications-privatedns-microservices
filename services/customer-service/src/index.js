const express = require('express');
const cors = require('cors');
const logger = require('./logger');

const app = express();
const PORT = process.env.PORT || 8082;
const SERVICE_NAME = process.env.SERVICE_NAME || 'customer-service';
const SERVICE_VERSION = process.env.SERVICE_VERSION || '1.0.0';

app.use(cors());
app.use(express.json());

app.get('/health/live', (req, res) => {
  res.status(200).json({
    status: 'alive',
    service: SERVICE_NAME,
    version: SERVICE_VERSION,
    timestamp: new Date().toISOString()
  });
});

app.get('/health/ready', (req, res) => {
  res.status(200).json({
    status: 'ready',
    service: SERVICE_NAME,
    version: SERVICE_VERSION,
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({
    message: `Welcome to ${SERVICE_NAME}`,
    version: SERVICE_VERSION,
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/customers', (req, res) => {
  res.json({
    service: SERVICE_NAME,
    customers: [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '098-765-4321' }
    ]
  });
});

app.post('/api/customers', (req, res) => {
  logger.info('New customer request', { body: req.body });
  res.status(201).json({
    message: 'Customer created',
    customer: { id: Date.now(), ...req.body, createdAt: new Date().toISOString() }
  });
});

app.get('/api/customers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  res.json({
    id: id,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890'
  });
});

app.listen(PORT, () => {
  logger.info(`${SERVICE_NAME} v${SERVICE_VERSION} running on port ${PORT}`);
});
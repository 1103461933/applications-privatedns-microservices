const express = require('express');
const cors = require('cors');
const logger = require('./logger');

const app = express();
const PORT = process.env.PORT || 8081;
const SERVICE_NAME = process.env.SERVICE_NAME || 'payment-service';
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

app.get('/api/payments', (req, res) => {
  res.json({
    service: SERVICE_NAME,
    payments: [
      { id: 1, amount: 100.50, status: 'completed', method: 'credit_card' },
      { id: 2, amount: 250.00, status: 'pending', method: 'paypal' }
    ]
  });
});

app.post('/api/payments', (req, res) => {
  logger.info('New payment request', { body: req.body });
  res.status(201).json({
    message: 'Payment processed',
    payment: { id: Date.now(), ...req.body, processedAt: new Date().toISOString() }
  });
});

app.get('/api/payments/:id', (req, res) => {
  const id = parseInt(req.params.id);
  res.json({
    id: id,
    amount: 100.50,
    status: 'completed',
    method: 'credit_card'
  });
});

app.listen(PORT, () => {
  logger.info(`${SERVICE_NAME} v${SERVICE_VERSION} running on port ${PORT}`);
});
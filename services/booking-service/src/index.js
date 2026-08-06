const express = require('express');
const cors = require('cors');
const logger = require('./logger');

const app = express();
const PORT = process.env.PORT || 8080;
const SERVICE_NAME = process.env.SERVICE_NAME || 'booking-service';
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

app.get('/api/bookings', (req, res) => {
  res.json({
    service: SERVICE_NAME,
    bookings: [
      { id: 1, customer: 'John Doe', date: '2024-12-01', status: 'confirmed' },
      { id: 2, customer: 'Jane Smith', date: '2024-12-02', status: 'pending' }
    ]
  });
});

app.post('/api/bookings', (req, res) => {
  logger.info('New booking request', { body: req.body });
  res.status(201).json({
    message: 'Booking created',
    booking: { id: Date.now(), ...req.body, createdAt: new Date().toISOString() }
  });
});

app.get('/api/bookings/:id', (req, res) => {
  const id = parseInt(req.params.id);
  res.json({
    id: id,
    customer: 'John Doe',
    date: '2024-12-01',
    status: 'confirmed'
  });
});

app.listen(PORT, () => {
  logger.info(`${SERVICE_NAME} v${SERVICE_VERSION} running on port ${PORT}`);
});
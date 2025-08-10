const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimiter = require('./middleware/rateLimiter');
const spotifyRouter = require('./routes/spotify');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./config/logger');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ origin: true }));
app.use(rateLimiter);

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

app.use('/spotify', spotifyRouter);

// Health endpoint
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Error handler (last middleware)
app.use(errorHandler);

module.exports = app;

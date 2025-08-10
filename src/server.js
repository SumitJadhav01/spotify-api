require('dotenv').config();
const http = require('http');
const app = require('./app');
const logger = require('./config/logger');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
server.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});

module.exports = server;

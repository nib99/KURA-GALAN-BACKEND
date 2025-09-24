const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');

const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
  errorFormat: 'pretty',
});

// Log database queries in development
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e) => {
    logger.debug('Database Query', {
      query: e.query,
      params: e.params,
      duration: `${e.duration}ms`,
      timestamp: e.timestamp
    });
  });
}

// Log database errors
prisma.$on('error', (e) => {
  logger.error('Database Error', {
    message: e.message,
    target: e.target,
    timestamp: new Date().toISOString()
  });
});

// Log database info
prisma.$on('info', (e) => {
  logger.info('Database Info', {
    message: e.message,
    target: e.target,
    timestamp: e.timestamp
  });
});

// Log database warnings
prisma.$on('warn', (e) => {
  logger.warn('Database Warning', {
    message: e.message,
    target: e.target,
    timestamp: e.timestamp
  });
});

// Test database connection
async function connectDatabase() {
  try {
    await prisma.$connect();
    logger.info('✅ Database connected successfully');
    
    // Test query
    await prisma.$queryRaw`SELECT 1`;
    logger.info('✅ Database query test successful');
    
  } catch (error) {
    logger.error('❌ Database connection failed', {
      error: error.message,
      stack: error.stack,
      code: error.code
    });
    
    // Retry connection after 5 seconds
    setTimeout(() => {
      logger.info('🔄 Retrying database connection...');
      connectDatabase();
    }, 5000);
  }
}

// Graceful shutdown
async function disconnectDatabase() {
  try {
    await prisma.$disconnect();
    logger.info('Database disconnected gracefully');
  } catch (error) {
    logger.error('Error disconnecting database', {
      error: error.message,
      stack: error.stack
    });
  }
}

// Initialize connection
connectDatabase();

// Handle shutdown events
process.on('beforeExit', disconnectDatabase);
process.on('SIGINT', disconnectDatabase);
process.on('SIGTERM', disconnectDatabase);

module.exports = prisma;
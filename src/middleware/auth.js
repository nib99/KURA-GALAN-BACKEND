const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const logger = require('../utils/logger');
const { jwtSecret, refreshTokenSecret } = require('../config/security');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'No token provided',
        code: 'NO_TOKEN'
      });
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, jwtSecret);
      
      // Get user from database with minimal fields
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
          emailVerified: true,
          lastLoginAt: true
        }
      });

      if (!user) {
        return res.status(401).json({
          error: 'Access denied',
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }

      if (user.status !== 'ACTIVE') {
        return res.status(403).json({
          error: 'Account suspended',
          message: 'Your account has been suspended. Please contact support.',
          code: 'ACCOUNT_SUSPENDED'
        });
      }

      // Add user to request object
      req.user = user;
      req.token = token;
      
      next();

    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          error: 'Token expired',
          message: 'Please refresh your token',
          code: 'TOKEN_EXPIRED'
        });
      }

      if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          error: 'Invalid token',
          message: 'Token verification failed',
          code: 'INVALID_TOKEN'
        });
      }

      throw jwtError;
    }

  } catch (error) {
    logger.error('Authentication error', {
      error: error.message,
      stack: error.stack,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(500).json({
      error: 'Authentication error',
      message: 'Internal server error',
      code: 'AUTH_ERROR'
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    if (!roles.includes(req.user.role)) {
      logger.warn('Authorization failed', {
        userId: req.user.id,
        userRole: req.user.role,
        requiredRoles: roles,
        ip: req.ip
      });

      return res.status(403).json({
        error: 'Access denied',
        message: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    next();
  };
};

const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, jwtSecret);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        emailVerified: true
      }
    });

    if (user && user.status === 'ACTIVE') {
      req.user = user;
      req.token = token;
    }
  } catch (error) {
    // Ignore token errors for optional auth
    logger.debug('Optional auth failed', {
      error: error.message,
      ip: req.ip
    });
  }

  next();
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        error: 'Refresh token required',
        message: 'No refresh token provided',
        code: 'NO_REFRESH_TOKEN'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, refreshTokenSecret);

    // Check if refresh token exists in database
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            status: true,
            emailVerified: true
          }
        }
      }
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      return res.status(401).json({
        error: 'Invalid refresh token',
        message: 'Refresh token is invalid or expired',
        code: 'INVALID_REFRESH_TOKEN'
      });
    }

    if (storedToken.user.status !== 'ACTIVE') {
      return res.status(403).json({
        error: 'Account suspended',
        message: 'Your account has been suspended',
        code: 'ACCOUNT_SUSPENDED'
      });
    }

    req.user = storedToken.user;
    req.refreshToken = refreshToken;
    
    next();

  } catch (error) {
    logger.error('Refresh token error', {
      error: error.message,
      stack: error.stack,
      ip: req.ip
    });

    res.status(401).json({
      error: 'Invalid refresh token',
      message: 'Token verification failed',
      code: 'REFRESH_TOKEN_ERROR'
    });
  }
};

module.exports = {
  authenticate,
  authorize,
  optionalAuth,
  refreshToken
};
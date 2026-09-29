import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'watthacks_jwt_secret_dev_2026';

/**
 * Authentication Middleware: Verifies JWT Bearer token
 */
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized: Missing or invalid Authorization header. Provide a valid Bearer token.'
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      error: 'Unauthorized: Invalid or expired session token.',
      details: err.message
    });
  }
}

/**
 * Optional Auth Middleware: Attaches user if token is present, proceeds otherwise
 */
export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch {
      // Proceed as unauthenticated guest/demo
    }
  }
  next();
}

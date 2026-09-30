import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'watthacks_jwt_secret_pune_sustainability_2026';

/**
 * Require JWT Authentication Middleware
 * Enforces valid Bearer token on protected routes
 */
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
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
      success: false,
      error: 'Unauthorized: Invalid or expired session token.',
      details: err.message
    });
  }
}

/**
 * Optional JWT Authentication Middleware
 * Attaches decoded user if valid Bearer token present; proceeds smoothly otherwise
 */
export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch {
      // Proceed unauthenticated (demo/guest mode)
    }
  }
  next();
}

export default { requireAuth, optionalAuth };

const jwt = require('jsonwebtoken');

/**
 * Interview9.ai Authentication Middleware
 * Part of TheGreyMatter.ai Ecosystem
 *
 * Security requirements:
 * - JWT_SECRET MUST be set via environment variable (no fallback)
 * - org_id is extracted from JWT and attached to req for org-scoped queries
 * - Error messages never leak internal details
 */

// Fail fast if JWT_SECRET is not configured
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    console.error('FATAL: JWT_SECRET environment variable is required. Exiting.');
    process.exit(1);
  } else {
    console.error(
      'WARNING: JWT_SECRET environment variable is not set. ' +
      'Authentication will fail for all requests. ' +
      'Set JWT_SECRET in your .env file.'
    );
  }
}

const authMiddleware = (req, res, next) => {
  // Guard: if JWT_SECRET was never set, reject all requests
  if (!JWT_SECRET) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_CONFIG_ERROR', message: 'Authentication service is misconfigured' },
    });
  }

  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'No token provided' },
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Extract and validate org_id from token
    const orgId = decoded.org || decoded.organizationId || decoded.org_id;
    if (!orgId) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_TOKEN', message: 'Token missing organization claim' },
      });
    }

    req.user = decoded;
    // Normalize org_id so all routes can use req.orgId consistently
    req.orgId = orgId;

    next();
  } catch (err) {
    // Do not expose error details — just indicate the token is invalid
    return res.status(401).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' },
    });
  }
};

const requirePermission = (permission) => (req, res, next) => {
  // Permission map — should be loaded from platform config in production
  const permissions = {
    'assessments:create': ['SuperAdmin', 'Admin', 'Manager', 'Analyst'],
    'assessments:delete': ['SuperAdmin', 'Admin', 'Manager'],
    'assessments:view': ['SuperAdmin', 'Admin', 'Manager', 'Analyst', 'Viewer'],
    'ai:analyze': ['SuperAdmin', 'Admin', 'Manager', 'Analyst'],
    'settings:modify': ['SuperAdmin', 'Admin'],
  };

  const userRole = req.user?.role;
  const userRoles = req.user?.roles || (userRole ? [userRole] : []);
  const allowed = permissions[permission] || [];

  if (!userRoles.some((r) => allowed.includes(r))) {
    return res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: 'Permission denied' },
    });
  }
  next();
};

module.exports = authMiddleware;
module.exports.requirePermission = requirePermission;

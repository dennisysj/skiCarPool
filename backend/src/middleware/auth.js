/**
 * Authentication middleware for protecting routes
 * Verifies the JWT token provided in the Authorization header
 */
const authMiddleware = async (req, res, next) => {
  // Get the authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: {
        message: 'Authorization header missing or invalid format'
      }
    });
  }

  // Extract the token
  const token = authHeader.split(' ')[1];
  
  try {
    // Verify the token with Supabase
    const { data, error } = await req.supabase.auth.getUser(token);
    
    if (error || !data.user) {
      return res.status(401).json({
        error: {
          message: 'Invalid or expired token'
        }
      });
    }
    
    // Attach the user to the request object
    req.user = data.user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    return res.status(500).json({
      error: {
        message: 'Authentication error'
      }
    });
  }
};

module.exports = authMiddleware; 
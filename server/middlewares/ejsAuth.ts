import { Request, Response, NextFunction } from 'express';
import session from 'express-session';

// Extend Express Request type to include session
declare module 'express-session' {
  interface SessionData {
    user?: {
      id: string;
      username: string;
      email: string;
      role: string;
    };
  }
}

/**
 * Authentication middleware for EJS-rendered routes
 * This is a simplified version of the auth middleware for the migration
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  // In a real application, we'd check for a valid session or JWT token
  // For now, we'll just check if there's a user in the session
  if (req.session && req.session.user) {
    next();
  } else {
    // Redirect to login page with return URL
    res.redirect(`/auth?returnUrl=${encodeURIComponent(req.originalUrl)}`);
  }
};

/**
 * Middleware to add user data to all views if logged in
 */
export const addUserToViews = (req: Request, res: Response, next: NextFunction) => {
  // Add user data to all views if user is logged in
  if (req.session && req.session.user) {
    res.locals.user = req.session.user;
    res.locals.isAuthenticated = true;
  } else {
    res.locals.isAuthenticated = false;
  }
  next();
};

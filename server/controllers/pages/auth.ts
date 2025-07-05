import { Request, Response } from 'express';
import { conn } from '../../db';
import logger from '../../libs/logger';
import { flashSuccess, flashError } from '../../libs/viewHelpers';

export const authController = {
  index: (req: Request, res: Response) => {
    const tab = req.query.tab || 'login';
    const error = req.query.error;

    res.render('pages/auth/index', {
      title: 'Authentication',
      layout: 'layouts/auth',
      activeTab: tab,
      error,
    });
  },

  logout: (req: Request, res: Response) => {
    // Destroy session
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        // Use flash message using res.locals directly since session is gone
        res.cookie('flash_message', 'Error logging out');
        res.cookie('flash_type', 'error');
      } else {
        // Set a flash message via cookie since session is gone
        res.cookie('flash_message', 'You have been logged out successfully');
        res.cookie('flash_type', 'success');
      }
      // Redirect to home page
      res.redirect('/');
    });
  },

  login: (req: Request, res: Response) => {
    res.render('pages/auth/login', {
      title: 'Login',
      layout: 'layouts/auth',
    });
  },

  signup: (req: Request, res: Response) => {
    res.render('pages/auth/signup', {
      title: 'Sign Up',
      layout: 'layouts/auth',
    });
  },

  resetPassword: (req: Request, res: Response) => {
    res.render('pages/auth/reset-password', {
      title: 'Reset Password',
      layout: 'layouts/auth',
    });
  },

  validateUser: (req: Request, res: Response) => {
    const { token } = req.params;

    // Here would be the logic to validate a user token
    res.render('pages/auth/validate/validate-user', {
      title: 'Validate Account',
      layout: 'layouts/auth',
      token,
    });
  },

  validateReset: (req: Request, res: Response) => {
    const { token } = req.params;

    // Here would be the logic to validate a password reset token
    res.render('pages/auth/validate/validate-reset', {
      title: 'Validate Password Reset',
      layout: 'layouts/auth',
      token,
    });
  },

  // API endpoints
  processLogin: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // In a real app, we would verify credentials against the database
      // For now, we'll just check for demo credentials
      if (email === 'admin@example.com' && password === 'password') {
        // Set up session
        req.session.user = {
          id: '1',
          username: 'admin',
          email: 'admin@example.com',
          role: 'admin',
        };

        // Return success or redirect
        const returnUrl = (req.query.returnUrl as string) || '/dashboard';
        if (req.headers.accept?.includes('application/json')) {
          return res.json({
            success: true,
            message: 'Login successful',
            redirect: returnUrl,
          });
        }

        // Add success flash message and redirect
        flashSuccess(req, res, 'You have successfully logged in', returnUrl);
        return;
      }

      // Invalid credentials
      if (req.headers.accept?.includes('application/json')) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      // Add error flash message and redirect
      flashError(req, res, 'Invalid email or password', '/auth?tab=login');
      return;
    } catch (error) {
      logger.error(`Login error: ${error instanceof Error ? error.message : error}`);
      res.status(400).json({
        success: false,
        message: 'Login failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  processSignup: async (req: Request, res: Response) => {
    try {
      const { email, password, name } = req.body;

      // Here would be the actual signup logic
      // For now, we'll just send a mock response

      res.json({
        success: true,
        message: 'Signup successful. Please check your email to verify your account.',
      });
    } catch (error) {
      logger.error(`Signup error: ${error instanceof Error ? error.message : error}`);
      res.status(400).json({
        success: false,
        message: 'Signup failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  processResetPassword: async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      // Here would be the actual password reset logic
      // For now, we'll just send a mock response

      res.json({
        success: true,
        message: 'If the email exists in our system, you will receive reset instructions.',
      });
    } catch (error) {
      logger.error(`Reset password error: ${error instanceof Error ? error.message : error}`);
      res.status(400).json({
        success: false,
        message: 'Password reset request failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
};

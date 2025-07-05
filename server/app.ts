import Express from 'express';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import flash from 'connect-flash';
import { runAsMicroService, runAsMonolith } from './appRunner';
import logger from './libs/logger';
import { applySentinel } from './libs/expressSentinel';
import expressLayouts from 'express-ejs-layouts';
import { addUserToViews } from './middlewares/ejsAuth';
// Import route modules
import indexRoutes from './routes';
import authRoutes from './routes/auth';
import dashboardRoutes from './routes/dashboard';
import healthRoutes from './routes/health';
import preferencesRoutes from './routes/preferences';

require('dotenv').config({
  path: '../.env',
});

const port = parseInt(process.env.PORT || '3002');
const host = '127.0.0.1';
const node_env = process?.env?.NODE_ENV?.trim() || 'development';
const app_mode = process?.env?.APP_MODE?.trim() || 'monolith';
const dev = node_env === 'development';
const childProcess = require('child_process');
const app: Express.Application = Express();

// Configure EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../../views'));
app.use(expressLayouts);
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);
app.set('layout', 'layouts/main');
app.use(Express.static(path.join(__dirname, '../../public')));

// Configure Express app
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(cookieParser());
applySentinel(app);

// Configure session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fusion-cms-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: node_env === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Enable flash messages
app.use(flash());

// Add user data to views
app.use(addUserToViews);

// Add default variables to all views
app.use((req, res, next) => {
  // Default theme from user preference or cookie
  const userTheme = req.cookies?.theme || (req.headers['accept-dark-mode'] ? 'dark' : 'light');
  res.locals.theme = userTheme;

  // Handle flash messages from cookies (for logout scenario)
  if (req.cookies?.flash_message) {
    const type = req.cookies?.flash_type || 'info';
    req.flash(type, req.cookies.flash_message);
    res.clearCookie('flash_message');
    res.clearCookie('flash_type');
  }

  // Add flash messages to all views
  res.locals.flash = {
    success: req.flash('success'),
    error: req.flash('error'),
    info: req.flash('info'),
    warning: req.flash('warning'),
    message: req.flash('message'),
    type: req.flash('type')[0] || 'info',
  };

  // Add other global variables here
  res.locals.appName = 'Fusion CMS';
  res.locals.currentYear = new Date().getFullYear();

  next();
});

// Test endpoint
app.get('/test', (_req, res) => {
  res.json({ status: 'All good', nodeVersion: childProcess.execSync('node -v').toString().trim() });
});

// Add routes for EJS views
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/health', healthRoutes);
app.use('/preferences', preferencesRoutes);

// Health check endpoint
app.get('/ping', (_req, res) => {
  res.status(200).json({ status: 'Working fine ! Inside Ping' });
});

// Start server
const startExpressApp = async () => {
  app.listen(port, () => {
    logger.info(`✓ Fusion CMS is running on: http://${host}:${port}`);
  });

  if (app_mode === 'monolith') {
    await runAsMonolith({ app, dev });
  } else {
    await runAsMicroService();
  }
};

// Start the Express app
startExpressApp().catch((err) => {
  logger.error(`Failed to start Express app: ${err}`);
  process.exit(1);
});

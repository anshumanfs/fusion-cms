import { rateLimit } from 'express-rate-limit';
import cors from 'cors';
import * as requestIp from 'request-ip';
import Express from 'express';
import config from '../../config.json';
import helmet from 'helmet';
import xss from 'xss-clean';

const rateLimiter = rateLimit({
  windowMs: config.security.rateLimit.windowMs,
  max: config.security.rateLimit.max,
});

const corsProtection = cors({
  origin: config.security.cors.origin,
  methods: config.security.cors.methods,
  allowedHeaders: config.security.cors.allowedHeaders,
});

const helmetProtection = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://unpkg.com', 'https://*.apollographql.com'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://unpkg.com', 'https://*.apollographql.com'],
      imgSrc: ["'self'", 'data:', 'https://*.apollographql.com'],
      frameSrc: ["'self'", 'https://unpkg.com', 'https://*.apollographql.com'],
    },
  },
});

const ipSentinel = (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
  const ip = requestIp.getClientIp(req);
  if (ip === '*') {
    next();
  } else {
    if (config.security.ipFilter.whitelist.includes(ip)) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  }
};

const applySentinel = (app: Express.Application) => {
  app.use(ipSentinel);
  app.use(corsProtection);
  app.use(helmetProtection);
  app.use(xss());
  app.use(rateLimiter);
};

export { applySentinel };

import { rateLimit } from 'express-rate-limit';
import * as requestIp from 'request-ip';
import config from '../../config.json';
import secureConfig from '../../.secure.json';

const rateLimiter = rateLimit({
  windowMs: config.security.rateLimit.windowMs,
  max: config.security.rateLimit.max,
});

const applySentinel = (req: any, res: any, next: any) => {
  const ip = requestIp.getClientIp(req);
  if (ip === '*') {
    rateLimiter(req, res, next);
  } else {
    if (config.security.ipFilter.whitelist.includes(ip)) {
      rateLimiter(req, res, next);
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  }
};

export { applySentinel };

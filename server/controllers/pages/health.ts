import { Request, Response } from 'express';

export const healthController = {
  index: (req: Request, res: Response) => {
    // Get system health information
    const healthInfo = {
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      memory: {
        total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
        used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
        rss: Math.round((process.memoryUsage().rss / 1024 / 1024) * 100) / 100,
      },
    };

    res.render('pages/health/index', {
      title: 'System Health',
      layout: 'layouts/main',
      healthInfo,
    });
  },
};

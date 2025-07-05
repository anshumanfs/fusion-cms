import { Request, Response } from 'express';

export const homeController = {
  index: (req: Request, res: Response) => {
    // Sample commands for the homepage
    const commands = ['npm install -g', 'init', 'serve', 'build'];

    // Features data for the homepage
    const features = [
      {
        title: 'Instant API Generation',
        description: 'Define your schema and get REST and GraphQL APIs automatically.',
        icon: 'api',
      },
      {
        title: 'Multiple Database Support',
        description: 'Connect to MongoDB, MySQL, PostgreSQL, SQLite, and more.',
        icon: 'database',
      },
      {
        title: 'Built-in Authentication',
        description: 'Secure your application with ready-to-use authentication.',
        icon: 'lock',
      },
      {
        title: 'Extensible Schema',
        description: 'Flexible schema design with easy customization options.',
        icon: 'schema',
      },
      {
        title: 'Modern Admin Dashboard',
        description: 'Manage your content with an intuitive admin interface.',
        icon: 'dashboard',
      },
      {
        title: 'Developer Friendly',
        description: 'Built with TypeScript for better developer experience.',
        icon: 'code',
      },
    ];

    res.render('pages/index', {
      title: 'Fusion CMS',
      layout: 'layouts/main',
      commands: commands,
      features: features,
    });
  },
};

import Express, { Request, Response } from 'express';
import { createServer } from 'http';
import next from 'next';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = Express();

  server.all('*', (req: Request, res: Response) => handle(req, res));

  createServer(server).listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});

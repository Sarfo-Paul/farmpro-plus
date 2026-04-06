import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import path from 'path';
import fs from 'fs/promises';
import authRoutes from './routes/auth';
import recordsRoutes from './routes/records';
import marketRoutes from './routes/market';
import weatherRoutes from './routes/weather';
import adminRoutes from './routes/admin';

const server = Fastify({ logger: true });

async function start() {
  await server.register(cors, { origin: 'http://localhost:5173', credentials: true });
  await server.register(jwt, { secret: process.env.JWT_SECRET || 'dev-secret' });

  // Resolve directory for serving a built frontend (if present)
  // Use process.cwd() (server folder) and point to workspace `dist` one level up
  const clientDistPath = path.join(process.cwd(), '..', 'dist');
  let hasClientDist = false;
  try {
    await fs.access(clientDistPath);
    hasClientDist = true;
    server.log.info(`Found client dist at ${clientDistPath}`);
  } catch (err) {
    server.log.info('No client dist found — skipping static file serving');
  }

  (server as any).decorate('authenticate', async (request: any, reply: any) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  await server.register(authRoutes, { prefix: '/api/auth' });
  await server.register(recordsRoutes, { prefix: '/api/records' });
  await server.register(marketRoutes, { prefix: '/api/market-prices' });
  await server.register(weatherRoutes, { prefix: '/api/weather' });
  // Admin routes (user + market management)
  await server.register(adminRoutes, { prefix: '/api/admin' });

  // Provide a dedicated API root that documents the API quickly
  server.get('/api', async (request, reply) => {
    return {
      message: 'FarmTrack Pro API',
      status: 'ok',
      api: '/api',
      docs: 'See server/README.md for endpoints and demo credentials'
    };
  });

  // Friendly root route: serve SPA `index.html` if available
  server.get('/', async (request, reply) => {
    if (hasClientDist) {
      try {
        const indexHtml = await fs.readFile(path.join(clientDistPath, 'index.html'), 'utf-8');
        reply.type('text/html; charset=utf-8').send(indexHtml);
        return;
      } catch (err) {
        server.log.error(err);
      }
    }
    return {
      message: 'FarmTrack Pro API',
      status: 'ok',
      api: '/api',
      docs: 'See server/README.md for endpoints and demo credentials'
    };
  });

  // Global not-found handler to avoid raw Fastify 404 responses
  server.setNotFoundHandler(async (request, reply) => {
    const method = request.method;
    const url = request.url || '';
    if (url.startsWith('/api')) {
      return reply.status(404).send({ message: `API route ${method}:${url} not found`, error: 'Not Found', statusCode: 404, docs: 'See server/README.md' });
    }
    if (hasClientDist) {
      const urlPath = url.split('?')[0];
      const fileRelative = urlPath === '/' ? 'index.html' : urlPath.replace(/^\//, '');
      const filePath = path.join(clientDistPath, fileRelative);
      const mimeTypes: any = {
        '.html': 'text/html; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.json': 'application/json; charset=utf-8',
        '.svg': 'image/svg+xml',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.woff2': 'font/woff2',
        '.woff': 'font/woff',
        '.ttf': 'font/ttf',
        '.map': 'application/json; charset=utf-8',
        '.ico': 'image/x-icon'
      };
      try {
        const data = await fs.readFile(filePath);
        const ext = path.extname(filePath).toLowerCase();
        const type = mimeTypes[ext] || 'application/octet-stream';
        reply.header('Content-Type', type).status(200).send(data);
        return;
      } catch (err) {
        // If file not found, fall back to index.html
        try {
          const indexHtml = await fs.readFile(path.join(clientDistPath, 'index.html'), 'utf-8');
          reply.header('Content-Type', 'text/html; charset=utf-8').status(200).send(indexHtml);
          return;
        } catch (err2) {
          // ignore and fall through to JSON response
        }
      }
    }
    return reply.status(200).send({ message: 'FarmTrack Pro API', status: 'ok', api: '/api', docs: 'See server/README.md for endpoints and demo credentials' });
  });

  // Centralized error handler to return clean JSON errors
  server.setErrorHandler((error, request, reply) => {
    server.log.error(error);
    const statusCode = (error && (error as any).statusCode) || 500;
    const payload = process.env.NODE_ENV === 'production'
      ? { message: 'Internal server error', statusCode }
      : { message: (error && (error as any).message) || 'Internal server error', statusCode, stack: (error && (error as any).stack) };
    reply.status(statusCode).send(payload);
  });

  const port = Number(process.env.PORT) || 4000;
  try {
    await server.listen({ port, host: '0.0.0.0' });
    server.log.info(`Server listening on ${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();

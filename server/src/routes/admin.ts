import { FastifyPluginAsync } from 'fastify';
import prisma from '../lib/prisma';
import { z } from 'zod';

const adminRoutes: FastifyPluginAsync = async (fastify, opts) => {
  const adminEmails = (process.env.ADMIN_EMAILS || 'alice@example.com').split(',').map((s) => s.trim());

  const ensureAdmin = async (request: any, reply: any) => {
    try {
      await request.jwtVerify();
      const payload = request.user as any;
      if (!payload?.email || !adminEmails.includes(payload.email)) {
        return reply.status(403).send({ error: 'Forbidden' });
      }
    } catch (err) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }
  };

  fastify.get('/users', { onRequest: [ensureAdmin] }, async (request, reply) => {
    const users = await prisma.user.findMany({ select: { id: true, email: true, name: true, createdAt: true } });
    return { users };
  });

  fastify.delete('/users/:id', { onRequest: [ensureAdmin] }, async (request: any, reply) => {
    const id = Number(request.params.id);
    await prisma.user.delete({ where: { id } });
    return { ok: true };
  });

  fastify.get('/market-prices', async (request, reply) => {
    const prices = await prisma.marketPrice.findMany({ orderBy: { date: 'desc' } });
    return { prices };
  });

  fastify.post('/market-prices', { onRequest: [ensureAdmin] }, async (request: any, reply) => {
    try {
      const body = request.body as any;
      const schema = z.object({ crop: z.string(), price: z.number(), date: z.string().optional() });
      const parsed = schema.parse(body);
      const created = await prisma.marketPrice.create({ data: { crop: parsed.crop, price: parsed.price, date: parsed.date ? new Date(parsed.date) : new Date() } });
      return { price: created };
    } catch (err: any) {
      return reply.status(400).send({ error: err.message || 'Invalid request' });
    }
  });

  fastify.delete('/market-prices/:id', { onRequest: [ensureAdmin] }, async (request: any, reply) => {
    const id = Number(request.params.id);
    await prisma.marketPrice.delete({ where: { id } });
    return { ok: true };
  });
};

export default adminRoutes;

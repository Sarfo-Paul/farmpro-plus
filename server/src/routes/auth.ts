import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import prisma from '../lib/prisma';
import argon2 from 'argon2';

const authRoutes: FastifyPluginAsync = async (fastify, opts) => {
  fastify.post('/register', async (request, reply) => {
    try {
      const body = request.body as any;
      const schema = z.object({ email: z.string().email(), password: z.string().min(6), name: z.string().optional() });
      const parsed = schema.parse(body);

      const existing = await prisma.user.findUnique({ where: { email: parsed.email } });
      if (existing) return reply.status(400).send({ error: 'User already exists' });

      const hash = await argon2.hash(parsed.password);
      const user = await prisma.user.create({ data: { email: parsed.email, password: hash, name: parsed.name } });
      return { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt };
    } catch (err: any) {
      reply.status(400).send({ error: err.message || 'Invalid request' });
    }
  });

  fastify.post('/login', async (request, reply) => {
    try {
      const body = request.body as any;
      const schema = z.object({ email: z.string().email(), password: z.string() });
      const parsed = schema.parse(body);

      const user = await prisma.user.findUnique({ where: { email: parsed.email } });
      if (!user) return reply.status(401).send({ error: 'Invalid credentials' });

      const valid = await argon2.verify(user.password, parsed.password);
      if (!valid) return reply.status(401).send({ error: 'Invalid credentials' });

      const token = fastify.jwt.sign({ userId: user.id, email: user.email });
      const adminEmails = (process.env.ADMIN_EMAILS || 'alice@example.com').split(',').map((s) => s.trim());
      const isAdmin = adminEmails.includes(user.email);
      return { token, user: { id: user.id, email: user.email, name: user.name, isAdmin } };
    } catch (err: any) {
      reply.status(400).send({ error: err.message || 'Invalid request' });
    }
  });

  fastify.get('/me', { onRequest: [(fastify as any).authenticate] }, async (request: any, reply) => {
    const payload = request.user as any;
    const user = await prisma.user.findUnique({ where: { id: payload.userId }, select: { id: true, email: true, name: true, createdAt: true } });
    if (!user) return reply.status(404).send({ error: 'User not found' });
    const adminEmails = (process.env.ADMIN_EMAILS || 'alice@example.com').split(',').map((s) => s.trim());
    const isAdmin = adminEmails.includes(user.email);
    return { user: { ...user, isAdmin } };
  });

  fastify.put('/me', { onRequest: [(fastify as any).authenticate] }, async (request: any, reply) => {
    try {
      const body = request.body as any;
      const schema = z.object({ name: z.string().optional(), password: z.string().min(6).optional() });
      const parsed = schema.parse(body);
      const payload = request.user as any;
      const updates: any = {};
      if (parsed.name) updates.name = parsed.name;
      if (parsed.password) updates.password = await argon2.hash(parsed.password);
      const updated = await prisma.user.update({ where: { id: payload.userId }, data: updates, select: { id: true, email: true, name: true, createdAt: true } });
      const adminEmails = (process.env.ADMIN_EMAILS || 'alice@example.com').split(',').map((s) => s.trim());
      const isAdmin = adminEmails.includes(updated.email);
      return { user: { ...updated, isAdmin } };
    } catch (err: any) {
      reply.status(400).send({ error: err.message || 'Invalid request' });
    }
  });
};

export default authRoutes;

import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import prisma from '../lib/prisma';

const recordsRoutes: FastifyPluginAsync = async (fastify, opts) => {
  fastify.get('/', async (request, reply) => {
    const q = request.query as any;
    const where: any = {};
    if (q.userId) {
      where.userId = Number(q.userId);
    } else {
      // If the request is authenticated and no explicit userId is provided,
      // return only the authenticated user's records to enable personalized dashboards.
      try {
        // @ts-ignore
        await request.jwtVerify();
        const payload = (request as any).user as any;
        if (payload?.userId) where.userId = payload.userId;
      } catch (_err) {
        // not authenticated — keep `where` empty (public listing)
      }
    }
    if (q.crop) where.crop = String(q.crop);
    const records = await prisma.record.findMany({ where, orderBy: { date: 'desc' }, take: Number(q.limit) || 100 });
    return { records };
  });

  fastify.get('/:id', async (request: any, reply: any) => {
    const id = Number(request.params.id);
    const record = await prisma.record.findUnique({ where: { id }, include: { user: { select: { id: true, email: true, name: true } } } });
    if (!record) return reply.status(404).send({ error: 'Not found' });
    return { record };
  });

  fastify.post('/', { onRequest: [(fastify as any).authenticate] }, async (request: any, reply: any) => {
    const payload = request.user as any;
    const body = request.body as any;
    const schema = z.object({ crop: z.string(), date: z.string().optional(), quantity: z.number().optional(), price: z.number().optional(), notes: z.string().optional(), location: z.string().optional() });
    const parsed = schema.parse(body);
    const record = await prisma.record.create({ data: { userId: payload.userId, crop: parsed.crop, date: parsed.date ? new Date(parsed.date) : new Date(), quantity: parsed.quantity ?? 0, price: parsed.price ?? 0, notes: parsed.notes, location: parsed.location } });
    return { record };
  });

  fastify.put('/:id', { onRequest: [(fastify as any).authenticate] }, async (request:any, reply:any) => {
    const id = Number(request.params.id);
    const payload = request.user as any;
    const existing = await prisma.record.findUnique({ where: { id } });
    if (!existing) return reply.status(404).send({ error: 'Not found' });
    if (existing.userId !== payload.userId) return reply.status(403).send({ error: 'Forbidden' });
    const body = request.body as any;
    const updates: any = {};
    if (body.crop) updates.crop = body.crop;
    if (body.date) updates.date = new Date(body.date);
    if (typeof body.quantity !== 'undefined') updates.quantity = body.quantity;
    if (typeof body.price !== 'undefined') updates.price = body.price;
    if (typeof body.notes !== 'undefined') updates.notes = body.notes;
    if (typeof body.location !== 'undefined') updates.location = body.location;
    const record = await prisma.record.update({ where: { id }, data: updates });
    return { record };
  });

  fastify.delete('/:id', { onRequest: [(fastify as any).authenticate] }, async (request:any, reply:any) => {
    const id = Number(request.params.id);
    const payload = request.user as any;
    const existing = await prisma.record.findUnique({ where: { id } });
    if (!existing) return reply.status(404).send({ error: 'Not found' });
    if (existing.userId !== payload.userId) return reply.status(403).send({ error: 'Forbidden' });
    await prisma.record.delete({ where: { id } });
    return { success: true };
  });
};

export default recordsRoutes;

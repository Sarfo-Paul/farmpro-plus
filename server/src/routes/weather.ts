import { FastifyPluginAsync } from 'fastify';
import prisma from '../lib/prisma';

const weatherRoutes: FastifyPluginAsync = async (fastify, opts) => {
  fastify.get('/', async (request:any) => {
    const q = request.query as any;
    const where: any = {};
    if (q.location) where.location = String(q.location);
    if (q.date) where.date = new Date(String(q.date));
    const items = await prisma.weather.findMany({ where, orderBy: { date: 'desc' }, take: Number(q.limit) || 50 });
    return { weather: items };
  });
};

export default weatherRoutes;

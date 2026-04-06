import { FastifyPluginAsync } from 'fastify';
import prisma from '../lib/prisma';

const marketRoutes: FastifyPluginAsync = async (fastify, opts) => {
  fastify.get('/', async (request:any) => {
    const q = request.query as any;
    const where: any = {};
    if (q.crop) where.crop = String(q.crop);
    if (q.date) where.date = new Date(String(q.date));
    const prices = await prisma.marketPrice.findMany({ where, orderBy: { date: 'desc' }, take: Number(q.limit) || 100 });
    return { prices };
  });
};

export default marketRoutes;

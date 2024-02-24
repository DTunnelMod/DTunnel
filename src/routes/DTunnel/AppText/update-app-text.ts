import prisma from '../../../config/prisma-client';
import SafeCallback from '../../../utils/safe-callback';
import Authentication from '../../../middlewares/authentication';
import { FastifyReply, FastifyRequest, RouteOptions } from 'fastify';
import { AppTextUpdateSchema } from './zod-schema';

export default {
  url: '/texts/update',
  method: 'PUT',
  onRequest: [Authentication.user],
  handler: async (req: FastifyRequest, reply: FastifyReply) => {
    const body = AppTextUpdateSchema.parse(req.body);

    const texts = await SafeCallback(() =>
      prisma.appText.updateMany({
        where: {
          label: body.label,
          user_id: req.user.id,
        },
        data: { text: body.text },
      })
    );

    if (!texts) {
      throw new Error('Não foi possível resetar textos');
    }

    reply.status(200).send();
  },
} as RouteOptions;

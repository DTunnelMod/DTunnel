import { z } from 'zod';
import AppTextDefault from './defaults';
import prisma from '../../../config/prisma-client';
import SafeCallback from '../../../utils/safe-callback';
import Authentication from '../../../middlewares/authentication';
import { FastifyReply, FastifyRequest, RouteOptions } from 'fastify';

const bodySchema = z.object({
  label: z.string(),
});

export default {
  url: '/text/reset',
  method: 'PUT',
  onRequest: [Authentication.user],
  handler: async (req: FastifyRequest, reply: FastifyReply) => {
    const { label } = bodySchema.parse(req.body);

    const AppText = AppTextDefault.find((appText) => appText.label === label);
    if (!AppText) {
      throw new Error('Label not found');
    }

    await SafeCallback(() =>
      prisma.appText.updateMany({
        where: {
          label,
          user_id: req.user.id,
        },
        data: {
          text: AppText.text,
        },
      })
    );

    reply.status(200).send();
  },
} as RouteOptions;

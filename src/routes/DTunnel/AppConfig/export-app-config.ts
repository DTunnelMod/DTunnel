import { z } from 'zod';
import SafeCallback from '../../../utils/safe-callback';
import Authentication from '../../../middlewares/authentication';
import { FastifyReply, FastifyRequest, RouteOptions } from 'fastify';

const bodySchema = z.object({
  config: z.string(),
});

export default {
  url: '/app_config/export/app',
  method: 'POST',
  onRequest: [Authentication.user],
  handler: async (req: FastifyRequest, reply: FastifyReply) => {
    const { config } = bodySchema.parse(req.body);
    reply.status(201).send({ config: Buffer.from(config).toString('base64') });
  },
} as RouteOptions;

import { z } from 'zod';
import GetAppText from './get-app-text';
import AESCrypt from '../../utils/crypto';
import GetAppConfig from './get-app-config';
import GetAppLayout from './get-app-layout';
import { FastifyReply, FastifyRequest, RouteOptions } from 'fastify';

const headerSchema = z.object({
  password: z.string().optional(),
  'dtunnel-token': z.string(),
  'dtunnel-update': z.enum(['app_config', 'app_layout', 'app_text']),
  'user-agent': z.literal('DTunnelMod (@DTunnelMod, @DTunnelModGroup, @LightXVD)'),
});

const handler = {
  app_text: GetAppText,
  app_config: GetAppConfig,
  app_layout: GetAppLayout,
};

export default {
  url: '/api/dtunnelmod',
  method: 'GET',
  handler: async (req: FastifyRequest, reply: FastifyReply) => {
    const password = 'DTunnelModSecret-API-9c69a0b72b442ccac3e6aaaa7630d12f2b351fe395e9fe667efa0907cde90da5';

    const headers = headerSchema.safeParse(req.headers);
    if (headers && !headers.success) return reply.send();

    const user_id = headers.data['dtunnel-token'];
    const response = await handler[headers.data['dtunnel-update']](user_id);

    if (headers.data.password == password) {
      if (['app_config', 'app_layout'].includes(headers.data['dtunnel-update'])) {
        return reply.send(response.map((data: any) => JSON.parse(data)));
      }
      return reply.send(response);
    }

    reply.send(AESCrypt.encrypt(password, JSON.stringify(response)));
  },
} as RouteOptions;

import AppTextDefault from './defaults';
import prisma from '../../../config/prisma-client';
import SafeCallback from '../../../utils/safe-callback';
import Authentication from '../../../middlewares/authentication';
import { FastifyReply, FastifyRequest, RouteOptions } from 'fastify';

export default {
  url: '/texts/reset',
  method: 'DELETE',
  onRequest: [Authentication.user],
  handler: async (req: FastifyRequest, reply: FastifyReply) => {
    const AppDefaultObject: any = {};
    AppTextDefault.forEach((App) => (AppDefaultObject[App.label] = App.text));

    Object.keys(AppDefaultObject).forEach(async (key) => {
      await SafeCallback(() =>
        prisma.appText.updateMany({
          where: {
            label: key,
            user_id: req.user.id,
          },
          data: {
            text: AppDefaultObject[key],
          },
        })
      );
    });

    reply.status(204).send();
  },
} as RouteOptions;

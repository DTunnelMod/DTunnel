import { Render } from '../../../config/render-config';
import Authentication from '../../../middlewares/authentication';
import { FastifyRequest, FastifyReply, RouteOptions } from 'fastify';

export default {
  url: '/texts',
  method: 'GET',
  onRequest: [Authentication.user],
  handler: async (req: FastifyRequest, reply: FastifyReply) => {
    Render.page(req, reply, '/texts/index.html', {
      user: req.user,
      active: 'texts',
      csrfToken: req.csrfProtection.generateCsrf(),
    });
  },
} as RouteOptions;

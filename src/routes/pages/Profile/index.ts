import { Render } from '../../../config/render-config';
import Authentication from '../../../middlewares/authentication';
import { FastifyRequest, FastifyReply, RouteOptions } from 'fastify';

export default {
  url: '/profile',
  method: 'GET',
  onRequest: [Authentication.user],
  handler: (req: FastifyRequest, reply: FastifyReply) => {
    Render.page(req, reply, '/profile/index.html', {
      user: req.user,
      active: 'profile',
      csrfToken: req.csrfProtection.generateCsrf(),
    });
  },
} as RouteOptions;

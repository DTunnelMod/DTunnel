import { Render } from '../../../config/render-config';
import formatDate from '../../../utils/format-date';
import Authentication from '../../../middlewares/authentication';
import { FastifyRequest, FastifyReply, RouteOptions } from 'fastify';

export default {
  url: '/',
  method: 'GET',
  onRequest: [Authentication.user],
  handler: async (req: FastifyRequest, reply: FastifyReply) => {
    Render.page(req, reply, '/home/index.html', {
      user: req.user,
      formatDate,
      active: 'home',
      csrfToken: req.csrfProtection.generateCsrf(),
    });
  },
} as RouteOptions;

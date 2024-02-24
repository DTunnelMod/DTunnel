import { Render } from '../../../config/render-config';
import Authentication from '../../../middlewares/authentication';
import { FastifyRequest, FastifyReply, RouteOptions } from 'fastify';

export default {
  url: '/register',
  method: 'GET',
  onRequest: [Authentication.user],
  handler: (req: FastifyRequest, reply: FastifyReply) => {
    if (req.user && req.user.id) reply.redirect('/');
    Render.page(req, reply, '/register/index.html', { csrfToken: req.csrfProtection.generateCsrf() });
  },
} as RouteOptions;

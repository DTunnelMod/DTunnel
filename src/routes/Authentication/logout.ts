import CookieManager from '../../utils/cookie-manager';
import Authentication from '../../middlewares/authentication';
import { FastifyReply, FastifyRequest, RouteOptions } from 'fastify';

export default {
  url: '/logout',
  method: 'GET',
  onRequest: [Authentication.user],
  handler: (req: FastifyRequest, reply: FastifyReply) => {
    CookieManager.deleteCookiesLoggedIn(reply);
    reply.redirect('/login');
  },
} as RouteOptions;

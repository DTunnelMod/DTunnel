import { FastifyReply } from 'fastify';
import { JWTConfig } from '../config/jwt-config';
import type { CookieSerializeOptions } from '@fastify/cookie';

export default class CookieManager {
  static readonly options: CookieSerializeOptions = {
    path: '/',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60,
  };

  static deleteCookiesLoggedIn(reply: FastifyReply) {
    reply.clearCookie('accessToken');
    reply.clearCookie('refreshToken');
  }

  static setCookiesLoggedIn(reply: FastifyReply, id: string) {
    const tokens = JWTConfig.generate(id);
    reply.setCookie('accessToken', tokens.accessToken, this.options);
    reply.setCookie('refreshToken', tokens.refreshToken, this.options);
  }
}

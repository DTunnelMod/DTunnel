import { z } from 'zod';
import BCrypt from '../../utils/bcrypt';
import prisma from '../../config/prisma-client';
import SafeCallback from '../../utils/safe-callback';
import Authentication from '../../middlewares/authentication';
import csrfProtection from '../../middlewares/csrf-protection';
import { FastifyReply, FastifyRequest, RouteOptions } from 'fastify';

const bodySchema = z.object({
  email: z.string().email(),
  username: z.string().max(20),
  password: z.string().min(6).max(20).nullable(),
  confirm_password: z.string().min(6).max(20).nullable(),
});

export default {
  url: '/profile',
  method: 'PUT',
  onRequest: [csrfProtection, Authentication.user],
  handler: async (req: FastifyRequest, reply: FastifyReply) => {
    const body = bodySchema.parse(req.body);

    const usernameAlreadyExists = await SafeCallback(() =>
      prisma.user.findFirst({
        where: {
          username: body.username,
        },
      })
    );

    reply.header('csrf-token', req.csrfProtection.generateCsrf());

    if (usernameAlreadyExists && usernameAlreadyExists.id !== req.user.id) {
      reply.status(409);
      throw new Error('Nome de usuário já utilizado, tente um diferente');
    }

    if (body.password !== body.confirm_password) {
      reply.status(400);
      throw new Error('Senhas não conferem');
    }

    const password = body.password ? BCrypt.hash(body.password) : undefined;

    const user = await SafeCallback(() =>
      prisma.user.update({
        where: {
          id: req.user.id,
        },
        data: {
          username: body.username,
          password,
        },
      })
    );

    if (!user) {
      throw new Error('Não foi possível alterar seus dados');
    }

    reply.status(200).send();
  },
} as RouteOptions;

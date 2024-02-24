import { FastifyReply, FastifyRequest, DoneFuncWithErrOrRes } from 'fastify';

export default function csrfProtection(req: FastifyRequest, reply: FastifyReply, done: DoneFuncWithErrOrRes) {
  const csrfToken = req.headers['csrf-token'] as string;

  if (!csrfToken) {
    reply.status(400);
    throw new Error('Csrf token não informado');
  }

  if (!req.csrfProtection.verifyCsrf(csrfToken)) {
    reply.status(403);
    reply.header('csrf-token', req.csrfProtection.generateCsrf());
    throw new Error('Csrf token inválido ou expirado');
  }

  done();
}

import { Imgbb } from '../../services/imgbb/upload';
import Authentication from '../../middlewares/authentication';
import { FastifyReply, FastifyRequest, RouteOptions } from 'fastify';

export default {
  url: '/upload/image',
  method: 'POST',
  onRequest: [Authentication.user],
  handler: async (req: FastifyRequest, reply: FastifyReply) => {
    const file = await req.file();

    if (!file) {
      reply.status(400);
      throw new Error('Arquivo inválido!');
    }

    const upload = await Imgbb.upload(file);

    reply.status(upload.status).send(upload);
  },
} as RouteOptions;

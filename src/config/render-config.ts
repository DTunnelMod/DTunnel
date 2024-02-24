import path from 'path';
import { eta } from '../http';
import AESCrypt from '../utils/crypto';
import { FastifyRequest, FastifyReply } from 'fastify';

const pages = path.resolve(__dirname, '../../frontend/pages');

const PASSWORD = '7223fd56-e21d-4191-8867-f3c67601122a';

export class Render {
  static async page(req: FastifyRequest, reply: FastifyReply, filename: string, options?: object) {
    const file = path.join(pages, filename);
    let content = eta.readFile(file);

    if (process.env.ENCRYPT_FILES !== PASSWORD) {
      const decrypted = AESCrypt.decrypt(PASSWORD, content);
      if (!decrypted) {
        return reply.send({ message: 'Could not decrypt file' });
      }
      content = decrypted;
    }

    const res = eta.renderString(content, { ...options });
    reply.header('Content-Type', 'text/html');
    reply.send(res);
  }
}

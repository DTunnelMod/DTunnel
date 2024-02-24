import fastify from 'fastify';
import { ICsrfProtection } from '../../utils/csrf-protection';

type User = {
  id: string;
  username: string;
  password: string;
  email: string;
  created_at: Date;
  updated_at: Date;
};

declare module 'fastify' {
  export interface FastifyRequest {
    user: User;
    csrfProtection: ICsrfProtection;
  }
}

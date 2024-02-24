import Tokens, { TokensSimple } from '@fastify/csrf';

const MINUTES_IN_SECONDS = 10 * 60;

export interface ICsrfProtection extends TokensSimple {
  generateCsrf: () => string;
  verifyCsrf: (token: string) => boolean;
}

const csrf = new Tokens({ validity: MINUTES_IN_SECONDS * 1000 }) as ICsrfProtection;

csrf.generateCsrf = () => csrf.create(process.env.CSRF_SECRET!);

csrf.verifyCsrf = (token: string) => csrf.verify(process.env.CSRF_SECRET!, token);

export default csrf;

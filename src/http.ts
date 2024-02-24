import { Eta } from 'eta';
import * as path from 'path';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import fastifyView from '@fastify/view';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import type { FastifyCookieOptions } from '@fastify/cookie';

const dashboard = path.resolve(__dirname, '../frontend', 'public');
const views = path.resolve(__dirname, '../frontend', 'views');

const fastify = Fastify({ ignoreTrailingSlash: true });
export const eta = new Eta({ views });

import routes from './routes/handle-routes';

fastify
  .register(cors, { origin: '*', methods: ['GET'] })
  .register(helmet, {
    contentSecurityPolicy: false,
  })
  .register(multipart)
  .register(require('@fastify/formbody'))
  .register(fastifyStatic, { root: dashboard })
  .register(fastifyView, { engine: { eta }, templates: views })
  .register(require('@fastify/cookie'), {
    hook: 'onRequest',
  } as FastifyCookieOptions)
  .register(routes);

export default fastify;

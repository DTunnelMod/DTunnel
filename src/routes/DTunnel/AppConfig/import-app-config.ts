import { z } from 'zod';
import prisma from '../../../config/prisma-client';
import Authentication from '../../../middlewares/authentication';
import { ConvertFromHexAARRGGBB } from '../../../utils/convert-color';
import { FastifyReply, FastifyRequest, RouteOptions } from 'fastify';
import { AppConfigImport, CategorySchema, getDateCreateAppConfig } from './zod-schema';

export default {
  url: '/app_config/import',
  method: 'POST',
  onRequest: [Authentication.user],
  handler: async (req: FastifyRequest, reply: FastifyReply) => {
    const body = AppConfigImport.parse(req.body);

    const items = body.items;
    const categoryDataImport: { [key: string]: z.infer<typeof CategorySchema> } = {};

    for (const appConfig of items) {
      if (appConfig.category_id) {
        const categoryAlreadExists = await prisma.category.findFirst({
          where: {
            id: appConfig.category_id,
            user_id: req.user.id,
          },
        });

        if (!categoryAlreadExists) continue;

        await prisma.appConfig.create({
          data: {
            ...getDateCreateAppConfig(appConfig),
            category_id: categoryAlreadExists.id,
            user_id: req.user.id,
          },
        });

        continue;
      }

      const categoryUniqueName = Buffer.from(appConfig.category.name).toString('base64');

      if (!categoryDataImport[categoryUniqueName]) {
        const status = 'ACTIVE';
        categoryDataImport[categoryUniqueName] = {
          ...(await prisma.category.create({
            data: {
              name: appConfig.category.name,
              color: ConvertFromHexAARRGGBB(appConfig.category.color),
              sorter: appConfig.category.sorter,
              status,
              user_id: req.user.id,
            },
          })),
          status,
        };
      }

      await prisma.appConfig.create({
        data: {
          ...getDateCreateAppConfig(appConfig),
          category_id: categoryDataImport[categoryUniqueName].id!,
          user_id: req.user.id,
        },
      });
    }

    reply.status(201).send({ status: 200 });
  },
} as RouteOptions;

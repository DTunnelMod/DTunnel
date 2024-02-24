import { z } from 'zod';

const AppConfigSelect = z.object({
  label: z.string(),
  value: z.string(),
});

const AppConfigValue = z.union([
  z.string().nullable(),
  z.boolean(),
  z.number(),
  z.object({
    options: z.array(AppConfigSelect),
    selected: z.string(),
  }),
]);

const AppLayoutType = z.enum([
  'IMAGE',
  'COLOR',
  'URL',
  'IMAGE',
  'BOOLEAN',
  'TEXT',
  'STRING',
  'SELECT',
  'INTEGER',
  'HTML',
]);

const app_config = z.object({
  id: z.number().nullable().optional(),
  label: z.string(),
  name: z.string(),
  value: AppConfigValue,
  type: AppLayoutType,
  user_id: z.string().optional(),
});

export const AppLayoutUpdate = z.object({
  id: z.number().optional().nullable(),
  app_config: z.array(app_config),
});

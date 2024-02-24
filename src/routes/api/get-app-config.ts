import prisma from '../../config/prisma-client';
import SafeCallback from '../../utils/safe-callback';
import AppConfigParser from '../../utils/parsers/app-config-parser';
import { AppConfigSelect } from '../DTunnel/AppConfig/zod-schema';

export default async function GetAppConfig(user_id: string) {
  const AppConfig = await SafeCallback(() =>
    prisma.appConfig.findMany({
      where: {
        user_id,
        status: 'ACTIVE',
        category: {
          status: 'ACTIVE',
        },
      },
      select: {
        ...AppConfigSelect,
      },
    })
  );
  if (!AppConfig?.length) return [];
  return AppConfig ? AppConfig.map(AppConfigParser) : [];
}

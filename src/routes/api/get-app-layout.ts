import prisma from '../../config/prisma-client';
import SafeCallback from '../../utils/safe-callback';
import { AppLayoutParserApi } from '../../utils/parsers/app-layout-parser';

export default async function GetAppLayout(user_id: string) {
  const AppLayout = await SafeCallback(() =>
    prisma.appLayout.findFirst({
      where: {
        user_id,
        is_active: true,
      },
      select: {
        user_id: true,
        layout_storage: {
          select: {
            id: true,
            name: true,
            label: true,
            type: true,
            value: true,
            status: true,
          },
        },
      },
    })
  );
  return AppLayout ? AppLayoutParserApi(AppLayout) : [];
}

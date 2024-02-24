import prisma from '../../config/prisma-client';
import SafeCallback from '../../utils/safe-callback';

export default async function GetAppText(user_id: string) {
  const appText = await SafeCallback(() =>
    prisma.appText.findMany({
      where: {
        user_id,
      },
      select: {
        label: true,
        text: true,
      },
    })
  );
  return appText ? appText : [];
}

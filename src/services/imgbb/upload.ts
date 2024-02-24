import { request } from '../../utils/request';
import { MultipartFile } from '@fastify/multipart';

export class Imgbb {
  static async upload(file: MultipartFile) {
    try {
      const req1 = await request({ url: 'https://imgbb.com' });

      const auth_token = req1.body!.split('auth_token="')[1].split('";')[0];

      const req2 = await request({
        url: 'https://imgbb.com/json',
        method: 'POST',
        formData: {
          source: {
            value: await file.toBuffer(),
            options: {
              filename: file.filename,
              contentType: file.mimetype,
            },
          },
          type: 'file',
          action: 'upload',
          timestamp: new Date().getTime(),
          auth_token,
        },
      });

      const response = JSON.parse(req2.body!);
      if (response.success && response.success.code == 200) {
        return { status: 200, url: response.image.display_url };
      }

      return { status: 400, message: response.error.message };
    } catch (err: any) {
      return { status: 500, message: 'Erro interno', stack: err.stack };
    }
  }
}

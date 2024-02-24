import crypto from 'crypto';

export default class AESCrypt {
  static encrypt(password: string, plaintext: string) {
    try {
      const key = crypto.createHash('sha256').update(password).digest();
      const iv = Buffer.alloc(16, 0);
      const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
      let ciphertext = cipher.update(plaintext, 'utf8', 'base64');
      ciphertext += cipher.final('base64');
      return ciphertext;
    } catch (err) {
      return null;
    }
  }

  static decrypt(password: string, ciphertext: string) {
    try {
      const key = crypto.createHash('sha256').update(password).digest();
      const iv = Buffer.alloc(16, 0);
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      let plaintext = decipher.update(ciphertext, 'base64', 'utf8');
      plaintext += decipher.final('utf8');
      return plaintext;
    } catch (err) {
      return null;
    }
  }
}

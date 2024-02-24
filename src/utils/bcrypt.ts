import bcrypt from 'bcrypt';

export default class BCrypt {
  static readonly SALT = 10;

  static hash(plaintext: string) {
    return bcrypt.hashSync(plaintext, this.SALT);
  }

  static compare(plaintext: string, hash: string) {
    return bcrypt.compareSync(plaintext, hash);
  }
}

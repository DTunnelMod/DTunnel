declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      CSRF_SECRET: string;
      ENCRYPT_FILES: string;
      JWT_SECRET_KEY: string;
      JWT_SECRET_REFRESH: string;
      NODE_ENV: 'development' | 'production';
    }
  }
}

export {};

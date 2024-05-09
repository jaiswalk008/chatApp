export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_NAME: string;
      DATABASE_USER: string;
      DATABASE_PASSWORD: string;
      DB_HOST: string;
      JWT_SECRET_KEY: string;
      PORT: number;
      IAM_USER_ACCESS_KEY: string;
      IAM_USER_SECRET_ACCESS_KEY: string;
      REDIS_HOST: string;
      REDIS_PORT: number;
      REDIS_USERNAME: string;
      REDIS_PASSWORD: string;
      ENV: 'test' | 'dev' | 'prod';
    }
  }
}


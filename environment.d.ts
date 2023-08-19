export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
        DATABASE_NAME:string;
        DATABASE_USER:string;
        DATABASE_PASSWORD:string;
        DB_HOST:string
        JWT_SECRET_KEY:string
        PORT:number
      ENV: 'test' | 'dev' | 'prod';
    }
  }
}

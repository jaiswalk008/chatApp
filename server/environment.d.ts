export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
        MONGODB_SRV:string;
        
      ENV: 'test' | 'dev' | 'prod';
    }
  }
}

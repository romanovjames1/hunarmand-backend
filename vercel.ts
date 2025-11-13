import { createNestServer } from './dist/src/main';
import serverlessExpress from '@vendia/serverless-express';

// Cache server between requests
let cachedServer: any;

export default async function handler(req: any, res: any) {
  if (!cachedServer) {
    const app = await createNestServer();
    await app.init();
    const expressApp = app.getHttpAdapter().getInstance();
    cachedServer = serverlessExpress({ app: expressApp });
  }

  return cachedServer(req, res);
}

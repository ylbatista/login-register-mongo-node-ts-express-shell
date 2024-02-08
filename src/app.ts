import { envs } from './config/envs';
import { MongoDbConnection } from './data/data-index';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';

(async()=> {
  main();
})();

async function main() {

  await MongoDbConnection.connect({
    //llamarla desde la variable de entorno .env
    dbName: envs.MONGO_DB_NAME,
    mongoUrl: envs.MONGO_URL,
  });

  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  });

  server.start();
}
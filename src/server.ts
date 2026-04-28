import { AppDataSource } from './db/data-source';
import { listen, close } from '@enxoval/http';
import { connect, disconnect, ensureTopics } from '@enxoval/messaging';
import { buildApp } from './app';

const PORT = Number(process.env.PORT) || 3002;
const HOST = process.env.HOST || '0.0.0.0';

async function shutdown() {
  await close();
  await disconnect();
  await AppDataSource.destroy();
  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

AppDataSource.initialize()
  .then(async () => {
    await AppDataSource.runMigrations();
    await ensureTopics();
    await connect();
    buildApp();
    return listen(PORT, HOST);
  })
  .catch((err) => {
    console.error('Failed to start:', err);
    process.exit(1);
  });

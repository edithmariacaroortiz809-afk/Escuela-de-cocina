import 'dotenv/config';
import app from './app.js';
import { logger } from './config/logger.js';
import { prisma } from './lib/prisma.js';

const port = Number(process.env.PORT ?? 3000);

async function start() {
  await prisma.$connect();
  app.listen(port, () => logger.info(`Servidor de recetas escuchando en http://localhost:${port}`));
}

start().catch((error) => {
  logger.error('No se pudo conectar a PostgreSQL', error);
  process.exit(1);
});

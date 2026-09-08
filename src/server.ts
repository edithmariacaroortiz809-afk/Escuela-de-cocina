import 'dotenv/config';
import { app } from './app.js';
import { connectDB } from './lib/mongoose.js';
import { logger } from './config/logger.js';

const PORT = process.env.PORT ?? 3000;

async function main() {
  await connectDB();
  app.listen(PORT, () => {
    logger.info(`Servidor escuchando en http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  logger.error(err);
  process.exit(1);
});

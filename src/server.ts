import app from './app.js';

const PORT = Number(process.env.PORT ?? 3000);

const server = app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

const shutdown = (signal: string) => {
  console.log(`Recibida señal ${signal}. Cerrando servidor...`);
  server.close(() => {
    console.log('Servidor cerrado correctamente');
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

import dotenv from 'dotenv';
import path from 'path';

// Carga las variables de entorno de prueba ANTES de que se importe cualquier
// módulo de la app. dotenv no sobreescribe variables ya definidas, por lo que
// esto tiene prioridad sobre el `import 'dotenv/config'` de src/app.ts.
dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });

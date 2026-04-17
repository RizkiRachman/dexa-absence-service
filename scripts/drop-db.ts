import { Client } from 'pg';

const DB_NAMES    = ['dexa_absence', 'dexa_logging'];
const DB_USER     = 'dexa';

const SUPERUSER          = 'postgres';
const SUPERUSER_PASSWORD = 'postgres';
const SUPERUSER_HOST     = 'localhost';
const SUPERUSER_PORT     = 5432;

async function main() {
  const client = new Client({
    host: SUPERUSER_HOST,
    port: SUPERUSER_PORT,
    user: SUPERUSER,
    password: SUPERUSER_PASSWORD,
    database: 'postgres',
  });

  try {
    await client.connect();

    for (const db of DB_NAMES) {
      await client.query(`
        SELECT pg_terminate_backend(pid)
        FROM pg_stat_activity
        WHERE datname = '${db}' AND pid <> pg_backend_pid();
      `);
      await client.query(`DROP DATABASE IF EXISTS ${db};`);
    }

    await client.query(`DROP OWNED BY ${DB_USER};`);
    await client.query(`DROP USER IF EXISTS ${DB_USER};`);

    console.log('Databases and user dropped.');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Drop failed:', message);
    process.exit(1);
  } finally {
    await client.end().catch(() => {});
  }
}

main();

import {Client} from 'pg';

const DB_NAMES    = ['dexa_absence', 'dexa_logging'];
const DB_USER     = 'dexa';
const DB_PASSWORD = 'password';

const SUPERUSER          = 'postgres';
const SUPERUSER_PASSWORD = 'postgres';
const SUPERUSER_HOST     = 'localhost';
const SUPERUSER_PORT     = 5432;

async function setupDatabase(db: string, superClient: Client) {
    const exists = await superClient.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [db]);
    if (exists.rowCount === 0) {
        await superClient.query(`CREATE DATABASE ${db} OWNER ${DB_USER};`);
    }
    await superClient.query(`GRANT ALL PRIVILEGES ON DATABASE ${db} TO ${DB_USER};`);

    const dbClient = new Client({host: SUPERUSER_HOST, port: SUPERUSER_PORT, user: SUPERUSER, password: SUPERUSER_PASSWORD, database: db});
    await dbClient.connect();
    await dbClient.query(`GRANT ALL ON SCHEMA public TO ${DB_USER};`);
    await dbClient.query(`ALTER SCHEMA public OWNER TO ${DB_USER};`);
    await dbClient.end();
}

async function main() {
    const client = new Client({host: SUPERUSER_HOST, port: SUPERUSER_PORT, user: SUPERUSER, password: SUPERUSER_PASSWORD, database: 'postgres'});

    try {
        await client.connect();

        await client.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${DB_USER}') THEN
                    CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';
                END IF;
            END
            $$;
        `);
        await client.query(`ALTER USER ${DB_USER} CREATEDB;`);

        for (const db of DB_NAMES) {
            await setupDatabase(db, client);
            console.log(`${db} ready.`);
        }

        console.log('Setup complete.');
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error('Setup failed:', message);
        process.exit(1);
    } finally {
        await client.end().catch(() => {});
    }
}

main();

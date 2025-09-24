const { Client } = require('pg');

async function dropDatabase() {
  const admin = new Client({
    host: '127.0.0.1',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'postgres',
  });

  try {
    await admin.connect();
    await admin.query(
      "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'randevu' AND pid <> pg_backend_pid();",
    );
    await admin.query('DROP DATABASE IF EXISTS randevu');
    console.log('Database dropped');
  } catch (error) {
    console.error('Failed to drop database:', error.message);
    process.exitCode = 1;
  } finally {
    await admin.end();
  }
}

dropDatabase().catch((error) => {
  console.error('Unexpected error while dropping database:', error);
  process.exitCode = 1;
});

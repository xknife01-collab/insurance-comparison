import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';

// Load .env
const envConfig = dotenv.parse(fs.readFileSync('.env'));
const databaseUrl = envConfig.DATABASE_URL;

if (!databaseUrl) {
  console.error("Missing DATABASE_URL in .env");
  process.exit(1);
}

const client = new pg.Client({
  connectionString: databaseUrl,
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL!");
    
    // Add certification_message if it doesn't exist
    await client.query(`
      ALTER TABLE planners 
      ADD COLUMN IF NOT EXISTS certification_message text;
    `);
    console.log("Migration executed successfully!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.end();
  }
}

run();

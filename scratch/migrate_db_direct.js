import pg from 'pg';

const client = new pg.Client({
  host: 'wfkxwztxpugakusynhpx.supabase.co',
  port: 5432,
  user: 'postgres',
  password: 'rlaghddlf0411*',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    await client.connect();
    console.log("Connected directly to PostgreSQL!");
    
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

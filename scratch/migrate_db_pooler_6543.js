import pg from 'pg';

const client = new pg.Client({
  host: 'aws-0-ap-southeast-1.pooler.supabase.com',
  port: 6543,
  user: 'postgres.wfkxwztxpugakusynhpx',
  password: 'rlaghddlf0411*',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to pooler port 6543!");
    
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

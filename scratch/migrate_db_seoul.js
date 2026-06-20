import pg from 'pg';

async function tryConnect(host, port) {
  const client = new pg.Client({
    host: host,
    port: port,
    user: 'postgres.wfkxwztxpugakusynhpx',
    password: 'rlaghddlf0411*',
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log(`Successfully connected to ${host}:${port}!`);
    await client.query(`
      ALTER TABLE planners 
      ADD COLUMN IF NOT EXISTS certification_message text;
    `);
    console.log("Migration executed successfully!");
    await client.end();
    return true;
  } catch (err) {
    console.error(`Failed to connect to ${host}:${port} - Error:`, err.message);
    try { await client.end(); } catch(e){}
    return false;
  }
}

async function run() {
  const hosts = [
    'aws-0-ap-northeast-2.pooler.supabase.com', // Seoul
    'aws-0-ap-southeast-1.pooler.supabase.com'  // Singapore
  ];
  
  for (const host of hosts) {
    for (const port of [6543, 5432]) {
      const success = await tryConnect(host, port);
      if (success) {
        process.exit(0);
      }
    }
  }
  console.log("All connection attempts failed.");
  process.exit(1);
}

run();

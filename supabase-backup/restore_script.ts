import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Error: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false }
});

const backupDir = path.resolve(process.cwd(), 'supabase-backup', 'backup_data');

async function restoreTable(tableName: string) {
  const filePath = path.join(backupDir, `${tableName}.json`);
  if (!fs.existsSync(filePath)) {
    console.log(`[Restore] Skip ${tableName}: Backup file not found.`);
    return;
  }

  const rawData = fs.readFileSync(filePath, 'utf-8');
  const rows = JSON.parse(rawData);

  if (!Array.isArray(rows) || rows.length === 0) {
    console.log(`[Restore] Skip ${tableName}: No data to restore.`);
    return;
  }

  console.log(`[Restore] Uploading ${rows.length} rows to: ${tableName}...`);

  // Chunk uploads to avoid payload limits
  const chunkSize = 100;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    
    // We use upsert so that it updates existing or inserts new (based on primary key)
    const { error } = await supabase
      .from(tableName)
      .upsert(chunk);

    if (error) {
      console.error(`[Error] Failed to upsert chunk to ${tableName} (rows ${i} to ${i + chunk.length}):`, error);
      throw error;
    }
  }

  console.log(`[Restore] Successfully restored ${tableName}!`);
}

async function run() {
  if (!fs.existsSync(backupDir)) {
    console.error(`Error: Backup directory ${backupDir} does not exist. Run backup first.`);
    process.exit(1);
  }

  const files = fs.readdirSync(backupDir).filter(f => f.endsWith('.json'));
  const tablesToRestore = files.map(f => f.replace('.json', ''));

  console.log(`Starting Supabase data restore to: ${supabaseUrl}`);
  console.log(`Tables to restore: ${tablesToRestore.join(', ')}\n`);

  for (const table of tablesToRestore) {
    try {
      await restoreTable(table);
    } catch (err) {
      console.error(`[Restore Failed] Table ${table} restoration halted due to error.`, err);
    }
  }

  console.log('\nRestore process completed!');
}

run();

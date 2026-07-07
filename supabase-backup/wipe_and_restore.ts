import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Reconfigure stdout to use utf-8 to print Korean characters properly
if (process.stdout.reconfigure) {
  process.stdout.reconfigure({ encoding: 'utf-8' });
}

// Load env vars
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

async function clearTableOnly(tableName: string) {
  console.log(`[*] Clearing table: ${tableName}...`);
  // Select 1 row to dynamically check columns
  const { data: sample, error: selectError } = await supabase
    .from(tableName)
    .select('*')
    .limit(1);

  if (selectError) {
    console.warn(`[!] Skip clearing ${tableName} (table might not exist yet):`, selectError.message);
    return;
  }

  if (!sample || sample.length === 0) {
    console.log(`[+] Table ${tableName} is already empty.`);
    return;
  }

  const firstKey = Object.keys(sample[0])[0];
  const { error: deleteError } = await supabase
    .from(tableName)
    .delete()
    .not(firstKey, 'is', null);

  if (deleteError) {
    throw deleteError;
  }
  console.log(`[+] Table ${tableName} cleared successfully.`);
}

async function restoreTableOnly(tableName: string) {
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
    try {
      const { error } = await supabase
        .from(tableName)
        .upsert(chunk);

      if (error) {
        throw error;
      }
    } catch (err: any) {
      const errMsg = err.message || '';
      if (errMsg.includes('cannot insert a non-DEFAULT value') || errMsg.includes('identity')) {
        console.log(`[!] Table ${tableName} identity error. Retrying after stripping "id"...`);
        // Strip id field to let Postgres auto-generate it
        const strippedChunk = chunk.map(({ id, ...rest }) => rest);
        const { error: retryError } = await supabase
          .from(tableName)
          .upsert(strippedChunk);

        if (retryError) {
          throw retryError;
        }
      } else {
        throw err;
      }
    }
  }

  console.log(`[Restore] Successfully restored ${tableName}!`);
}

async function run() {
  if (!fs.existsSync(backupDir)) {
    console.error(`Error: Backup directory ${backupDir} does not exist.`);
    process.exit(1);
  }

  const files = fs.readdirSync(backupDir).filter(f => f.endsWith('.json'));
  const tablesToProcess = files.map(f => f.replace('.json', ''));

  console.log(`==================================================`);
  console.log(`   SUPABASE ROBUST WIPE AND RESTORE PROCESS       `);
  console.log(`==================================================`);
  console.log(`Target database: ${supabaseUrl}`);
  console.log(`Tables to process: ${tablesToProcess.join(', ')}\n`);

  // 1. SELF-HEALING CLEAR PHASE
  console.log(`--------------------------------------------------`);
  console.log(`PHASE 1: Dynamic Table Clearing (Resolving constraints...)`);
  console.log(`--------------------------------------------------`);
  let clearQueue = [...tablesToProcess];
  let clearAttempts = 0;
  
  while (clearQueue.length > 0 && clearAttempts < 5) {
    clearAttempts++;
    console.log(`\n[Clear Round ${clearAttempts}] Processing remaining ${clearQueue.length} tables...`);
    const nextClearQueue: string[] = [];
    
    for (const table of clearQueue) {
      try {
        await clearTableOnly(table);
      } catch (err: any) {
        console.warn(`[Clear Pending] Table "${table}" could not be cleared (constraint active). Will retry. Detail: ${err.message || err}`);
        nextClearQueue.push(table);
      }
    }
    clearQueue = nextClearQueue;
  }

  if (clearQueue.length > 0) {
    console.error(`\n[-] Clear phase failed: Persistent constraints prevented clearing of: ${clearQueue.join(', ')}`);
    process.exit(1);
  }
  console.log(`\n[+] Phase 1 Completed: All tables cleared successfully!`);

  // 2. SELF-HEALING RESTORE PHASE
  console.log(`\n--------------------------------------------------`);
  console.log(`PHASE 2: Dynamic Data Restoration (Resolving parent references...)`);
  console.log(`--------------------------------------------------`);
  let restoreQueue = [...tablesToProcess];
  let restoreAttempts = 0;
  
  while (restoreQueue.length > 0 && restoreAttempts < 5) {
    restoreAttempts++;
    console.log(`\n[Restore Round ${restoreAttempts}] Uploading remaining ${restoreQueue.length} tables...`);
    const nextRestoreQueue: string[] = [];
    
    for (const table of restoreQueue) {
      try {
        await restoreTableOnly(table);
      } catch (err: any) {
        console.warn(`[Restore Pending] Table "${table}" could not be restored (parent rows missing). Will retry. Detail: ${err.message || err}`);
        nextRestoreQueue.push(table);
      }
    }
    restoreQueue = nextRestoreQueue;
  }

  if (restoreQueue.length > 0) {
    console.error(`\n[-] Restore phase failed: Missing dependencies or invalid references in: ${restoreQueue.join(', ')}`);
    process.exit(1);
  }

  console.log('\n==================================================');
  console.log(' ★ ALL TABLES WIPED AND RESTORED SUCCESSFULLY! ★');
  console.log('==================================================');
}

run();

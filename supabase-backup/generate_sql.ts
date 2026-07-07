import * as fs from 'fs';
import * as path from 'path';

const backupDir = path.resolve(process.cwd(), 'supabase-backup', 'backup_data');
const sqlOutputFile = path.resolve(process.cwd(), 'supabase-backup', 'backup_schema_and_data.sql');

function detectPostgresType(val: any, colName: string): string {
  if (colName === 'id') {
    if (typeof val === 'number') return 'SERIAL PRIMARY KEY';
    if (typeof val === 'string' && val.length > 20) return 'UUID PRIMARY KEY'; // UUID
    return 'TEXT PRIMARY KEY';
  }
  
  if (val === null || val === undefined) return 'TEXT';
  
  if (typeof val === 'boolean') return 'BOOLEAN';
  
  if (typeof val === 'number') {
    if (Number.isInteger(val)) return 'BIGINT';
    return 'NUMERIC';
  }
  
  if (typeof val === 'object') return 'JSONB';
  
  if (typeof val === 'string') {
    // Check if it is an ISO date string
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(val)) {
      return 'TIMESTAMPTZ';
    }
    return 'TEXT';
  }
  
  return 'TEXT';
}

function escapeSQLString(val: any): string {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'boolean') return val ? 'true' : 'false';
  if (typeof val === 'number') return val.toString();
  if (typeof val === 'object') {
    // stringify JSON and escape single quotes
    const str = JSON.stringify(val);
    return `'${str.replace(/'/g, "''")}'::jsonb`;
  }
  const strVal = val.toString();
  return `'${strVal.replace(/'/g, "''")}'`;
}

function buildSQLForTable(tableName: string): string {
  const filePath = path.join(backupDir, `${tableName}.json`);
  if (!fs.existsSync(filePath)) return '';

  const rawData = fs.readFileSync(filePath, 'utf-8');
  const rows = JSON.parse(rawData);

  if (!Array.isArray(rows) || rows.length === 0) {
    return `-- Table ${tableName} has no records. Skipping creation/inserts.\n\n`;
  }

  // 1. Determine columns and types by inspecting the first few rows
  const columns: Record<string, string> = {};
  
  // Aggregate keys from all rows just in case some rows have missing columns
  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (!columns[key] || columns[key] === 'TEXT') {
        const detected = detectPostgresType(row[key], key);
        // Only override if detected type is more specific than TEXT
        if (row[key] !== null && row[key] !== undefined) {
          columns[key] = detected;
        } else if (!columns[key]) {
          columns[key] = 'TEXT';
        }
      }
    }
  }

  let sql = `-- =====================================================\n`;
  sql += `-- Table: ${tableName}\n`;
  sql += `-- =====================================================\n\n`;

  // 2. Build CREATE TABLE statement
  sql += `CREATE TABLE IF NOT EXISTS public.${tableName} (\n`;
  const columnDefs = Object.entries(columns).map(([col, type]) => `  ${col} ${type}`);
  sql += columnDefs.join(',\n');
  sql += `\n);\n\n`;

  // 3. Build INSERT statements
  const columnList = Object.keys(columns);
  
  // Insert in batches of 100
  const batchSize = 100;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    
    sql += `INSERT INTO public.${tableName} (${columnList.join(', ')}) VALUES\n`;
    
    const valueStrings = batch.map(row => {
      const vals = columnList.map(col => escapeSQLString(row[col]));
      return `  (${vals.join(', ')})`;
    });
    
    sql += valueStrings.join(',\n');
    sql += `\nON CONFLICT DO NOTHING;\n\n`; // Prevent failures if run on existing data
  }

  return sql + '\n';
}

function run() {
  if (!fs.existsSync(backupDir)) {
    console.error(`Error: Backup directory ${backupDir} does not exist. Run backup first.`);
    process.exit(1);
  }

  const files = fs.readdirSync(backupDir).filter(f => f.endsWith('.json'));
  const tables = files.map(f => f.replace('.json', ''));

  console.log(`Generating unified SQL backup file: ${sqlOutputFile}`);

  let fullSQL = `-- Combined Supabase Database Backup\n`;
  fullSQL += `-- Generated on: ${new Date().toISOString()}\n`;
  fullSQL += `-- Includes schema and data for ${tables.length} tables.\n\n`;
  fullSQL += `CREATE SCHEMA IF NOT EXISTS public;\n\n`;

  for (const table of tables) {
    try {
      console.log(`[SQL Gen] Processing table: ${table}...`);
      fullSQL += buildSQLForTable(table);
    } catch (err) {
      console.error(`[Error] Failed to generate SQL for table: ${table}`, err);
    }
  }

  fs.writeFileSync(sqlOutputFile, fullSQL, 'utf-8');
  console.log(`\nSQL Backup successfully generated at: ${sqlOutputFile}`);
}

run();

/**
 * 로컬 오프라인 개발용 가상 Supabase 클라이언트
 * 실시간 DB 백업본 JSON 파일을 비동기(Dynamic Import)로 가져와 메모리 상에서 필터링/정렬하여 응답합니다.
 */

// Helper to dynamically load JSON data in browser or node
const loadTableData = async (tableName: string): Promise<any[]> => {
  try {
    // Vite dynamic import mapping for the backup data directory
    const module = await import(`../../../supabase-backup/backup_data/${tableName}.json`);
    return module.default || [];
  } catch (err) {
    console.warn(`[Mock Client] Local backup file for table "${tableName}" not found, returning empty array.`);
    return [];
  }
};

class MockQueryBuilder {
  private tableName: string;
  private filters: Array<{ type: 'eq' | 'neq' | 'in'; column: string; value: any }> = [];
  private orderByColumn: string | null = null;
  private orderAscending: boolean = true;
  private limitCount: number | null = null;
  private isSingle: boolean = false;
  private isMaybeSingle: boolean = false;
  private isInsert: boolean = false;
  private isUpdate: boolean = false;
  private payload: any = null;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  select(columns: string = '*') {
    // We keep everything in memory and don't slice columns unless explicitly needed,
    // since the loaders will just pick the fields they want from the returned rows.
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push({ type: 'eq', column, value });
    return this;
  }

  neq(column: string, value: any) {
    this.filters.push({ type: 'neq', column, value });
    return this;
  }

  in(column: string, value: any[]) {
    this.filters.push({ type: 'in', column, value });
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.orderByColumn = column;
    this.orderAscending = options?.ascending !== false;
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  maybeSingle() {
    this.isMaybeSingle = true;
    return this;
  }

  insert(values: any) {
    this.isInsert = true;
    this.payload = values;
    return this;
  }

  update(values: any) {
    this.isUpdate = true;
    this.payload = values;
    return this;
  }

  delete() {
    return this;
  }

  upsert(values: any) {
    this.isInsert = true;
    this.payload = values;
    return this;
  }

  // Promise thenable implementation to allow 'await query'
  async then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    try {
      // 1. If it's a write operation (insert/update), return success immediately
      if (this.isInsert || this.isUpdate) {
        const result = { data: this.payload, error: null, count: 1 };
        return onfulfilled ? onfulfilled(result) : result;
      }

      // 2. Load mock data from JSON file
      let data = await loadTableData(this.tableName);

      // 3. Apply filters
      for (const filter of this.filters) {
        data = data.filter((row: any) => {
          // Normalize column naming (match snake_case or camelCase)
          const rowVal = row[filter.column] !== undefined 
            ? row[filter.column] 
            : row[filter.column.replace(/_([a-z])/g, (g) => g[1].toUpperCase())];
          
          if (filter.type === 'eq') {
            if (rowVal === undefined) return false;
            // Loose comparison to handle numeric strings vs numbers
            return rowVal == filter.value || 
                   (typeof rowVal === 'string' && typeof filter.value === 'string' && rowVal.toLowerCase() === filter.value.toLowerCase());
          }
          if (filter.type === 'neq') {
            return rowVal != filter.value;
          }
          if (filter.type === 'in') {
            if (!Array.isArray(filter.value)) return false;
            return filter.value.some(val => rowVal == val);
          }
          return true;
        });
      }

      // 4. Apply sorting
      if (this.orderByColumn) {
        const col = this.orderByColumn;
        data.sort((a: any, b: any) => {
          const aVal = a[col] !== undefined ? a[col] : a[col.replace(/_([a-z])/g, (g) => g[1].toUpperCase())];
          const bVal = b[col] !== undefined ? b[col] : b[col.replace(/_([a-z])/g, (g) => g[1].toUpperCase())];
          
          if (aVal === undefined || aVal === null) return 1;
          if (bVal === undefined || bVal === null) return -1;
          
          if (typeof aVal === 'number' && typeof bVal === 'number') {
            return this.orderAscending ? aVal - bVal : bVal - aVal;
          }
          
          const aStr = String(aVal);
          const bStr = String(bVal);
          return this.orderAscending ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
        });
      }

      // 5. Apply limit
      if (this.limitCount !== null) {
        data = data.slice(0, this.limitCount);
      }

      // 6. Handle single row modifiers
      let finalResult: any;
      if (this.isSingle) {
        finalResult = { data: data[0] || null, error: data[0] ? null : { message: 'No row found', code: 'PGRST116' } };
      } else if (this.isMaybeSingle) {
        finalResult = { data: data[0] || null, error: null };
      } else {
        finalResult = { data, error: null };
      }

      return onfulfilled ? onfulfilled(finalResult) : finalResult;
    } catch (err: any) {
      console.error(`[Mock Client Error] Query failed on table ${this.tableName}:`, err);
      const errResult = { data: null, error: { message: err.message, code: 'MOCK_ERR' } };
      return onfulfilled ? onfulfilled(errResult) : errResult;
    }
  }
}

class MockSupabaseClient {
  from(tableName: string) {
    return new MockQueryBuilder(tableName);
  }

  // Mock channels/realtime features
  channel(channelName: string) {
    return {
      on(event: string, filter: any, callback: () => void) {
        return this;
      },
      subscribe() {
        return this;
      }
    };
  }

  removeChannel(channel: any) {
    return this;
  }
}

export const getMockSupabaseClient = () => {
  console.log('[Supabase Client] Running in offline simulation mode using local backups.');
  return new MockSupabaseClient() as any;
};

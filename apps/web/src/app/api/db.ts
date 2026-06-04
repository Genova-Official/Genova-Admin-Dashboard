import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://genova:genova2024%2A%23@genova-db.cvgwmemqmgwf.eu-west-1.rds.amazonaws.com:5432/genova';

export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('Executed query', { text, duration, rows: res.rowCount });
  return res;
}

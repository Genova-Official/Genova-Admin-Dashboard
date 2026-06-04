import { NextRequest, NextResponse } from 'next/server';
import { query } from '../db';

const formatNaira = (amount: any) => {
  const val = parseFloat(amount || '0');
  return new Intl.NumberFormat('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
};

export async function GET(request: NextRequest) {
  try {
    // Query recent operational events in parallel
    const [salesRes, inventoryRes, businessRes, userRes, expenseRes] = await Promise.all([
      // 1. Sales
      query(`
        SELECT 
          s.id, 
          s.total_price, 
          s.payment_method, 
          s.payment_status, 
          s.payer_name, 
          s.created_at,
          pb.business_name
        FROM "Sales_sales" s
        LEFT JOIN "Profile_business" pb ON s.owner_id = pb.user_id
        ORDER BY s.created_at DESC
        LIMIT 40
      `),
      // 2. Inventory
      query(`
        SELECT 
          i.id, 
          i.product_name, 
          i.quantity, 
          i.cost_price, 
          i.low_stock_threshold, 
          i.created_at,
          pb.business_name
        FROM "Inventory_inventory" i
        LEFT JOIN "Profile_business" pb ON i.owner_id = pb.user_id
        ORDER BY i.created_at DESC
        LIMIT 40
      `),
      // 3. Businesses
      query(`
        SELECT 
          b.id, 
          b.business_name, 
          b.business_email, 
          b.is_verified, 
          b.created_at
        FROM "Profile_business" b
        ORDER BY b.created_at DESC
        LIMIT 30
      `),
      // 4. Users & Logins
      query(`
        SELECT 
          u.id, 
          u.email, 
          u.name, 
          u.user_status, 
          u.last_login, 
          u.created_at
        FROM "Account_user" u
        WHERE u.last_login IS NOT NULL OR u.created_at IS NOT NULL
        ORDER BY COALESCE(u.last_login, u.created_at) DESC
        LIMIT 30
      `),
      // 5. Expenses
      query(`
        SELECT 
          e.id, 
          e.product_name, 
          e.product_price, 
          e.quantity, 
          e.description, 
          e.created_at
        FROM "Log_expense" e
        ORDER BY e.created_at DESC
        LIMIT 30
      `)
    ]);

    const logs: any[] = [];

    // Map Sales
    salesRes.rows.forEach((row: any) => {
      const isFailed = row.payment_status?.toLowerCase() === 'failed';
      const isPending = row.payment_status?.toLowerCase() === 'pending';
      const type = isFailed ? 'error' : isPending ? 'warning' : 'info';
      const status = isFailed ? 500 : isPending ? 202 : 200;
      
      logs.push({
        id: `sales-${row.id}`,
        type,
        service: 'SALES',
        status,
        message: `Sale processed: ₦${formatNaira(row.total_price)} via ${row.payment_method || 'CASH'} (${row.payment_status || 'Paid'}) for ${row.business_name || 'Platform Business'}`,
        timestamp: row.created_at
      });
    });

    // Map Inventory
    inventoryRes.rows.forEach((row: any) => {
      const qty = parseInt(row.quantity || '0', 10);
      const threshold = parseInt(row.low_stock_threshold || '5', 10);
      const isLow = qty <= threshold;
      
      logs.push({
        id: `inv-${row.id}`,
        type: isLow ? 'warning' : 'info',
        service: 'INVENTORY',
        status: isLow ? 400 : 200,
        message: isLow 
          ? `[LOW STOCK] Stock Warning: "${row.product_name}" is running low (Remaining: ${qty}, Threshold: ${threshold}) for ${row.business_name || 'Platform Business'}`
          : `Stock item registered: "${row.product_name}" (Qty: ${qty}, Cost: ₦${formatNaira(row.cost_price)}) for ${row.business_name || 'Platform Business'}`,
        timestamp: row.created_at
      });
    });

    // Map Businesses
    businessRes.rows.forEach((row: any) => {
      logs.push({
        id: `biz-${row.id}`,
        type: row.is_verified ? 'info' : 'warning',
        service: 'API',
        status: row.is_verified ? 200 : 202,
        message: `Business Registered: "${row.business_name}" (${row.business_email}) - Verified: ${row.is_verified ? 'Yes' : 'No'}`,
        timestamp: row.created_at
      });
    });

    // Map Users
    userRes.rows.forEach((row: any) => {
      logs.push({
        id: `auth-${row.id}-${row.last_login || row.created_at}`,
        type: 'info',
        service: 'AUTH',
        status: 200,
        message: `User Active Session: ${row.email} (${row.name || 'User'}) - Status: ${row.user_status || 'Active'}`,
        timestamp: row.last_login || row.created_at
      });
    });

    // Map Expenses
    expenseRes.rows.forEach((row: any) => {
      const totalCost = parseFloat(row.product_price || '0') * parseInt(row.quantity || '1', 10);
      logs.push({
        id: `exp-${row.id}`,
        type: 'warning',
        service: 'NOTIF',
        status: 200,
        message: `Expense Logged: "${row.product_name}" (Total: ₦${formatNaira(totalCost)}) - ${row.description || 'No description provided'}`,
        timestamp: row.created_at
      });
    });

    // Sort logs descending by timestamp
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Limit to top 100 log entries
    const slicedLogs = logs.slice(0, 100);

    return NextResponse.json(slicedLogs);
  } catch (error: any) {
    console.error('Failed to retrieve operational database logs:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve operational database logs', details: error.message },
      { status: 500 }
    );
  }
}

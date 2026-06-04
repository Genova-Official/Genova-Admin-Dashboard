import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../db';

export async function GET(request: NextRequest) {
  try {
    // 1. Business Count
    const bizRes = await query('SELECT COUNT(DISTINCT business_admin_id) as count FROM "Account_location"');
    const total_businesses = parseInt(bizRes.rows[0]?.count || '0', 10);

    // 2. Active Businesses Today
    const activeTodayRes = await query('SELECT COUNT(DISTINCT owner_id) as count FROM "Sales_sales" WHERE created_at::date = CURRENT_DATE');
    const active_today = parseInt(activeTodayRes.rows[0]?.count || '0', 10);

    // 3. Staff Count
    const staffRes = await query('SELECT COUNT(*) as count FROM "Account_user" WHERE created_by_id IS NOT NULL');
    const staff_count = parseInt(staffRes.rows[0]?.count || '0', 10);

    // 4. Branches Count
    const branchesRes = await query('SELECT COUNT(*) as count FROM "Account_location"');
    const branches_count = parseInt(branchesRes.rows[0]?.count || '0', 10);

    // 5. Sales Volume & VAT
    const salesVolumeRes = await query('SELECT SUM(total_price) as volume, SUM(vat_amount) as vat FROM "Sales_sales"');
    const total_volume = parseFloat(salesVolumeRes.rows[0]?.volume || '0');
    const total_vat = parseFloat(salesVolumeRes.rows[0]?.vat || '0');

    // 6. Transactions Today, Week, Month
    const txTodayRes = await query('SELECT COUNT(*) as count FROM "Sales_sales" WHERE created_at::date = CURRENT_DATE');
    const transactions_today = parseInt(txTodayRes.rows[0]?.count || '0', 10);

    const txWeekRes = await query('SELECT COUNT(*) as count FROM "Sales_sales" WHERE created_at >= NOW() - INTERVAL \'7 days\'');
    const transactions_week = parseInt(txWeekRes.rows[0]?.count || '0', 10);

    const txMonthRes = await query('SELECT COUNT(*) as count FROM "Sales_sales" WHERE created_at >= NOW() - INTERVAL \'30 days\'');
    const transactions_month = parseInt(txMonthRes.rows[0]?.count || '0', 10);

    // 7. Inventory stats
    const invRes = await query('SELECT SUM(quantity) as count, SUM(quantity * cost_price) as value, COUNT(*) as products FROM "Inventory_inventory"');
    const inventory_count = parseInt(invRes.rows[0]?.count || '0', 10);
    const inventory_value = parseFloat(invRes.rows[0]?.value || '0');
    const inventory_products = parseInt(invRes.rows[0]?.products || '0', 10);

    // 8. Low Stock Alerts
    const lowStockRes = await query('SELECT COUNT(*) as count FROM "Inventory_inventory" WHERE quantity <= 10');
    const low_stock_alerts = parseInt(lowStockRes.rows[0]?.count || '0', 10);

    return NextResponse.json({
      businesses: {
        total: total_businesses,
        active: active_today,
        inactive: Math.max(0, total_businesses - active_today),
      },
      staff: {
        total: staff_count,
      },
      branches: {
        total: branches_count,
      },
      sales: {
        total_volume,
        total_vat,
        transactions_today,
        transactions_week,
        transactions_month,
      },
      inventory: {
        total_count: inventory_count,
        total_value: inventory_value,
        total_products: inventory_products,
        low_stock_alerts: low_stock_alerts,
      },
    });
  } catch (error: any) {
    console.error('Failed to query database stats:', error);
    return NextResponse.json(
      { error: 'Failed to query operational intelligence', details: error.message },
      { status: 500 }
    );
  }
}

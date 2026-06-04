import { NextRequest, NextResponse } from 'next/server';
import { query } from '../db';

export async function GET(request: NextRequest) {
  try {
    // Daily sales for last 30 days
    const dailySalesRes = await query(
      `SELECT
        DATE(created_at) AS day,
        SUM(total_price) AS total,
        COUNT(*) AS count
       FROM "Sales_sales"
       WHERE created_at >= NOW() - INTERVAL '30 days'
       GROUP BY DATE(created_at)
       ORDER BY DATE(created_at) ASC`
    );

    // Top businesses by sales volume (from Profile_business + Sales_sales)
    const topBizRes = await query(
      `SELECT
        pb.business_name AS name,
        pb.business_email AS email,
        COALESCE(SUM(ss.total_price), 0) AS total_volume,
        COUNT(ss.id) AS transaction_count
       FROM "Profile_business" pb
       LEFT JOIN "Sales_sales" ss ON ss.owner_id = pb.user_id
       GROUP BY pb.id, pb.business_name, pb.business_email
       ORDER BY total_volume DESC
       LIMIT 5`
    );

    // Monthly summary
    const monthlySummaryRes = await query(
      `SELECT
        TO_CHAR(DATE_TRUNC('month', created_at), 'Mon YYYY') AS month,
        SUM(total_price) AS revenue,
        COUNT(*) AS transactions
       FROM "Sales_sales"
       WHERE created_at >= NOW() - INTERVAL '6 months'
       GROUP BY DATE_TRUNC('month', created_at)
       ORDER BY DATE_TRUNC('month', created_at) ASC`
    );

    return NextResponse.json({
      daily_sales: dailySalesRes.rows.map((row: any) => ({
        day: row.day,
        total: parseFloat(row.total || '0'),
        count: parseInt(row.count || '0', 10),
      })),
      top_businesses: topBizRes.rows.map((row: any) => ({
        name: row.name,
        email: row.email,
        total_volume: parseFloat(row.total_volume || '0'),
        transaction_count: parseInt(row.transaction_count || '0', 10),
      })),
      monthly_summary: monthlySummaryRes.rows.map((row: any) => ({
        month: row.month,
        revenue: parseFloat(row.revenue || '0'),
        transactions: parseInt(row.transactions || '0', 10),
      })),
    });
  } catch (error: any) {
    console.error('Failed to fetch analytics from DB:', error);
    return NextResponse.json(
      { error: 'Failed to load analytics', details: error.message },
      { status: 500 }
    );
  }
}

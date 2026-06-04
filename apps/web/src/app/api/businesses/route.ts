import { NextRequest, NextResponse } from 'next/server';
import { query } from '../db';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const search = searchParams.get('search') || '';

  try {
    // Profile_business is the source of truth for onboarded businesses
    // Joined with Account_user for status, plus staff & branch counts
    const searchClause = search
      ? `WHERE (pb.business_name ILIKE $1 OR pb.business_email ILIKE $1)`
      : '';
    const params: string[] = search ? [`%${search}%`] : [];

    const bizRes = await query(
      `SELECT
        pb.id,
        pb.business_name AS name,
        pb.business_email AS email,
        pb.is_verified,
        pb.created_at,
        pb.user_id,
        au.user_status AS status,
        au.last_login,
        (
          SELECT COUNT(*) FROM "Account_location" al WHERE al.business_admin_id = pb.user_id
        ) AS location_count,
        (
          SELECT COUNT(*) FROM "Account_user" staff WHERE staff.created_by_id = pb.user_id
        ) AS staff_count,
        (
          SELECT COALESCE(SUM(ss.total_price), 0) FROM "Sales_sales" ss WHERE ss.owner_id = pb.user_id
        ) AS total_sales_volume
      FROM "Profile_business" pb
      LEFT JOIN "Account_user" au ON au.id = pb.user_id
      ${searchClause}
      ORDER BY pb.created_at DESC`,
      params
    );

    const businesses = bizRes.rows.map((row: any) => ({
      id: row.user_id,
      business_id: row.id,
      name: row.name || 'Unnamed Business',
      email: row.email,
      status: row.status || 'Active',
      is_verified: row.is_verified,
      created_at: row.created_at,
      last_login: row.last_login,
      location_count: parseInt(row.location_count || '0', 10),
      staff_count: parseInt(row.staff_count || '0', 10),
      total_sales_volume: parseFloat(row.total_sales_volume || '0'),
    }));

    return NextResponse.json(businesses);
  } catch (error: any) {
    console.error('Failed to fetch businesses from DB:', error);
    return NextResponse.json(
      { error: 'Failed to load businesses', details: error.message },
      { status: 500 }
    );
  }
}

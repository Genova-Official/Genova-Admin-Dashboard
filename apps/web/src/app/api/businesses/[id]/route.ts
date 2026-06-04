import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const businessId = parseInt(id, 10);
  const lookupId = isNaN(businessId) ? -1 : businessId;

  try {
    // 1. Fetch business and owner record directly from DB
    const bizOwnerRes = await query(
      `SELECT
        pb.id AS business_id,
        pb.business_name AS name,
        pb.business_email AS email,
        pb.is_verified,
        pb.created_at,
        au.id AS user_id,
        au.first_name,
        au.last_name,
        au.user_status,
        au.is_active,
        au.last_login
      FROM "Profile_business" pb
      LEFT JOIN "Account_user" au ON au.id = pb.user_id
      WHERE pb.user_id = $1 OR pb.id = $2`,
      [lookupId, id]
    );

    if (bizOwnerRes.rows.length === 0) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    const owner = bizOwnerRes.rows[0];
    const ownerUserId = owner.user_id;

    // 2. Fetch locations
    const locationsRes = await query(
      `SELECT id, location_name, is_main_location, status, created_at
       FROM "Account_location"
       WHERE business_admin_id = $1
       ORDER BY is_main_location DESC, created_at ASC`,
      [ownerUserId]
    );

    // 3. Fetch staff members
    const staffRes = await query(
      `SELECT id, email, name, user_status, last_login
       FROM "Account_user"
       WHERE created_by_id = $1
       ORDER BY name ASC, created_at DESC`,
      [ownerUserId]
    );

    // 4. Fetch sales stats
    const salesRes = await query(
      'SELECT SUM(total_price) as volume, SUM(vat_amount) as vat, COUNT(*) as count FROM "Sales_sales" WHERE owner_id = $1',
      [ownerUserId]
    );
    const total_volume = parseFloat(salesRes.rows[0]?.volume || '0');
    const total_vat = parseFloat(salesRes.rows[0]?.vat || '0');
    const total_count = parseInt(salesRes.rows[0]?.count || '0', 10);

    // 5. Fetch inventory stats
    const invRes = await query(
      'SELECT SUM(quantity) as items, SUM(quantity * cost_price) as value, COUNT(*) as products FROM "Inventory_inventory" WHERE owner_id = $1',
      [ownerUserId]
    );
    const total_items = parseInt(invRes.rows[0]?.items || '0', 10);
    const total_value = parseFloat(invRes.rows[0]?.value || '0');
    const unique_products = parseInt(invRes.rows[0]?.products || '0', 10);

    // 6. Respond with formatted payload
    return NextResponse.json({
      id: ownerUserId,
      email: owner.email,
      name: owner.name || `${owner.first_name || ''} ${owner.last_name || ''}`.trim() || 'Unnamed Business',
      first_name: owner.first_name || '',
      last_name: owner.last_name || '',
      user_status: owner.user_status || 'Active',
      is_verified: owner.is_verified || false,
      is_active: owner.is_active || false,
      created_at: owner.created_at,
      last_login: owner.last_login,
      locations: locationsRes.rows.map((loc: any) => ({
        id: String(loc.id),
        location_name: loc.location_name,
        is_main_location: loc.is_main_location,
        status: loc.status || 'Active',
        created_at: loc.created_at,
      })),
      staff: staffRes.rows.map((s: any) => ({
        id: s.id,
        email: s.email,
        name: s.name || 'Unnamed Staff',
        user_status: s.user_status || 'Active',
        last_login: s.last_login,
      })),
      stats: {
        sales: {
          total_volume,
          total_count,
          total_vat,
        },
        inventory: {
          total_items,
          total_value,
          unique_products,
        },
      },
    });
  } catch (error: any) {
    console.error(`Failed to fetch database business detail for ID ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to compile business details', details: error.message },
      { status: 500 }
    );
  }
}

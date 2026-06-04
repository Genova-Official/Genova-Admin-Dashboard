import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../db';

const BACKEND_URL = process.env.BACKEND_API_URL || 'https://api.genovatransact.com/api/console';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const businessId = parseInt(id, 10);
  
  const headers = new Headers();
  const authHeader = request.headers.get('Authorization');
  if (authHeader) {
    headers.set('Authorization', authHeader);
  }

  try {
    // 1. Fetch basic business model from backend API
    const res = await fetch(`${BACKEND_URL}/businesses/${id}/`, {
      headers,
      cache: 'no-store',
    });

    if (!res.ok) {
      return new NextResponse(await res.text(), {
        status: res.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const businessData = await res.json();

    // 2. Query PostgreSQL database for real-time inventory and sales metrics
    const salesRes = await query(
      'SELECT SUM(total_price) as volume, SUM(vat_amount) as vat, COUNT(*) as count FROM "Sales_sales" WHERE owner_id = $1',
      [businessId]
    );
    const total_volume = parseFloat(salesRes.rows[0]?.volume || '0');
    const total_vat = parseFloat(salesRes.rows[0]?.vat || '0');
    const total_count = parseInt(salesRes.rows[0]?.count || '0', 10);

    const invRes = await query(
      'SELECT SUM(quantity) as items, SUM(quantity * cost_price) as value, COUNT(*) as products FROM "Inventory_inventory" WHERE owner_id = $1',
      [businessId]
    );
    const total_items = parseInt(invRes.rows[0]?.items || '0', 10);
    const total_value = parseFloat(invRes.rows[0]?.value || '0');
    const unique_products = parseInt(invRes.rows[0]?.products || '0', 10);

    // 3. Respond with unified data shape conforming to frontend requirements
    return NextResponse.json({
      ...businessData,
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
    console.error(`Failed to fetch and enrich business detail for ID ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to compile business metrics', details: error.message },
      { status: 500 }
    );
  }
}

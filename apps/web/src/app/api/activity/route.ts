import { NextRequest, NextResponse } from 'next/server';
import { query } from '../db';

export async function GET(request: NextRequest) {
  try {
    // 1. Fetch recent 50 sales with business/owner and location info
    const salesRes = await query(
      `SELECT 
        s.id, 
        s.total_price, 
        s.payment_method, 
        s.payment_status, 
        s.payer_name, 
        s.created_at, 
        s.owner_id, 
        s.location_id,
        pb.business_name,
        al.location_name,
        au.name as owner_name,
        staff.name as staff_name
      FROM "Sales_sales" s
      LEFT JOIN "Profile_business" pb ON s.owner_id = pb.user_id
      LEFT JOIN "Account_location" al ON s.location_id = al.id
      LEFT JOIN "Account_user" au ON s.owner_id = au.id
      LEFT JOIN "Account_user" staff ON s.initiated_by_id = staff.id
      ORDER BY s.created_at DESC
      LIMIT 50`
    );

    const sales = salesRes.rows;
    if (sales.length === 0) {
      return NextResponse.json([]);
    }

    // 2. Fetch all sale items for the retrieved sales in a single query
    const saleIds = sales.map((s: any) => s.id);
    const itemsRes = await query(
      `SELECT 
        si.sale_id,
        si.quantity,
        ii.product_name
      FROM "Sales_saleitem" si
      LEFT JOIN "Inventory_inventory" ii ON si.product_id = ii.id
      WHERE si.sale_id = ANY($1)`,
      [saleIds]
    );

    // Group items by sale_id
    const itemsMap = new Map<string, { quantity: number; product_name: string }[]>();
    itemsRes.rows.forEach((row: any) => {
      if (!itemsMap.has(row.sale_id)) {
        itemsMap.set(row.sale_id, []);
      }
      itemsMap.get(row.sale_id)!.push({
        quantity: parseInt(row.quantity || '1', 10),
        product_name: row.product_name || 'Unnamed Product',
      });
    });

    // 3. Construct beautiful and descriptive activity feed items
    const activities = sales.map((row: any) => {
      const saleItems = itemsMap.get(row.id) || [];
      
      // Build descriptive items list
      let itemDescription = '';
      if (saleItems.length > 0) {
        const itemStrings = saleItems.slice(0, 3).map(item => `${item.product_name} (${item.quantity}x)`);
        itemDescription = itemStrings.join(', ');
        if (saleItems.length > 3) {
          itemDescription += ` & ${saleItems.length - 3} other items`;
        }
      }

      // Build overall activity description
      let description = '';
      const method = (row.payment_method || 'CASH').toUpperCase();
      
      if (itemDescription) {
        if (row.payer_name) {
          description = `Sold ${itemDescription} to ${row.payer_name} via ${method}`;
        } else {
          description = `Sold ${itemDescription} via ${method}`;
        }
      } else {
        if (row.payer_name) {
          description = `Transaction ${row.id} to ${row.payer_name} via ${method}`;
        } else {
          description = `Transaction ${row.id} via ${method}`;
        }
      }

      if (row.staff_name && row.staff_name !== 'User') {
        description += ` (processed by ${row.staff_name})`;
      }

      return {
        id: row.id,
        type: 'sale',
        business: row.business_name || row.owner_name || 'Platform Business',
        location: row.location_name || 'Main Location',
        amount: parseFloat(row.total_price || '0'),
        time: row.created_at, // NextJS JSON serialization handles ISO 8601 formatting perfectly
        status: row.payment_status ? row.payment_status.charAt(0).toUpperCase() + row.payment_status.slice(1) : 'Paid',
        description: description,
      };
    });

    return NextResponse.json(activities);
  } catch (error: any) {
    console.error('Failed to query activity stream:', error);
    return NextResponse.json(
      { error: 'Failed to query operational activity telemetry', details: error.message },
      { status: 500 }
    );
  }
}

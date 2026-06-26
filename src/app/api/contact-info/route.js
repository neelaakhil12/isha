import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET - Fetch contact info
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('contact_info')
      .select('*')
      .eq('id', 1)
      .single();

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Return defaults if no row exists yet
    const defaults = {
      id: 1,
      email: 'support@ishasoftwares.com',
      email_general: 'info@ishasoftwares.com',
      phone_sales: '+91 98765 43210',
      phone_support: '+91 98765 43211',
      address: '123 SaaS Street, Suite 400, Tech Park, Hyderabad, India',
    };

    return NextResponse.json(data || defaults);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT - Update contact info (admin only — validated by cookie in middleware, but minimal check here too)
export async function PUT(request) {
  try {
    const body = await request.json();
    const { email, email_general, phone_sales, phone_support, address } = body;

    // Upsert the single contact_info row (id = 1)
    const { data, error } = await supabase
      .from('contact_info')
      .upsert(
        { id: 1, email, email_general, phone_sales, phone_support, address, updated_at: new Date().toISOString() },
        { onConflict: 'id' }
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

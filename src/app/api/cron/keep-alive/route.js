import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Force dynamic execution to bypass static caching
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    // Perform a lightweight query to trigger database activity on Supabase
    const { data, error } = await supabase.from('services').select('id').limit(1);

    if (error) {
      console.error('Supabase keep-alive query error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase kept alive successfully.',
      timestamp: new Date().toISOString(),
      data
    });
  } catch (error) {
    console.error('Keep-alive cron route error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

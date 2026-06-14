'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, LogOut, Package, CreditCard, Loader2, ArrowRight, ShieldAlert, ChevronRight, Printer, Play, Send, CheckCircle2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [pricingPlans, setPricingPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  // Demo Video Modal States
  const [demoOpen, setDemoOpen] = useState(false);
  const [selectedDemoOrder, setSelectedDemoOrder] = useState(null);

  const handleDemoClick = (order) => {
    setSelectedDemoOrder(order);
    setDemoOpen(true);
  };

  const getOrderDetails = useCallback((order) => {
    // 1. Split on '|' to separate service name parts from phone number
    const partsPipe = order.service_name.split(' | ');
    const serviceNamePart = partsPipe[0].trim();
    let phone = '';
    if (partsPipe.length > 1) {
      const phoneVal = partsPipe[1].trim();
      phone = phoneVal.toLowerCase().startsWith('phone:') ? phoneVal.substring(6).trim() : phoneVal;
    }

    // Now split the service name part by ' - '
    const parts = serviceNamePart.split(' - ');

    // Find matching plan from pricingPlans
    let matchedPlan = null;
    let index = 0;
    
    // Sort plans by name length descending so we match the longest plan name first
    const sortedPlans = [...pricingPlans].sort((a, b) => b.name.length - a.name.length);
    
    for (let i = parts.length; i > 0; i--) {
      const candidateName = parts.slice(0, i).join(' - ').trim().toLowerCase();
      matchedPlan = sortedPlans.find(p => p.name.toLowerCase() === candidateName);
      if (matchedPlan) {
        index = i;
        break;
      }
    }

    let isBulk = false;
    let companyName = '';
    let serviceDisplayName = serviceNamePart;
    
    if (matchedPlan) {
      // The company name is whatever parts are after the matched plan name
      companyName = parts.slice(index).join(' - ').trim();
      
      const cleanPlanName = matchedPlan.name;
      if (matchedPlan.plan_type === 'bulk') {
        isBulk = true;
        serviceDisplayName = `Bulk Email Service - ${cleanPlanName}`;
      } else if (matchedPlan.plan_type === 'smtp') {
        serviceDisplayName = `SMTP Service - ${cleanPlanName}`;
      } else if (matchedPlan.plan_type === 'extractor') {
        serviceDisplayName = `Email Extractor Tool - ${cleanPlanName}`;
      } else if (matchedPlan.plan_type === 'transactional') {
        serviceDisplayName = `Transactional Email - ${cleanPlanName}`;
      }
    } else {
      // Fallback logic if plan is not found in database
      const nameLower = serviceNamePart.toLowerCase();
      if (
        nameLower.includes('bulk') || 
        (
          (nameLower.includes('plan-1') || nameLower.includes('plan-2') || nameLower.includes('plan-3')) && 
          !nameLower.includes('smtp') && 
          !nameLower.includes('extractor') && 
          !nameLower.includes('transactional')
        )
      ) {
        isBulk = true;
        if (!nameLower.includes('bulk email')) {
          serviceDisplayName = `Bulk Email Service - ${serviceNamePart}`;
        }
      }
      
      // Guess company name for fallback
      const fallbackParts = serviceNamePart.split(' - ');
      if (fallbackParts.length > 1) {
        companyName = fallbackParts.slice(1).join(' - ').trim();
      }
    }

    return { isBulk, serviceDisplayName, companyName, phone };
  }, [pricingPlans]);

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.authenticated) {
        setUser(data.user);
        loadOrders(data.user.email);
      } else {
        router.push('/login');
      }
    } catch (err) {
      console.error('Session check error:', err);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const loadOrders = async (email) => {
    setOrdersLoading(true);
    try {
      const [ordersRes, servicesRes, pricingPlansRes] = await Promise.all([
        supabase
          .from('orders')
          .select('*')
          .eq('customer_email', email)
          .order('created_at', { ascending: false }),
        supabase
          .from('services')
          .select('*'),
        supabase
          .from('pricing_plans')
          .select('*')
      ]);

      if (!ordersRes.error && ordersRes.data) {
        setOrders(ordersRes.data);
      }
      if (!servicesRes.error && servicesRes.data) {
        setServices(servicesRes.data);
      }
      if (!pricingPlansRes.error && pricingPlansRes.data) {
        setPricingPlans(pricingPlansRes.data);
      }
    } catch (err) {
      console.error('Error loading user dashboard data:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (err) {
      console.error('Error logging out:', err);
      setLoggingOut(false);
    }
  };

  const handlePrint = (order) => {
    const { serviceDisplayName, companyName: orderCompany, phone: orderPhone } = getOrderDetails(order);
    const displayCompany = orderCompany || userCompanyName;
    const displayPhone = orderPhone || userPhone;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up blocked! Please allow pop-ups for this site to generate your invoice.');
      return;
    }
    const invoiceHtml = `
      <html>
        <head>
          <title>Invoice - ISHA-${order.id ? order.id.slice(0, 8).toUpperCase() : 'TEMP'}</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; background-color: #ffffff; }
            .invoice-box { max-width: 800px; margin: auto; border: 1px solid #f1f5f9; padding: 40px; border-radius: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.02); }
            .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; border-bottom: 2px solid #f1f5f9; padding-bottom: 24px; }
            .company-details { text-align: right; }
            .company-name { font-size: 24px; font-weight: 900; color: #7c3aed; }
            .company-sub { font-size: 13px; color: #64748b; margin-top: 2px; }
            .invoice-title { font-size: 32px; font-weight: 950; text-transform: uppercase; color: #0f172a; margin: 0; }
            .meta-grid { display: grid; grid-template-cols: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
            .meta-title { font-size: 11px; font-weight: 800; text-transform: uppercase; color: #94a3b8; margin-bottom: 8px; letter-spacing: 0.05em; }
            .meta-value { font-size: 14px; font-weight: 700; color: #334155; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 40px; text-align: left; }
            th { background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 14px; font-size: 11px; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em; }
            td { padding: 14px; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #334155; }
            .totals-box { width: 320px; margin-left: auto; margin-top: 20px; font-size: 14px; }
            .total-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f8fafc; }
            .grand-total { border-top: 2px solid #7c3aed; font-size: 20px; font-weight: 950; color: #0f172a; padding-top: 14px; margin-top: 8px; border-bottom: none; }
            .footer-note { text-align: center; color: #94a3b8; font-size: 12px; margin-top: 60px; border-top: 1px solid #f1f5f9; padding-top: 24px; line-height: 1.6; }
            @media print {
              body { padding: 0; background-color: transparent; }
              .invoice-box { border: none; box-shadow: none; padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <div class="header">
              <div>
                <h1 class="invoice-title">Invoice</h1>
                <p class="company-sub" style="font-family: monospace;">ID: ISHA-${order.id ? order.id.slice(0, 8).toUpperCase() : 'TEMP'}</p>
              </div>
              <div class="company-details">
                <img src="${window.location.origin}/logo.png" alt="Isha Software Solutions Logo" style="height: 50px; width: auto; margin-bottom: 8px; display: block; margin-left: auto;" />
                <div class="company-name">Isha Software Solutions</div>
                <div class="company-sub">Secure Delivery Infrastructure</div>
                <div class="company-sub">Hyderabad, Telangana, India</div>
              </div>
            </div>
            
            <div class="meta-grid">
              <div>
                <div class="meta-title">Billed To</div>
                <div class="meta-value">${user.name}</div>
                <div class="meta-value" style="font-weight: 500; color: #64748b; margin-top: 2px;">${user.email}</div>
                ${displayCompany ? `<div class="meta-value" style="font-weight: 500; color: #64748b; margin-top: 2px;">${displayCompany}</div>` : ''}
                ${displayPhone ? `<div class="meta-value" style="font-weight: 500; color: #64748b; margin-top: 2px;">${displayPhone}</div>` : ''}
              </div>
              <div style="text-align: right;">
                <div class="meta-title">Invoice Date</div>
                <div class="meta-value">${new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <div class="meta-title" style="margin-top: 16px;">Status</div>
                <div class="meta-value" style="color: ${order.status === 'completed' ? '#10b981' : '#f59e0b'}; text-transform: uppercase;">${order.status}</div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Product / Service Description</th>
                  <th style="text-align: right; width: 60px;">Qty</th>
                  <th style="text-align: right; width: 120px;">Unit Price</th>
                  <th style="text-align: right; width: 120px;">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="font-weight: 700; color: #0f172a;">${serviceDisplayName}</td>
                  <td style="text-align: right; color: #64748b;">1</td>
                  <td style="text-align: right;">₹${Number(order.amount).toLocaleString('en-IN')}</td>
                  <td style="text-align: right; font-weight: 700; color: #0f172a;">₹${Number(order.amount).toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>

            <div class="totals-box">
              <div class="total-row">
                <span style="color: #64748b; font-weight: 500;">Subtotal</span>
                <span style="font-weight: 700; color: #334155;">₹${Number(order.amount).toLocaleString('en-IN')}</span>
              </div>
              <div class="total-row">
                <span style="color: #64748b; font-weight: 500;">GST (18% Included)</span>
                <span style="font-weight: 700; color: #334155;">₹${(order.amount - (order.amount / 1.18)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div class="total-row grand-total">
                <span>Grand Total</span>
                <span>₹${Number(order.amount).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div class="footer-note">
              Thank you for choosing Isha Software Solutions. This is a computer-generated invoice and does not require signature.<br>
              For support or queries, contact support@ishasoftwares.com.
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(invoiceHtml);
    printWindow.document.close();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm font-semibold text-slate-500">Entering Secure Cockpit...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Extract user company and phone from the latest order that has them
  let userCompanyName = '';
  let userPhone = '';

  if (orders && orders.length > 0) {
    for (const order of orders) {
      const { companyName, phone } = getOrderDetails(order);
      if (companyName && !userCompanyName) {
        userCompanyName = companyName;
      }
      if (phone && !userPhone) {
        userPhone = phone;
      }
      if (userCompanyName && userPhone) {
        break;
      }
    }
  }

  const matchedService = selectedDemoOrder && services.find(s => 
    selectedDemoOrder.service_name.toLowerCase().includes(s.name.toLowerCase())
  );
  let videoUrl = matchedService?.demo_video_url || '/mautic_demo.mp4';
  if (videoUrl.includes('res.cloudinary.com')) {
    videoUrl = videoUrl.replace('/upload/', '/upload/e_volume:mute/');
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        
        {/* Header Dashboard Banner */}
        <div className="relative overflow-hidden bg-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/15 pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <span className="text-secondary font-bold text-xs tracking-widest uppercase bg-secondary/15 px-3 py-1 rounded-full border border-secondary/25">
                User Cockpit
              </span>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight mt-3">
                Welcome back, <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{user.name}</span>
              </h1>
              <p className="text-slate-400 text-sm md:text-base font-medium">
                Manage your services, check transactions, and request server adjustments.
              </p>
            </div>
            
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="self-start md:self-center flex items-center space-x-2 bg-white/10 hover:bg-white/15 text-white border border-white/10 px-5 py-3 rounded-2xl font-bold transition-all text-sm cursor-pointer disabled:opacity-50"
            >
              {loggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
              <span>{loggingOut ? 'Signing out...' : 'Log Out'}</span>
            </button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Account Profile */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">Account Profile</h3>
                <p className="text-slate-400 text-xs mt-0.5">Your registration details</p>
              </div>
              <div className="space-y-2 pt-2 text-sm">
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400 font-semibold">Email</span>
                  <span className="text-slate-700 font-bold truncate max-w-[180px]">{user.email}</span>
                </div>
                {userCompanyName && (
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-400 font-semibold">Company</span>
                    <span className="text-slate-700 font-bold truncate max-w-[180px]">{userCompanyName}</span>
                  </div>
                )}
                {userPhone && (
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-400 font-semibold">Phone</span>
                    <span className="text-slate-700 font-bold">{userPhone}</span>
                  </div>
                )}
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400 font-semibold">Sign-in Mode</span>
                  <span className="text-slate-700 font-bold capitalize">{user.provider === 'google' ? 'Google Social' : 'Email Link (OTP)'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Active Subscriptions */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">Active Subscriptions</h3>
                <p className="text-slate-400 text-xs mt-0.5">Currently active relays & suites</p>
              </div>
              <div className="space-y-2 pt-2 text-sm">
                {ordersLoading ? (
                  <div className="flex items-center space-x-2 py-2 text-slate-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing packages...</span>
                  </div>
                ) : orders.filter(o => o.status === 'completed').length > 0 ? (
                  <div className="space-y-2">
                    {orders
                      .filter(o => o.status === 'completed')
                      .slice(0, 2)
                      .map((o, idx) => (
                        <div key={o.id || idx} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
                          <span className="text-slate-700 font-bold truncate max-w-[170px] text-xs">{o.service_name}</span>
                          <span className="text-emerald-600 bg-emerald-50 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Active</span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 py-2 text-slate-400 text-xs">
                    <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>No active service subscriptions found.</span>
                  </div>
                )}
              </div>
            </div>
            {!ordersLoading && orders.filter(o => o.status === 'completed').length === 0 && (
              <Link href="/pricing" className="mt-4 text-xs font-bold text-primary hover:text-primary-hover flex items-center space-x-1 hover:translate-x-1 transition-transform cursor-pointer">
                <span>Browse Pricing Plans</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {/* Card 3: Billing Analytics */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">Billing Analytics</h3>
                <p className="text-slate-400 text-xs mt-0.5">Transactions overview</p>
              </div>
              <div className="space-y-2 pt-2 text-sm">
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400 font-semibold">Total Orders</span>
                  <span className="text-slate-700 font-bold">{ordersLoading ? '...' : orders.length}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400 font-semibold">Completed Orders</span>
                  <span className="text-slate-700 font-bold text-emerald-600">{ordersLoading ? '...' : orders.filter(o => o.status === 'completed').length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order History Panel */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Transaction History</h3>
              <p className="text-slate-400 text-xs mt-0.5">Order invoices matched with your profile</p>
            </div>
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
              {ordersLoading ? 'Checking...' : `${orders.length} total`}
            </span>
          </div>

          {ordersLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-30 text-primary" />
              <p className="text-sm font-semibold mb-2">No transaction invoices found.</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                If you recently placed an order, it will appear here once linked with your login email address ({user.email}).
              </p>
              <Link 
                href="/pricing" 
                className="mt-6 inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-accent text-white font-bold px-6 py-2.5 rounded-full hover:scale-105 transition-transform shadow-md shadow-primary/20 text-xs cursor-pointer"
              >
                <span>Select a Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {['Product Plan / Service', 'Price Paid', 'Date', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((order, index) => {
                    const { isBulk, serviceDisplayName } = getOrderDetails(order);
                    return (
                      <tr key={order.id || index} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-800">{serviceDisplayName}</td>
                        <td className="px-6 py-4 font-extrabold text-slate-900">₹{Number(order.amount).toLocaleString('en-IN')}</td>
                        <td className="px-6 py-4 text-slate-400 text-xs">
                          {new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            order.status === 'completed' 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handlePrint(order)}
                              className="flex items-center space-x-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl font-bold transition-all text-xs cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>Invoice</span>
                            </button>
                            {isBulk && (
                              <button
                                onClick={() => handleDemoClick(order)}
                                className="flex items-center space-x-1.5 px-3 py-1.5 bg-secondary/15 hover:bg-secondary/25 text-secondary rounded-xl font-bold transition-all text-xs cursor-pointer"
                              >
                                <Play className="w-3.5 h-3.5" />
                                <span>Demo</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Demo Video Modal */}
      {demoOpen && selectedDemoOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl border border-slate-100 overflow-hidden relative">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50">
              <div>
                <h3 className="font-black text-lg text-slate-900">Platform Demonstration</h3>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">{selectedDemoOrder.service_name} Walkthrough</p>
              </div>
              <button 
                onClick={() => setDemoOpen(false)} 
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors cursor-pointer text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Content - Video Player */}
            <div className="p-6">
              <video
                src={videoUrl}
                controls
                controlsList="novolume"
                autoPlay
                muted
                onVolumeChange={(e) => {
                  e.target.muted = true;
                  e.target.volume = 0;
                }}
                className="w-full h-auto rounded-2xl border border-slate-150 shadow-md bg-slate-950 no-audio-video"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

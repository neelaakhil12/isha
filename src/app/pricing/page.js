'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, Zap, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const bulkEmailPlans = {
  title: "Bulk-Email Pricing",
  subtitle: "High-Performance Infrastructure for Large-Scale Email Sending",
  description: "Dedicated infrastructure with improved delivery performance",
  plans: [
    {
      name: "Plan-3",
      priceINR: "₹ 10,000",
      priceUSD: "$ 120",
      period: "/month",
      credits: "800,000 Email Credits",
      badge: "Starter",
      features: [
        "Web-Based Email Sending Application",
        "Multiple Dedicated IPs Rotation",
        "SPF, DKIM & DMARC Setup",
        "rDNS Configuration",
        "Dedicated Support"
      ],
      popular: false
    },
    {
      name: "Plan-2",
      priceINR: "₹ 15,000",
      priceUSD: "$ 180",
      period: "/month",
      credits: "1,500,000 Email Credits",
      badge: "Popular",
      features: [
        "Web-Based Email Sending Application",
        "Multiple Dedicated IPs Rotation",
        "SPF, DKIM & DMARC Setup",
        "rDNS Configuration",
        "Dedicated Support"
      ],
      popular: true
    },
    {
      name: "Plan-1",
      priceINR: "₹ 20,000",
      priceUSD: "$ 240",
      period: "/month",
      credits: "3,000,000 Email Credits",
      badge: "Enterprise",
      features: [
        "Web-Based Email Sending Application",
        "Multiple Dedicated IPs Rotation",
        "SPF, DKIM & DMARC Setup",
        "rDNS Configuration",
        "Dedicated Support"
      ],
      popular: false
    }
  ]
};

const smtpPlans = {
  title: "SMTP Pricing Plans",
  subtitle: "Maximise Your Conversion with SMTP that simply delivers",
  plans: [
    {
      name: "SMTP Plan-1",
      priceINR: "₹ 7,500",
      priceUSD: "$ 90",
      period: "/month",
      credits: "30,000 Email Credits",
      limit: "Daily sending limit: 1k",
      features: [
        "Multiple Dedicated IPs Rotation",
        "SPF, DKIM & DMARC Setup",
        "rDNS Configuration",
        "Dedicated Support"
      ],
      popular: false
    },
    {
      name: "SMTP Plan-2",
      priceINR: "₹ 12,000",
      priceUSD: "$ 145",
      period: "/month",
      credits: "60,000 Email Credits",
      limit: "Daily sending limit: 2k",
      features: [
        "Multiple Dedicated IPs Rotation",
        "SPF, DKIM & DMARC Setup",
        "rDNS Configuration",
        "Dedicated Support"
      ],
      popular: true
    }
  ]
};

const extractorPlan = {
  title: "Email Extractor Tool Plan",
  subtitle: "Extract targeted business leads and generate campaigns instantly",
  priceINR: "₹ 50,000",
  priceUSD: "$ 600",
  period: "/Annually",
  features: [
    "Domain Email Scraper",
    "Deep Web Leads Scaping Tech",
    "Unlimited File Export Format",
    "Smart Lead Validation",
    "Full Technical Setup & Onboarding",
    "Dedicated Support"
  ]
};

const transactionalPlan = {
  title: "Transactional Email Plans",
  subtitle: "Transactional email service with 99% deliverability",
  priceINR: "₹ 2,874",
  priceUSD: "$ 35",
  period: "/month",
  credits: "10,000 Email Credits",
  features: [
    "Dedicated IP Address",
    "SPF, DKIM & DMARC Setup",
    "rDNS Configuration",
    "Instant Delivery Relays",
    "Dedicated Support"
  ]
};

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    if (document.getElementById('razorpay-script')) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const getNumericPrice = (priceStr) => {
  if (!priceStr) return 0;
  const cleaned = priceStr.replace(/[₹$,\s]/g, '');
  return parseFloat(cleaned) || 0;
};

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState('bulk');
  const [currency, setCurrency] = useState('INR'); // 'INR' or 'USD'
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    email: '',
    companyName: '',
    phone: ''
  });
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successDetails, setSuccessDetails] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.authenticated) {
          setUser(data.user);
        }
      } catch (err) {
        console.error('Error fetching user session:', err);
      }
    }
    loadUser();
  }, []);

  useEffect(() => {
    if (user && checkoutOpen) {
      setCheckoutForm(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user, checkoutOpen]);

  const handlePurchaseClick = (plan) => {
    setSelectedPlan(plan);
    setCheckoutOpen(true);
  };

  const handleProceedToPay = async (e) => {
    e.preventDefault();
    setPaymentLoading(true);
    
    const sdkLoaded = await loadRazorpayScript();
    if (!sdkLoaded) {
      alert('Failed to load Razorpay SDK. Please check your internet connection.');
      setPaymentLoading(false);
      return;
    }

    const priceStr = selectedPlan.priceINR;
    const priceVal = getNumericPrice(priceStr);
    
    if (priceVal <= 0) {
      alert('Invalid plan price value.');
      setPaymentLoading(false);
      return;
    }

    const planAmountInPaise = Math.round(priceVal * 100);
    const rzpKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_SzAYkH6cKTT6UE';

    const options = {
      key: rzpKey,
      amount: planAmountInPaise,
      currency: 'INR',
      name: 'Isha Software Solutions',
      description: `Purchase of ${selectedPlan.name}`,
      prefill: {
        name: checkoutForm.name,
        email: checkoutForm.email,
        contact: checkoutForm.phone,
      },
      notes: {
        company_name: checkoutForm.companyName || ''
      },
      theme: {
        color: '#7c3aed',
      },
      handler: async function (response) {
        setPaymentLoading(true);
        try {
          const serviceNameDetails = `${selectedPlan.name}${checkoutForm.companyName ? ` - ${checkoutForm.companyName.trim()}` : ''}${checkoutForm.phone ? ` | Phone: ${checkoutForm.phone.trim()}` : ''}`;
          const { error } = await supabase.from('orders').insert([
            {
              customer_email: checkoutForm.email,
              service_name: serviceNameDetails,
              amount: priceVal,
              status: 'completed',
              created_at: new Date().toISOString()
            }
          ]);

          if (error) {
            console.error('Supabase order record error:', error);
            alert('Payment successful, but we failed to register the order. Please contact support with payment ID: ' + response.razorpay_payment_id);
          } else {
            let serviceDisplayName = selectedPlan.name;
            if (activeTab === 'bulk') {
              serviceDisplayName = `Bulk Email Service - ${selectedPlan.name}`;
            } else if (activeTab === 'smtp') {
              serviceDisplayName = `SMTP Service - ${selectedPlan.name}`;
            } else if (activeTab === 'extractor') {
              serviceDisplayName = `Email Extractor Tool - ${selectedPlan.name}`;
            } else if (activeTab === 'transactional') {
              serviceDisplayName = `Transactional Email - ${selectedPlan.name}`;
            }

            setSuccessDetails({
              planName: serviceDisplayName,
              amount: priceVal,
              email: checkoutForm.email,
              companyName: checkoutForm.companyName,
              phone: checkoutForm.phone
            });
            setSuccessModalOpen(true);
          }
        } catch (err) {
          console.error('Order registration error:', err);
          alert('Something went wrong. Please contact support.');
        } finally {
          setPaymentLoading(false);
          setCheckoutOpen(false);
          setSelectedPlan(null);
        }
      },
      modal: {
        ondismiss: function () {
          setPaymentLoading(false);
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      alert('Payment failed: ' + response.error.description);
      setPaymentLoading(false);
    });
    rzp.open();
  };

  useEffect(() => {
    async function loadPlans() {
      try {
        const { data, error } = await supabase.from('pricing_plans').select('*');
        if (!error && data && data.length > 0) {
          setPlans(data);
        }
      } catch (err) {
        console.error('Error fetching pricing plans:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPlans();
  }, []);

  const defaultTabs = ['bulk', 'smtp', 'extractor', 'transactional'];
  const tabs = plans.length > 0 
    ? Array.from(new Set(plans.map(p => p.plan_type)))
    : defaultTabs;

  // Auto-align activeTab if it is no longer valid
  useEffect(() => {
    if (tabs.length > 0 && !tabs.includes(activeTab)) {
      setActiveTab(tabs[0]);
    }
  }, [plans, activeTab, tabs]);

  const getDisplayPlans = () => {
    const dbPlans = plans.filter(p => p.plan_type === activeTab);
    if (dbPlans.length > 0) {
      return dbPlans.map(p => ({
        id: p.id,
        name: p.name,
        badge: p.badge,
        priceINR: p.price_inr,
        priceUSD: p.price_usd,
        period: p.period,
        credits: p.credits,
        limit: p.limit_info,
        features: p.features,
        popular: p.popular
      }));
    }

    // Static fallbacks
    if (activeTab === 'bulk') {
      return bulkEmailPlans.plans;
    } else if (activeTab === 'smtp') {
      return smtpPlans.plans.map(p => ({ ...p, limit: p.limit }));
    } else if (activeTab === 'extractor') {
      return [{
        name: extractorPlan.title,
        priceINR: extractorPlan.priceINR,
        priceUSD: extractorPlan.priceUSD,
        period: extractorPlan.period,
        features: extractorPlan.features
      }];
    } else if (activeTab === 'transactional') {
      return [{
        name: transactionalPlan.title,
        priceINR: transactionalPlan.priceINR,
        priceUSD: transactionalPlan.priceUSD,
        period: transactionalPlan.period,
        credits: transactionalPlan.credits,
        features: transactionalPlan.features
      }];
    }
    return [];
  };

  const displayPlans = getDisplayPlans();

  const categoryHeaders = {
    bulk: {
      title: "Bulk-Email Pricing",
      subtitle: "High-Performance Infrastructure for Large-Scale Email Sending",
      description: "Dedicated infrastructure with improved delivery performance"
    },
    smtp: {
      title: "SMTP Pricing Plans",
      subtitle: "Maximise Your Conversion with SMTP that simply delivers",
      description: "Reliable SMTP relay servers with secure authentication and high deliverability"
    },
    extractor: {
      title: "Email Extractor Tool Plans",
      subtitle: "Extract targeted business leads and generate campaigns instantly",
      description: "Advanced email extraction technology for business lead generation"
    },
    transactional: {
      title: "Transactional Email Plans",
      subtitle: "Transactional email service with 99% deliverability",
      description: "Priority email sending relays for critical notifications and OTP tokens"
    }
  };

  const header = categoryHeaders[activeTab] || {
    title: `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Pricing Plans`,
    subtitle: `Maximize outreach with professional ${activeTab} delivery infrastructure`,
    description: `Scalable solutions tailored for ${activeTab} communication workflows`
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header section */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-20 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-slate-900 to-accent/20" />
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <span className="text-primary font-bold text-xs tracking-widest uppercase py-1.5 px-4 bg-primary/15 border border-primary/25 rounded-full">
            Pricing Plans
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mt-6 mb-4">
            Simple, <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Transparent</span> Pricing
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            Choose the perfect infrastructure plan tailored for your outreach, SMTP delivery, lead extraction, and transactional systems.
          </p>

          {/* Custom Switcher Tabs */}
          <div className="mt-10 flex flex-wrap justify-center gap-2 p-1.5 bg-slate-800/80 border border-slate-700/50 rounded-2xl max-w-2xl mx-auto backdrop-blur-md">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-4 text-xs md:text-sm font-bold rounded-xl capitalize transition-all duration-300 cursor-pointer ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'smtp' ? 'SMTP' : tab}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Main pricing grids */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="space-y-12 animate-fade-in">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold text-text-dark mb-3">
              {header.title}
            </h2>
            <p className="text-primary font-semibold text-sm uppercase tracking-wide mb-1">
              {header.subtitle}
            </p>
            {header.description && (
              <p className="text-slate-500 text-base">
                {header.description}
              </p>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : displayPlans.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-md">
              <p className="font-semibold text-slate-400">No plans found in this category.</p>
            </div>
          ) : (
            <div className={`grid grid-cols-1 ${displayPlans.length === 1 ? 'max-w-xl mx-auto' : displayPlans.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' : 'md:grid-cols-3'} gap-8`}>
              {displayPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-3xl p-8 border transition-all duration-300 flex flex-col relative ${
                    plan.popular
                      ? 'border-primary shadow-xl ring-2 ring-primary/20 scale-105 z-10'
                      : 'border-slate-200 shadow-md hover:shadow-xl hover:border-slate-300'
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent text-white text-xs font-black py-1.5 px-4 rounded-full shadow-md uppercase tracking-wider">
                      Most Popular
                    </span>
                  )}
                  <div className="mb-6">
                    {plan.badge && (
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {plan.badge}
                      </span>
                    )}
                    <h3 className="text-2xl font-black text-text-dark mt-1">
                      {plan.name}
                    </h3>
                    <div className="flex flex-col mt-4 mb-2 space-y-1">
                      <div className="flex items-baseline">
                        <span className="text-4xl font-black text-text-dark transition-all duration-300">
                          {plan.priceINR}
                        </span>
                        <span className="text-slate-500 text-sm font-semibold ml-1">
                          {plan.period}
                        </span>
                      </div>
                      {plan.priceUSD && (
                        <div className="flex items-baseline">
                          <span className="text-3xl font-black text-text-dark">
                            {plan.priceUSD}
                          </span>
                          <span className="text-slate-500 text-xs font-semibold ml-1">
                            {plan.period}
                          </span>
                        </div>
                      )}
                    </div>
                    {plan.credits && (
                      <p className="text-primary font-extrabold text-sm bg-primary/5 py-2 px-4 rounded-lg inline-block mt-2">
                        {plan.credits}
                      </p>
                    )}
                    {plan.limit && (
                      <div className="mt-2">
                        <span className="text-xs text-secondary font-bold uppercase tracking-wider bg-secondary/5 py-1 px-3.5 rounded-full inline-block">
                          {plan.limit}
                        </span>
                      </div>
                    )}
                  </div>

                  <ul className="space-y-4 mb-8 flex-grow">
                    {plan.features && plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start text-sm text-slate-600">
                        <Check className="w-5 h-5 text-highlight shrink-0 mr-2.5 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {user ? (
                    <button
                      onClick={() => handlePurchaseClick(plan)}
                      className={`w-full py-4 rounded-full font-bold transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer ${
                        plan.popular
                          ? 'bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent-hover text-white shadow-lg shadow-primary/25 hover:scale-[1.03]'
                          : 'bg-slate-100 hover:bg-slate-200 text-text-dark hover:scale-[1.03]'
                      }`}
                    >
                      <span>Purchase</span>
                      <ArrowRight className="w-4.5 h-4.5" />
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      className={`w-full py-4 rounded-full font-bold transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer ${
                        plan.popular
                          ? 'bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent-hover text-white shadow-lg shadow-primary/25 hover:scale-[1.03]'
                          : 'bg-slate-100 hover:bg-slate-200 text-text-dark hover:scale-[1.03]'
                      }`}
                    >
                      <span>Purchase</span>
                      <ArrowRight className="w-4.5 h-4.5" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Enterprise / Custom Plan CTA */}
      <section className="bg-slate-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl font-black mb-4">Need a Custom Volume Plan?</h2>
          <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto mb-8">
            If you need to send higher volumes, dedicated SMTP clusters, or custom extraction configurations, our system engineers will tailor a setup for your business requirements.
          </p>
          <Link
            href="/contact"
            className="bg-white text-primary hover:bg-slate-50 font-bold px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-all duration-300 inline-flex items-center space-x-2 cursor-pointer"
          >
            <span>Contact System Sales</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {checkoutOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-slate-100 overflow-hidden relative">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50">
              <div>
                <h3 className="font-black text-lg text-slate-900">Plan Checkout</h3>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">Secure payment processing</p>
              </div>
              <button 
                onClick={() => { setCheckoutOpen(false); setSelectedPlan(null); }} 
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors cursor-pointer text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Plan info */}
              <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <h4 className="font-extrabold text-slate-900">{selectedPlan.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedPlan.credits || 'Access Subscription'}</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-primary">
                    {selectedPlan.priceINR}
                  </span>
                  <span className="text-xs text-slate-400 block">{selectedPlan.period}</span>
                </div>
              </div>

              {/* Form Fields */}
              <form onSubmit={handleProceedToPay} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={checkoutForm.name}
                    onChange={(e) => setCheckoutForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={checkoutForm.email}
                    onChange={(e) => setCheckoutForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="john@company.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Company Name</label>
                  <input
                    type="text"
                    value={checkoutForm.companyName}
                    onChange={(e) => setCheckoutForm(prev => ({ ...prev, companyName: e.target.value }))}
                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Acme Corp"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10,12}"
                    value={checkoutForm.phone}
                    onChange={(e) => setCheckoutForm(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '') }))}
                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="10-digit mobile number"
                  />
                </div>

                <button
                  type="submit"
                  disabled={paymentLoading}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent-hover text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
                >
                  {paymentLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      <span>Opening Payment Gateway...</span>
                    </>
                  ) : (
                    <span>Proceed to Pay</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {successModalOpen && successDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-slate-100 overflow-hidden text-center p-8 space-y-6">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500 border border-emerald-100">
              <Check className="w-10 h-10 stroke-[3]" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900">Isha Software Solutions</h2>
              <p className="text-emerald-600 font-extrabold text-sm uppercase tracking-wider">Your payment is successful</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-2 text-left text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Service Plan</span>
                <span className="text-slate-800 font-bold">{successDetails.planName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Paid Amount</span>
                <span className="text-slate-800 font-bold">₹{Number(successDetails.amount).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Billed Email</span>
                <span className="text-slate-800 font-bold truncate max-w-[180px]">{successDetails.email}</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => {
                  const phoneNumber = "917032565821";
                  const waMessage = `Hello Isha Software Solutions,

I have successfully made a payment. Here are my order details:
- Plan: ${successDetails.planName}
- Email: ${successDetails.email}
- Company: ${successDetails.companyName || 'N/A'}
- Phone: ${successDetails.phone || 'N/A'}
- Amount: ₹${Number(successDetails.amount).toLocaleString('en-IN')}
- Status: Completed
- Date: ${new Date().toLocaleDateString('en-IN')}

Please activate my services.`;

                  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(waMessage)}`;
                  window.open(whatsappUrl, '_blank');
                  window.location.href = '/account';
                }}
                className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Proceed to WhatsApp to Send Details</span>
              </button>
              <button
                onClick={() => window.location.href = '/account'}
                className="w-full text-slate-400 hover:text-slate-600 font-bold py-2 text-xs transition-all cursor-pointer"
              >
                Go directly to account cockpit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

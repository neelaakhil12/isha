'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, Images, Briefcase, Tag, LogOut,
  TrendingUp, DollarSign, Clock, CheckCircle2,
  Plus, Pencil, Trash2, X, Save, Loader2,
  Upload, ChevronDown, ChevronUp, ArrowUpRight,
  Play
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// ─── Reusable Modal ─────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="font-black text-lg text-slate-900">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({ title, value, icon: Icon, color, sub }) {
  return (
    <div className={`bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <ArrowUpRight className="w-4 h-4 text-slate-300" />
      </div>
      <p className="text-3xl font-black text-slate-900 mb-1">{value}</p>
      <p className="text-sm font-semibold text-slate-500">{title}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

// ─── Dashboard Tab ───────────────────────────────────────────────────────────
function DashboardTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    setOrders(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  const today = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter(o => o.created_at?.startsWith(today));
  const todayEarnings = todayOrders.filter(o => o.status === 'completed').reduce((sum, o) => sum + Number(o.amount), 0);
  const totalEarnings = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + Number(o.amount), 0);
  const pending = orders.filter(o => o.status === 'pending').length;
  const completed = orders.filter(o => o.status === 'completed').length;

  const handleStatusToggle = async (order) => {
    const newStatus = order.status === 'pending' ? 'completed' : 'pending';
    await supabase.from('orders').update({ status: newStatus }).eq('id', order.id);
    loadOrders();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this order?')) return;
    await supabase.from('orders').delete().eq('id', id);
    loadOrders();
  };

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard title="Today's Earnings" value={`₹${todayEarnings.toLocaleString()}`} icon={TrendingUp} color="bg-gradient-to-tr from-emerald-500 to-teal-500" sub={`${todayOrders.length} order(s) today`} />
        <StatCard title="Total Earnings" value={`₹${totalEarnings.toLocaleString()}`} icon={DollarSign} color="bg-gradient-to-tr from-primary to-accent" sub="All time completed" />
        <StatCard title="Pending Orders" value={pending} icon={Clock} color="bg-gradient-to-tr from-amber-500 to-orange-500" sub="Awaiting completion" />
        <StatCard title="Completed Orders" value={completed} icon={CheckCircle2} color="bg-gradient-to-tr from-violet-500 to-purple-600" sub="Successfully fulfilled" />
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="font-black text-slate-900">Recent Orders</h3>
          <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{orders.length} total</span>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <DollarSign className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-semibold">No orders yet. They will appear here once added to Supabase.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['Customer', 'Service', 'Amount', 'Date', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800 truncate max-w-[160px]">{order.customer_email}</td>
                    <td className="px-6 py-4 text-slate-600">{order.service_name}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">₹{Number(order.amount).toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-400 text-xs">{new Date(order.created_at).toLocaleDateString('en-IN')}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleStatusToggle(order)}
                        className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                          order.status === 'completed' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                        }`}
                      >
                        {order.status}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleDelete(order.id)} className="text-red-400 hover:text-red-600 transition-colors cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Hero Slides Tab ─────────────────────────────────────────────────────────
const dashboardFallbackImages = [
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=200&q=80',
];

function HeroSlidesTab() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'add' | slide object
  const [form, setForm] = useState({ subtitle: '', title: '', description: '', image_url: '', order_index: 0 });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('hero_slides').select('*').order('order_index');
    setSlides(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setForm({ subtitle: '', title: '', description: '', image_url: '', order_index: slides.length }); setModal('add'); };
  const openEdit = (slide) => { setForm({ ...slide }); setModal(slide); };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData(); fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.imageUrl) setForm(f => ({ ...f, image_url: data.imageUrl }));
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    if (modal === 'add') {
      await supabase.from('hero_slides').insert([form]);
    } else {
      await supabase.from('hero_slides').update(form).eq('id', modal.id);
    }
    setSaving(false);
    setModal(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this slide?')) return;
    await supabase.from('hero_slides').delete().eq('id', id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h3 className="font-black text-slate-900 text-lg">Hero Slides</h3><p className="text-slate-500 text-sm">Manage homepage hero slider content and images</p></div>
        <button onClick={openAdd} className="flex items-center space-x-2 bg-gradient-to-r from-primary to-accent text-white font-bold px-5 py-2.5 rounded-2xl hover:scale-105 transition-transform shadow-md shadow-primary/20 cursor-pointer text-sm">
          <Plus className="w-4 h-4" /><span>Add Slide</span>
        </button>
      </div>

      {loading ? <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div> :
        slides.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
            <Images className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p className="text-slate-400 text-sm font-semibold">No hero slides yet. Click "Add Slide" to create your first one.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {slides.map((slide, index) => (
              <div key={slide.id} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-start space-x-4 hover:shadow-md transition-shadow">
                <img 
                  src={slide.image_url || dashboardFallbackImages[index % dashboardFallbackImages.length]} 
                  alt="" 
                  className="w-20 h-14 rounded-xl object-cover shrink-0 border border-slate-100" 
                />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{slide.subtitle}</span>
                  <p className="font-bold text-slate-900 text-sm mt-1 truncate">{slide.title}</p>
                  <p className="text-slate-400 text-xs truncate mt-0.5">{slide.description}</p>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <button onClick={() => openEdit(slide)} className="w-8 h-8 rounded-xl bg-blue-50 text-blue-500 hover:bg-blue-100 flex items-center justify-center transition-colors cursor-pointer"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(slide.id)} className="w-8 h-8 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        )
      }

      {modal && (
        <Modal title={modal === 'add' ? 'Add Hero Slide' : 'Edit Hero Slide'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            {[['subtitle', 'Subtitle (e.g. CAMPAIGNS THAT CONVERT)'], ['title', 'Title'], ['description', 'Description']].map(([key, label]) => (
              <div key={key}>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
                {key === 'description' ? (
                  <textarea rows={3} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
                ) : (
                  <input type="text" value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                )}
              </div>
            ))}

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Background Image</label>
              <div className="flex items-center space-x-3">
                <label className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm px-4 py-2.5 rounded-2xl cursor-pointer transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                </label>
                {form.image_url && <img src={form.image_url} alt="" className="h-10 w-16 object-cover rounded-xl border border-slate-200" />}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Order Index</label>
              <input type="number" value={form.order_index} onChange={e => setForm(f => ({ ...f, order_index: parseInt(e.target.value) || 0 }))} className="w-32 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>

            <button onClick={handleSave} disabled={saving} className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-3.5 rounded-2xl hover:scale-[1.02] transition-transform shadow-md shadow-primary/20 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Saving...</span></> : <><Save className="w-4 h-4" /><span>Save Slide</span></>}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Services Tab ─────────────────────────────────────────────────────────────
function ServicesTab() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', features: '', color: 'from-primary to-accent', href: '/services', image_url: '', demo_video_url: '' });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('services').select('*').order('created_at');
    setServices(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setForm({ name: '', description: '', features: '', color: 'from-primary to-accent', href: '/services', image_url: '', demo_video_url: '' }); setModal('add'); };
  const openEdit = (s) => { setForm({ ...s, features: Array.isArray(s.features) ? s.features.join('\n') : s.features, image_url: s.image_url || '', demo_video_url: s.demo_video_url || '' }); setModal(s); };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData(); fd.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.imageUrl) setForm(f => ({ ...f, image_url: data.imageUrl }));
    } catch (err) {
      console.error('Error uploading service image:', err);
    } finally {
      setUploading(false);
    }
  };


  const handleSave = async () => {
    setSaving(true);
    const payload = { ...form, features: form.features.split('\n').map(f => f.trim()).filter(Boolean) };
    if (modal === 'add') {
      await supabase.from('services').insert([payload]);
    } else {
      await supabase.from('services').update(payload).eq('id', modal.id);
    }
    setSaving(false); setModal(null); load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this service?')) return;
    await supabase.from('services').delete().eq('id', id);
    load();
  };

  const colorOptions = ['from-primary to-accent', 'from-secondary to-accent', 'from-highlight to-primary', 'from-accent to-secondary'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h3 className="font-black text-slate-900 text-lg">Services</h3><p className="text-slate-500 text-sm">Manage homepage and services page offerings</p></div>
        <button onClick={openAdd} className="flex items-center space-x-2 bg-gradient-to-r from-primary to-accent text-white font-bold px-5 py-2.5 rounded-2xl hover:scale-105 transition-transform shadow-md shadow-primary/20 cursor-pointer text-sm">
          <Plus className="w-4 h-4" /><span>Add Service</span>
        </button>
      </div>

      {loading ? <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div> :
        services.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
            <Briefcase className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p className="text-slate-400 text-sm font-semibold">No services yet. Add your first service card.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {services.map(s => (
              <div key={s.id} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-start space-x-4 hover:shadow-md transition-shadow">
                {s.image_url ? (
                  <img src={s.image_url} alt="" className="w-16 h-12 rounded-xl object-cover shrink-0 border border-slate-100" />
                ) : (
                  <div className={`w-16 h-12 rounded-xl bg-gradient-to-tr ${s.color} flex items-center justify-center shrink-0`}>
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900">{s.name}</p>
                  <p className="text-slate-400 text-xs mt-0.5 truncate">{s.description}</p>
                  <p className="text-xs text-slate-300 mt-1">{Array.isArray(s.features) ? s.features.length : 0} features</p>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <button onClick={() => openEdit(s)} className="w-8 h-8 rounded-xl bg-blue-50 text-blue-500 hover:bg-blue-100 flex items-center justify-center cursor-pointer"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(s.id)} className="w-8 h-8 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        )
      }

      {modal && (
        <Modal title={modal === 'add' ? 'Add Service' : 'Edit Service'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            {[['name', 'Service Name'], ['description', 'Description']].map(([key, label]) => (
              <div key={key}>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
                {key === 'description' ? (
                  <textarea rows={3} value={form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
                ) : (
                  <input type="text" value={form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                )}
              </div>
            ))}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Service Image</label>
              <div className="flex items-center space-x-3">
                <label className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm px-4 py-2.5 rounded-2xl cursor-pointer transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading || saving} />
                </label>
                {form.image_url && <img src={form.image_url} alt="" className="h-10 w-16 object-cover rounded-xl border border-slate-200" />}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Features (one per line)</label>
              <textarea rows={5} value={form.features || ''} onChange={e => setForm(f => ({ ...f, features: e.target.value }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none font-mono" placeholder="High Delivery Rate&#10;Campaign Analytics&#10;Email Templates" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Color Theme</label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map(c => (
                  <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))} className={`h-8 w-24 rounded-xl bg-gradient-to-r ${c} border-2 transition-all cursor-pointer ${form.color === c ? 'border-slate-900 scale-110' : 'border-transparent'}`} />
                ))}
              </div>
            </div>
            <button onClick={handleSave} disabled={saving || uploading} className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-3.5 rounded-2xl hover:scale-[1.02] transition-transform shadow-md shadow-primary/20 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Saving...</span></> : <><Save className="w-4 h-4" /><span>Save Service</span></>}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Pricing Tab ─────────────────────────────────────────────────────────────
function PricingTab() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ plan_type: 'bulk', name: '', badge: '', price_inr: '', price_usd: '', period: '/month', credits: '', limit_info: '', features: '', popular: false });
  const [saving, setSaving] = useState(false);
  const [activeType, setActiveType] = useState('bulk');
  const [isCustomType, setIsCustomType] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('pricing_plans').select('*').order('created_at');
    setPlans(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const defaultTabs = ['bulk', 'smtp', 'extractor', 'transactional'];
  const tabs = plans.length > 0 
    ? Array.from(new Set(plans.map(p => p.plan_type)))
    : defaultTabs;

  useEffect(() => {
    if (tabs.length > 0 && !tabs.includes(activeType)) {
      setActiveType(tabs[0]);
    }
  }, [plans, activeType, tabs]);

  const openAdd = () => {
    setIsCustomType(false);
    setForm({ plan_type: activeType, name: '', badge: '', price_inr: '', price_usd: '', period: '/month', credits: '', limit_info: '', features: '', popular: false });
    setModal('add');
  };
  const openEdit = (p) => {
    setIsCustomType(false);
    setForm({ ...p, features: Array.isArray(p.features) ? p.features.join('\n') : p.features });
    setModal(p);
  };

  const handleSave = async () => {
    if (!form.plan_type || !form.plan_type.trim()) {
      alert('Plan type is required.');
      return;
    }
    setSaving(true);
    const payload = { ...form, plan_type: form.plan_type.trim().toLowerCase(), features: form.features.split('\n').map(f => f.trim()).filter(Boolean) };
    if (modal === 'add') { await supabase.from('pricing_plans').insert([payload]); }
    else { await supabase.from('pricing_plans').update(payload).eq('id', modal.id); }
    setSaving(false); setModal(null); load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this plan?')) return;
    await supabase.from('pricing_plans').delete().eq('id', id);
    load();
  };

  const handleRenameCategory = async () => {
    const newName = prompt(`Rename category "${activeType}" to:`, activeType);
    if (!newName) return;
    const cleanName = newName.trim().toLowerCase();
    if (!cleanName || cleanName === activeType) return;

    if (!confirm(`Are you sure you want to rename all plans under "${activeType}" to "${cleanName}"?`)) return;

    setLoading(true);
    const { error } = await supabase
      .from('pricing_plans')
      .update({ plan_type: cleanName })
      .eq('plan_type', activeType);

    if (error) {
      alert(`Error renaming category: ${error.message}`);
    } else {
      setActiveType(cleanName);
      await load();
    }
    setLoading(false);
  };

  const handleDeleteCategory = async () => {
    if (!confirm(`Are you sure you want to delete the category "${activeType}"?\nThis will permanently delete ALL pricing plans inside it!`)) return;

    setLoading(true);
    const { error } = await supabase
      .from('pricing_plans')
      .delete()
      .eq('plan_type', activeType);

    if (error) {
      alert(`Error deleting category: ${error.message}`);
    } else {
      await load();
    }
    setLoading(false);
  };

  const handleAddCategoryButton = () => {
    const categoryName = prompt("Enter new plan type / category name (e.g., SMS, WhatsApp):");
    if (!categoryName) return;
    const cleanName = categoryName.trim().toLowerCase();
    if (!cleanName) return;

    setIsCustomType(true);
    setForm({
      plan_type: cleanName,
      name: '',
      badge: '',
      price_inr: '',
      price_usd: '',
      period: '/month',
      credits: '',
      limit_info: '',
      features: '',
      popular: false
    });
    setModal('add');
  };

  const filtered = plans.filter(p => p.plan_type === activeType);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h3 className="font-black text-slate-900 text-lg">Pricing Plans</h3><p className="text-slate-500 text-sm">Manage all pricing plan cards</p></div>
        <div className="flex items-center space-x-3">
          <button onClick={handleAddCategoryButton} className="flex items-center space-x-2 bg-gradient-to-r from-secondary to-accent text-white font-bold px-5 py-2.5 rounded-2xl hover:scale-105 transition-transform shadow-md shadow-secondary/20 cursor-pointer text-sm">
            <Plus className="w-4 h-4" /><span>Add Plan Type</span>
          </button>
          <button onClick={openAdd} className="flex items-center space-x-2 bg-gradient-to-r from-primary to-accent text-white font-bold px-5 py-2.5 rounded-2xl hover:scale-105 transition-transform shadow-md shadow-primary/20 cursor-pointer text-sm">
            <Plus className="w-4 h-4" /><span>Add Plan</span>
          </button>
        </div>
      </div>

      {/* Type Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-2xl">
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveType(t)} className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl capitalize transition-all cursor-pointer ${activeType === t ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {t === 'smtp' ? 'SMTP' : t}
          </button>
        ))}
      </div>

      {/* Category Actions */}
      <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm text-xs">
        <span className="text-slate-500 font-bold">
          Category Options (<span className="text-primary font-black uppercase tracking-wider">{activeType}</span>):
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRenameCategory}
            className="flex items-center space-x-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl font-bold cursor-pointer transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Rename Category</span>
          </button>
          <button
            onClick={handleDeleteCategory}
            className="flex items-center space-x-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold cursor-pointer transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Category</span>
          </button>
        </div>
      </div>

      {loading ? <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div> :
        filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
            <Tag className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p className="text-slate-400 text-sm font-semibold">No {activeType} plans yet.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map(p => (
              <div key={p.id} className={`bg-white rounded-2xl border p-5 flex items-start space-x-4 hover:shadow-md transition-shadow ${p.popular ? 'border-primary/30 ring-1 ring-primary/20' : 'border-slate-100'}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="font-bold text-slate-900">{p.name}</p>
                    {p.popular && <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">Popular</span>}
                    {p.badge && <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{p.badge}</span>}
                  </div>
                  <div className="flex flex-col mb-1.5 space-y-0.5">
                    <p className="text-lg font-black text-slate-900">{p.price_inr} <span className="text-sm text-slate-400 font-semibold">{p.period}</span></p>
                    {p.price_usd && (
                      <p className="text-base font-black text-slate-800">{p.price_usd} <span className="text-xs text-slate-400 font-semibold">{p.period}</span></p>
                    )}
                  </div>
                  {p.credits && <p className="text-xs text-primary font-semibold mt-0.5">{p.credits}</p>}
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-xl bg-blue-50 text-blue-500 hover:bg-blue-100 flex items-center justify-center cursor-pointer"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(p.id)} className="w-8 h-8 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        )
      }

      {modal && (
        <Modal title={modal === 'add' ? 'Add Pricing Plan' : 'Edit Pricing Plan'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Plan Type</label>
              {isCustomType ? (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="e.g. whatsapp, sms"
                    value={form.plan_type}
                    onChange={e => setForm(f => ({ ...f, plan_type: e.target.value.toLowerCase() }))}
                    className="flex-1 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomType(false);
                      setForm(f => ({ ...f, plan_type: tabs[0] || 'bulk' }));
                    }}
                    className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm rounded-2xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <select
                  value={form.plan_type}
                  onChange={e => {
                    if (e.target.value === 'NEW_CUSTOM_TYPE') {
                      setIsCustomType(true);
                      setForm(f => ({ ...f, plan_type: '' }));
                    } else {
                      setForm(f => ({ ...f, plan_type: e.target.value }));
                    }
                  }}
                  className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white text-slate-800"
                >
                  {tabs.map(t => (
                    <option key={t} value={t}>
                      {t === 'smtp' ? 'SMTP' : t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                  <option value="NEW_CUSTOM_TYPE">+ Add Custom Plan Type...</option>
                </select>
              )}
            </div>
            {[['name', 'Plan Name'], ['badge', 'Badge (Starter / Popular / Enterprise)'], ['price_inr', 'Price INR (₹ 10,000)'], ['price_usd', 'Price USD ($ 120)'], ['period', 'Period (/month)'], ['credits', 'Credits (800,000 Email Credits)']].map(([key, label]) => (
              <div key={key}>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
                <input type="text" value={form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Features (one per line)</label>
              <textarea rows={5} value={form.features} onChange={e => setForm(f => ({ ...f, features: e.target.value }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none font-mono" placeholder="High Delivery Rate&#10;SPF, DKIM Setup&#10;Dedicated Support" />
            </div>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" checked={form.popular} onChange={e => setForm(f => ({ ...f, popular: e.target.checked }))} className="w-4 h-4 accent-primary" />
              <span className="text-sm font-semibold text-slate-700">Mark as Popular / Featured</span>
            </label>
            <button onClick={handleSave} disabled={saving} className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-3.5 rounded-2xl hover:scale-[1.02] transition-transform shadow-md shadow-primary/20 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Saving...</span></> : <><Save className="w-4 h-4" /><span>Save Plan</span></>}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Demo Videos Tab ──────────────────────────────────────────────────────────
function DemoVideosTab() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadServices = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('services').select('*').order('created_at');
    const filteredServices = (data || []).filter(s => s.name.toLowerCase().includes('bulk email'));
    setServices(filteredServices);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.imageUrl) {
        setVideoUrl(data.imageUrl);
      }
    } catch (err) {
      console.error('Error uploading video:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!editingService) return;
    setSaving(true);
    const { error } = await supabase
      .from('services')
      .update({ demo_video_url: videoUrl })
      .eq('id', editingService.id);
    
    if (error) {
      alert('Error saving demo video: ' + error.message);
    } else {
      setEditingService(null);
      loadServices();
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-black text-slate-900 text-lg">Demo Videos</h3>
        <p className="text-slate-500 text-sm">Configure walkthrough and demonstration videos played when users click the Demo button</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : services.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400">
          <p className="text-sm font-semibold">No services configured yet. Create services first under the Services tab.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {services.map(service => (
            <div key={service.id} className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-slate-900 text-lg">{service.name}</span>
                  <span className="text-xs text-slate-400">({service.href})</span>
                </div>
                <p className="text-slate-500 text-sm">{service.description}</p>
                <div className="pt-2">
                  {service.demo_video_url ? (
                    <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-full text-xs font-bold border border-emerald-100">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="truncate max-w-[250px]">{service.demo_video_url}</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center space-x-2 bg-amber-50 text-amber-700 px-3.5 py-1.5 rounded-full text-xs font-bold border border-amber-100">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>Using default video (/mautic_demo.mp4)</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <button
                  onClick={() => {
                    setEditingService(service);
                    setVideoUrl(service.demo_video_url || '');
                  }}
                  className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-2xl transition-colors cursor-pointer text-sm"
                >
                  <Pencil className="w-4 h-4" />
                  <span>Configure Video</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingService && (
        <Modal title={`Configure Demo Video for ${editingService.name}`} onClose={() => setEditingService(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Video URL</label>
              <input
                type="text"
                placeholder="Paste direct mp4 link, or upload a video below"
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Upload Demo Video File</label>
              <div className="flex items-center space-x-3">
                <label className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm px-4 py-2.5 rounded-2xl cursor-pointer transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>{uploading ? 'Uploading...' : 'Upload Video File'}</span>
                  <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" disabled={uploading} />
                </label>
                {videoUrl && (
                  <span className="text-xs text-slate-500 truncate max-w-[250px]" title={videoUrl}>
                    Active video set
                  </span>
                )}
              </div>
            </div>

            {videoUrl && (
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Preview</label>
                <video
                  src={videoUrl}
                  controls
                  className="w-full h-auto max-h-[200px] rounded-2xl border border-slate-200 bg-black"
                />
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={saving || uploading}
              className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-3.5 rounded-2xl hover:scale-[1.02] transition-transform shadow-md shadow-primary/20 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Demo Video</span>
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Main Admin Dashboard ────────────────────────────────────────────────────
export default function AdminDashboard({ adminEmail }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.reload();
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'hero', label: 'Hero Slides', icon: Images },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'pricing', label: 'Pricing', icon: Tag },
    { id: 'demo_videos', label: 'Demo Videos', icon: Play },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 text-white flex flex-col fixed h-full z-20 shadow-2xl">
        {/* Brand */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-black text-sm leading-tight">Isha Admin</p>
              <p className="text-slate-400 text-xs">Control Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                  active ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4.5 h-4.5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Admin Info & Logout */}
        <div className="p-4 border-t border-slate-800">
          <p className="text-xs text-slate-500 font-semibold mb-3 truncate px-1">{adminEmail}</p>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer disabled:opacity-60"
          >
            {loggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
            <span>{loggingOut ? 'Logging out...' : 'Log Out'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-100 px-8 py-5 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-black text-xl text-slate-900">
                {tabs.find(t => t.id === activeTab)?.label}
              </h1>
              <p className="text-slate-400 text-sm">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <a href="/" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-xl transition-colors flex items-center space-x-1">
              <span>View Live Site</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </header>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === 'dashboard' && <DashboardTab />}
          {activeTab === 'hero' && <HeroSlidesTab />}
          {activeTab === 'services' && <ServicesTab />}
          {activeTab === 'pricing' && <PricingTab />}
          {activeTab === 'demo_videos' && <DemoVideosTab />}
        </div>
      </main>
    </div>
  );
}

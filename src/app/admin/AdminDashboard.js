'use client';

import { useState, useEffect, useCallback } from 'react';
import * as Lucide from 'lucide-react';
import {
  LayoutDashboard, Images, Briefcase, Tag, LogOut,
  TrendingUp, DollarSign, Clock, CheckCircle2,
  Plus, Pencil, Trash2, X, Save, Loader2,
  Upload, ChevronDown, ChevronUp, ArrowUpRight,
  Play, MapPin, Phone, Mail, BookUser,
  ShieldCheck, Eye, Trophy, HelpCircle, Users, Target
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

// ─── Contact Info Tab ────────────────────────────────────────────────────────
function ContactInfoTab() {
  const defaultForm = {
    email: 'support@ishasoftwares.com',
    phone_sales: '+91 98765 43210',
    address: '123 SaaS Street, Suite 400, Tech Park, Hyderabad, India',
    map_url: '',
    map_visible: true,
    social_visible: true,
    facebook_url: '',
    twitter_url: '',
    linkedin_url: '',
    instagram_url: '',
  };
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('contact_info')
        .select('*')
        .eq('id', 1)
        .single();
      if (!err && data) {
        setForm({
          email: data.email || defaultForm.email,
          phone_sales: data.phone_sales || defaultForm.phone_sales,
          address: data.address || defaultForm.address,
          map_url: data.map_url || '',
          map_visible: data.map_visible !== undefined ? data.map_visible : true,
          social_visible: data.social_visible !== undefined ? data.social_visible : true,
          facebook_url: data.facebook_url || '',
          twitter_url: data.twitter_url || '',
          linkedin_url: data.linkedin_url || '',
          instagram_url: data.instagram_url || '',
        });
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const { error: err } = await supabase
      .from('contact_info')
      .upsert({ id: 1, ...form, updated_at: new Date().toISOString() }, { onConflict: 'id' });
    if (err) {
      setError(err.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState(null);

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setLocateError('Geolocation is not supported by this browser.');
      return;
    }
    setLocating(true);
    setLocateError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const url = `https://maps.google.com/maps?q=${latitude},${longitude}&z=17&output=embed`;
        setForm(f => ({ ...f, map_url: url }));
        setSaved(false);
        setLocating(false);
      },
      (err) => {
        setLocateError('Could not get location. Please allow location access in your browser.');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const fields = [
    { key: 'email', label: 'Email Address', icon: Mail, type: 'email', placeholder: 'support@example.com', hint: 'Shown in footer & contact page' },
    { key: 'phone_sales', label: 'Phone Number', icon: Phone, type: 'tel', placeholder: '+91 98765 43210', hint: 'Shown in footer & contact page' },
    { key: 'address', label: 'Office Address', icon: MapPin, type: 'textarea', placeholder: '123 Main St, City, State, Country', hint: 'Shown in footer & contact page' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-black text-slate-900 text-lg">Contact Information</h3>
        <p className="text-slate-500 text-sm">Update the contact details shown on the website footer and contact page.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-6">

          {/* Contact Details Card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <h4 className="font-bold text-slate-800 text-base mb-6 flex items-center space-x-2">
              <Phone className="w-4 h-4 text-primary" />
              <span>Contact Details</span>
            </h4>

            {/* Live Preview */}
            <div className="mb-6 p-5 rounded-2xl bg-slate-900 text-slate-300 text-sm space-y-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Live Preview</p>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span>{form.address}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-secondary shrink-0" />
                <span>{form.phone_sales}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-secondary shrink-0" />
                <span>{form.email}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fields.map(({ key, label, icon: Icon, type, placeholder, hint }) => (
                <div key={key} className={type === 'textarea' ? 'md:col-span-2' : ''}>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    <Icon className="w-3.5 h-3.5 inline mr-1.5 opacity-60" />
                    {label}
                  </label>
                  {type === 'textarea' ? (
                    <textarea
                      name={key}
                      value={form[key]}
                      onChange={handleChange}
                      rows={3}
                      placeholder={placeholder}
                      className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none transition-all"
                    />
                  ) : (
                    <input
                      type={type}
                      name={key}
                      value={form[key]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                    />
                  )}
                  <p className="text-xs text-slate-400 mt-1.5 ml-1">{hint}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Google Map Card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold text-slate-800 text-base flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Google Map</span>
              </h4>
              {/* Visibility Toggle */}
              <div className="flex items-center space-x-3">
                <span className="text-sm font-semibold text-slate-500">
                  {form.map_visible ? 'Visible on site' : 'Hidden from site'}
                </span>
                <button
                  onClick={() => { setForm(f => ({ ...f, map_visible: !f.map_visible })); setSaved(false); }}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer focus:outline-none ${
                    form.map_visible ? 'bg-gradient-to-r from-primary to-accent' : 'bg-slate-300'
                  }`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
                    form.map_visible ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Google Maps URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  name="map_url"
                  value={form.map_url}
                  onChange={handleChange}
                  placeholder="Paste any Google Maps link or click Locate Me →"
                  className="flex-1 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                />
                <button
                  type="button"
                  onClick={handleLocateMe}
                  disabled={locating}
                  title="Use my current location"
                  className="flex items-center space-x-1.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-primary to-accent text-white text-xs font-bold shrink-0 hover:opacity-90 transition-all cursor-pointer disabled:opacity-60 shadow-md shadow-primary/20"
                >
                  {locating ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /><span>Locating...</span></>
                  ) : (
                    <><MapPin className="w-4 h-4" /><span>Locate Me</span></>
                  )}
                </button>
              </div>
              {locateError && (
                <p className="text-xs text-red-500 mt-1.5 ml-1">{locateError}</p>
              )}
              {!locateError && (
                <p className="text-xs text-slate-400 mt-1.5 ml-1">
                  Click <strong>Locate Me</strong> to auto-detect your location, or paste any Google Maps link.
                </p>
              )}
            </div>

            {/* Smart URL warning + auto-fix */}
            {form.map_url && !form.map_url.includes('output=embed') && !form.map_url.includes('/maps/embed') && (
              <div className="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start space-x-3">
                <span className="text-amber-500 text-lg shrink-0">⚠️</span>
                <div className="flex-1">
                  <p className="text-amber-700 text-sm font-bold">Regular Maps URL detected</p>
                  <p className="text-amber-600 text-xs mt-1">
                    This URL needs to be converted to embed format. Click below to fix it automatically.
                  </p>
                  <button
                    onClick={() => {
                      const base = form.map_url.includes('?') ? `${form.map_url}&output=embed` : `${form.map_url}?output=embed`;
                      setForm(f => ({ ...f, map_url: base }));
                      setSaved(false);
                    }}
                    className="mt-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white px-4 py-1.5 rounded-xl transition-colors cursor-pointer"
                  >
                    Convert to Embed URL
                  </button>
                </div>
              </div>
            )}

            {/* Map Preview */}
            {form.map_url ? (
              <div className="mt-4 rounded-2xl overflow-hidden border border-slate-200 h-52">
                <iframe
                  src={
                    form.map_url.includes('output=embed') || form.map_url.includes('/maps/embed')
                      ? form.map_url
                      : form.map_url.includes('?') ? `${form.map_url}&output=embed` : `${form.map_url}?output=embed`
                  }
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Map Preview"
                />
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border-2 border-dashed border-slate-200 h-32 flex items-center justify-center text-slate-400 text-sm text-center px-4">
                <span>Paste any Google Maps link above to preview the map here</span>
              </div>
            )}
          </div>

          {/* Social Media Card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold text-slate-800 text-base flex items-center space-x-2">
                <span className="text-lg">📲</span>
                <span>Social Media</span>
              </h4>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-semibold text-slate-500">
                  {form.social_visible ? 'Section visible' : 'Section hidden'}
                </span>
                <button
                  onClick={() => { setForm(f => ({ ...f, social_visible: !f.social_visible })); setSaved(false); }}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer focus:outline-none ${
                    form.social_visible ? 'bg-gradient-to-r from-primary to-accent' : 'bg-slate-300'
                  }`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
                    form.social_visible ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { key: 'facebook_url', label: 'Facebook', emoji: '📘', placeholder: 'https://facebook.com/yourpage', color: 'text-blue-600' },
                { key: 'twitter_url', label: 'Twitter / X', emoji: '🐦', placeholder: 'https://twitter.com/yourhandle', color: 'text-sky-500' },
                { key: 'linkedin_url', label: 'LinkedIn', emoji: '💼', placeholder: 'https://linkedin.com/company/yourco', color: 'text-blue-700' },
                { key: 'instagram_url', label: 'Instagram', emoji: '📸', placeholder: 'https://instagram.com/yourprofile', color: 'text-pink-500' },
              ].map(({ key, label, emoji, placeholder }) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-xl w-8 text-center shrink-0">{emoji}</span>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</label>
                    <input
                      type="url"
                      name={key}
                      value={form[key]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      className="w-full border border-slate-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                    />
                  </div>
                  <p className="text-xs text-slate-400 shrink-0">{form[key] ? '✅ Set' : '⬜ Empty'}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-4 ml-1">Leave a URL empty to hide that platform's button on the website.</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-semibold">{error}</div>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center space-x-2 px-8 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-md cursor-pointer disabled:opacity-60 ${
              saved
                ? 'bg-emerald-500 text-white shadow-emerald-200'
                : 'bg-gradient-to-r from-primary to-accent text-white shadow-primary/20 hover:scale-[1.02]'
            }`}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Saving...' : saved ? 'Saved Successfully!' : 'Save Contact Info'}</span>
          </button>
        </div>
      )}
    </div>
  );
}


// ─── Home About Tab ─────────────────────────────────────────────────────────
function HomeAboutTab() {
  const defaultForm = {
    badge: 'About The Company',
    title: 'Empowering Smart Businesses with Advanced Email Solutions',
    description_1: 'Isha Software Solutions helps businesses automate communication...',
    description_2: 'Our infrastructure is built for high volume...',
    link_text: 'Read Our Mission Story',
    link_url: '/about',
    smtp_rate: '99.8%',
    sender_score: '98/100',
    queue_latency: '< 150ms',
    queue_latency_pct: '10'
  };
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase.from('about_company').select('*').eq('id', 1).maybeSingle();
      if (data) setForm(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await supabase.from('about_company').upsert({ id: 1, ...form, updated_at: new Date().toISOString() }, { onConflict: 'id' });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-8 space-y-6">
      <div><h3 className="font-black text-slate-900 text-lg">Home About Section</h3><p className="text-slate-500 text-sm">Configure About Company text and metrics on homepage</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[['badge', 'Badge Label'], ['title', 'Section Title'], ['link_text', 'Button/Link Text'], ['link_url', 'Button/Link URL']].map(([key, label]) => (
          <div key={key} className={key === 'title' ? 'md:col-span-2' : ''}>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
            <input type="text" value={form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
        ))}
        {[['description_1', 'Short Intro Text'], ['description_2', 'Full Detailed Paragraph']].map(([key, label]) => (
          <div key={key} className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
            <textarea rows={3} value={form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
          </div>
        ))}
        <div className="md:col-span-2 border-t pt-6"><h4 className="font-bold text-slate-800 text-sm mb-4">Platform Preview Slider Metrics</h4></div>
        {[['smtp_rate', 'SMTP Delivery Rate (e.g. 99.8%)'], ['sender_score', 'Sender Score (e.g. 98/100)'], ['queue_latency', 'Queue Latency (e.g. < 150ms)'], ['queue_latency_pct', 'Queue Latency Progress Bar % (e.g. 10)']].map(([key, label]) => (
          <div key={key}>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
            <input type="text" value={form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
        ))}
      </div>
      <button onClick={handleSave} disabled={saving} className={`flex items-center space-x-2 px-8 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-md cursor-pointer ${saved ? 'bg-emerald-500 text-white' : 'bg-gradient-to-r from-primary to-accent text-white shadow-primary/20 hover:scale-[1.02]'}`}>
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        <span>{saving ? 'Saving...' : saved ? 'Saved Successfully!' : 'Save About Company Content'}</span>
      </button>
    </div>
  );
}

// ─── Home Benefits Tab ──────────────────────────────────────────────────────
const benefitIconsList = ['ShieldCheck', 'CheckCircle2', 'Settings', 'Coins', 'PhoneCall', 'Clock', 'Send', 'Server', 'Zap', 'Search', 'Users', 'MailCheck', 'Trophy', 'HelpCircle', 'Target', 'Eye'];

function HomeBenefitsTab() {
  const [benefits, setBenefits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', icon_name: 'ShieldCheck', order_index: 0 });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('benefits').select('*').order('order_index');
    setBenefits(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setForm({ title: '', description: '', icon_name: 'ShieldCheck', order_index: benefits.length }); setModal('add'); };
  const openEdit = (b) => { setForm({ ...b }); setModal(b); };

  const handleSave = async () => {
    setSaving(true);
    if (modal === 'add') { await supabase.from('benefits').insert([form]); }
    else { await supabase.from('benefits').update(form).eq('id', modal.id); }
    setSaving(false); setModal(null); load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this benefit?')) return;
    await supabase.from('benefits').delete().eq('id', id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h3 className="font-black text-slate-900 text-lg">Platform Benefits</h3><p className="text-slate-500 text-sm">Manage why choose us benefit cards on homepage</p></div>
        <button onClick={openAdd} className="flex items-center space-x-2 bg-gradient-to-r from-primary to-accent text-white font-bold px-5 py-2.5 rounded-2xl hover:scale-105 transition-transform shadow-md shadow-primary/20 cursor-pointer text-sm">
          <Plus className="w-4 h-4" /><span>Add Benefit</span>
        </button>
      </div>
      {loading ? <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div> :
        benefits.length === 0 ? <div className="text-center py-16 bg-white rounded-3xl border border-dashed"><ShieldCheck className="w-10 h-10 mx-auto mb-3 text-slate-300" /><p className="text-slate-400 text-sm font-semibold">No benefits yet.</p></div> :
        <div className="grid gap-4">
          {benefits.map(b => {
            const Icon = Lucide[b.icon_name] || ShieldCheck;
            return (
              <div key={b.id} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-start space-x-4 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0"><Icon className="w-5 h-5" /></div>
                <div className="flex-1 min-w-0"><p className="font-bold text-slate-900">{b.title}</p><p className="text-slate-400 text-xs mt-0.5">{b.description}</p><p className="text-[10px] text-slate-300 mt-1 font-bold">Order index: {b.order_index} | Icon: {b.icon_name}</p></div>
                <div className="flex items-center space-x-2 shrink-0">
                  <button onClick={() => openEdit(b)} className="w-8 h-8 rounded-xl bg-blue-50 text-blue-500 hover:bg-blue-100 flex items-center justify-center cursor-pointer"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(b.id)} className="w-8 h-8 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            );
          })}
        </div>
      }
      {modal && (
        <Modal title={modal === 'add' ? 'Add Benefit' : 'Edit Benefit'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Title</label>
              <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
              <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Icon</label>
                <select value={form.icon_name} onChange={e => setForm(f => ({ ...f, icon_name: e.target.value }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none bg-white">
                  {benefitIconsList.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Order Index</label>
                <input type="number" value={form.order_index} onChange={e => setForm(f => ({ ...f, order_index: parseInt(e.target.value) || 0 }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none" />
              </div>
            </div>
            <button onClick={handleSave} disabled={saving} className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-3.5 rounded-2xl hover:scale-[1.02] transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}<span>Save Benefit</span>
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Home Stats Tab ─────────────────────────────────────────────────────────
const statColorsList = ['from-primary to-accent', 'from-secondary to-accent', 'from-highlight to-primary', 'from-accent to-secondary'];

function HomeStatsTab() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ target_num: '', suffix: '', target_text: '', label: '', icon_name: 'Mail', color: 'from-primary to-accent', order_index: 0 });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('stats').select('*').order('order_index');
    setStats(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setForm({ target_num: '', suffix: '', target_text: '', label: '', icon_name: 'Mail', color: 'from-primary to-accent', order_index: stats.length }); setModal('add'); };
  const openEdit = (s) => { setForm({ ...s, target_num: s.target_num ?? '', target_text: s.target_text ?? '' }); setModal(s); };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...form,
      target_num: form.target_num !== '' ? parseInt(form.target_num) : null,
      target_text: form.target_text !== '' ? form.target_text : null
    };
    if (modal === 'add') { await supabase.from('stats').insert([payload]); }
    else { await supabase.from('stats').update(payload).eq('id', modal.id); }
    setSaving(false); setModal(null); load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this stat?')) return;
    await supabase.from('stats').delete().eq('id', id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h3 className="font-black text-slate-900 text-lg">Homepage Stats</h3><p className="text-slate-500 text-sm">Manage dynamic stat counters inside the stats banner</p></div>
        <button onClick={openAdd} className="flex items-center space-x-2 bg-gradient-to-r from-primary to-accent text-white font-bold px-5 py-2.5 rounded-2xl hover:scale-105 transition-transform shadow-md shadow-primary/20 cursor-pointer text-sm">
          <Plus className="w-4 h-4" /><span>Add Stat</span>
        </button>
      </div>
      {loading ? <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div> :
        stats.length === 0 ? <div className="text-center py-16 bg-white rounded-3xl border border-dashed"><TrendingUp className="w-10 h-10 mx-auto mb-3 text-slate-300" /><p className="text-slate-400 text-sm font-semibold">No stats yet.</p></div> :
        <div className="grid gap-4">
          {stats.map(s => {
            const Icon = Lucide[s.icon_name] || Mail;
            return (
              <div key={s.id} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-start space-x-4 hover:shadow-md transition-all">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${s.color} flex items-center justify-center text-white shrink-0`}><Icon className="w-5 h-5" /></div>
                <div className="flex-1 min-w-0"><p className="font-bold text-slate-900 text-base">{s.target_text || `${s.target_num}${s.suffix || ''}`}</p><p className="text-slate-500 font-bold text-xs">{s.label}</p><p className="text-[10px] text-slate-300 mt-1">Order index: {s.order_index} | Icon: {s.icon_name}</p></div>
                <div className="flex items-center space-x-2 shrink-0">
                  <button onClick={() => openEdit(s)} className="w-8 h-8 rounded-xl bg-blue-50 text-blue-500 hover:bg-blue-100 flex items-center justify-center cursor-pointer"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(s.id)} className="w-8 h-8 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            );
          })}
        </div>
      }
      {modal && (
        <Modal title={modal === 'add' ? 'Add Stat' : 'Edit Stat'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Target Number (for animation)</label>
                <input type="number" placeholder="e.g. 10000" value={form.target_num} onChange={e => setForm(f => ({ ...f, target_num: e.target.value }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Suffix (e.g. +, %)</label>
                <input type="text" placeholder="e.g. +" value={form.suffix} onChange={e => setForm(f => ({ ...f, suffix: e.target.value }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Static Target Text (Alternative if not animating, e.g. 24/7)</label>
              <input type="text" placeholder="e.g. 24/7" value={form.target_text} onChange={e => setForm(f => ({ ...f, target_text: e.target.value }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Stat Label</label>
              <input type="text" placeholder="e.g. Campaigns Sent" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Icon</label>
                <select value={form.icon_name} onChange={e => setForm(f => ({ ...f, icon_name: e.target.value }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm bg-white focus:outline-none">
                  {benefitIconsList.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Order Index</label>
                <input type="number" value={form.order_index} onChange={e => setForm(f => ({ ...f, order_index: parseInt(e.target.value) || 0 }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Color Theme</label>
              <div className="flex flex-wrap gap-2">
                {statColorsList.map(c => (
                  <button key={c} type="button" onClick={() => setForm(f => ({ ...f, color: c }))} className={`h-8 w-24 rounded-xl bg-gradient-to-r ${c} border-2 transition-all cursor-pointer ${form.color === c ? 'border-slate-900 scale-110' : 'border-transparent'}`} />
                ))}
              </div>
            </div>
            <button onClick={handleSave} disabled={saving} className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-3.5 rounded-2xl hover:scale-[1.02] transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}<span>Save Stat</span>
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Home Testimonials Tab ──────────────────────────────────────────────────
function HomeTestimonialsTab() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ quote: '', author: '', role: '', rating: 5, avatar: '', order_index: 0 });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('testimonials').select('*').order('order_index');
    setTestimonials(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setForm({ quote: '', author: '', role: '', rating: 5, avatar: '', order_index: testimonials.length }); setModal('add'); };
  const openEdit = (t) => { setForm({ ...t }); setModal(t); };

  const handleSave = async () => {
    setSaving(true);
    if (modal === 'add') { await supabase.from('testimonials').insert([form]); }
    else { await supabase.from('testimonials').update(form).eq('id', modal.id); }
    setSaving(false); setModal(null); load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this testimonial?')) return;
    await supabase.from('testimonials').delete().eq('id', id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h3 className="font-black text-slate-900 text-lg">Client Stories / Testimonials</h3><p className="text-slate-500 text-sm">Manage user testimonials and reviews on homepage slider</p></div>
        <button onClick={openAdd} className="flex items-center space-x-2 bg-gradient-to-r from-primary to-accent text-white font-bold px-5 py-2.5 rounded-2xl hover:scale-105 transition-transform shadow-md shadow-primary/20 cursor-pointer text-sm">
          <Plus className="w-4 h-4" /><span>Add Testimonial</span>
        </button>
      </div>
      {loading ? <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div> :
        testimonials.length === 0 ? <div className="text-center py-16 bg-white rounded-3xl border border-dashed"><Users className="w-10 h-10 mx-auto mb-3 text-slate-300" /><p className="text-slate-400 text-sm font-semibold">No testimonials yet.</p></div> :
        <div className="grid gap-4">
          {testimonials.map(t => (
            <div key={t.id} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-start space-x-4 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-bold text-lg shrink-0">{t.avatar || t.author?.charAt(0) || 'S'}</div>
              <div className="flex-1 min-w-0"><p className="font-bold text-slate-900">{t.author}</p><p className="text-slate-500 text-xs font-semibold">{t.role}</p><p className="text-slate-400 text-xs mt-1 truncate italic">"{t.quote}"</p><p className="text-[10px] text-slate-300 mt-1 font-bold">Rating: {t.rating} stars | Order index: {t.order_index}</p></div>
              <div className="flex items-center space-x-2 shrink-0">
                <button onClick={() => openEdit(t)} className="w-8 h-8 rounded-xl bg-blue-50 text-blue-500 hover:bg-blue-100 flex items-center justify-center cursor-pointer"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(t.id)} className="w-8 h-8 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      }
      {modal && (
        <Modal title={modal === 'add' ? 'Add Testimonial' : 'Edit Testimonial'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Author Name</label>
                <input type="text" value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Author Role / Company</label>
                <input type="text" placeholder="e.g. CTO, CloudScale Tech" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Quote / Review Text</label>
              <textarea rows={3} value={form.quote} onChange={e => setForm(f => ({ ...f, quote: e.target.value }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none resize-none" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Rating (1-5)</label>
                <input type="number" min={1} max={5} value={form.rating} onChange={e => setForm(f => ({ ...f, rating: Math.max(1, Math.min(5, parseInt(e.target.value) || 5)) }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Avatar (Initial or URL)</label>
                <input type="text" placeholder="e.g. S" value={form.avatar} onChange={e => setForm(f => ({ ...f, avatar: e.target.value }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Order Index</label>
                <input type="number" value={form.order_index} onChange={e => setForm(f => ({ ...f, order_index: parseInt(e.target.value) || 0 }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none" />
              </div>
            </div>
            <button onClick={handleSave} disabled={saving} className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-3.5 rounded-2xl hover:scale-[1.02] transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}<span>Save Testimonial</span>
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Home FAQs Tab ──────────────────────────────────────────────────────────
function HomeFaqsTab() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ question: '', answer: '', order_index: 0 });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('faqs').select('*').order('order_index');
    setFaqs(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setForm({ question: '', answer: '', order_index: faqs.length }); setModal('add'); };
  const openEdit = (faq) => { setForm({ ...faq }); setModal(faq); };

  const handleSave = async () => {
    setSaving(true);
    if (modal === 'add') { await supabase.from('faqs').insert([form]); }
    else { await supabase.from('faqs').update(form).eq('id', modal.id); }
    setSaving(false); setModal(null); load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this FAQ?')) return;
    await supabase.from('faqs').delete().eq('id', id);
    load();
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div><h3 className="font-black text-slate-900 text-lg">Frequently Asked Questions (Admin)</h3><p className="text-slate-500 text-sm">Manage homepage accordion FAQ lists</p></div>
        <button onClick={openAdd} className="flex items-center space-x-2 bg-gradient-to-r from-primary to-accent text-white font-bold px-5 py-2.5 rounded-2xl hover:scale-105 transition-transform shadow-md shadow-primary/20 cursor-pointer text-sm">
          <Plus className="w-4 h-4" /><span>Add FAQ</span>
        </button>
      </div>
      {loading ? <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div> :
        faqs.length === 0 ? <div className="text-center py-16 bg-white rounded-3xl border border-dashed"><HelpCircle className="w-10 h-10 mx-auto mb-3 text-slate-300" /><p className="text-slate-400 text-sm font-semibold">No FAQs yet.</p></div> :
        <div className="grid gap-4">
          {faqs.map(f => (
            <div key={f.id} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-start space-x-4 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0"><HelpCircle className="w-5 h-5" /></div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900">{f.question}</p>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">{f.answer}</p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                  <p className="text-[10px] text-slate-300 font-bold">Order index: {f.order_index}</p>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => openEdit(f)} className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer text-xs font-bold">
                      <Pencil className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button onClick={() => handleDelete(f.id)} className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer text-xs font-bold">
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      }
      {modal && (
        <Modal title={modal === 'add' ? 'Add FAQ' : 'Edit FAQ'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Question</label>
              <input type="text" value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Answer</label>
              <textarea rows={4} value={form.answer} onChange={e => setForm(f => ({ ...f, answer: e.target.value }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none resize-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Order Index</label>
              <input type="number" value={form.order_index} onChange={e => setForm(f => ({ ...f, order_index: parseInt(e.target.value) || 0 }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none" />
            </div>
            <button onClick={handleSave} disabled={saving} className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-3.5 rounded-2xl hover:scale-[1.02] transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}<span>Save FAQ</span>
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── About Headers Tab ──────────────────────────────────────────────────────
function AboutHeadersTab() {
  const defaultForm = {
    header_title: 'Powering Smart Digital Outreach',
    header_description: 'Isha Software Solutions delivers secure, high-reputation SMTP networks and marketing tools...',
    intro_title: 'Next-Generation Email Solutions Crafted for Scalability',
    intro_desc_1: 'Founded with the goal of breaking vendor lock-ins...',
    intro_desc_2: 'We design software that eliminates complex billing rules...'
  };
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase.from('about_page_headers').select('*').eq('id', 1).maybeSingle();
      if (data) setForm(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await supabase.from('about_page_headers').upsert({ id: 1, ...form, updated_at: new Date().toISOString() }, { onConflict: 'id' });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-8 space-y-6">
      <div><h3 className="font-black text-slate-900 text-lg">About Page Headings</h3><p className="text-slate-500 text-sm">Configure headers and introduction paragraphs on About page</p></div>
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Hero Title</label>
          <input type="text" value={form.header_title || ''} onChange={e => setForm(f => ({ ...f, header_title: e.target.value }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Hero Description</label>
          <textarea rows={2} value={form.header_description || ''} onChange={e => setForm(f => ({ ...f, header_description: e.target.value }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none resize-none" />
        </div>
        <div className="border-t pt-6">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Introduction Section Title</label>
          <input type="text" value={form.intro_title || ''} onChange={e => setForm(f => ({ ...f, intro_title: e.target.value }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Introduction Paragraph 1</label>
          <textarea rows={3} value={form.intro_desc_1 || ''} onChange={e => setForm(f => ({ ...f, intro_desc_1: e.target.value }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none resize-none" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Introduction Paragraph 2</label>
          <textarea rows={3} value={form.intro_desc_2 || ''} onChange={e => setForm(f => ({ ...f, intro_desc_2: e.target.value }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none resize-none" />
        </div>
      </div>
      <button onClick={handleSave} disabled={saving} className={`flex items-center space-x-2 px-8 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-md cursor-pointer ${saved ? 'bg-emerald-500 text-white' : 'bg-gradient-to-r from-primary to-accent text-white shadow-primary/20 hover:scale-[1.02]'}`}>
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        <span>{saving ? 'Saving...' : saved ? 'Saved Successfully!' : 'Save Headers Content'}</span>
      </button>
    </div>
  );
}

// ─── About Ideals Tab ───────────────────────────────────────────────────────
function AboutIdealsTab() {
  const [ideals, setIdeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', order_index: 0 });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('about_page_ideals').select('*').order('order_index');
    setIdeals(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setForm({ title: '', description: '', order_index: ideals.length }); setModal('add'); };
  const openEdit = (i) => { setForm({ ...i }); setModal(i); };

  const handleSave = async () => {
    setSaving(true);
    if (modal === 'add') { await supabase.from('about_page_ideals').insert([form]); }
    else { await supabase.from('about_page_ideals').update(form).eq('id', modal.id); }
    setSaving(false); setModal(null); load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this ideal?')) return;
    await supabase.from('about_page_ideals').delete().eq('id', id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h3 className="font-black text-slate-900 text-lg">About Page Core Ideals</h3><p className="text-slate-500 text-sm">Configure Core Ideals list displayed in the about page intro card</p></div>
        <button onClick={openAdd} className="flex items-center space-x-2 bg-gradient-to-r from-primary to-accent text-white font-bold px-5 py-2.5 rounded-2xl hover:scale-105 transition-transform shadow-md shadow-primary/20 cursor-pointer text-sm">
          <Plus className="w-4 h-4" /><span>Add Ideal</span>
        </button>
      </div>
      {loading ? <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div> :
        ideals.length === 0 ? <div className="text-center py-16 bg-white rounded-3xl border border-dashed"><ShieldCheck className="w-10 h-10 mx-auto mb-3 text-slate-300" /><p className="text-slate-400 text-sm font-semibold">No ideals yet.</p></div> :
        <div className="grid gap-4">
          {ideals.map((i, idx) => (
            <div key={i.id} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-start space-x-4 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold">{idx + 1}</div>
              <div className="flex-1 min-w-0"><p className="font-bold text-slate-900">{i.title}</p><p className="text-slate-400 text-xs mt-0.5">{i.description}</p><p className="text-[10px] text-slate-300 mt-1 font-bold">Order index: {i.order_index}</p></div>
              <div className="flex items-center space-x-2 shrink-0">
                <button onClick={() => openEdit(i)} className="w-8 h-8 rounded-xl bg-blue-50 text-blue-500 hover:bg-blue-100 flex items-center justify-center cursor-pointer"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(i.id)} className="w-8 h-8 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      }
      {modal && (
        <Modal title={modal === 'add' ? 'Add Ideal' : 'Edit Ideal'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Ideal Title</label>
              <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Ideal Description</label>
              <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none resize-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Order Index</label>
              <input type="number" value={form.order_index} onChange={e => setForm(f => ({ ...f, order_index: parseInt(e.target.value) || 0 }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none" />
            </div>
            <button onClick={handleSave} disabled={saving} className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-3.5 rounded-2xl hover:scale-[1.02] transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}<span>Save Ideal</span>
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── About Mission & Vision Tab ─────────────────────────────────────────────
function AboutMissionTab() {
  const defaultForm = {
    mission_text: 'To simplify high-volume digital mailing by delivering reliable, self-scalable SMTP relays and analytical campaign creators...',
    vision_text: 'To stand as the leading global infrastructure network for automated and transactional email deliveries...'
  };
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase.from('about_page_mission_vision').select('*').eq('id', 1).maybeSingle();
      if (data) setForm(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await supabase.from('about_page_mission_vision').upsert({ id: 1, ...form, updated_at: new Date().toISOString() }, { onConflict: 'id' });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-8 space-y-6">
      <div><h3 className="font-black text-slate-900 text-lg">Mission & Vision Statements</h3><p className="text-slate-500 text-sm">Configure Mission and Vision text blocks on About page</p></div>
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center space-x-1.5"><Target className="w-4 h-4 text-primary" /><span>Our Mission Text</span></label>
          <textarea rows={4} value={form.mission_text || ''} onChange={e => setForm(f => ({ ...f, mission_text: e.target.value }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none resize-none" />
        </div>
        <div className="border-t pt-6">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center space-x-1.5"><Eye className="w-4 h-4 text-secondary" /><span>Our Vision Text</span></label>
          <textarea rows={4} value={form.vision_text || ''} onChange={e => setForm(f => ({ ...f, vision_text: e.target.value }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none resize-none" />
        </div>
      </div>
      <button onClick={handleSave} disabled={saving} className={`flex items-center space-x-2 px-8 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-md cursor-pointer ${saved ? 'bg-emerald-500 text-white' : 'bg-gradient-to-r from-primary to-accent text-white shadow-primary/20 hover:scale-[1.02]'}`}>
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        <span>{saving ? 'Saving...' : saved ? 'Saved Successfully!' : 'Save Mission & Vision'}</span>
      </button>
    </div>
  );
}

// ─── About Expertise Tab ────────────────────────────────────────────────────
function AboutExpertiseTab() {
  const [headerForm, setHeaderForm] = useState({ title: '', description: '' });
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingHeader, setSavingHeader] = useState(false);
  const [savedHeader, setSavedHeader] = useState(false);
  const [modal, setModal] = useState(null);
  const [cardForm, setCardForm] = useState({ title: '', description: '', order_index: 0 });
  const [savingCard, setSavingCard] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [headerRes, cardsRes] = await Promise.all([
      supabase.from('about_page_expertise').select('*').eq('id', 1).maybeSingle(),
      supabase.from('about_page_expertise_cards').select('*').order('order_index')
    ]);
    if (headerRes.data) setHeaderForm(headerRes.data);
    setCards(cardsRes.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSaveHeader = async () => {
    setSavingHeader(true);
    await supabase.from('about_page_expertise').upsert({ id: 1, ...headerForm, updated_at: new Date().toISOString() }, { onConflict: 'id' });
    setSavingHeader(false); setSavedHeader(true); setTimeout(() => setSavedHeader(false), 2000);
  };

  const openAdd = () => { setCardForm({ title: '', description: '', order_index: cards.length }); setModal('add'); };
  const openEdit = (c) => { setCardForm({ ...c }); setModal(c); };

  const handleSaveCard = async () => {
    setSavingCard(true);
    if (modal === 'add') { await supabase.from('about_page_expertise_cards').insert([cardForm]); }
    else { await supabase.from('about_page_expertise_cards').update(cardForm).eq('id', modal.id); }
    setSavingCard(false); setModal(null); loadData();
  };

  const handleDeleteCard = async (id) => {
    if (!confirm('Delete this card?')) return;
    await supabase.from('about_page_expertise_cards').delete().eq('id', id);
    loadData();
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-8">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl border border-slate-100 p-8 space-y-6">
        <div><h3 className="font-black text-slate-900 text-lg">Expertise Section Headers</h3><p className="text-slate-500 text-sm">Configure section title and main description</p></div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Title</label>
            <input type="text" value={headerForm.title || ''} onChange={e => setHeaderForm(f => ({ ...f, title: e.target.value }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description Text</label>
            <textarea rows={2} value={headerForm.description || ''} onChange={e => setHeaderForm(f => ({ ...f, description: e.target.value }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none resize-none" />
          </div>
        </div>
        <button onClick={handleSaveHeader} disabled={savingHeader} className={`flex items-center space-x-2 px-8 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-md cursor-pointer ${savedHeader ? 'bg-emerald-500 text-white' : 'bg-gradient-to-r from-primary to-accent text-white shadow-primary/20 hover:scale-[1.02]'}`}>
          {savingHeader ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{savingHeader ? 'Saving...' : savedHeader ? 'Saved Successfully!' : 'Save Expertise Headers'}</span>
        </button>
      </div>

      {/* Expertise Cards List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h4 className="font-black text-slate-900 text-lg">Expertise Grid Cards</h4><p className="text-slate-500 text-sm">Manage the three card blocks explaining specific technologies</p></div>
          <button onClick={openAdd} className="flex items-center space-x-2 bg-gradient-to-r from-primary to-accent text-white font-bold px-5 py-2.5 rounded-2xl hover:scale-105 transition-transform shadow-md shadow-primary/20 cursor-pointer text-sm">
            <Plus className="w-4 h-4" /><span>Add Expertise Card</span>
          </button>
        </div>
        {cards.length === 0 ? <div className="text-center py-16 bg-white rounded-3xl border border-dashed"><Briefcase className="w-10 h-10 mx-auto mb-3 text-slate-300" /><p className="text-slate-400 text-sm font-semibold">No cards yet.</p></div> :
          <div className="grid gap-4">
            {cards.map(c => (
              <div key={c.id} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-start space-x-4 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0"><Briefcase className="w-5 h-5" /></div>
                <div className="flex-1 min-w-0"><p className="font-bold text-slate-900">{c.title}</p><p className="text-slate-400 text-xs mt-0.5">{c.description}</p><p className="text-[10px] text-slate-300 mt-1 font-bold">Order index: {c.order_index}</p></div>
                <div className="flex items-center space-x-2 shrink-0">
                  <button onClick={() => openEdit(c)} className="w-8 h-8 rounded-xl bg-blue-50 text-blue-500 hover:bg-blue-100 flex items-center justify-center cursor-pointer"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDeleteCard(c.id)} className="w-8 h-8 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        }
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Add Expertise Card' : 'Edit Expertise Card'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Card Title</label>
              <input type="text" value={cardForm.title} onChange={e => setCardForm(f => ({ ...f, title: e.target.value }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Card Description</label>
              <textarea rows={3} value={cardForm.description} onChange={e => setCardForm(f => ({ ...f, description: e.target.value }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none resize-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Order Index</label>
              <input type="number" value={cardForm.order_index} onChange={e => setCardForm(f => ({ ...f, order_index: parseInt(e.target.value) || 0 }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none" />
            </div>
            <button onClick={handleSaveCard} disabled={savingCard} className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-3.5 rounded-2xl hover:scale-[1.02] transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60">
              {savingCard ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}<span>Save Card</span>
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── About Achievements Tab ─────────────────────────────────────────────────
const achievementColorsList = ['text-primary', 'text-highlight', 'text-secondary', 'text-accent'];
const achievementIconsList = ['MailCheck', 'ShieldCheck', 'Trophy', 'Users', 'Target', 'Eye', 'Mail', 'Clock', 'PhoneCall', 'Coins'];

function AboutAchievementsTab() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ value: '', label: '', icon_name: 'MailCheck', color: 'text-primary', order_index: 0 });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('about_page_achievements').select('*').order('order_index');
    setAchievements(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setForm({ value: '', label: '', icon_name: 'MailCheck', color: 'text-primary', order_index: achievements.length }); setModal('add'); };
  const openEdit = (a) => { setForm({ ...a }); setModal(a); };

  const handleSave = async () => {
    setSaving(true);
    if (modal === 'add') { await supabase.from('about_page_achievements').insert([form]); }
    else { await supabase.from('about_page_achievements').update(form).eq('id', modal.id); }
    setSaving(false); setModal(null); load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this achievement?')) return;
    await supabase.from('about_page_achievements').delete().eq('id', id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h3 className="font-black text-slate-900 text-lg">About Achievements</h3><p className="text-slate-500 text-sm">Manage dynamic metrics (Success Nodes) shown on About page</p></div>
        <button onClick={openAdd} className="flex items-center space-x-2 bg-gradient-to-r from-primary to-accent text-white font-bold px-5 py-2.5 rounded-2xl hover:scale-105 transition-transform shadow-md shadow-primary/20 cursor-pointer text-sm">
          <Plus className="w-4 h-4" /><span>Add Achievement</span>
        </button>
      </div>
      {loading ? <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div> :
        achievements.length === 0 ? <div className="text-center py-16 bg-white rounded-3xl border border-dashed"><Trophy className="w-10 h-10 mx-auto mb-3 text-slate-300" /><p className="text-slate-400 text-sm font-semibold">No achievements yet.</p></div> :
        <div className="grid gap-4">
          {achievements.map(a => {
            const Icon = Lucide[a.icon_name] || Trophy;
            return (
              <div key={a.id} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-start space-x-4 hover:shadow-md transition-all">
                <div className={`w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 ${a.color}`}><Icon className="w-5 h-5" /></div>
                <div className="flex-1 min-w-0"><p className="font-bold text-slate-900 text-lg">{a.value}</p><p className="text-slate-500 font-bold text-xs">{a.label}</p><p className="text-[10px] text-slate-300 mt-1 font-bold">Order index: {a.order_index} | Color: {a.color} | Icon: {a.icon_name}</p></div>
                <div className="flex items-center space-x-2 shrink-0">
                  <button onClick={() => openEdit(a)} className="w-8 h-8 rounded-xl bg-blue-50 text-blue-500 hover:bg-blue-100 flex items-center justify-center cursor-pointer"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(a.id)} className="w-8 h-8 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            );
          })}
        </div>
      }
      {modal && (
        <Modal title={modal === 'add' ? 'Add Achievement' : 'Edit Achievement'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Value (e.g. 5B+)</label>
                <input type="text" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Label (e.g. Average Delivery Rate)</label>
                <input type="text" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Icon</label>
                <select value={form.icon_name} onChange={e => setForm(f => ({ ...f, icon_name: e.target.value }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm bg-white focus:outline-none">
                  {achievementIconsList.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Color Theme</label>
                <select value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm bg-white focus:outline-none">
                  {achievementColorsList.map(c => <option key={c} value={c}>{c.replace('text-', '')}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Order Index</label>
                <input type="number" value={form.order_index} onChange={e => setForm(f => ({ ...f, order_index: parseInt(e.target.value) || 0 }))} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none" />
              </div>
            </div>
            <button onClick={handleSave} disabled={saving} className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-3.5 rounded-2xl hover:scale-[1.02] transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}<span>Save Achievement</span>
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

  const generalTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'hero', label: 'Hero Slides', icon: Images },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'pricing', label: 'Pricing', icon: Tag },
    { id: 'demo_videos', label: 'Demo Videos', icon: Play },
    { id: 'contact_info', label: 'Contact Info', icon: BookUser },
  ];

  const homepageTabs = [
    { id: 'home_about', label: 'Home About Details', icon: BookUser },
    { id: 'home_benefits', label: 'Home Benefits', icon: ShieldCheck },
    { id: 'home_stats', label: 'Home Stats Banner', icon: TrendingUp },
    { id: 'home_testimonials', label: 'Home Testimonials', icon: Users },
    { id: 'home_faqs', label: 'Home FAQs', icon: HelpCircle },
  ];

  const aboutpageTabs = [
    { id: 'about_headers', label: 'About Page Headers', icon: BookUser },
    { id: 'about_ideals', label: 'About Page Ideals', icon: ShieldCheck },
    { id: 'about_mission', label: 'About Mission & Vision', icon: Eye },
    { id: 'about_expertise', label: 'About Tech Expertise', icon: Briefcase },
    { id: 'about_achievements', label: 'About Success Stats', icon: Trophy },
  ];

  const allTabs = [...generalTabs, ...homepageTabs, ...aboutpageTabs];

  const renderTabButton = (tab) => {
    const Icon = tab.icon;
    const active = activeTab === tab.id;
    return (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
          active ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25' : 'text-slate-400 hover:text-white hover:bg-slate-800'
        }`}
      >
        <Icon className="w-4 h-4 shrink-0" />
        <span>{tab.label}</span>
      </button>
    );
  };

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
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2 px-4">Core Settings</p>
            <div className="space-y-1">
              {generalTabs.map(tab => renderTabButton(tab))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2 px-4">Homepage Editor</p>
            <div className="space-y-1">
              {homepageTabs.map(tab => renderTabButton(tab))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2 px-4">About Page Editor</p>
            <div className="space-y-1">
              {aboutpageTabs.map(tab => renderTabButton(tab))}
            </div>
          </div>
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
      <main className="ml-64 min-h-screen w-[calc(100%-16rem)]">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-100 px-8 py-5 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-black text-xl text-slate-900">
                {allTabs.find(t => t.id === activeTab)?.label}
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
        <div className="p-8 max-w-5xl">
          {activeTab === 'dashboard' && <DashboardTab />}
          {activeTab === 'hero' && <HeroSlidesTab />}
          {activeTab === 'services' && <ServicesTab />}
          {activeTab === 'pricing' && <PricingTab />}
          {activeTab === 'demo_videos' && <DemoVideosTab />}
          {activeTab === 'contact_info' && <ContactInfoTab />}
          {activeTab === 'home_about' && <HomeAboutTab />}
          {activeTab === 'home_benefits' && <HomeBenefitsTab />}
          {activeTab === 'home_stats' && <HomeStatsTab />}
          {activeTab === 'home_testimonials' && <HomeTestimonialsTab />}
          {activeTab === 'home_faqs' && <HomeFaqsTab />}
          {activeTab === 'about_headers' && <AboutHeadersTab />}
          {activeTab === 'about_ideals' && <AboutIdealsTab />}
          {activeTab === 'about_mission' && <AboutMissionTab />}
          {activeTab === 'about_expertise' && <AboutExpertiseTab />}
          {activeTab === 'about_achievements' && <AboutAchievementsTab />}
        </div>
      </main>
    </div>
  );
}

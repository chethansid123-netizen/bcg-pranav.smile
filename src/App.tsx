import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  Calculator, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Plus,
  Search,
  ChevronRight,
  Building2,
  DollarSign,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Lead, BankOffer, UserRole, LeadStatus } from './types';

// --- Components ---

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }: any) => {
  const base = "px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50";
  const variants: any = {
    primary: "bg-black text-white hover:bg-zinc-800",
    secondary: "bg-white border border-zinc-200 text-zinc-900 hover:bg-zinc-50",
    ghost: "text-zinc-600 hover:bg-zinc-100",
    danger: "bg-red-50 text-red-600 hover:bg-red-100"
  };
  return (
    <button disabled={disabled} onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Card = ({ children, className = '' }: any) => (
  <div className={`bg-white border border-zinc-100 rounded-2xl shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

const Badge = ({ status }: { status: LeadStatus }) => {
  const colors: Record<string, string> = {
    NEW: "bg-blue-50 text-blue-600",
    ASSIGNED: "bg-indigo-50 text-indigo-600",
    IN_REVIEW: "bg-amber-50 text-amber-600",
    DOCS_PENDING: "bg-orange-50 text-orange-600",
    DOCS_VERIFIED: "bg-emerald-50 text-emerald-600",
    CREDIT_APPROVED: "bg-green-50 text-green-600",
    SANCTIONED: "bg-purple-50 text-purple-600",
    DISBURSED: "bg-zinc-900 text-white",
    REJECTED: "bg-red-50 text-red-600",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${colors[status] || 'bg-zinc-100'}`}>
      {status.replace('_', ' ')}
    </span>
  );
};

// --- Views ---

const LoginView = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      const user = await res.json();
      onLogin(user);
    } else {
      setError('Invalid credentials. Try admin@gcbp.com / admin123');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black text-white rounded-2xl mb-4 shadow-xl">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">GCBP Mortgage</h1>
          <p className="text-zinc-500 mt-2">Sign in to manage your mortgage journey</p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                placeholder="name@company.com"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                placeholder="••••••••"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button className="w-full py-4 rounded-xl">Sign In</Button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-zinc-100">
            <p className="text-xs text-center text-zinc-400 font-medium">DEMO ACCOUNTS</p>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {['admin@gcbp.com', 'sales@gcbp.com', 'credit@gcbp.com', 'customer@example.com'].map(acc => (
                <button 
                  key={acc}
                  onClick={() => { setEmail(acc); setPassword(acc.split('@')[0] === 'admin' ? 'admin123' : acc.split('@')[0] === 'sales' ? 'sales123' : acc.split('@')[0] === 'credit' ? 'credit123' : 'cust123'); }}
                  className="text-[10px] bg-zinc-50 hover:bg-zinc-100 p-2 rounded-lg text-zinc-600 transition-colors"
                >
                  {acc.split('@')[0].toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

const EMICalculator = () => {
  const [amount, setAmount] = useState(5000000);
  const [roi, setRoi] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const r = roi / (12 * 100);
  const n = tenure * 12;
  const emi = Math.round((amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  const totalPayment = emi * n;
  const totalInterest = totalPayment - amount;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
        <Calculator size={20} className="text-zinc-400" />
        EMI Calculator
      </h3>
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-zinc-600">Loan Amount</label>
            <span className="text-sm font-bold">₹{amount.toLocaleString()}</span>
          </div>
          <input type="range" min="100000" max="100000000" step="100000" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full accent-black" />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-zinc-600">Interest Rate (%)</label>
            <span className="text-sm font-bold">{roi}%</span>
          </div>
          <input type="range" min="5" max="20" step="0.1" value={roi} onChange={(e) => setRoi(Number(e.target.value))} className="w-full accent-black" />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-zinc-600">Tenure (Years)</label>
            <span className="text-sm font-bold">{tenure} Yrs</span>
          </div>
          <input type="range" min="1" max="30" step="1" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} className="w-full accent-black" />
        </div>

        <div className="bg-zinc-50 rounded-2xl p-6 mt-8">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Monthly EMI</p>
              <p className="text-2xl font-bold text-zinc-900">₹{emi.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Total Interest</p>
              <p className="text-2xl font-bold text-zinc-900">₹{totalInterest.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

const CustomerDashboard = ({ user }: { user: User }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [showApply, setShowApply] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    phone: '',
    email: user.email,
    pan: '',
    aadhar: '',
    income: 100000,
    property_value: 5000000,
    loan_amount: 4000000,
    tenure: 20
  });

  const fetchLeads = async () => {
    const res = await fetch(`/api/leads?role=CUSTOMER&userId=${user.id}`);
    const data = await res.json();
    setLeads(data);
  };

  useEffect(() => { fetchLeads(); }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, customer_id: user.id })
    });
    if (res.ok) {
      setShowApply(false);
      fetchLeads();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user.name.split(' ')[0]}</h2>
          <p className="text-zinc-500 mt-1">Track your mortgage applications and explore offers.</p>
        </div>
        <Button onClick={() => setShowApply(true)} className="rounded-xl px-6">
          <Plus size={18} /> Apply New Loan
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Your Applications</h3>
          {leads.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-zinc-300" />
              </div>
              <p className="text-zinc-500">No active applications found.</p>
              <Button onClick={() => setShowApply(true)} variant="secondary" className="mt-4 mx-auto">Start your first application</Button>
            </Card>
          ) : (
            leads.map(lead => (
              <Card key={lead.id} className="p-6 hover:border-zinc-300 transition-all cursor-pointer group">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-zinc-900 text-white rounded-xl flex items-center justify-center font-bold">
                      ₹{(lead.loan_amount / 100000).toFixed(1)}L
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900">Home Loan Application #{lead.id}</h4>
                      <p className="text-sm text-zinc-500">{new Date(lead.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Badge status={lead.status} />
                </div>
                <div className="mt-6 flex items-center gap-8">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Property Value</span>
                    <span className="font-semibold">₹{lead.property_value.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Tenure</span>
                    <span className="font-semibold">{lead.tenure} Years</span>
                  </div>
                  <div className="ml-auto">
                    <ArrowRight size={20} className="text-zinc-300 group-hover:text-black transition-colors" />
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
        <div className="space-y-6">
          <EMICalculator />
          <Card className="p-6 bg-zinc-900 text-white border-none">
            <h4 className="font-bold mb-2">Need Help?</h4>
            <p className="text-zinc-400 text-sm mb-4">Our relationship managers are available 24/7 to assist you.</p>
            <Button variant="secondary" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">Chat with RM</Button>
          </Card>
        </div>
      </div>

      <AnimatePresence>
        {showApply && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl"
            >
              <Card className="p-8 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold">Loan Application</h2>
                  <button onClick={() => setShowApply(false)} className="text-zinc-400 hover:text-black">✕</button>
                </div>
                <form onSubmit={handleApply} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Personal Details</h3>
                    <input placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 rounded-xl border border-zinc-200 outline-none focus:ring-2 focus:ring-black" required />
                    <input placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-3 rounded-xl border border-zinc-200 outline-none focus:ring-2 focus:ring-black" required />
                    <input placeholder="PAN Number" value={formData.pan} onChange={e => setFormData({...formData, pan: e.target.value})} className="w-full p-3 rounded-xl border border-zinc-200 outline-none focus:ring-2 focus:ring-black" required />
                    <input placeholder="Aadhar Number" value={formData.aadhar} onChange={e => setFormData({...formData, aadhar: e.target.value})} className="w-full p-3 rounded-xl border border-zinc-200 outline-none focus:ring-2 focus:ring-black" required />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Financial Details</h3>
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Monthly Income</label>
                      <input type="number" value={formData.income} onChange={e => setFormData({...formData, income: Number(e.target.value)})} className="w-full p-3 rounded-xl border border-zinc-200 outline-none focus:ring-2 focus:ring-black" required />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Property Value</label>
                      <input type="number" value={formData.property_value} onChange={e => setFormData({...formData, property_value: Number(e.target.value)})} className="w-full p-3 rounded-xl border border-zinc-200 outline-none focus:ring-2 focus:ring-black" required />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Loan Amount</label>
                      <input type="number" value={formData.loan_amount} onChange={e => setFormData({...formData, loan_amount: Number(e.target.value)})} className="w-full p-3 rounded-xl border border-zinc-200 outline-none focus:ring-2 focus:ring-black" required />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Tenure (Years)</label>
                      <input type="number" value={formData.tenure} onChange={e => setFormData({...formData, tenure: Number(e.target.value)})} className="w-full p-3 rounded-xl border border-zinc-200 outline-none focus:ring-2 focus:ring-black" required />
                    </div>
                  </div>
                  <div className="md:col-span-2 pt-4">
                    <Button className="w-full py-4 rounded-xl">Submit Application</Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SalesDashboard = ({ user }: { user: User }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const fetchLeads = async () => {
    const res = await fetch('/api/leads?role=SALES_AGENT');
    const data = await res.json();
    setLeads(data);
  };

  useEffect(() => { fetchLeads(); }, []);

  const updateStatus = async (id: number, status: LeadStatus) => {
    await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchLeads();
    setSelectedLead(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sales Pipeline</h2>
          <p className="text-zinc-500 mt-1">Manage leads and drive conversions.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input placeholder="Search leads..." className="pl-10 pr-4 py-2 rounded-lg border border-zinc-200 outline-none focus:ring-2 focus:ring-black w-64" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-blue-50 border-blue-100">
          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">New Leads</p>
          <p className="text-2xl font-bold text-blue-900">{leads.filter(l => l.status === 'NEW').length}</p>
        </Card>
        <Card className="p-4 bg-amber-50 border-amber-100">
          <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">In Review</p>
          <p className="text-2xl font-bold text-amber-900">{leads.filter(l => l.status === 'IN_REVIEW').length}</p>
        </Card>
        <Card className="p-4 bg-emerald-50 border-emerald-100">
          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Approved</p>
          <p className="text-2xl font-bold text-emerald-900">{leads.filter(l => l.status === 'CREDIT_APPROVED').length}</p>
        </Card>
        <Card className="p-4 bg-zinc-900 border-none">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Disbursed</p>
          <p className="text-2xl font-bold text-white">{leads.filter(l => l.status === 'DISBURSED').length}</p>
        </Card>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-bottom border-zinc-100 bg-zinc-50/50">
                <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Customer</th>
                <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Loan Details</th>
                <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
                <th className="p-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Applied On</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {leads.map(lead => (
                <tr key={lead.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-zinc-900">{lead.name}</div>
                    <div className="text-xs text-zinc-500">{lead.phone}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold">₹{lead.loan_amount.toLocaleString()}</div>
                    <div className="text-xs text-zinc-500">{lead.tenure} Yrs @ {lead.income.toLocaleString()}/mo</div>
                  </td>
                  <td className="p-4">
                    <Badge status={lead.status} />
                  </td>
                  <td className="p-4 text-sm text-zinc-500">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" onClick={() => setSelectedLead(lead)}>
                      Manage <ChevronRight size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <AnimatePresence>
        {selectedLead && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-end">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="w-full max-w-md h-full bg-white shadow-2xl p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Lead Details</h2>
                <button onClick={() => setSelectedLead(null)} className="text-zinc-400 hover:text-black">✕</button>
              </div>
              
              <div className="space-y-8">
                <section>
                  <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Customer Info</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-zinc-500">PAN</p>
                      <p className="font-semibold">{selectedLead.pan}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Aadhar</p>
                      <p className="font-semibold">{selectedLead.aadhar}</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Actions</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedLead.status === 'NEW' && (
                      <Button onClick={() => updateStatus(selectedLead.id, 'ASSIGNED')} className="w-full">Assign to RM</Button>
                    )}
                    {selectedLead.status === 'ASSIGNED' && (
                      <Button onClick={() => updateStatus(selectedLead.id, 'IN_REVIEW')} className="w-full">Push to Credit</Button>
                    )}
                    {selectedLead.status === 'CREDIT_APPROVED' && (
                      <Button onClick={() => updateStatus(selectedLead.id, 'SANCTIONED')} className="w-full">Generate Sanction</Button>
                    )}
                    <Button variant="danger" onClick={() => updateStatus(selectedLead.id, 'REJECTED')} className="w-full">Reject Lead</Button>
                  </div>
                </section>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CreditDashboard = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [banks, setBanks] = useState<BankOffer[]>([]);

  const fetchData = async () => {
    const [lRes, bRes] = await Promise.all([
      fetch('/api/leads?role=CREDIT_ANALYST'),
      fetch('/api/banks')
    ]);
    setLeads(await lRes.json());
    setBanks(await bRes.json());
  };

  useEffect(() => { fetchData(); }, []);

  const approveLead = async (id: number) => {
    await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'CREDIT_APPROVED' })
    });
    fetchData();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Credit Analysis</h2>
        <p className="text-zinc-500 mt-1">Review eligibility and recommend bank partners.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Pending Reviews</h3>
          {leads.map(lead => {
            const eligibleBanks = banks.filter(b => lead.income >= b.min_income);
            const bestBank = eligibleBanks[0];

            return (
              <Card key={lead.id} className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="font-bold text-lg">{lead.name}</h4>
                    <p className="text-sm text-zinc-500">Income: ₹{lead.income.toLocaleString()} | Loan: ₹{lead.loan_amount.toLocaleString()}</p>
                  </div>
                  <Badge status={lead.status} />
                </div>

                <div className="bg-zinc-50 rounded-xl p-4 mb-6">
                  <h5 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Automated Recommendation</h5>
                  {bestBank ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg border border-zinc-200 flex items-center justify-center">
                          <Building2 size={20} className="text-zinc-400" />
                        </div>
                        <div>
                          <p className="font-bold">{bestBank.bank_name}</p>
                          <p className="text-xs text-zinc-500">ROI: {bestBank.roi}% | Fee: {bestBank.processing_fee}%</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-emerald-600 font-bold uppercase">Highly Eligible</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-red-500">No matching banks found for this income level.</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button onClick={() => approveLead(lead.id)} disabled={!bestBank} className="flex-1">Approve & Recommend</Button>
                  <Button variant="secondary" className="flex-1">Request More Docs</Button>
                </div>
              </Card>
            );
          })}
        </div>
        
        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Bank Partners</h3>
          {banks.map(bank => (
            <Card key={bank.id} className="p-4">
              <div className="flex justify-between items-center">
                <div className="font-bold">{bank.bank_name}</div>
                <div className="text-emerald-600 font-bold">{bank.roi}%</div>
              </div>
              <div className="mt-2 flex justify-between text-xs text-zinc-500">
                <span>Min Income: ₹{bank.min_income.toLocaleString()}</span>
                <span>Max Tenure: {bank.max_tenure}Y</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user) {
    return <LoginView onLogin={setUser} />;
  }

  const renderContent = () => {
    switch (user.role) {
      case 'CUSTOMER': return <CustomerDashboard user={user} />;
      case 'SALES_AGENT': return <SalesDashboard user={user} />;
      case 'CREDIT_ANALYST': return <CreditDashboard />;
      case 'ADMIN': return <SalesDashboard user={user} />; // Admin sees all for now
      default: return <div className="p-12 text-center text-zinc-400">Dashboard for {user.role} coming soon...</div>;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Applications', icon: FileText },
    { id: 'users', label: 'Team', icon: Users, roles: ['ADMIN', 'SALES_AGENT'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['ADMIN'] },
  ].filter(item => !item.roles || item.roles.includes(user.role));

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-sans text-zinc-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-zinc-100 flex flex-col fixed h-full">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center shadow-lg">
              <ShieldCheck size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight">GCBP</span>
          </div>
          
          <nav className="space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === item.id 
                    ? 'bg-zinc-900 text-white shadow-md' 
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-zinc-50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center font-bold text-zinc-600">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user.name}</p>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{user.role.replace('_', ' ')}</p>
            </div>
          </div>
          <button 
            onClick={() => setUser(null)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-12">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </main>
    </div>
  );
}

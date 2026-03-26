import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Wallet, UserCircle, LogIn, UserPlus, 
  TrendingUp, Zap, Clock3, Gift, Star, Target, CheckCircle2, 
  AlertCircle, X, ArrowUpRight, ShieldCheck, Lock, Unlock, Sparkles,
  ChevronRight, Award
} from 'lucide-react';

const API_URL = "https://betting-app-backend-ymji.onrender.com/api/users";

// running

export default function App() {
  const [user, setUser] = useState(null); 
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [modal, setModal] = useState({ 
    show: false, type: 'success', title: '', message: '', onConfirm: null, isRecharge: false 
  });

  // Keep Login Persistent
  useEffect(() => {
    const savedId = localStorage.getItem('userId');
    if (savedId && !user) {
      axios.get(`${API_URL}/profile/${savedId}`)
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('userId'));
    }
  }, []);

  const isAdmin = user?.email === "solarpanel13579@gmail.com";

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? 'login' : 'register';
    const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { ...formData };
    
    try {
      const res = await axios.post(`${API_URL}/${endpoint}`, formData);
      if (isLogin) {
        setUser(res.data.user);
        localStorage.setItem('userId', res.data.user.id || res.data.user._id);
      } else {
        setModal({ show: true, type: 'success', title: 'Success', message: 'Registration complete. Please login.' });
        setIsLogin(true);
      }
    } catch (err) {
      setModal({ show: true, type: 'error', title: 'Error', message: err.response?.data?.message || "Auth Error" });
    }
  };

  const handleRecharge = () => {
    setModal({
      show: true,
      type: 'input',
      isRecharge: true,
      title: 'Deposit Funds',
      message: 'Scan QR and enter Payment Details',
      onConfirm: async (data) => {
        try {
          await axios.post(`${API_URL}/request-recharge`, { 
            userId: user._id || user.id, 
            amount: data.amount, 
            transactionId: data.utr 
          });
          setModal({ show: true, type: 'success', title: 'Submitted', message: 'Verification takes 10-30 minutes.' });
        } catch (err) {
          setModal({ show: true, type: 'error', title: 'Error', message: 'Transaction ID already exists or invalid.' });
        }
      }
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white overflow-hidden relative app-background">
        {/* Ambient Glows */}
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-amber-500/20 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full"></div>
        
        <CustomModal modal={modal} setModal={setModal} />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-slate-900/50 backdrop-blur-2xl rounded-[40px] shadow-2xl p-10 border border-white/10 relative z-10"
        >
          <div className="flex justify-center mb-8 relative">
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }} 
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute inset-0 bg-amber-400 blur-3xl opacity-20 rounded-full"
            ></motion.div>
            <img src="/logo.png" alt="Logo" className="w-24 h-24 rounded-full border-4 border-slate-800 relative z-10 shadow-2xl"/>
          </div>
          <h2 className="text-3xl font-black text-white mb-2 text-center italic tracking-tighter uppercase">SAPPHIRE</h2>
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <>
                <input type="text" placeholder="Full Name" className="w-full p-4 bg-slate-800/50 text-white rounded-2xl border border-white/5 outline-none focus:border-amber-400/50 transition-all" onChange={e => setFormData({...formData, name: e.target.value})} />
                <input type="text" placeholder="Phone" className="w-full p-4 bg-slate-800/50 text-white rounded-2xl border border-white/5 outline-none focus:border-amber-400/50 transition-all" onChange={e => setFormData({...formData, phone: e.target.value})} />
                <input 
                    type="text" 
                    placeholder="Referral Code (Optional)" 
                    className="w-full p-4 bg-slate-800/50 text-white rounded-2xl border border-white/5 outline-none focus:border-amber-400/50 transition-all" 
                    onChange={e => setFormData({...formData, referralCode: e.target.value})} 
                />
              </>
            )}
            <input type="email" placeholder="Email" className="w-full p-4 bg-slate-800/50 text-white rounded-2xl border border-white/5 outline-none focus:border-amber-400/50 transition-all" onChange={e => setFormData({...formData, email: e.target.value})} />
            <input type="password" placeholder="Password" className="w-full p-4 bg-slate-800/50 text-white rounded-2xl border border-white/5 outline-none focus:border-amber-400/50 transition-all" onChange={e => setFormData({...formData, password: e.target.value})} />
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-amber-400/20"
            >
              {isLogin ? "Login Now" : "Create Account"}
            </motion.button>
          </form>
          <p className="mt-8 text-center text-slate-500 text-xs font-bold cursor-pointer hover:text-amber-400 transition-colors" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "DON'T HAVE AN ACCOUNT? JOIN" : "ALREADY A MEMBER? SIGN IN"}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-32 text-white font-sans selection:bg-amber-400 selection:text-black overflow-hidden relative app-background">
      {/* Background Subtle Logo Watermark */}
      <style>{`
        .app-background::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url('/logo.jpg');
          background-size: cover;
          background-position: center;
          opacity: 0.03; /* Extremely low opacity for background */
          filter: blur(10px); /* Subtly blurred background logo */
          z-index: 0;
          pointer-events: none;
        }
      `}</style>
      
      <CustomModal modal={modal} setModal={setModal} />

      {/* Glass Header */}
      <div className="sticky top-0 z-40 bg-slate-950/60 backdrop-blur-xl border-b border-white/5 p-6 rounded-b-[40px]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3 relative z-10">
             <div className="w-12 h-12 rounded-full border-2 border-amber-400 p-0.5 shadow-lg shadow-amber-400/20">
               <img src="/logo.png" className="w-full h-full object-cover rounded-full" alt="Profile" />
             </div>
             <div>
               <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest leading-none mb-1">{isAdmin ? 'System Admin' : 'Premium Member'}</p>
               <h2 className="text-base font-bold tracking-tight">{user.name}</h2>
             </div>
          </div>
          <motion.button 
            whileTap={{ rotate: 90 }}
            onClick={() => { setUser(null); localStorage.clear(); }} 
            className="p-2.5 bg-slate-900/50 border border-white/10 rounded-xl text-slate-400 relative z-10"
          >
            <X size={20} />
          </motion.button>
        </div>
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-6 rounded-[35px] flex justify-between items-center border border-white/10 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 blur-[50px] rounded-full"></div>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Balance</p>
            <p className="text-4xl font-black mt-1 tracking-tighter bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">₹{user.walletBalance.toLocaleString()}</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRecharge} 
            className="relative z-10 bg-amber-400 text-slate-950 px-6 py-4 rounded-2xl font-black flex items-center space-x-2 shadow-xl shadow-amber-400/20"
          >
            <Wallet size={18} />
            <span className="text-xs uppercase tracking-tighter">Deposit</span>
          </motion.button>
        </motion.div>
      </div>

      <div className="p-5 max-w-2xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && <Dashboard user={user} setUser={setUser} setActiveTab={setActiveTab} setModal={setModal} />}
            {activeTab === 'investment' && <InvestmentTab user={user} setModal={setModal} />}
            {activeTab === 'account' && <AccountTab user={user} />}
            {activeTab === 'admin' && isAdmin && <AdminDashboard setModal={setModal} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Glass Bottom Nav */}
      <nav className="fixed bottom-6 left-6 right-6 bg-slate-900/70 backdrop-blur-2xl border border-white/10 flex justify-around items-center py-4 px-2 shadow-2xl rounded-[35px] z-50">
        <NavButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard />} label="Market" />
        <NavButton active={activeTab === 'investment'} onClick={() => setActiveTab('investment')} icon={<TrendingUp />} label="Earnings" />
        {isAdmin && <NavButton active={activeTab === 'admin'} onClick={() => setActiveTab('admin')} icon={<ShieldCheck />} label="Admin" />}
        <NavButton active={activeTab === 'account'} onClick={() => setActiveTab('account')} icon={<UserCircle />} label="Profile" />
      </nav>
    </div>
  );
}

// --- SUB-COMPONENTS WITH REDESIGNED CARDS ---

function AdminDashboard({ setModal }) {
  const [requests, setRequests] = useState([]);
  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API_URL}/pending-recharges`);
      setRequests(res.data);
    } catch (err) { console.error(err); }
  };
  useEffect(() => { fetchRequests(); }, []);

  const handleVerify = async (transactionId, status) => {
    try {
      await axios.post(`${API_URL}/verify-recharge`, { transactionId, status });
      setModal({ show: true, type: 'success', title: 'Done', message: `Request ${status} successfully.` });
      fetchRequests();
    } catch (err) { setModal({ show: true, type: 'error', title: 'Error', message: 'Action failed.' }); }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-black italic flex items-center gap-2">
          <ShieldCheck className="text-amber-400" size={20} />
          PENDING VERIFICATIONS
      </h3>
      {requests.length === 0 ? (
          <p className="text-slate-500 text-center py-10">No pending requests.</p>
      ) : requests.map((r, idx) => (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            key={r._id} 
            className="bg-slate-900 p-7 rounded-[40px] border border-white/10 mb-4 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 blur-[50px] rounded-full"></div>
          
          <div className="flex justify-between mb-4 relative z-10">
            <div>
                <p className="text-amber-400 text-[10px] font-black uppercase tracking-widest mb-1">User Name</p>
                <p className="font-bold text-lg">{r.userId?.name || 'Unknown'}</p>
            </div>
            <div className="text-right">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Requested</p>
                <p className="text-2xl font-black text-emerald-400">₹{r.amount}</p>
            </div>
          </div>
          
          <div className="bg-black/50 p-5 rounded-3xl mb-6 border border-white/5 relative z-10">
             <p className="text-[10px] text-slate-500 font-black uppercase mb-1 tracking-widest">UTR Number</p>
             <p className="text-amber-200 font-mono text-base break-all select-all">{r.transactionId}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 relative z-10">
            <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => handleVerify(r.transactionId, 'approved')} 
                className="bg-emerald-500 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20"
            >
                Approve
            </motion.button>
            <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => handleVerify(r.transactionId, 'rejected')} 
                className="bg-slate-800 text-red-500 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-red-500/20"
            >
                Reject
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function Dashboard({ user, setUser, setActiveTab, setModal }) {
  const plans = [
    { id: 1, name: "Starter Card", price: 700, daily: 380, duration: 28, tag: "POPULAR" },
    { id: 2, name: "Gold Card", price: 1500, daily: 880, duration: 29, tag: "HOT" },
    { id: 3, name: "Silver Card", price: 3660, daily: 2080, duration: 28, tag: "HOT" },
    { id: 4, name: "Platinum Card", price: 4880, daily: 2660, duration: 28, tag: "HOT" },
    { id: 5, name: "Elite Card", price: 7820, daily: 4290, duration: 28, tag: "HOT" },
    { id: 6, name: "Premium Card", price: 18520, daily: 9800, duration: 25, tag: "HOT" },
    { id: 7, name: "Signature Card", price: 38600, daily: 22900, duration: 20, tag: "HOT" },
    { id: 8, name: "Legend Card", price: 48700, daily: 26700, duration: 20, tag: "HOT" },
    { id: 9, name: "Infinity Card", price: 156000, daily: 72900, duration: 20, tag: "HOT" },
    { id: 10, name: "VIP Diamond", price: 520000, daily: 256000, duration: 10, tag: "ELITE" }
  ];

  const buyPlan = async (p) => {
    try {
      const res = await axios.post(`${API_URL}/invest`, {
        userId: user._id || user.id, planName: p.name, amount: p.price, dailyIncome: p.daily, durationDays: p.duration
      });
      setUser(prev => ({ ...prev, walletBalance: res.data.remainingBalance }));
      setModal({ show: true, type: 'success', title: 'Plan Active', message: `Successfully deployed ${p.name}` });
      setActiveTab('investment'); 
    } catch (err) {
      setModal({ show: true, type: 'error', title: 'Alert', message: "Insufficient wallet balance." });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-2">
        <h3 className="text-xl font-black tracking-tight italic flex items-center gap-2">
            <Sparkles className="text-amber-400" size={20} />
            INVESTMENT MARKET
        </h3>
      </div>
      <div className="space-y-5">
        {plans.map((p, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={p.id} 
            className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-[40px] p-6 group hover:border-amber-400/30 transition-all shadow-xl relative overflow-hidden"
          >
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber-400/5 blur-2xl rounded-full"></div>
            
            <div className="flex justify-between items-center mb-6 relative z-10">
               <div className="flex items-center gap-4">
                  {/* Card Logo with Zap Icon */}
                  <div className="relative">
                    <img src="/logo.png" className="w-14 h-14 rounded-3xl border-2 border-slate-800 shadow-lg" alt="Logo" />
                    <div className="absolute -bottom-1 -right-1 bg-amber-400 rounded-lg p-1 shadow-lg">
                        <Zap size={10} className="text-slate-950 fill-current" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-black tracking-tight">{p.name}</h4>
                    <span className="text-[10px] bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded-full font-black border border-amber-400/20">{p.tag}</span>
                  </div>
               </div>
               <div className="text-right">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Period</p>
                  <p className="text-amber-400 font-black">{p.duration} Days</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-950/50 p-5 rounded-3xl mb-6 border border-white/5 relative z-10">
               <div>
                  <p className="text-[9px] text-slate-500 uppercase font-black tracking-tighter">Daily Profit</p>
                  <p className="text-emerald-400 font-black text-xl">₹{p.daily}</p>
               </div>
               <div className="text-right">
                  <p className="text-[9px] text-slate-500 uppercase font-black tracking-tighter">Total Payout</p>
                  <p className="text-white font-black text-xl">₹{p.daily * p.duration}</p>
               </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => buyPlan(p)} 
              className="relative z-10 w-full py-4 bg-white text-slate-950 rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-amber-400 transition-all shadow-lg"
            >
              Invest ₹{p.price.toLocaleString()}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Investment Tab

function InvestmentTab({ user, setModal }) {
  const [myInvestments, setMyInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      axios.get(`${API_URL}/my-investments/${user._id || user.id}`)
        .then(res => {
          setMyInvestments(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-2">
        <h3 className="text-xl font-black tracking-tight italic flex items-center gap-2">
            <TrendingUp className="text-emerald-400" size={20} />
            EARNINGS PORTFOLIO
        </h3>
      </div>

      {loading ? (
        <p className="text-center text-slate-500 py-10 animate-pulse uppercase text-[10px] font-black tracking-widest">Syncing Blockchain...</p>
      ) : myInvestments.length === 0 ? (
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-[40px] p-16 text-center border border-dashed border-white/10">
           <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="text-slate-600" size={32} />
           </div>
           <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.2em]">No Active Plans Found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {myInvestments.map((plan, idx) => {
            // FIX: Ensure date is parsed correctly even if it's a string from MongoDB
            const startDate = plan.createdAt ? new Date(plan.createdAt) : new Date();
            const today = new Date();
            
            // Calculate total days passed (using Math.floor to get whole numbers)
            const diffTime = Math.abs(today - startDate);
            const daysPassed = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            // FIX: Calculate days remaining correctly
            const totalDuration = plan.durationDays || 20; // fallback to 20 if undefined
            const daysRemaining = Math.max(0, totalDuration - daysPassed);
            
            // Calculate progress percentage
            const progress = Math.min(100, (daysPassed / totalDuration) * 100);

            return (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                key={plan._id} 
                className="bg-slate-900/80 backdrop-blur-md rounded-[40px] p-7 border border-white/5 shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 blur-[60px] rounded-full"></div>
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <img src="/logo.png" className="w-12 h-12 rounded-2xl border-2 border-emerald-400/30 p-0.5 shadow-lg shadow-emerald-400/10" alt="Logo" />
                    <div>
                        <h4 className="font-black text-base uppercase leading-none mb-1">{plan.planName}</h4>
                        <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                             <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">Live Assets</span>
                        </div>
                    </div>
                  </div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest text-right">
                    Started:<br/>{startDate.toLocaleDateString()}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                  <div className="bg-slate-950/80 p-4 rounded-3xl border border-white/5">
                    <p className="text-[8px] text-slate-500 font-black uppercase mb-1 tracking-tighter">Yield Earned</p>
                    <p className="text-2xl font-black text-white">₹{plan.totalReturn}</p>
                  </div>
                  <div className="bg-slate-950/80 p-4 rounded-3xl border border-white/5">
                    <p className="text-[8px] text-slate-500 font-black uppercase mb-1 tracking-tighter">Daily Profit</p>
                    <p className="text-xl font-black text-emerald-400">+₹{plan.dailyIncome}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6 relative z-10">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                    <span>Maturity Progress</span>
                    {/* FIXED LABEL: Now shows real number instead of NaN */}
                    <span className="text-amber-400">{daysRemaining} Days Left</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress || 5}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
                    ></motion.div>
                  </div>
                </div>

                <div className="relative z-10 space-y-2">
                  <motion.button 
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setModal({ 
                      show: true, 
                      type: 'error', 
                      title: 'Withdrawal Locked', 
                      message: `Funds are under institutional lock. Payout will be unlocked in ${daysRemaining} days.` 
                    })}
                    className="w-full py-4 bg-slate-800/80 border border-white/5 rounded-2xl flex items-center justify-center gap-2 group transition-all"
                  >
                    <Lock size={14} className="text-slate-500 group-hover:text-amber-400 transition-colors" />
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Claim Earnings</span>
                  </motion.button>
                  <p className="text-center text-[8px] font-bold text-slate-600 uppercase tracking-widest">
                    * Locked until {totalDuration} days cycle completes
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}


    
function AccountTab({ user }) {
const shareReferral = () => {
    const text = `Join Sapphire and get ₹300 instantly! Use my code: ${user.myReferralCode}`;
    if (navigator.share) {
      navigator.share({ title: 'Sapphire App', text: text, url: window.location.origin });
    } else {
      navigator.clipboard.writeText(user.myReferralCode);
      alert("Referral code copied!");
    }
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-900/50 backdrop-blur-xl rounded-[50px] p-10 text-center border border-white/10 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-amber-400/10 to-transparent"></div>
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-gradient-to-tr from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-slate-950 text-4xl font-black mx-auto shadow-2xl border-4 border-slate-900">
          {user.name?.charAt(0)}
        </div>
        <div className="absolute bottom-0 right-[35%] bg-emerald-500 border-4 border-slate-900 w-6 h-6 rounded-full shadow-lg"></div>
      </div>
      <h2 className="text-3xl font-black tracking-tight">{user.name}</h2>
      <p className="text-slate-500 font-bold text-xs mt-1 uppercase tracking-widest">{user.email}</p>
      
      <div className="mt-10 grid grid-cols-1 gap-4 text-left relative z-10">
        <div className="bg-slate-950/50 p-5 rounded-3xl border border-white/5 flex items-center justify-between">
            <div>
                <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Linked Phone</p>
                <p className="font-bold text-white text-lg">{user.phone}</p>
            </div>
            <div className="p-3 bg-slate-900 rounded-2xl"><Unlock size={20} className="text-amber-400" /></div>
        </div>
        <div className="bg-slate-950/50 p-5 rounded-3xl border border-white/5 flex items-center justify-between">
            <div>
                <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Security Level</p>
                <p className="font-bold text-emerald-400 text-lg">Tier 1 Elite</p>
            </div>
            <div className="p-3 bg-slate-900 rounded-2xl"><ShieldCheck size={20} className="text-emerald-400" /></div>
        </div>
      </div>

      <div className="mt-6 bg-amber-400/10 p-5 rounded-3xl border border-amber-400/20 flex items-center justify-between">
        <div className="text-left">
          <p className="text-[9px] text-amber-400 uppercase font-black tracking-widest">Your Referral Code</p>
          <p className="font-bold text-white text-lg tracking-widest uppercase">{user.myReferralCode || 'REFF001'}</p>
        </div>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={shareReferral}
          className="p-3 bg-amber-400 rounded-2xl text-slate-950 shadow-lg shadow-amber-400/20"
        >
          <Gift size={20} />
        </motion.button>
      </div>
      

      <motion.button 
        whileTap={{ scale: 0.95 }}
        className="w-full mt-8 py-4 bg-slate-800/50 hover:bg-red-500/10 text-slate-400 hover:text-red-400 border border-white/5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all relative z-10"
      >
        Contact Support
      </motion.button>
    </motion.div>
  );
}

// --- REDESIGNED SHARED UI COMPONENTS ---

const NavButton = ({ active, onClick, icon, label }) => (
  <motion.button 
    whileTap={{ scale: 0.9 }}
    onClick={onClick} 
    className={`flex flex-col items-center p-3 rounded-2xl transition-all relative ${active ? 'text-amber-400' : 'text-slate-500'}`}
  >
    {active && (
        <motion.div layoutId="navGlow" className="absolute inset-0 bg-amber-400/10 blur-xl rounded-full"></motion.div>
    )}
    <div className="relative z-10">
        {React.cloneElement(icon, { strokeWidth: active ? 3 : 2, size: 22 })}
    </div>
    <span className="text-[9px] font-black uppercase mt-1.5 tracking-tighter relative z-10">{label}</span>
  </motion.button>
);

function CustomModal({ modal, setModal }) {
  if (!modal.show) return null;

  const handleConfirm = () => {
    if (modal.isRecharge) {
      const amount = document.getElementById('amtIn').value;
      const utr = document.getElementById('utrIn').value;
      if (amount && utr) modal.onConfirm({ amount, utr });
    } else if (modal.type === 'input') {
      const val = document.getElementById('mIn').value;
      if (val) modal.onConfirm(val);
    }
    setModal({ ...modal, show: false });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-slate-900 w-full max-w-sm rounded-[45px] border border-white/10 shadow-2xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
        
        {modal.isRecharge && (
          <div className="flex flex-col items-center mb-6">
            <div className="bg-white p-4 rounded-[35px] mb-4 shadow-2xl border-4 border-amber-400/20">
                <img src="/QR.jpeg" alt="Scan to Pay" className="w-40 h-40" />
            </div>
            <div className="bg-slate-950 px-4 py-2 rounded-full border border-white/10">
                <p className="text-amber-400 font-black text-[11px] uppercase tracking-widest UPI">nazimkhan1212@ptaxis</p>

                  <button 
                  onClick={() => navigator.clipboard.writeText('shyamalkumar414@okicici')}
                  className="text-slate-400 hover:text-amber-400 transition-colors"
                  title="Copy UPI ID"
                  >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </button>

            </div>
          </div>
        )}

        <h3 className="text-2xl font-black text-center mb-2 tracking-tight">{modal.title}</h3>
        <p className="text-slate-500 text-[11px] font-bold text-center uppercase mb-8 tracking-widest leading-relaxed">{modal.message}</p>
        
        <div className="space-y-4 mb-8">
          {modal.isRecharge ? (
            <>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase ml-4">Deposit Amount</label>
                <input type="number" id="amtIn" placeholder="Enter Amount Paid" className="w-full bg-slate-950 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-amber-400 transition-all font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase ml-4">UTR / Transaction ID</label>
                <input type="text" id="utrIn" placeholder="12-Digit Reference" className="w-full bg-slate-950 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-amber-400 transition-all font-mono uppercase" />
              </div>
            </>
          ) : (
            modal.type === 'input' && <input type="number" id="mIn" className="w-full bg-slate-950 border border-white/5 rounded-2xl py-4 px-5 text-center text-2xl font-black text-amber-400" />
          )}
        </div>

        <div className="flex flex-col gap-3">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleConfirm} 
            className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-amber-400/20"
          >
            Confirm Action
          </motion.button>
          <button onClick={() => setModal({ ...modal, show: false })} className="w-full py-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:text-white transition-colors">Dismiss</button>
        </div>
      </motion.div>
    </div>
  );
}


import React, { useEffect, useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PumpingSlip, Customer, Worker, ExpenseRecord } from '../types';
import { getGeminiInsights } from '../services/geminiService';

interface DashboardProps {
  onBack: () => void;
  slips: PumpingSlip[];
  customers: Customer[];
  workers: Worker[];
  expenses: ExpenseRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({ slips, customers, workers, expenses }) => {
  const [insight, setInsight] = useState<string>("Đang kết nối AI phân tích dữ liệu...");

  const stats = useMemo(() => {
    const approved = slips.filter(s => s.status === 'approved');
    
    // 1. Total Volume Pumped (All Time)
    const totalVol = approved.reduce((sum, s) => sum + s.volumeActual, 0);

    // 2. Outstanding Debts (Total Receivable from Customers)
    const totalDebt = customers.reduce((sum, c) => sum + (c.receivable || 0), 0);

    // 3. Upcoming Payroll (Estimated for Current Month)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const currentMonthSlips = approved.filter(s => {
      const d = new Date(s.workDate);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const upcomingPayroll = currentMonthSlips.reduce((sum, slip) => {
      const volume = Math.max(30, slip.volumeActual); // Minimum 30m3 policy
      const slipPayroll = (slip.workerIds || []).reduce((wSum, wId) => {
        const worker = workers.find(w => w.id === wId);
        return wSum + (volume * (worker?.wageRate || 0));
      }, 0);
      return sum + slipPayroll;
    }, 0);

    // 4. Recent Expenses (Current Month)
    const recentExpenses = expenses
      .filter(e => {
        const d = new Date(e.expenseDate);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, e) => sum + e.amount, 0);

    // Calculate Total Revenue for chart/insight context
    const totalRevenue = approved.reduce((sum, s) => {
       const customer = customers.find(c => c.id === s.customerId);
       return sum + (s.volumeActual * (customer?.defaultUnitPrice || 150000));
    }, 0);

    return { 
      totalVol, 
      totalDebt, 
      upcomingPayroll, 
      recentExpenses,
      totalRevenue,
      approvedCount: approved.length, 
      pendingCount: slips.filter(s => s.status === 'new').length 
    };
  }, [slips, customers, workers, expenses]);

  const revenueByCustomer = useMemo(() => {
    return customers.map(c => {
       const vol = slips.filter(s => s.status === 'approved' && s.customerId === c.id).reduce((sum, s) => sum + s.volumeActual, 0);
       return { name: c.customerName, revenue: vol * c.defaultUnitPrice };
    }).sort((a,b) => b.revenue - a.revenue).slice(0, 5);
  }, [slips, customers]);

  useEffect(() => {
    const fetchInsight = async () => {
      const summary = `Sản lượng tổng: ${stats.totalVol}m3, Công nợ khách hàng: ${stats.totalDebt.toLocaleString()}đ, Lương dự kiến tháng này: ${stats.upcomingPayroll.toLocaleString()}đ, Chi phí tháng này: ${stats.recentExpenses.toLocaleString()}đ`;
      const res = await getGeminiInsights(summary);
      setInsight(res);
    };
    fetchInsight();
  }, [stats]);

  const formatVND = (v: number) => v.toLocaleString('vi-VN') + ' đ';

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-fluid-2xl font-black text-white uppercase tracking-tighter leading-tight">Trung Tâm Điều Hành</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] italic">Hệ thống thời gian thực (Live)</p>
          </div>
        </div>
        <div className="flex gap-4">
           <div className="glass px-6 py-3 rounded-[20px] border border-white/5">
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Sản lượng tổng</p>
              <p className="text-xl font-black text-red-500">{stats.totalVol.toFixed(1)} <span className="text-[10px] text-slate-600">m³</span></p>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Tổng sản lượng bơm', value: `${stats.totalVol.toFixed(1)} m³`, icon: 'fa-layer-group', color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Công nợ khách hàng', value: formatVND(stats.totalDebt), icon: 'fa-hand-holding-dollar', color: 'text-red-500', bg: 'bg-red-500/10' },
          { label: 'Lương dự kiến (Tháng)', value: formatVND(stats.upcomingPayroll), icon: 'fa-users-cog', color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Chi phí (Tháng)', value: formatVND(stats.recentExpenses), icon: 'fa-receipt', color: 'text-orange-500', bg: 'bg-orange-500/10' },
        ].map((item, i) => (
          <div key={i} className="glass p-8 rounded-[40px] border border-white/5 hover:border-white/10 transition-all group cursor-default">
            <div className={`${item.bg} ${item.color} w-14 h-14 rounded-2xl flex items-center justify-center text-xl mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
              <i className={`fas ${item.icon}`}></i>
            </div>
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-2">{item.label}</p>
            <p className="text-xl font-black text-slate-100 tracking-tighter group-hover:text-white transition-colors">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-8 md:p-10 rounded-[45px] border border-white/5">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-base font-black text-white uppercase tracking-tight">Biểu đồ Doanh thu (Top 5)</h3>
              <div className="px-4 py-1.5 bg-slate-950 rounded-full border border-white/5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Tháng này</div>
           </div>
           <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={revenueByCustomer}>
                 <defs>
                   <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                     <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} strokeOpacity={0.2} />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 800}} dy={15} />
                 <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 800}} />
                 <Tooltip contentStyle={{backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold'}} />
                 <Area type="monotone" dataKey="revenue" stroke="#ef4444" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" animationDuration={2000} />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="relative group overflow-hidden rounded-[45px]">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-800 to-black transition-transform duration-1000 group-hover:scale-110"></div>
          <div className="relative z-10 p-10 h-full flex flex-col justify-between backdrop-blur-sm bg-black/10">
             <div>
                <div className="w-16 h-16 bg-white/10 backdrop-blur-2xl rounded-3xl flex items-center justify-center mb-10 border border-white/20 shadow-2xl group-hover:rotate-12 transition-transform">
                   <i className="fas fa-microchip text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-5">AI Phân Tích Dữ Liệu</h3>
                <div className="bg-black/30 backdrop-blur-xl p-6 rounded-[30px] border border-white/10 shadow-2xl">
                   <p className="text-white/80 text-xs md:text-sm leading-relaxed italic font-medium">
                     "{insight}"
                   </p>
                </div>
             </div>
             <button className="mt-10 w-full py-5 bg-white text-red-900 font-black text-[10px] uppercase tracking-[0.2em] rounded-[24px] shadow-2xl active:scale-95 transition-all">
                Cập nhật Insight
             </button>
          </div>
          {/* Animated circles */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-400/10 rounded-full blur-2xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

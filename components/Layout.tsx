
import React, { useState } from 'react';
import { UserRole } from '../App';
import { DVC_LOGO } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, userRole, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Điều hành', icon: 'fa-chart-pie', role: 'admin' },
    { id: 'slips', label: 'Hồ sơ phiếu', icon: 'fa-file-invoice-dollar', role: 'both' },
    { id: 'customers', label: 'Đối tác', icon: 'fa-building-user', role: 'admin' },
    { id: 'expenses', label: 'Chi phí đội', icon: 'fa-money-bill-transfer', role: 'both' },
    { id: 'fuel', label: 'Quản lý dầu', icon: 'fa-gas-pump', role: 'both' },
    { id: 'teams', label: 'Đội bơm', icon: 'fa-users-gear', role: 'admin' },
    { id: 'payroll', label: 'Bảng lương', icon: 'fa-receipt', role: 'admin' },
    { id: 'debt', label: 'Công nợ', icon: 'fa-landmark', role: 'admin' },
    { id: 'export', label: 'Báo cáo', icon: 'fa-file-pdf', role: 'both' },
    { id: 'settings', label: 'Cài đặt', icon: 'fa-sliders', role: 'admin' },
  ].filter(item => item.role === 'both' || item.role === userRole);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-transparent selection:bg-red-500/30">
      {/* Mobile Top Bar */}
      <div className="md:hidden glass border-b border-white/5 p-4 flex justify-between items-center sticky top-0 z-[100] shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="h-8 bg-white rounded-lg p-1.5 shadow-xl">
            <img src={DVC_LOGO} alt="DVC" className="h-full object-contain" />
          </div>
          <h1 className="text-[10px] font-black uppercase tracking-tighter text-red-500">DVC Management</h1>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900 border border-white/10 text-slate-300 shadow-xl active:scale-95 transition-all">
          <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars-staggered'} text-lg`}></i>
        </button>
      </div>

      {/* Sidebar - Liquid Glass Design */}
      <aside className={`fixed inset-0 z-[150] md:z-0 transform bg-slate-950/80 backdrop-blur-3xl border-r border-white/5 w-64 md:w-80 p-6 md:p-8 transition-all duration-700 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="hidden md:block mb-12">
           <div className="bg-white p-5 rounded-[35px] shadow-2xl hover:scale-[1.02] transition-all group relative overflow-hidden">
              <img src={DVC_LOGO} alt="DVC" className="h-10 mx-auto relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-slate-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
           </div>
           <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.5em] mt-6 text-center italic">Concrete Intelligence</p>
        </div>

        <nav className="space-y-2 overflow-y-auto max-h-[calc(100vh-280px)] no-scrollbar">
          {menuItems.map((item) => (
            <button 
              key={item.id} 
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }} 
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-[22px] transition-all duration-500 group relative ${activeTab === item.id ? 'bg-red-600 text-white shadow-2xl shadow-red-900/40' : 'text-slate-500 hover:bg-white/5 hover:text-slate-100'}`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-500 ${activeTab === item.id ? 'bg-white/20' : 'bg-slate-900 group-hover:bg-slate-800'}`}>
                <i className={`fas ${item.icon} text-sm`}></i>
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
              {activeTab === item.id && (
                <div className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white]"></div>
              )}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-8 left-6 right-6">
          <button onClick={onLogout} className="w-full py-5 bg-slate-900 text-slate-500 hover:text-red-500 hover:bg-red-600/10 rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] border border-white/5 transition-all flex items-center justify-center gap-3 group">
            <i className="fas fa-power-off group-hover:scale-110 transition-transform"></i> Thoát hệ thống
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-12 no-scrollbar relative">
        <div className="max-w-7xl mx-auto pb-32">{children}</div>
      </main>
    </div>
  );
};

export default Layout;

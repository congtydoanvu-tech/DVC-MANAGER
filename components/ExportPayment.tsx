
import React, { useState } from 'react';
import { MOCK_CUSTOMERS, DVC_LOGO } from '../constants';
import { PumpingSlip, Team } from '../types';
import { UserRole } from '../App';

interface ExportPaymentProps {
  onBack: () => void;
  userRole: UserRole;
  teamCode: string | null;
  teams: Team[];
  slips: PumpingSlip[];
}

const ExportPayment: React.FC<ExportPaymentProps> = ({ onBack, userRole, teamCode, teams, slips }) => {
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  const [selectedCustomer, setSelectedCustomer] = useState(MOCK_CUSTOMERS[0].id);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [monthFrom, setMonthFrom] = useState(currentMonthStr);
  const [monthTo, setMonthTo] = useState(currentMonthStr);

  const formatVND = (value: number) => value.toLocaleString('vi-VN') + ' VNĐ';

  const handleExport = () => setIsPreviewOpen(true);

  // Fixed: t.code -> t.teamCode
  const currentTeam = teams.find(t => t.teamCode === teamCode);
  const filteredSlips = slips.filter(s => {
    const isOurTeam = userRole === 'admin' || (currentTeam && s.teamId === currentTeam.id);
    // Fixed: s.date -> s.workDate
    const dateMatch = s.workDate >= `${monthFrom}-01` && s.workDate <= `${monthTo}-31`;
    // Fixed: s.customerName matching with customerName
    const customerMatch = userRole === 'team' || s.customerName === MOCK_CUSTOMERS.find(c => c.id === selectedCustomer)?.customerName;
    return isOurTeam && dateMatch && customerMatch;
  });

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-500 transition-all">
          <i className="fas fa-arrow-left"></i>
        </button>
        <div>
          <h2 className="text-2xl font-black text-slate-100 tracking-tight uppercase">Xuất báo cáo khối lượng</h2>
          <p className="text-slate-500 text-sm font-medium">Tổng hợp dữ liệu bơm bê tông định kỳ</p>
        </div>
      </header>

      <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 max-w-2xl mx-auto shadow-2xl">
        <div className="space-y-6">
          {userRole === 'admin' && (
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Chọn Khách hàng</label>
              <select 
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 focus:ring-2 focus:ring-red-600 focus:outline-none font-bold"
              >
                {/* Fixed: c.name -> c.customerName */}
                {MOCK_CUSTOMERS.map(c => <option key={c.id} value={c.id}>{c.customerName}</option>)}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Từ tháng</label>
              <input type="month" value={monthFrom} onChange={(e) => setMonthFrom(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 font-bold outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Đến tháng</label>
              <input type="month" value={monthTo} onChange={(e) => setMonthTo(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 font-bold outline-none" />
            </div>
          </div>

          <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800">
            <p className="text-[10px] font-black uppercase text-slate-500 mb-3 flex items-center gap-2"><i className="fas fa-chart-pie text-red-500"></i> Thống kê nhanh:</p>
            <div className="flex justify-between items-center py-1">
              <span className="text-xs text-slate-400 font-bold">Số lượng ca bơm:</span>
              <span className="text-sm text-slate-100 font-black">{filteredSlips.length} ca</span>
            </div>
            <div className="flex justify-between items-center py-1 border-t border-slate-900 mt-2 pt-2">
              <span className="text-xs text-slate-400 font-bold">Tổng khối lượng:</span>
              {/* Fixed: s.volume -> s.volumeActual */}
              <span className="text-lg text-red-500 font-black">{filteredSlips.reduce((sum, s) => sum + s.volumeActual, 0).toFixed(2)} m³</span>
            </div>
          </div>

          <button 
            onClick={handleExport}
            className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-900/40 hover:bg-red-700 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <i className="fas fa-file-pdf"></i>
            Tạo báo cáo chi tiết
          </button>
        </div>
      </div>

      {isPreviewOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-4xl h-[95vh] rounded-2xl overflow-y-auto p-12 text-gray-900 relative">
              <button onClick={() => setIsPreviewOpen(false)} className="absolute top-4 right-4 w-10 h-10 bg-slate-100 rounded-full text-slate-600 hover:bg-red-600 hover:text-white transition-all"><i className="fas fa-times"></i></button>
              
              <div className="border-b-4 border-red-600 pb-8 mb-8 flex justify-between items-center">
                 <div className="flex items-center gap-6">
                    <div className="w-24">
                        <img src={DVC_LOGO} alt="DVC LOGO" className="w-full h-auto" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">DOANVU COMPANY</h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 mt-2">Dịch vụ bơm bê tông chuyên nghiệp</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <h2 className="text-2xl font-black uppercase tracking-tighter">BÁO CÁO KHỐI LƯỢNG</h2>
                    <p className="text-xs text-gray-500 font-bold">Kỳ hạn: {monthFrom} ➔ {monthTo}</p>
                 </div>
              </div>

              <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
                 {/* Fixed: c.name -> c.customerName */}
                 <p className="text-sm font-black uppercase mb-1">Kính gửi: {MOCK_CUSTOMERS.find(c => c.id === selectedCustomer)?.customerName || 'QUÝ KHÁCH HÀNG'}</p>
                 <p className="text-xs text-gray-600 italic">DVC xin gửi chi tiết khối lượng bơm bê tông thực tế đã thực hiện trong kỳ báo cáo:</p>
              </div>

              <table className="w-full border-collapse border-2 border-gray-900 text-xs mb-10">
                 <thead className="bg-gray-900 text-white uppercase font-black">
                    <tr>
                       <th className="border-2 border-gray-900 p-3">Ngày</th>
                       <th className="border-2 border-gray-900 p-3">Công trình / Địa chỉ</th>
                       <th className="border-2 border-gray-900 p-3 text-center">KL (m³)</th>
                       <th className="border-2 border-gray-900 p-3 text-center">Ống (m)</th>
                    </tr>
                 </thead>
                 <tbody>
                    {filteredSlips.map((s, idx) => (
                       <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                          {/* Fixed: s.date -> s.workDate */}
                          <td className="p-3 font-bold border-x border-gray-200">{s.workDate}</td>
                          {/* Fixed: s.address -> s.siteAddress */}
                          <td className="p-3 border-x border-gray-200">{s.projectId} - {s.siteAddress}</td>
                          {/* Fixed: s.volume -> s.volumeActual */}
                          <td className="p-3 text-center font-black border-x border-gray-200">{s.volumeActual.toFixed(2)}</td>
                          <td className="p-3 text-center border-x border-gray-200">{s.pipeLength}</td>
                       </tr>
                    ))}
                    <tr className="bg-gray-900 text-white font-black text-sm">
                       <td colSpan={2} className="p-4 text-right">TỔNG KHỐI LƯỢNG THỰC HIỆN:</td>
                       {/* Fixed: s.volume -> s.volumeActual */}
                       <td className="p-4 text-center text-red-400">{filteredSlips.reduce((sum, s) => sum + s.volumeActual, 0).toFixed(2)} m³</td>
                       <td></td>
                    </tr>
                 </tbody>
              </table>

              <div className="grid grid-cols-2 gap-10 mt-24 text-center relative h-40">
                 <div>
                    <p className="text-sm font-black mb-24 uppercase">Xác nhận khách hàng</p>
                    <p className="text-[10px] text-gray-400 italic">(Ký, ghi rõ họ tên và đóng dấu)</p>
                 </div>
                 <div className="relative">
                    <p className="text-sm font-black mb-24 uppercase">Đại diện Công ty DVC</p>
                    {/* Official Stamp Mimic */}
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 opacity-60 pointer-events-none rotate-[-8deg] scale-150">
                       <div className="w-32 h-32 border-[4px] border-red-600 rounded-full flex flex-col items-center justify-center text-[9px] text-red-600 font-black leading-tight border-double">
                          <span>CÔNG TY TNHH</span>
                          <span className="text-sm tracking-widest">DOANVU</span>
                          <span className="text-xs mt-1">DVC SYSTEM</span>
                       </div>
                    </div>
                 </div>
              </div>
              
              <div className="mt-12 text-center border-t border-gray-100 pt-6">
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Cung cấp dịch vụ bơm bê tông uy tín - chất lượng - chính xác</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ExportPayment;

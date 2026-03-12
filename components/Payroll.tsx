
import React, { useState, useMemo } from 'react';
import { Team, PumpingSlip, Worker, SalaryCalculation } from '../types';

interface PayrollProps {
  teams: Team[];
  workers: Worker[];
  slips: PumpingSlip[];
  onBack: () => void;
}

const Payroll: React.FC<PayrollProps> = ({ teams, workers, slips, onBack }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const formatVND = (v: number) => v.toLocaleString('vi-VN') + ' đ';

  // LOGIC TÍNH LƯƠNG ĐOÀN VŨ:
  // 1 ca = tối thiểu 30 m3
  // KL quy đổi = max(30, KL thực tế)
  // Chia đều cho công nhân tham gia
  const payrollDetails = useMemo(() => {
    return workers.map(worker => {
      const workerSlips = slips.filter(s => 
        s.status === 'approved' && 
        s.workDate.startsWith(selectedMonth) && 
        s.workerIds.includes(worker.id)
      );

      let totalSalary = 0;
      let totalActualVol = 0;
      let totalConvVol = 0;

      workerSlips.forEach(slip => {
        // KL thực tế của ca
        const slipVol = slip.volumeActual;
        // KL quy đổi tối thiểu 30m3
        const convVol = Math.max(30, slipVol);
        // Chia đều cho số người trong ca
        const perWorkerVol = convVol / (slip.workerIds.length || 1);
        
        totalActualVol += slipVol / (slip.workerIds.length || 1);
        totalConvVol += perWorkerVol;
        totalSalary += perWorkerVol * worker.wageRate;
      });

      return {
        ...worker,
        caCount: workerSlips.length,
        totalActualVol,
        totalConvVol,
        totalSalary
      };
    }).sort((a,b) => b.totalSalary - a.totalSalary);
  }, [workers, slips, selectedMonth]);

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4 md:gap-5">
          <button onClick={onBack} className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-500 transition-all shadow-xl">
            <i className="fas fa-arrow-left text-sm md:text-base"></i>
          </button>
          <div>
            <h2 className="text-fluid-2xl font-black text-slate-100 uppercase tracking-tighter">Bảng Lương Đoàn Vũ</h2>
            <p className="text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] mt-1 md:mt-2 italic">Kết soát ca bơm & chi trả công nhân</p>
          </div>
        </div>
        <input type="month" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="w-full md:w-auto px-5 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 font-bold outline-none focus:border-red-500 text-sm" />
      </header>

      <div className="glass rounded-[35px] md:rounded-[45px] border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="bg-slate-800/30 text-[10px] md:text-[11px] font-black uppercase text-slate-500 tracking-[0.15em] md:tracking-[0.2em]">
                <th className="px-6 md:px-10 py-5 md:py-7">Họ tên & Đội</th>
                <th className="px-6 md:px-10 py-5 md:py-7 text-center">Số ca</th>
                <th className="px-6 md:px-10 py-5 md:py-7 text-center">KL Thực tế</th>
                <th className="px-6 md:px-10 py-5 md:py-7 text-center">KL Quy đổi (*)</th>
                <th className="px-6 md:px-10 py-5 md:py-7 text-right">Lương thực nhận</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {payrollDetails.map(row => (
                <tr key={row.id} className="hover:bg-slate-800/20 transition-all">
                  <td className="px-6 md:px-10 py-6 md:py-7">
                    <p className="font-black text-slate-100 text-base md:text-lg tracking-tight uppercase leading-none">{row.fullName}</p>
                    <span className="inline-block mt-2 px-2 py-0.5 bg-slate-950 border border-slate-800 rounded-lg text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest">
                      {teams.find(t => t.id === row.teamId)?.teamCode}
                    </span>
                  </td>
                  <td className="px-6 md:px-10 py-6 md:py-7 text-center font-black text-slate-100 text-base md:text-lg">{row.caCount}</td>
                  <td className="px-6 md:px-10 py-6 md:py-7 text-center font-bold text-slate-400 text-sm md:text-base">{row.totalActualVol.toFixed(1)} <span className="text-[9px] md:text-[10px]">m³</span></td>
                  <td className="px-6 md:px-10 py-6 md:py-7 text-center">
                    <span className="px-3 md:px-4 py-1.5 bg-red-600/10 text-red-500 rounded-xl font-black text-base md:text-lg">
                      {row.totalConvVol.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-6 md:px-10 py-6 md:py-7 text-right">
                    <p className="font-black text-slate-100 text-xl md:text-2xl tracking-tighter leading-none">{formatVND(row.totalSalary)}</p>
                    <p className="text-[8px] md:text-[9px] text-slate-600 font-black uppercase tracking-widest mt-1.5 md:mt-2">Đơn giá: {row.wageRate}đ/m³</p>
                  </td>
                </tr>
              ))}
              {payrollDetails.length === 0 && (
                <tr>
                   <td colSpan={5} className="py-24 text-center text-slate-600 font-black uppercase tracking-widest opacity-30 italic text-xs md:text-sm">Không có dữ liệu lương tháng này</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="p-6 md:p-10 bg-slate-900/50 border border-slate-800 border-dashed rounded-[35px] md:rounded-[40px] text-[11px] md:text-xs text-slate-500 leading-relaxed italic">
        * Quy tắc tính lương: KL quy đổi mỗi ca được tính bằng max(30, KL thực tế của ca) sau đó chia đều cho số công nhân tham gia ca đó. Bảng lương chỉ tính trên các phiếu đã có trạng thái "Đã duyệt".
      </div>
    </div>
  );
};

export default Payroll;

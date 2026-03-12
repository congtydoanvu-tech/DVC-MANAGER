
import React, { useState, useMemo } from 'react';
import { Team, FuelTransaction } from '../types';
import { UserRole } from '../App';

interface FuelManagementProps {
  userRole: UserRole;
  teamCode: string | null;
  teams: Team[];
  transactions: FuelTransaction[];
  onAddTransaction: (tx: FuelTransaction) => void;
  onBack: () => void;
}

const FuelManagement: React.FC<FuelManagementProps> = ({ userRole, teamCode, teams, transactions, onAddTransaction, onBack }) => {
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [returnAmount, setReturnAmount] = useState('');
  const [notes, setNotes] = useState('');

  const formatVND = (value: number) => (value || 0).toLocaleString('vi-VN') + ' đ';

  // Fixed: t.code -> t.teamCode
  const currentTeam = teams.find(t => t.teamCode === teamCode);
  const displayTeams = useMemo(() => userRole === 'admin' ? teams : teams.filter(t => t.id === currentTeam?.id), [userRole, teams, currentTeam]);

  const filteredTransactions = useMemo(() => {
    let list = userRole === 'admin' ? (selectedTeamId ? transactions.filter(t => t.teamId === selectedTeamId) : transactions) : transactions.filter(t => t.teamId === currentTeam?.id);
    return list.sort((a,b) => b.id.localeCompare(a.id));
  }, [userRole, selectedTeamId, transactions, currentTeam]);

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const team = teams.find(t => t.id === selectedTeamId);
    if (!team || !returnAmount) return;

    const amount = parseFloat(returnAmount);
    if (amount > (team.fuelBalance || 0)) return alert("Số tiền chi vượt quá quỹ hiện có của đội!");

    const newTx: FuelTransaction = {
      id: 'ft' + Date.now(),
      teamId: selectedTeamId,
      date: new Date().toISOString().split('T')[0],
      type: 'return',
      amount,
      description: notes || 'Chi phí nhiên liệu định kỳ (đối soát)'
    };

    onAddTransaction(newTx);
    setIsReturnModalOpen(false);
    setReturnAmount('');
    setNotes('');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-500 transition-all shadow-lg"><i className="fas fa-arrow-left"></i></button>
          <div>
            <h2 className="text-2xl font-black text-slate-100 uppercase tracking-tighter">Quản lý Quỹ Dầu</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Định mức: 10,000đ/m³ thu tự động</p>
          </div>
        </div>
        {userRole === 'admin' && (
          <button onClick={() => setIsReturnModalOpen(true)} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase shadow-xl shadow-blue-900/30 hover:bg-blue-700 transition-all flex items-center gap-2"><i className="fas fa-gas-pump"></i> Chi dầu lẻ cho đội</button>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayTeams.map(team => (
          <div key={team.id} className="bg-slate-900/60 backdrop-blur-sm p-8 rounded-[40px] border border-slate-800 relative overflow-hidden group hover:border-blue-500/50 transition-all">
            <div className="flex justify-between items-start mb-8">
               <div className="w-14 h-14 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform"><i className="fas fa-droplet text-2xl"></i></div>
               {/* Fixed: code -> teamCode */}
               <span className="bg-slate-950 px-3 py-1.5 rounded-xl text-[10px] font-black text-slate-500 border border-slate-800 uppercase tracking-[0.2em] shadow-sm">Đội {team.teamCode}</span>
            </div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1.5">Số dư quỹ nhiên liệu</p>
            <p className="text-4xl font-black text-slate-100 tracking-tighter">{formatVND(team.fuelBalance)}</p>
            <div className="mt-6 flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 text-[10px] font-black">{team.driverName.charAt(0)}</div>
               <p className="text-xs text-slate-400 font-bold uppercase tracking-tight opacity-70">TX: {team.driverName}</p>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full blur-[80px] group-hover:bg-blue-500/15 transition-all duration-700"></div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-[40px] border border-slate-800 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="p-8 border-b border-slate-800 bg-slate-800/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest border-l-4 border-blue-600 pl-4">Lịch sử giao dịch quỹ dầu</h3>
           {userRole === 'admin' && (
             <select value={selectedTeamId} onChange={e => setSelectedTeamId(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-black text-slate-300 outline-none focus:border-blue-500 transition-all">
               <option value="">Tất cả đội bơm</option>
               {/* Fixed: code -> teamCode */}
               {teams.map(t => <option key={t.id} value={t.id}>{t.teamCode}</option>)}
             </select>
           )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase text-slate-500 bg-slate-950/50">
                <th className="px-8 py-5">Thời gian</th>
                <th className="px-8 py-5">Nội dung / Đối soát</th>
                <th className="px-8 py-5 text-center">Đội</th>
                <th className="px-8 py-5 text-right">Biến động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredTransactions.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-800/30 transition-all group">
                  <td className="px-8 py-5 text-[11px] font-bold text-slate-500">{tx.date.split('-').reverse().join('/')}</td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{tx.description}</p>
                    <span className={`inline-block mt-1 text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${tx.type === 'collect' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {tx.type === 'collect' ? 'Thu phí tự động' : 'Đã chi trả tiền mặt'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    {/* Fixed: code -> teamCode */}
                    <span className="text-[10px] font-black text-slate-400 px-3 py-1 bg-slate-950 rounded-lg">{teams.find(t => t.id === tx.teamId)?.teamCode}</span>
                  </td>
                  <td className={`px-8 py-5 text-right font-black text-base ${tx.type === 'collect' ? 'text-green-500' : 'text-red-500'}`}>
                    {tx.type === 'collect' ? '+' : '-'}{formatVND(tx.amount)}
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr><td colSpan={4} className="p-32 text-center text-slate-600 uppercase font-black italic opacity-20 tracking-widest">Không có dữ liệu quỹ dầu</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isReturnModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-slate-900 w-full max-w-md rounded-[48px] p-10 border border-slate-800 shadow-2xl animate-in zoom-in duration-500">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-2xl font-black text-slate-100 uppercase tracking-tighter leading-none">Cấp dầu lẻ</h3>
               <button onClick={() => setIsReturnModalOpen(false)} className="w-10 h-10 rounded-full bg-slate-800 text-slate-500"><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleReturnSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Đội bơm nhận tiền</label>
                <select required value={selectedTeamId} onChange={e => setSelectedTeamId(e.target.value)} className="w-full bg-slate-950 p-4.5 border border-slate-800 rounded-2xl text-sm font-bold text-white outline-none focus:border-blue-500">
                   <option value="">-- Chọn đội --</option>
                   {/* Fixed: code -> teamCode */}
                   {teams.map(t => <option key={t.id} value={t.id}>{t.teamCode} (Sư dư: {formatVND(t.fuelBalance)})</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Số tiền chi trả (VNĐ)</label>
                <input required type="number" placeholder="0" value={returnAmount} onChange={e => setReturnAmount(e.target.value)} className="w-full bg-slate-950 p-4.5 border border-slate-800 rounded-2xl text-2xl font-black text-red-500 outline-none focus:border-red-500/50" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Lý do chi phí</label>
                <textarea placeholder="Ví dụ: Nạp dầu lẻ tại công trình..." value={notes} onChange={e => setNotes(e.target.value)} className="w-full bg-slate-950 p-4.5 border border-slate-800 rounded-2xl text-sm font-medium outline-none focus:border-blue-500" rows={3} />
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setIsReturnModalOpen(false)} className="flex-1 py-5 bg-slate-800 rounded-[24px] font-black text-xs uppercase text-slate-300">Hủy</button>
                <button type="submit" className="flex-2 py-5 bg-blue-600 rounded-[24px] font-black text-xs uppercase text-white shadow-2xl shadow-blue-900/40 hover:bg-blue-700 active:scale-95 transition-all">Xác nhận chi quỹ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FuelManagement;

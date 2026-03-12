
import React, { useState } from 'react';
import { Team, ExpenseRecord } from '../types';
import { UserRole } from '../App';
import { analyzeExpensePhoto } from '../services/geminiService';

interface ExpenseManagementProps {
  userRole: UserRole;
  teamCode: string | null;
  teams: Team[];
  expenses: ExpenseRecord[];
  onAdd: (expense: ExpenseRecord) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

const ExpenseManagement: React.FC<ExpenseManagementProps> = ({ userRole, teamCode, teams, expenses: allExpenses, onAdd, onDelete, onBack }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [formData, setFormData] = useState({
    category: 'Dầu' as ExpenseRecord['category'],
    amount: '',
    expenseDate: new Date().toISOString().split('T')[0],
    invoiceImageUrl: '',
    description: ''
  });

  // Fixed: t.code -> t.teamCode
  const currentTeam = teams.find(t => t.teamCode === teamCode);
  const expenses = userRole === 'admin' ? allExpenses : allExpenses.filter(e => e.teamId === currentTeam?.id);

  const formatVND = (value: number) => value.toLocaleString('vi-VN') + ' đ';

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setFormData(prev => ({ ...prev, invoiceImageUrl: base64 }));
      setIsAnalyzing(true);
      const res = await analyzeExpensePhoto(base64);
      if (res) {
        setFormData(p => ({ 
          ...p, 
          amount: res.amount?.toString() || p.amount, 
          category: (['Dầu', 'Ăn uống', 'Sửa chữa', 'Khác'].includes(res.category) ? res.category : p.category) as any,
          description: res.notes || p.description 
        }));
      }
      setIsAnalyzing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: 'e' + Date.now(),
      teamId: currentTeam?.id || 'admin',
      ...formData,
      amount: parseFloat(formData.amount)
    } as ExpenseRecord);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400"><i className="fas fa-arrow-left"></i></button>
          <h2 className="text-2xl font-black uppercase">Chi phí Đội Bơm</h2>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 px-6 py-3 rounded-xl font-black text-xs uppercase text-white shadow-xl shadow-blue-900/40"><i className="fas fa-plus mr-2"></i>Nhập chi phí</button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {expenses.map(exp => (
          <div key={exp.id} className="bg-slate-900 rounded-[32px] border border-slate-800 overflow-hidden group hover:border-blue-500/50 transition-all shadow-xl">
            <div className="h-44 bg-slate-800 relative">
               {/* Fixed: photoUrl -> invoiceImageUrl */}
               <img src={exp.invoiceImageUrl} alt="Receipt" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
               <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[9px] font-black text-white uppercase tracking-widest">{exp.category}</div>
            </div>
            <div className="p-6">
               {/* Fixed: date -> expenseDate */}
               <p className="text-[10px] text-slate-500 font-black uppercase">{exp.expenseDate}</p>
               <h3 className="text-2xl font-black text-slate-100 mt-1 tracking-tighter">{formatVND(exp.amount)}</h3>
               {/* Fixed: notes -> description */}
               <p className="text-xs text-slate-400 mt-2 italic line-clamp-2">"{exp.description || 'Không có ghi chú'}"</p>
               <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center">
                  {/* Fixed: code -> teamCode */}
                  <span className="text-[10px] font-black text-slate-500 uppercase">Đội: {teams.find(t => t.id === exp.teamId)?.teamCode}</span>
                  <button onClick={() => onDelete(exp.id)} className="text-slate-600 hover:text-red-500 transition-colors"><i className="fas fa-trash-alt"></i></button>
               </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
          <div className="bg-slate-900 w-full max-w-md rounded-[40px] p-8 border border-slate-800 shadow-2xl animate-in zoom-in">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-8">Hóa đơn Chi phí</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Chụp hóa đơn (* AI Tự động nhập liệu)</label>
                {/* Fixed: photoUrl -> invoiceImageUrl */}
                {formData.invoiceImageUrl ? (
                  <div className="relative h-44 rounded-3xl overflow-hidden border-2 border-slate-800">
                    <img src={formData.invoiceImageUrl} alt="P" className="w-full h-full object-cover" />
                    {isAnalyzing && <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-xs font-black text-white animate-pulse">AI Đang xử lý...</div>}
                    <button type="button" onClick={() => setFormData(p => ({ ...p, invoiceImageUrl: '' }))} className="absolute top-3 right-3 w-10 h-10 bg-red-600 rounded-full text-white"><i className="fas fa-trash"></i></button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-44 border-2 border-dashed border-slate-700 rounded-3xl cursor-pointer hover:bg-slate-800/50 transition-all">
                    <i className="fas fa-camera text-2xl text-slate-600 mb-2"></i>
                    <span className="text-[10px] font-black uppercase text-slate-500">Chụp hóa đơn</span>
                    <input type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="hidden" />
                  </label>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4">
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})} className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 font-bold">
                  <option value="Dầu">Tiền Dầu (Nhiên liệu)</option>
                  <option value="Sửa chữa">Sửa chữa / Bảo trì</option>
                  <option value="Ăn uống">Ăn uống / Bồi dưỡng</option>
                  <option value="Khác">Chi phí khác</option>
                </select>
                <input required type="number" placeholder="Số tiền (VNĐ)" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 font-black text-red-500 text-xl" />
                {/* Fixed: notes -> description */}
                <textarea placeholder="Ghi chú thêm..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 text-sm" rows={2} />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-800 rounded-2xl font-black text-xs uppercase">Hủy</button>
                <button type="submit" disabled={isAnalyzing} className="flex-2 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase shadow-xl shadow-blue-900/40">Lưu Hóa Đơn</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseManagement;

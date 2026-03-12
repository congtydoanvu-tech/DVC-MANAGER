
import React, { useState, useMemo } from 'react';
import { PumpingSlip, Team, Worker, Customer } from '../types';
import { UserRole } from '../App';
import { analyzePumpingSlipPhoto } from '../services/geminiService';

interface PumpingSlipListProps {
  userRole: UserRole;
  teamCode?: string | null;
  teams: Team[];
  workers: Worker[];
  customers: Customer[];
  slips: PumpingSlip[];
  onAdd: (slip: PumpingSlip) => void;
  onUpdate: (slip: PumpingSlip) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

const PumpingSlipList: React.FC<PumpingSlipListProps> = ({ userRole, teamCode, teams, workers, customers, slips: allSlips, onAdd, onUpdate, onDelete, onBack }) => {
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [editingSlip, setEditingSlip] = useState<PumpingSlip | null>(null);
  const [viewingSlip, setViewingSlip] = useState<PumpingSlip | null>(null);
  
  const currentTeam = teams.find(t => t.teamCode === teamCode);
  const teamWorkers = useMemo(() => workers.filter(w => w.teamId === currentTeam?.id), [workers, currentTeam]);

  const [formData, setFormData] = useState<Partial<PumpingSlip>>({
    customerId: '', customerName: '', projectId: '', workDate: new Date().toISOString().split('T')[0],
    siteAddress: '', volumeActual: 0, pipeLength: 0, imageUrl: '', note: '', workerIds: []
  });

  const slips = useMemo(() => {
    let filtered = userRole === 'team' ? allSlips.filter(s => s.teamId === currentTeam?.id) : allSlips;
    return filtered.filter(s => s.workDate.startsWith(filterMonth)).sort((a,b) => b.workDate.localeCompare(a.workDate));
  }, [allSlips, userRole, currentTeam, filterMonth]);

  const handleOpenModal = (slip?: PumpingSlip) => {
    if (slip) {
      setEditingSlip(slip);
      setFormData(slip);
    } else {
      setEditingSlip(null);
      setFormData({
        customerId: '', customerName: '', projectId: '', workDate: new Date().toISOString().split('T')[0],
        siteAddress: '', volumeActual: 0, pipeLength: 0, imageUrl: '', note: '', workerIds: []
      });
    }
    setIsModalOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setFormData(p => ({ ...p, imageUrl: base64 }));
      setIsAnalyzing(true);
      const res = await analyzePumpingSlipPhoto(base64);
      if (res) {
        const matchedCustomer = customers.find(c => c.customerName.toLowerCase().includes(res.customerName?.toLowerCase()));
        setFormData(p => ({ 
          ...p, 
          customerId: matchedCustomer?.id || p.customerId,
          customerName: matchedCustomer?.customerName || res.customerName || p.customerName, 
          projectId: res.projectName || p.projectId, 
          volumeActual: res.volume || p.volumeActual, 
          siteAddress: res.address || p.siteAddress 
        }));
      }
      setIsAnalyzing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slipData: PumpingSlip = {
      id: editingSlip?.id || 's' + Date.now(),
      teamId: currentTeam?.id || teams[0].id,
      status: 'new', // Khi đội bơm gửi lại/gửi mới đều về trạng thái chờ duyệt
      ...formData,
    } as PumpingSlip;

    editingSlip ? onUpdate(slipData) : onAdd(slipData);
    setIsModalOpen(false);
  };

  const handleApprove = (slip: PumpingSlip) => onUpdate({ ...slip, status: 'approved' });
  const handleReturn = (slip: PumpingSlip, reason: string) => onUpdate({ ...slip, status: 'returned', returnReason: reason });

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4 md:gap-6">
          <button onClick={onBack} className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-500 transition-all">
            <i className="fas fa-chevron-left text-sm md:text-base"></i>
          </button>
          <div>
            <h2 className="text-fluid-2xl font-black text-slate-100 uppercase tracking-tighter leading-none">Hồ sơ Phiếu bơm</h2>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2 italic">{userRole === 'admin' ? 'Kế toán phê duyệt' : `Mã đội: ${teamCode}`}</p>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <input type="month" value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className="flex-1 md:flex-none px-4 md:px-6 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 font-bold outline-none focus:border-red-500/50 text-sm" />
          {userRole === 'team' && (
            <button onClick={() => handleOpenModal()} className="bg-red-600 px-6 md:px-8 py-3.5 rounded-2xl font-black text-[11px] md:text-xs uppercase text-white shadow-xl shadow-red-900/40 hover:bg-red-700 active:scale-95 transition-all flex items-center gap-2 md:gap-3 whitespace-nowrap">
              <i className="fas fa-plus"></i> Nhập phiếu
            </button>
          )}
        </div>
      </header>

      {slips.length === 0 ? (
        <div className="py-24 md:py-32 text-center bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-[40px] md:rounded-[50px] opacity-60">
           <i className="fas fa-file-invoice text-4xl md:text-5xl text-slate-700 mb-6"></i>
           <p className="font-black uppercase tracking-[0.2em] text-slate-500 text-xs md:text-sm">Chưa có dữ liệu bơm bê tông</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {slips.map(slip => (
            <div key={slip.id} className={`group glass p-5 md:p-6 rounded-[35px] md:rounded-[40px] border transition-all hover:-translate-y-1 md:hover:-translate-y-2 flex flex-col justify-between ${slip.status === 'returned' ? 'border-orange-500/30 bg-orange-500/5' : 'border-slate-800 shadow-2xl shadow-black/40'}`}>
              <div className="space-y-3 md:space-y-4">
                <div className="flex justify-between items-start">
                   <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-800 rounded-xl md:rounded-2xl overflow-hidden border border-slate-700">
                      <img src={slip.imageUrl} className="w-full h-full object-cover" />
                   </div>
                   <span className={`text-[8px] md:text-[9px] font-black uppercase px-2.5 md:px-3 py-1 md:py-1.5 rounded-xl border ${
                      slip.status === 'approved' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                      slip.status === 'returned' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20 animate-pulse' : 
                      'bg-blue-500/10 text-blue-500 border-blue-500/20'
                    }`}>
                      {slip.status === 'approved' ? 'Đã duyệt' : slip.status === 'returned' ? 'Bị trả lại' : 'Chờ duyệt'}
                    </span>
                </div>
                <div>
                  <h3 className="font-black text-slate-100 uppercase tracking-tight text-base md:text-lg truncate">{slip.customerName}</h3>
                  <p className="text-[11px] md:text-xs text-red-500 font-bold tracking-tight">{slip.projectId}</p>
                  <p className="text-[9px] md:text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1.5 md:mt-2">{slip.workDate.split('-').reverse().join('/')}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 md:gap-4 pt-3 md:pt-4 border-t border-slate-800/50">
                   <div>
                      <p className="text-[8px] md:text-[9px] text-slate-500 font-black uppercase tracking-widest">Thực bơm</p>
                      <p className="text-lg md:text-xl font-black text-slate-100">{slip.volumeActual} <span className="text-[9px] md:text-[10px]">m³</span></p>
                   </div>
                   <div>
                      <p className="text-[8px] md:text-[9px] text-slate-500 font-black uppercase tracking-widest">Nhân sự</p>
                      <p className="text-lg md:text-xl font-black text-slate-100">{slip.workerIds.length} <span className="text-[9px] md:text-[10px]">người</span></p>
                   </div>
                </div>
              </div>
              
              <div className="pt-5 md:pt-6 flex gap-2 md:gap-3">
                <button onClick={() => setViewingSlip(slip)} className="flex-1 py-3 bg-slate-800 rounded-2xl text-[9px] md:text-[10px] font-black uppercase text-slate-400 hover:text-white transition-all">Chi tiết</button>
                {userRole === 'admin' && slip.status === 'new' && (
                  <button onClick={() => handleApprove(slip)} className="flex-1 py-3 bg-green-600 rounded-2xl text-[9px] md:text-[10px] font-black uppercase text-white shadow-lg shadow-green-900/20">Duyệt</button>
                )}
                {userRole === 'team' && slip.status === 'returned' && (
                  <button onClick={() => handleOpenModal(slip)} className="flex-1 py-3 bg-orange-600 rounded-2xl text-[9px] md:text-[10px] font-black uppercase text-white shadow-lg shadow-orange-900/20">Sửa & Gửi</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Nhập/Sửa Phiếu */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-2xl animate-in fade-in">
          <div className="bg-slate-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[40px] md:rounded-[50px] p-6 md:p-10 border border-slate-800 shadow-2xl no-scrollbar relative">
            <header className="flex justify-between items-center mb-8 md:mb-10">
              <h3 className="text-fluid-lg font-black text-slate-100 uppercase tracking-tighter">
                {editingSlip ? (editingSlip.status === 'returned' ? 'Sửa phiếu bị trả' : 'Cập nhật phiếu') : 'Nhập phiếu bơm'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-800 text-slate-500 hover:text-white flex items-center justify-center"><i className="fas fa-times text-lg"></i></button>
            </header>

            {editingSlip?.status === 'returned' && (
              <div className="mb-6 md:mb-8 p-5 md:p-6 bg-orange-600/10 border border-orange-500/20 rounded-3xl">
                <p className="text-[9px] md:text-[10px] text-orange-500 font-black uppercase tracking-widest mb-1 md:mb-2">Lý do bị trả từ Admin:</p>
                <p className="text-slate-300 font-bold italic leading-relaxed text-sm md:text-base">"{editingSlip.returnReason || 'Dữ liệu chưa chính xác'}"</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
              <div className="space-y-3">
                <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Chụp phiếu bơm (AI tự nhập)</label>
                <div className="relative h-48 md:h-60 rounded-[35px] md:rounded-[40px] border-2 border-dashed border-slate-800 bg-slate-950/50 overflow-hidden group cursor-pointer">
                  {formData.imageUrl ? (
                    <>
                      <img src={formData.imageUrl} className="w-full h-full object-contain" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label className="bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-2xl font-black text-[10px] md:text-xs uppercase text-white cursor-pointer">Thay ảnh</label>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-3 md:gap-4">
                      <i className="fas fa-camera text-3xl md:text-4xl text-slate-700"></i>
                      <span className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest">Bấm để chụp ảnh phiếu</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                       <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-3 md:mb-4"></div>
                       <p className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-widest animate-pulse">AI Đang phân tích...</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Khách hàng</label>
                  <select required value={formData.customerId} onChange={e => {
                    const c = customers.find(x => x.id === e.target.value);
                    setFormData({...formData, customerId: e.target.value, customerName: c?.customerName || ''});
                  }} className="w-full bg-slate-950 p-4 md:p-5 rounded-2xl md:rounded-3xl border border-slate-800 text-slate-100 font-bold outline-none text-sm md:text-base">
                    <option value="">Chọn khách hàng</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.customerName}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tên công trình</label>
                  <input required value={formData.projectId} onChange={e => setFormData({...formData, projectId: e.target.value})} placeholder="VD: Flora Novia" className="w-full bg-slate-950 p-4 md:p-5 rounded-2xl md:rounded-3xl border border-slate-800 text-slate-100 font-bold outline-none text-sm md:text-base" />
                </div>
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Khối lượng (m³)</label>
                  <input required type="number" step="0.1" value={formData.volumeActual} onChange={e => setFormData({...formData, volumeActual: parseFloat(e.target.value)})} className="w-full bg-slate-950 p-4 md:p-5 rounded-2xl md:rounded-3xl border border-slate-800 text-xl md:text-2xl font-black text-red-500 outline-none" />
                </div>
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mét ống (m)</label>
                  <input required type="number" value={formData.pipeLength} onChange={e => setFormData({...formData, pipeLength: parseFloat(e.target.value)})} className="w-full bg-slate-950 p-4 md:p-5 rounded-2xl md:rounded-3xl border border-slate-800 text-xl md:text-2xl font-black text-blue-500 outline-none" />
                </div>
              </div>

              <div className="space-y-3 md:space-y-4">
                 <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Chấm công nhân lực (*)</label>
                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 md:gap-3">
                    {teamWorkers.map(w => (
                      <div 
                        key={w.id} 
                        onClick={() => {
                          const ids = formData.workerIds || [];
                          const newIds = ids.includes(w.id) ? ids.filter(id => id !== w.id) : [...ids, w.id];
                          setFormData({...formData, workerIds: newIds});
                        }}
                        className={`p-3 md:p-4 rounded-xl md:rounded-2xl border cursor-pointer transition-all flex items-center gap-2 md:gap-3 ${formData.workerIds?.includes(w.id) ? 'bg-red-600/10 border-red-500/30 text-slate-100' : 'bg-slate-950 border-slate-800 text-slate-600 hover:border-slate-700'}`}
                      >
                         <div className={`w-3.5 h-3.5 md:w-4 md:h-4 rounded border flex items-center justify-center transition-all ${formData.workerIds?.includes(w.id) ? 'bg-red-500 border-red-500' : 'border-slate-700'}`}>
                            {formData.workerIds?.includes(w.id) && <i className="fas fa-check text-[9px] md:text-[10px] text-white"></i>}
                         </div>
                         <span className="text-[10px] md:text-[11px] font-bold uppercase truncate">{w.fullName}</span>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="flex gap-4 md:gap-5 pt-6 md:pt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 md:py-5 bg-slate-800 rounded-2xl md:rounded-3xl font-black text-[11px] md:text-xs uppercase text-slate-400">Hủy</button>
                <button type="submit" disabled={isAnalyzing} className="flex-[2] py-4 md:py-5 bg-red-600 rounded-2xl md:rounded-3xl font-black text-[11px] md:text-xs uppercase text-white shadow-2xl shadow-red-900/40 disabled:opacity-50">Gửi phiếu duyệt</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PumpingSlipList;

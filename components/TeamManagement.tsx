
import React, { useState } from 'react';
import { Team, Worker } from '../types';

interface TeamManagementProps {
  teams: Team[];
  workers: Worker[];
  onAdd: (team: Team) => void;
  onUpdate: (team: Team) => void;
  onDelete: (id: string) => void;
  onAddWorker: (worker: Worker) => void;
  onUpdateWorker: (worker: Worker) => void;
  onDeleteWorker: (id: string) => void;
  onBack: () => void;
}

const TeamManagement: React.FC<TeamManagementProps> = ({ teams, workers, onAdd, onUpdate, onDelete, onAddWorker, onUpdateWorker, onDeleteWorker, onBack }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [formData, setFormData] = useState({ teamCode: '', teamName: '', driverName: '', password: '123' });

  const [selectedTeamForWorkers, setSelectedTeamForWorkers] = useState<Team | null>(null);
  const [isWorkerModalOpen, setIsWorkerModalOpen] = useState(false);
  const [workerFormData, setWorkerFormData] = useState({ fullName: '', cccd: '', birthDate: '', startDate: '', wageRate: '5000' });

  const handleOpenAdd = () => { setEditingTeam(null); setFormData({ teamCode: '', teamName: '', driverName: '', password: '123' }); setIsModalOpen(true); };
  const handleOpenEdit = (team: Team) => { setEditingTeam(team); setFormData({ teamCode: team.teamCode, teamName: team.teamName, driverName: team.driverName, password: team.password }); setIsModalOpen(true); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTeam) onUpdate({ ...editingTeam, ...formData });
    else onAdd({ id: 't' + Date.now(), ...formData, fuelBalance: 0 });
    setIsModalOpen(false);
  };

  const handleAddWorkerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeamForWorkers) return;
    onAddWorker({ 
      id: 'w' + Date.now(), 
      teamId: selectedTeamForWorkers.id, 
      ...workerFormData, 
      wageRate: parseFloat(workerFormData.wageRate),
      status: 'active'
    } as Worker);
    setIsWorkerModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          {/* Fixed: code -> teamCode */}
          <button onClick={selectedTeamForWorkers ? () => setSelectedTeamForWorkers(null) : onBack} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400"><i className="fas fa-arrow-left"></i></button>
          <h2 className="text-2xl font-black uppercase">{selectedTeamForWorkers ? `Công nhân Đội ${selectedTeamForWorkers.teamCode}` : 'Quản lý Đội Bơm'}</h2>
        </div>
        {!selectedTeamForWorkers && <button onClick={handleOpenAdd} className="bg-red-600 px-6 py-3 rounded-xl font-black text-xs uppercase text-white shadow-xl shadow-red-900/40"><i className="fas fa-plus mr-2"></i>Thêm đội</button>}
        {selectedTeamForWorkers && <button onClick={() => setIsWorkerModalOpen(true)} className="bg-green-600 px-6 py-3 rounded-xl font-black text-xs uppercase text-white shadow-xl shadow-green-900/40"><i className="fas fa-user-plus mr-2"></i>Thêm công nhân</button>}
      </header>

      {!selectedTeamForWorkers ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {teams.map(team => (
            <div key={team.id} className="bg-slate-900 p-6 rounded-[32px] border border-slate-800 hover:border-red-500/50 transition-all group relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-500"><i className="fas fa-truck-monster text-xl"></i></div>
                <div className="flex gap-1">
                  <button onClick={() => handleOpenEdit(team)} className="w-8 h-8 rounded-full bg-slate-800 text-slate-500 hover:text-white transition-colors"><i className="fas fa-cog"></i></button>
                  <button onClick={() => onDelete(team.id)} className="w-8 h-8 rounded-full bg-slate-800 text-slate-500 hover:text-red-500 transition-colors"><i className="fas fa-trash"></i></button>
                </div>
              </div>
              {/* Fixed: code -> teamCode */}
              <h3 className="text-2xl font-black text-slate-100 uppercase tracking-tighter">{team.teamCode}</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">TX: {team.driverName}</p>
              <div className="mt-6 pt-6 border-t border-slate-800 flex justify-between items-center">
                 <p className="text-[10px] font-black text-slate-500 uppercase">Nhân lực: <span className="text-red-500">{workers.filter(w => w.teamId === team.id).length} người</span></p>
                 <button onClick={() => setSelectedTeamForWorkers(team)} className="text-[10px] font-black uppercase text-blue-500 hover:underline tracking-widest">Xem nhân viên</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900 rounded-[32px] border border-slate-800 overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/30 text-[10px] font-black uppercase text-slate-500">
                <th className="px-8 py-5">Họ tên</th>
                <th className="px-8 py-5 text-center">Năm sinh</th>
                <th className="px-8 py-5 text-center">Số CCCD</th>
                <th className="px-8 py-5 text-center">Đơn giá/m³</th>
                <th className="px-8 py-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {workers.filter(w => w.teamId === selectedTeamForWorkers.id).map(w => (
                <tr key={w.id} className="hover:bg-slate-800/20 transition-colors">
                  {/* Fixed: w.name -> w.fullName, w.birthYear -> w.birthDate, w.idNumber -> w.cccd */}
                  <td className="px-8 py-5 font-bold text-slate-200">{w.fullName}</td>
                  <td className="px-8 py-5 text-center font-medium text-slate-400">{w.birthDate}</td>
                  <td className="px-8 py-5 text-center font-mono text-slate-400 tracking-widest">{w.cccd}</td>
                  <td className="px-8 py-5 text-center font-black text-red-500">{w.wageRate}đ</td>
                  <td className="px-8 py-5 text-right"><button onClick={() => onDeleteWorker(w.id)} className="text-slate-600 hover:text-red-500 transition-colors"><i className="fas fa-trash"></i></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Đội Bơm */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
          <div className="bg-slate-900 w-full max-w-md rounded-[40px] p-8 border border-slate-800 shadow-2xl animate-in zoom-in">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-6">{editingTeam ? 'Cập nhật Đội' : 'Thêm Đội Bơm'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required placeholder="Mã đội (VD: TEAM01)" value={formData.teamCode} onChange={e => setFormData({...formData, teamCode: e.target.value})} className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 font-black text-white" />
              <input required placeholder="Tên đội (VD: Đội Bơm Số 1)" value={formData.teamName} onChange={e => setFormData({...formData, teamName: e.target.value})} className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 font-bold" />
              <input required placeholder="Tên tài xế chính" value={formData.driverName} onChange={e => setFormData({...formData, driverName: e.target.value})} className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 font-bold" />
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Mật khẩu truy cập cho đội</label>
                <input required type="text" placeholder="Mật khẩu" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 font-black text-red-500" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-800 rounded-2xl font-black text-xs uppercase">Hủy</button>
                <button type="submit" className="flex-2 py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase shadow-xl shadow-red-900/40">Lưu thông tin</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Công Nhân */}
      {isWorkerModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
          <div className="bg-slate-900 w-full max-w-lg rounded-[40px] p-10 border border-slate-800 shadow-2xl animate-in zoom-in no-scrollbar overflow-y-auto max-h-[90vh]">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-6">Thêm Công nhân mới</h3>
            <form onSubmit={handleAddWorkerSubmit} className="space-y-4">
              <input required placeholder="Họ và tên" value={workerFormData.fullName} onChange={e => setWorkerFormData({...workerFormData, fullName: e.target.value})} className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 font-bold" />
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="Năm sinh / Ngày sinh" value={workerFormData.birthDate} onChange={e => setWorkerFormData({...workerFormData, birthDate: e.target.value})} className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 font-bold" />
                <input required placeholder="Số CCCD" value={workerFormData.cccd} onChange={e => setWorkerFormData({...workerFormData, cccd: e.target.value})} className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono tracking-widest" />
              </div>
              <input required type="date" value={workerFormData.startDate} onChange={e => setWorkerFormData({...workerFormData, startDate: e.target.value})} className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 font-bold" />
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Đơn giá lương khoán (VNĐ/m³)</label>
                <input required type="number" placeholder="Ví dụ: 5000" value={workerFormData.wageRate} onChange={e => setWorkerFormData({...workerFormData, wageRate: e.target.value})} className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 font-black text-red-500 text-lg" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsWorkerModalOpen(false)} className="flex-1 py-5 bg-slate-800 rounded-3xl font-black text-xs uppercase">Quay lại</button>
                <button type="submit" className="flex-2 py-5 bg-green-600 text-white rounded-3xl font-black text-xs uppercase shadow-xl shadow-green-900/40">Thêm vào đội</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;

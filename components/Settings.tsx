
import React, { useState } from 'react';
import { Team } from '../types';

interface SettingsProps {
  adminPassword: string;
  setAdminPassword: (pw: string) => void;
  teams: Team[];
  setTeams: (teams: Team[]) => void;
  onBack: () => void;
}

const Settings: React.FC<SettingsProps> = ({ adminPassword, setAdminPassword, teams, setTeams, onBack }) => {
  const [newAdminPw, setNewAdminPw] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [newTeamPw, setNewTeamPw] = useState('');

  const handleUpdateAdminPw = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAdminPw.length < 3) return alert("Mật khẩu quá ngắn!");
    setAdminPassword(newAdminPw);
    setNewAdminPw('');
    alert("Đã cập nhật mật khẩu Admin!");
  };

  const handleUpdateTeamPw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeamId || !newTeamPw) return;
    setTeams(teams.map(t => t.id === selectedTeamId ? { ...t, password: newTeamPw } : t));
    setNewTeamPw('');
    alert("Đã cấp mật khẩu mới cho Đội!");
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex items-center gap-5">
        <button onClick={onBack} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-500 transition-all">
          <i className="fas fa-arrow-left"></i>
        </button>
        <div>
          <h2 className="text-3xl font-black text-slate-100 uppercase tracking-tighter">Cấu Hình Hệ Thống</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2 italic">Quản Lý Bảo Mật & Đội Bơm</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-10 rounded-[45px] border border-slate-800">
           <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center text-red-500"><i className="fas fa-user-shield"></i></div>
              <h3 className="text-xl font-black text-slate-100 uppercase">Đổi mật khẩu Admin</h3>
           </div>
           <form onSubmit={handleUpdateAdminPw} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Mật khẩu hiện tại: <span className="text-slate-300">******</span></label>
                <input required type="password" value={newAdminPw} onChange={e => setNewAdminPw(e.target.value)} placeholder="Nhập mật khẩu quản trị mới" className="w-full bg-slate-950 p-5 rounded-3xl border border-slate-800 text-slate-100 font-bold outline-none focus:border-red-500" />
              </div>
              <button type="submit" className="w-full py-5 bg-red-600 rounded-3xl font-black text-xs uppercase text-white shadow-xl shadow-red-900/30">Cập nhật Admin</button>
           </form>
        </div>

        <div className="glass p-10 rounded-[45px] border border-slate-800">
           <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500"><i className="fas fa-key"></i></div>
              <h3 className="text-xl font-black text-slate-100 uppercase">Cấp mật khẩu Đội bơm</h3>
           </div>
           <form onSubmit={handleUpdateTeamPw} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Chọn Đội công tác</label>
                <select required value={selectedTeamId} onChange={e => setSelectedTeamId(e.target.value)} className="w-full bg-slate-950 p-5 rounded-3xl border border-slate-800 text-slate-100 font-bold outline-none focus:border-blue-500">
                  <option value="">-- Chọn đội --</option>
                  {teams.map(t => <option key={t.id} value={t.id}>{t.teamCode} - {t.teamName}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Mật khẩu truy cập mới</label>
                <input required type="text" value={newTeamPw} onChange={e => setNewTeamPw(e.target.value)} placeholder="Nhập mật khẩu riêng cho đội" className="w-full bg-slate-950 p-5 rounded-3xl border border-slate-800 text-slate-100 font-bold outline-none focus:border-blue-500" />
              </div>
              <button type="submit" className="w-full py-5 bg-blue-600 rounded-3xl font-black text-xs uppercase text-white shadow-xl shadow-blue-900/30">Lưu & Cấp mật khẩu</button>
           </form>
        </div>
      </div>
      
      <div className="p-8 bg-slate-900/30 border border-slate-800 border-dashed rounded-[40px] text-center">
         <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">© 2025 DOANVU Concrete Systems - Bảo mật hệ thống nội bộ</p>
      </div>
    </div>
  );
};

export default Settings;

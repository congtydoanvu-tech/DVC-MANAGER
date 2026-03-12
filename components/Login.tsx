
import React, { useState, useEffect } from 'react';
import { UserRole } from '../App';
import { Team } from '../types';
import { DVC_LOGO } from '../constants';

interface LoginProps {
  onLogin: (role: UserRole, teamCode?: string) => void;
  adminPassword: string;
  teams: Team[];
}

const Login: React.FC<LoginProps> = ({ onLogin, adminPassword, teams }) => {
  const [loginType, setLoginType] = useState<'admin' | 'team'>('team');
  const [password, setPassword] = useState('');
  const [selectedTeamCode, setSelectedTeamCode] = useState('');
  const [error, setError] = useState('');
  const [isBiometricActive, setIsBiometricActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const handleLogin = (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');

    if (loginType === 'admin') {
      if (password === adminPassword) onLogin('admin');
      else setError('Mật khẩu quản trị không đúng!');
    } else {
      const team = teams.find(t => t.teamCode === selectedTeamCode);
      if (team && password === team.password) {
        onLogin('team', selectedTeamCode);
      } else {
        setError('Thông tin đội bơm không chính xác!');
      }
    }
  };

  const startBiometricScan = () => {
    if (loginType === 'team' && !selectedTeamCode) {
      setError('Vui lòng chọn đội trước!');
      return;
    }
    setIsScanning(true);
    // Giả lập quét vân tay trong 2 giây
    setTimeout(() => {
      setIsScanning(false);
      // Nếu là Admin hoặc đã chọn đội, tự động đăng nhập (giả lập đã khớp vân tay)
      if (loginType === 'admin') {
        onLogin('admin');
      } else {
        onLogin('team', selectedTeamCode);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md glass rounded-[50px] p-8 md:p-12 shadow-2xl animate-in fade-in zoom-in duration-700 relative overflow-hidden">
        {/* Decorative Light Leak */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-600/20 blur-[80px]"></div>
        
        <div className="flex flex-col items-center mb-10">
          <div className="bg-white p-4 rounded-[30px] shadow-2xl mb-6">
            <img src={DVC_LOGO} alt="DVC" className="h-12 md:h-14" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">Hệ Thống DVC</h1>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-2 italic">Concrete Systems Pro</p>
        </div>

        <div className="flex bg-slate-950/50 p-1.5 rounded-[24px] mb-8 border border-white/5">
          <button 
            onClick={() => { setLoginType('team'); setPassword(''); setError(''); }} 
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-[20px] transition-all duration-500 ${loginType === 'team' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Đội Bơm
          </button>
          <button 
            onClick={() => { setLoginType('admin'); setPassword(''); setError(''); }} 
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-[20px] transition-all duration-500 ${loginType === 'admin' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Admin
          </button>
        </div>

        {!isBiometricActive ? (
          <form onSubmit={handleLogin} className="space-y-6">
            {loginType === 'team' && (
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-500 ml-2 tracking-widest">Mã đội công tác</label>
                <select 
                  required 
                  value={selectedTeamCode} 
                  onChange={e => setSelectedTeamCode(e.target.value)} 
                  className="w-full bg-slate-950/80 p-4.5 border border-white/10 rounded-[24px] text-white font-black text-sm outline-none focus:border-red-500/50 transition-all appearance-none cursor-pointer"
                >
                  <option value="">-- CHỌN ĐỘI BƠM --</option>
                  {teams.map(t => <option key={t.id} value={t.teamCode}>{t.teamCode} - {t.driverName}</option>)}
                </select>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-slate-500 ml-2 tracking-widest">Mật khẩu truy cập</label>
              <input 
                required 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="••••••••" 
                className="w-full bg-slate-950/80 p-4.5 border border-white/10 rounded-[24px] text-white font-black tracking-[0.5em] outline-none focus:border-red-500/50 transition-all text-center text-base" 
              />
            </div>

            {error && <p className="text-center text-red-500 text-[10px] font-black uppercase tracking-tight animate-pulse">{error}</p>}

            <div className="flex flex-col gap-4 pt-2">
              <button type="submit" className="w-full py-5 bg-red-600 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-red-900/40 hover:bg-red-700 active:scale-95 transition-all">
                Đăng nhập hệ thống
              </button>
              <button 
                type="button"
                onClick={() => setIsBiometricActive(true)}
                className="w-full py-5 bg-slate-800/50 text-slate-300 rounded-[24px] font-black text-[10px] uppercase tracking-widest border border-white/5 hover:bg-slate-800 transition-all"
              >
                <i className="fas fa-fingerprint mr-2"></i> Sử dụng Vân tay
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center py-10 animate-in fade-in slide-in-from-bottom-4">
            <div 
              onClick={startBiometricScan}
              className={`fingerprint-scanner ${isScanning ? 'scanning' : ''} mb-8`}
            >
              <i className={`fas fa-fingerprint text-4xl ${isScanning ? 'text-red-500' : 'text-slate-600'}`}></i>
              <div className="scan-bar"></div>
            </div>
            
            <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed mb-8">
              {isScanning ? 'Đang xác thực vân tay...' : 'Chạm để quét vân tay đăng nhập'}
            </p>

            <button 
              onClick={() => setIsBiometricActive(false)}
              className="text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-red-500 transition-colors"
            >
              Sử dụng mật khẩu thay thế
            </button>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-[8px] text-slate-600 font-bold uppercase tracking-[0.3em]">© 2025 DOANVU Concrete Systems</p>
          <p className="text-[7px] text-slate-800 font-bold uppercase tracking-[0.2em] mt-1 italic">Authorized Personnel Only</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

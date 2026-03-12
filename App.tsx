
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import PumpingSlipList from './components/PumpingSlipList';
import Payroll from './components/Payroll';
import DebtManagement from './components/DebtManagement';
import ExportPayment from './components/ExportPayment';
import Login from './components/Login';
import Settings from './components/Settings';
import TeamManagement from './components/TeamManagement';
import CustomerManagement from './components/CustomerManagement';
import ExpenseManagement from './components/ExpenseManagement';
import FuelManagement from './components/FuelManagement';
import { MOCK_TEAMS, MOCK_WORKERS, MOCK_CUSTOMERS, FUEL_FEE_PER_M3 } from './constants';
import { Team, PumpingSlip, Worker, ExpenseRecord, FuelTransaction, Customer } from './types';

export type UserRole = 'admin' | 'team' | null;

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [teamCode, setTeamCode] = useState<string | null>(null);
  
  const [adminPassword, setAdminPassword] = useState(() => localStorage.getItem('dvc_admin_pw') || 'admin');
  const [customers, setCustomers] = useState<Customer[]>(() => JSON.parse(localStorage.getItem('dvc_customers') || JSON.stringify(MOCK_CUSTOMERS)));
  const [teams, setTeams] = useState<Team[]>(() => JSON.parse(localStorage.getItem('dvc_teams') || JSON.stringify(MOCK_TEAMS)));
  const [workers, setWorkers] = useState<Worker[]>(() => JSON.parse(localStorage.getItem('dvc_workers') || JSON.stringify(MOCK_WORKERS)));
  const [slips, setSlips] = useState<PumpingSlip[]>(() => JSON.parse(localStorage.getItem('dvc_slips') || '[]'));
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => JSON.parse(localStorage.getItem('dvc_expenses') || '[]'));
  const [fuelTransactions, setFuelTransactions] = useState<FuelTransaction[]>(() => JSON.parse(localStorage.getItem('dvc_fuel_tx') || '[]'));

  useEffect(() => {
    localStorage.setItem('dvc_admin_pw', adminPassword);
    localStorage.setItem('dvc_customers', JSON.stringify(customers));
    localStorage.setItem('dvc_teams', JSON.stringify(teams));
    localStorage.setItem('dvc_workers', JSON.stringify(workers));
    localStorage.setItem('dvc_slips', JSON.stringify(slips));
    localStorage.setItem('dvc_expenses', JSON.stringify(expenses));
  }, [adminPassword, customers, teams, workers, slips, expenses]);

  const handleUpdateSlip = useCallback((updatedSlip: PumpingSlip) => {
    setSlips(prev => prev.map(s => s.id === updatedSlip.id ? updatedSlip : s));
    
    // Logic sau khi duyệt: Cập nhật quỹ dầu cho đội bơm (10k/m3 - giả định theo tiêu chuẩn DVC)
    if (updatedSlip.status === 'approved') {
       const fuelFee = updatedSlip.volumeActual * 10000;
       setTeams(prev => prev.map(t => t.id === updatedSlip.teamId ? { ...t, fuelBalance: t.fuelBalance - fuelFee } : t));
    }
  }, []);

  const handleAddSlip = (slip: PumpingSlip) => setSlips(prev => [slip, ...prev]);

  const renderContent = () => {
    const commonProps = { onBack: () => userRole === 'admin' ? setActiveTab('dashboard') : setUserRole(null) };
    
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard {...commonProps} slips={slips} customers={customers} workers={workers} expenses={expenses} />;
      case 'slips':
        return <PumpingSlipList {...commonProps} userRole={userRole} teamCode={teamCode} teams={teams} workers={workers} customers={customers} slips={slips} onAdd={handleAddSlip} onUpdate={handleUpdateSlip} onDelete={id => setSlips(s => s.filter(x => x.id !== id))} />;
      case 'expenses':
        return <ExpenseManagement {...commonProps} userRole={userRole} teamCode={teamCode} teams={teams} expenses={expenses} onAdd={e => setExpenses(p => [e, ...p])} onDelete={id => setExpenses(p => p.filter(x => x.id !== id))} />;
      case 'payroll':
        return <Payroll {...commonProps} teams={teams} workers={workers} slips={slips} />;
      case 'customers':
        return <CustomerManagement {...commonProps} customers={customers} onAdd={c => setCustomers(p => [...p, c])} onDelete={id => setCustomers(p => p.filter(x => x.id !== id))} />;
      case 'teams':
        return <TeamManagement {...commonProps} teams={teams} workers={workers} onAdd={t => setTeams(p => [...p, t])} onUpdate={t => setTeams(p => p.map(x => x.id === t.id ? t : x))} onDelete={id => setTeams(p => p.filter(x => x.id !== id))} onAddWorker={w => setWorkers(p => [...p, w])} onUpdateWorker={w => setWorkers(p => p.map(x => x.id === w.id ? w : x))} onDeleteWorker={id => setWorkers(p => p.filter(x => x.id !== id))} />;
      case 'settings':
        return <Settings {...commonProps} adminPassword={adminPassword} setAdminPassword={setAdminPassword} teams={teams} setTeams={setTeams} />;
      case 'fuel':
        return <FuelManagement {...commonProps} userRole={userRole} teamCode={teamCode} teams={teams} transactions={[]} onAddTransaction={() => {}} />;
      case 'debt':
        return <DebtManagement {...commonProps} />;
      case 'export':
        return <ExportPayment {...commonProps} userRole={userRole} teamCode={teamCode} teams={teams} slips={slips} />;
      default:
        return null;
    }
  };

  if (!userRole) {
    return <Login adminPassword={adminPassword} teams={teams} onLogin={(role, code) => {
      setUserRole(role);
      if (code) setTeamCode(code);
      if (role === 'team') setActiveTab('slips');
    }} />;
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} onLogout={() => setUserRole(null)}>
      {renderContent()}
    </Layout>
  );
};

export default App;

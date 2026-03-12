
import React, { useState } from 'react';
import { MOCK_CUSTOMERS } from '../constants';
import { Customer } from '../types';

interface DebtManagementProps {
  onBack: () => void;
}

const DebtManagement: React.FC<DebtManagementProps> = ({ onBack }) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  
  const formatVND = (value: number) => value.toLocaleString('vi-VN') + ' đ';

  // Giả lập dữ liệu công nợ phong phú hơn
  const customersWithDebt: Customer[] = MOCK_CUSTOMERS.map(c => ({
    ...c,
    receivable: Math.floor(Math.random() * 100000000), // Tiền bơm
    payable: Math.floor(Math.random() * 20000000)     // Tiền bù trừ/chiết khấu
  }));

  const activeCustomer = customersWithDebt.find(c => c.id === selectedCustomerId);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-500 transition-all"
        >
          <i className="fas fa-arrow-left"></i>
        </button>
        <div>
          <h2 className="text-2xl font-black text-slate-100 uppercase tracking-tight">Quản lý Công nợ Đối tác</h2>
          <p className="text-slate-500 text-sm">Theo dõi thu-chi và bù trừ công nợ khách hàng</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {customersWithDebt.map((customer) => {
          const balance = customer.receivable - customer.payable;
          return (
            <div key={customer.id} className="bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-slate-700 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div>
                  {/* Fixed: customer.name to customer.customerName */}
                  <h3 className="text-lg font-black text-slate-100 group-hover:text-red-500 transition-colors uppercase">{customer.customerName}</h3>
                  <div className="flex gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-slate-800 text-[9px] font-black text-slate-500 rounded uppercase border border-slate-700">ID: {customer.id}</span>
                    <span className="px-2 py-0.5 bg-blue-500/10 text-[9px] font-black text-blue-500 rounded uppercase border border-blue-500/20">{customer.phone}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCustomerId(customer.id)}
                  className="bg-slate-800 text-slate-300 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                >
                  Đối soát
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Phải thu (Bơm)</p>
                  <p className="text-sm font-black text-slate-100">{formatVND(customer.receivable)}</p>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Phải trả (Bù trừ)</p>
                  <p className="text-sm font-black text-slate-400">{formatVND(customer.payable)}</p>
                </div>
                <div className={`p-4 rounded-2xl border ${balance > 0 ? 'bg-red-600/5 border-red-600/20' : 'bg-green-600/5 border-green-600/20'}`}>
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Dư nợ cuối</p>
                  <p className={`text-sm font-black ${balance > 0 ? 'text-red-500' : 'text-green-500'}`}>{formatVND(balance)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {activeCustomer && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl border border-slate-800 shadow-2xl animate-in zoom-in">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <div>
                {/* Fixed: activeCustomer.name to activeCustomer.customerName */}
                <h3 className="text-xl font-black text-slate-100 uppercase tracking-tighter">Báo cáo đối soát: {activeCustomer.customerName}</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Chi tiết công nợ & Lịch sử thanh toán</p>
              </div>
              <button onClick={() => setSelectedCustomerId(null)} className="text-slate-500 hover:text-white transition-colors">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2 bg-red-600 text-white p-6 rounded-3xl shadow-xl shadow-red-900/20">
                     <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Tổng nợ cần thu</p>
                     <p className="text-3xl font-black">{formatVND(activeCustomer.receivable - activeCustomer.payable)}</p>
                     <div className="mt-4 pt-4 border-t border-white/20 flex gap-4 text-[10px] font-bold uppercase">
                        <span>Bơm: {formatVND(activeCustomer.receivable)}</span>
                        <span>Đã trừ: {formatVND(activeCustomer.payable)}</span>
                     </div>
                  </div>
                  <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 flex flex-col justify-center">
                     <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Số ca bơm</p>
                     <p className="text-2xl font-black text-slate-100">24 ca</p>
                  </div>
                  <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 flex flex-col justify-center">
                     <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Lần thanh toán cuối</p>
                     <p className="text-sm font-black text-slate-100 uppercase">22/10/2023</p>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-l-4 border-red-600 pl-3">Lịch sử giao dịch</h4>
                    <div className="flex gap-2">
                       <button className="text-[10px] font-black text-slate-500 uppercase px-3 py-1 bg-slate-800 rounded-lg hover:text-slate-100 transition-all">Tuần này</button>
                       <button className="text-[10px] font-black text-white uppercase px-3 py-1 bg-red-600 rounded-lg">Tháng này</button>
                    </div>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900 text-slate-500 font-black uppercase">
                        <tr>
                          <th className="p-4">Ngày</th>
                          <th className="p-4">Nội dung giao dịch</th>
                          <th className="p-4 text-center">Loại</th>
                          <th className="p-4 text-right">Số tiền</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {[1,2,3,4,5].map(i => (
                          <tr key={i} className="hover:bg-slate-900/50 transition-colors">
                            <td className="p-4 text-slate-400 font-bold">2{i}/10/2023</td>
                            <td className="p-4">
                               <p className="font-bold text-slate-200">Phiếu bơm #{1000 + i} - Công trình Flora</p>
                               <p className="text-[10px] text-slate-500 uppercase">Khối lượng: 45.5m³ x 150k</p>
                            </td>
                            <td className="p-4 text-center">
                               <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded font-black uppercase text-[8px]">Phát sinh</span>
                            </td>
                            <td className="p-4 text-right font-black text-slate-100">{formatVND(6825000)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </div>
            </div>
            
            <div className="p-6 bg-slate-800/20 border-t border-slate-800 flex justify-between items-center gap-4">
                <button className="flex-1 py-3 bg-slate-800 text-slate-300 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-700 transition-all">
                  Cập nhật thanh toán
                </button>
                <button className="flex-1 py-3 bg-red-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 shadow-lg shadow-red-900/40">
                  <i className="fas fa-file-export mr-2"></i> Xuất file đối soát
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebtManagement;

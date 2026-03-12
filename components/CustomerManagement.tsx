
import React, { useState } from 'react';
import { Customer } from '../types';

interface CustomerManagementProps {
  customers: Customer[];
  onAdd: (c: Customer) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

const CustomerManagement: React.FC<CustomerManagementProps> = ({ customers, onAdd, onDelete, onBack }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Customer>>({ customerName: '', phone: '', address: '', note: '', defaultUnitPrice: 150000 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ 
      id: 'C' + Date.now(), 
      ...formData, 
      receivable: 0, 
      payable: 0 
    } as Customer);
    setFormData({ customerName: '', phone: '', address: '', note: '', defaultUnitPrice: 150000 });
    setIsModalOpen(false);
  };

  const formatVND = (v: number) => v.toLocaleString('vi-VN') + ' đ';

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-500 transition-all">
            <i className="fas fa-arrow-left"></i>
          </button>
          <h2 className="text-fluid-lg font-black uppercase tracking-tight text-slate-100">Quản lý Khách hàng</h2>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-red-600 px-5 md:px-6 py-3 rounded-xl font-black text-[11px] md:text-xs uppercase text-white shadow-xl shadow-red-900/40 w-full md:w-auto flex items-center justify-center">
           <i className="fas fa-plus mr-2"></i> Thêm đối tác
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {customers.map(c => (
          <div key={c.id} className="bg-slate-900 p-6 md:p-8 rounded-[35px] md:rounded-[40px] border border-slate-800 flex flex-col justify-between group hover:border-red-500/30 transition-all">
            <div className="space-y-4 md:space-y-6">
               <div className="flex justify-between items-start">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 group-hover:text-red-500 transition-colors">
                     <i className="fas fa-building text-lg md:text-xl"></i>
                  </div>
                  <button onClick={() => onDelete(c.id)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-700 hover:text-red-500 transition-colors">
                     <i className="fas fa-trash-alt text-sm"></i>
                  </button>
               </div>
               <div>
                  <h3 className="text-lg md:text-xl font-black text-slate-100 uppercase tracking-tight leading-none mb-1.5 md:mb-2">{c.customerName}</h3>
                  <p className="text-[11px] md:text-xs text-slate-500 font-bold leading-relaxed">{c.address}</p>
               </div>
               <div className="grid grid-cols-2 gap-3 md:gap-4 py-4 md:py-6 border-t border-slate-800/50 mt-4">
                  <div>
                    <p className="text-[8px] md:text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Dư nợ hiện tại</p>
                    <p className="text-base md:text-lg font-black text-red-500">{formatVND(c.receivable)}</p>
                  </div>
                  <div>
                    <p className="text-[8px] md:text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Đơn giá mặc định</p>
                    <p className="text-base md:text-lg font-black text-slate-100">{formatVND(c.defaultUnitPrice)}</p>
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
           <div className="bg-slate-900 w-full max-w-md rounded-[35px] md:rounded-[40px] p-8 md:p-10 border border-slate-800 animate-in zoom-in overflow-y-auto max-h-[90vh] no-scrollbar">
              <h3 className="text-fluid-lg font-black text-white uppercase tracking-tighter mb-8">Thêm Đối tác Khách hàng</h3>
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                 <div className="space-y-1.5">
                    <label className="text-[9px] md:text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Tên khách hàng</label>
                    <input required placeholder="Tên khách hàng" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 text-slate-100 font-bold outline-none text-sm" />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[9px] md:text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Số điện thoại</label>
                    <input required placeholder="Số điện thoại" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 text-slate-100 font-bold outline-none text-sm" />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[9px] md:text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Địa chỉ</label>
                    <input required placeholder="Địa chỉ" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 text-slate-100 font-bold outline-none text-sm" />
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-[9px] md:text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Đơn giá bơm mặc định (VNĐ/m³)</label>
                   <input required type="number" value={formData.defaultUnitPrice} onChange={e => setFormData({...formData, defaultUnitPrice: parseInt(e.target.value)})} className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 text-red-500 font-black text-lg outline-none" />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[9px] md:text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Ghi chú</label>
                    <textarea placeholder="Ghi chú thêm..." value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 text-slate-300 text-sm outline-none" rows={2} />
                 </div>
                 <div className="flex gap-4 pt-4 md:pt-6">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-800 rounded-2xl font-black text-[11px] md:text-xs uppercase text-slate-400">Hủy</button>
                    <button type="submit" className="flex-[2] py-4 bg-red-600 rounded-2xl font-black text-[11px] md:text-xs uppercase text-white shadow-xl shadow-red-900/40">Lưu khách hàng</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;

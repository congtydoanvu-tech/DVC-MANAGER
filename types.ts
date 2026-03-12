
export type TicketStatus = 'new' | 'approved' | 'returned';

export interface User {
  userId: string;
  username: string;
  role: 'admin' | 'team';
  teamId?: string;
  status: 'active' | 'inactive';
}

export interface Team {
  id: string;
  teamCode: string;
  teamName: string;
  password: string; // Cấp bởi Admin
  driverName: string;
  fuelBalance: number;
}

export interface Worker {
  id: string;
  fullName: string;
  birthDate: string;
  cccd: string;
  startDate: string;
  teamId: string;
  wageRate: number; // Đơn giá lương/m3
  status: 'active' | 'inactive';
}

export interface Customer {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  note: string;
  receivable: number; // Tiền khách nợ
  payable: number;    // Tiền DVC nợ (chiết khấu)
  defaultUnitPrice: number;
}

export interface PumpingSlip {
  id: string;
  customerId: string;
  customerName: string; // Cache để hiển thị nhanh
  projectId: string;
  teamId: string;
  workDate: string;
  siteAddress: string;
  volumeActual: number;
  pipeLength: number;
  imageUrl: string;
  note: string;
  status: TicketStatus;
  workerIds: string[]; // Chấm công trực tiếp
  returnReason?: string;
  pumpTime?: string;
}

export interface ExpenseRecord {
  id: string;
  teamId: string;
  expenseDate: string;
  category: 'Dầu' | 'Sửa chữa' | 'Ăn uống' | 'Khác';
  amount: number;
  invoiceImageUrl: string;
  description: string;
}

export interface SalaryCalculation {
  id: string;
  ticketId: string;
  workerId: string;
  volumeActual: number;
  volumeConverted: number; // max(30, actual)
  unitPrice: number;
  totalSalary: number;
}

// Add FuelTransaction interface
export interface FuelTransaction {
  id: string;
  teamId: string;
  date: string;
  type: 'collect' | 'return';
  amount: number;
  description: string;
}

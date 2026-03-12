
import { Customer, Team, Worker } from './types';

export const DVC_LOGO = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 100'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23ef4444;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23b91c1c;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='80' height='80' rx='20' fill='url(%23grad)' x='10' y='10'/%3E%3Cpath d='M35 30 L65 50 L35 70 Z' fill='white'/%3E%3Ctext x='100' y='65' font-family='Arial Black, sans-serif' font-size='50' font-weight='900' fill='%23ef4444' letter-spacing='-2'%3EDVC%3C/text%3E%3Ctext x='100' y='85' font-family='Arial, sans-serif' font-size='12' font-weight='bold' fill='%2364748b' letter-spacing='4'%3ECONCRETE SYSTEMS%3C/text%3E%3C/svg%3E";

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'C001', customerName: 'Tập đoàn Hòa Bình', phone: '0901234567', address: 'Quận 1, TP.HCM', note: 'Thanh toán sau 30 ngày', receivable: 150000000, payable: 0, defaultUnitPrice: 150000 },
  { id: 'C002', customerName: 'Coteccons', phone: '0908889999', address: 'Quận 7, TP.HCM', note: 'Chiết khấu 2%', receivable: 85000000, payable: 5000000, defaultUnitPrice: 160000 },
];

export const MOCK_TEAMS: Team[] = [
  { id: 'T1', teamCode: 'TEAM-01', teamName: 'Đội Bơm Số 1', password: '123', driverName: 'Nguyễn Văn Hùng', fuelBalance: 5000000 },
  { id: 'T2', teamCode: 'TEAM-02', teamName: 'Đội Bơm Số 2', password: '456', driverName: 'Trần Minh Tâm', fuelBalance: 3200000 },
];

export const MOCK_WORKERS: Worker[] = [
  { id: 'W1', fullName: 'Lê Văn Khải', birthDate: '1990-05-12', cccd: '079190123456', startDate: '2023-01-15', teamId: 'T1', wageRate: 5000, status: 'active' },
  { id: 'W2', fullName: 'Phạm Hồng Thái', birthDate: '1992-11-20', cccd: '079192654321', startDate: '2023-03-10', teamId: 'T1', wageRate: 5000, status: 'active' },
  { id: 'W3', fullName: 'Võ Minh Luân', birthDate: '1988-02-05', cccd: '079188112233', startDate: '2023-01-20', teamId: 'T2', wageRate: 5500, status: 'active' },
];

// Add missing FUEL_FEE_PER_M3
export const FUEL_FEE_PER_M3 = 10000;

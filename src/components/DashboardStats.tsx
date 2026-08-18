import React from 'react';
import { InspectionRequest } from '../types';
import { FileCheck, ShieldAlert, Clock, CheckCircle2, FireExtinguisher } from 'lucide-react';

export type StatusFilterType = 'ALL' | 'PENDING' | 'PASSED' | 'FAILED';

interface Props {
  requests: InspectionRequest[];
  selectedStatus: StatusFilterType;
  onSelectStatus: (status: StatusFilterType) => void;
}

export const DashboardStats: React.FC<Props> = ({ requests, selectedStatus, onSelectStatus }) => {
  const totalForms = requests.length;
  const pendingForms = requests.filter((r) => r.status === 'PENDING').length;
  const passedForms = requests.filter((r) => r.status === 'PASSED').length;
  const failedForms = requests.filter((r) => r.status === 'FAILED').length;

  const totalVehicles = requests.reduce((acc, curr) => acc + (curr.extinguisherCount || curr.extinguishers?.length || 0), 0);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
      
      {/* Total Forms */}
      <button
        type="button"
        onClick={() => onSelectStatus('ALL')}
        className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all duration-200 cursor-pointer ${
          selectedStatus === 'ALL'
            ? 'bg-red-50/80 border-red-500 shadow-md ring-2 ring-red-500/30'
            : 'bg-white border-slate-200 shadow-sm hover:border-red-300 hover:shadow-md'
        }`}
      >
        <div>
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
            แบบฟอร์มทั้งหมด
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-extrabold text-slate-900">{totalForms}</span>
            <span className="text-xs text-slate-500">รายการ</span>
          </div>
        </div>
        <div className={`p-2.5 rounded-xl ${selectedStatus === 'ALL' ? 'bg-red-600 text-white shadow-sm' : 'bg-red-50 text-red-700'}`}>
          <FileCheck className="w-5 h-5" />
        </div>
      </button>

      {/* Pending Step 2 */}
      <button
        type="button"
        onClick={() => onSelectStatus('PENDING')}
        className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all duration-200 cursor-pointer ${
          selectedStatus === 'PENDING'
            ? 'bg-amber-50 border-amber-500 shadow-md ring-2 ring-amber-500/30'
            : 'bg-white border-amber-200 shadow-sm hover:border-amber-400 hover:shadow-md'
        }`}
      >
        <div>
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
            รอผู้ตรวจ (Step 2)
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-extrabold text-amber-900">{pendingForms}</span>
            <span className="text-xs text-amber-700">รายการ</span>
          </div>
        </div>
        <div className={`p-2.5 rounded-xl ${selectedStatus === 'PENDING' ? 'bg-amber-600 text-white shadow-sm' : 'bg-amber-100 text-amber-800'}`}>
          <Clock className="w-5 h-5" />
        </div>
      </button>

      {/* Total Vehicles */}
      <button
        type="button"
        onClick={() => onSelectStatus('ALL')}
        className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all duration-200 cursor-pointer ${
          selectedStatus === 'ALL'
            ? 'bg-orange-50 border-orange-300 shadow-sm'
            : 'bg-white border-orange-200 shadow-sm hover:border-orange-400 hover:shadow-md'
        }`}
      >
        <div>
          <span className="text-[11px] font-bold text-orange-800 uppercase tracking-wider block">
            จำนวนถังดับเพลิงรวม
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-extrabold text-orange-900">{totalVehicles}</span>
            <span className="text-xs text-orange-700">ถัง</span>
          </div>
        </div>
        <div className="p-2.5 bg-orange-100 text-orange-800 rounded-xl">
          <FireExtinguisher className="w-5 h-5" />
        </div>
      </button>

      {/* Passed */}
      <button
        type="button"
        onClick={() => onSelectStatus('PASSED')}
        className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all duration-200 cursor-pointer ${
          selectedStatus === 'PASSED'
            ? 'bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-500/30'
            : 'bg-white border-emerald-200 shadow-sm hover:border-emerald-400 hover:shadow-md'
        }`}
      >
        <div>
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
            ผ่านการตรวจ (Passed)
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-extrabold text-emerald-800">{passedForms}</span>
            <span className="text-xs text-emerald-600">รายการ</span>
          </div>
        </div>
        <div className={`p-2.5 rounded-xl ${selectedStatus === 'PASSED' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-emerald-100 text-emerald-800'}`}>
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </button>

      {/* Failed / Not Pass */}
      <button
        type="button"
        onClick={() => onSelectStatus('FAILED')}
        className={`col-span-2 lg:col-span-1 p-3.5 rounded-xl border text-left flex items-center justify-between transition-all duration-200 cursor-pointer ${
          selectedStatus === 'FAILED'
            ? 'bg-red-50 border-red-500 shadow-md ring-2 ring-red-500/30'
            : 'bg-white border-red-200 shadow-sm hover:border-red-400 hover:shadow-md'
        }`}
      >
        <div>
          <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider block">
            ไม่ผ่าน (Not Pass)
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-extrabold text-red-700">{failedForms}</span>
            <span className="text-xs text-red-600">ห้ามใช้งาน</span>
          </div>
        </div>
        <div className={`p-2.5 rounded-xl ${selectedStatus === 'FAILED' ? 'bg-red-600 text-white shadow-sm' : 'bg-red-100 text-red-700'}`}>
          <ShieldAlert className="w-5 h-5" />
        </div>
      </button>

    </div>
  );
};



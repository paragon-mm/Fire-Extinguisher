import React from 'react';
import { InspectionRequest } from '../types';
import { ShieldCheck, Eye, Trash2, Clock, AlertTriangle, CheckCircle2, FireExtinguisher, ArrowRight, Filter, X, Printer } from 'lucide-react';
import { StatusFilterType } from './DashboardStats';
import { formatDate } from '../utils/formatDate';

interface Props {
  requests: InspectionRequest[];
  statusFilter?: StatusFilterType;
  onResetStatusFilter?: () => void;
  onInspect: (req: InspectionRequest) => void;
  onViewPDF: (req: InspectionRequest) => void;
  onPrintSticker?: (req: InspectionRequest) => void;
  onDelete: (id: string) => void;
  onNewRequest: () => void;
}

export const InspectionList: React.FC<Props> = ({
  requests,
  statusFilter = 'ALL',
  onResetStatusFilter,
  onInspect,
  onViewPDF,
  onPrintSticker,
  onDelete,
  onNewRequest
}) => {
  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm my-6">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8 text-orange-600" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">
          {statusFilter !== 'ALL' ? 'ไม่พบรายการตามสถานะที่เลือก' : 'ยังไม่มีรายการขอตรวจสภาพถังดับเพลิง'}
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
          {statusFilter !== 'ALL'
            ? 'ลองเปลี่ยนการกรองการตรวจหรือล้างตัวกรองเพื่อดูรายการทั้งหมด'
            : 'เริ่มต้นสร้างแบบฟอร์มขอตรวจใหม่ (Step 1) เพื่อส่งให้ผู้ตรวจประเมินตามมาตรฐาน GCM PTA MM-F-0055-01'}
        </p>
        <div className="flex items-center justify-center gap-3">
          {statusFilter !== 'ALL' && onResetStatusFilter && (
            <button
              onClick={onResetStatusFilter}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition shadow-sm inline-flex items-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              แสดงแบบฟอร์มทั้งหมด
            </button>
          )}
          <button
            onClick={onNewRequest}
            className="px-5 py-2.5 bg-red-900 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition shadow-md inline-flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            สร้างรายการขอตรวจแรก (Step 1)
          </button>
        </div>
      </div>
    );
  }

  const getStatusFilterLabel = (status: StatusFilterType | string) => {
    switch (status) {
      case 'PENDING':
        return 'รอผู้ตรวจ (Step 2)';
      case 'PASSED':
        return 'ผ่านการตรวจ (Passed)';
      case 'FAILED':
        return 'ไม่ผ่าน (Not Pass)';
      default:
        return 'ทั้งหมด';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900">
              รายการขอตรวจสภาพถังดับเพลิงในระบบ ({requests.length} รายการ)
            </h2>
            {statusFilter !== 'ALL' && (
              <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 border border-red-200 text-[11px] px-2 py-0.5 rounded-full font-bold">
                <Filter className="w-3 h-3" />
                {getStatusFilterLabel(statusFilter)}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            กระบวนการ 2 ขั้นตอน: ผู้ขอยื่นเรื่อง (Step 1) &rarr; ผู้ตรวจทำการประเมิน 8 ข้อ & ออก Running No. MM-FX-202X-XX (Step 2)
          </p>
        </div>

        {statusFilter !== 'ALL' && onResetStatusFilter && (
          <button
            onClick={onResetStatusFilter}
            className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold transition inline-flex items-center gap-1 self-start sm:self-center"
          >
            <X className="w-3.5 h-3.5" />
            ล้างตัวกรองสถานะ (แสดงทั้งหมด)
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        {/* Mobile View (Cards) */}
        <div className="lg:hidden flex flex-col p-4 gap-4 bg-slate-50">
          {requests.map((req) => {
            const isPending = req.status === 'PENDING';
            const isFailed = req.status === 'FAILED';
            const isPassed = req.status === 'PASSED';
            const extinguisherItems = req.extinguishers || [];

            return (
              <div key={req.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-mono font-bold text-slate-900 text-xs">
                      {req.runningNo ? (
                        <span className="text-red-900 bg-red-50 px-2 py-1 rounded border border-red-200 font-black">
                          {req.runningNo}
                        </span>
                      ) : isFailed ? (
                        <span className="text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200 text-[11px] font-bold">
                          [ไม่ผ่าน - ไม่ออก Running No.]
                        </span>
                      ) : (
                        <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px] font-bold">
                          [รอออก Running No.]
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-bold text-slate-800 mt-1.5">{req.company}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {isPending && (
                      <span title="รอตรวจ" className="inline-flex items-center justify-center p-1.5 bg-amber-100 border border-amber-300 text-amber-700 rounded-lg shadow-sm">
                        <Clock className="w-4 h-4 animate-pulse" />
                      </span>
                    )}
                    {isPassed && (
                      <span title="ผ่านการตรวจ" className="inline-flex items-center justify-center p-1.5 bg-emerald-100 border border-emerald-300 text-emerald-700 rounded-lg shadow-sm">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    )}
                    {isFailed && (
                      <span title="ไม่ผ่านการตรวจ" className="inline-flex items-center justify-center p-1.5 bg-red-100 border border-red-300 text-red-700 rounded-lg shadow-sm">
                        <AlertTriangle className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  {extinguisherItems.map((vh, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs">
                      <span className="w-4 h-4 bg-slate-800 text-white font-extrabold rounded text-[10px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-900">{vh.equipmentName}</span>
                      <span className="text-red-900 font-mono font-extrabold bg-red-50 px-1.5 py-0.2 rounded border border-red-100">
                        {vh.serialNumber}
                      </span>
                      {vh.location && <span className="text-slate-500 text-[10px]">({vh.location})</span>}
                    </div>
                  ))}
                </div>

                <div className="text-xs pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="font-medium">ผู้ขอ: <span className="font-bold text-slate-800">{req.supervisorName}</span></span>
                    <span>{formatDate(req.checkDate)}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 flex-wrap">
                   <div className="flex gap-2 w-full">
                     <button
                          onClick={() => onViewPDF(req)}
                          className="px-2.5 py-2 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-800 rounded-lg font-medium text-xs transition border border-slate-200 flex items-center gap-1 flex-1 justify-center"
                        >
                          <Eye className="w-4 h-4 text-red-600" />
                          PDF
                     </button>
                     {req.status === 'PASSED' && onPrintSticker && (
                       <button
                            onClick={() => onPrintSticker(req)}
                            className="px-2.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 rounded-lg font-medium text-xs transition border border-emerald-200 flex items-center gap-1 flex-1 justify-center"
                          >
                            <Printer className="w-4 h-4 text-emerald-600" />
                            Sticker
                       </button>
                     )}
                   </div>
                   <div className="flex gap-2 w-full mt-1">
                     <button
                          onClick={() => onInspect(req)}
                          className={`px-3 py-2 rounded-lg font-bold text-xs transition flex items-center justify-center gap-1 shadow-sm flex-1 ${
                            isPending
                              ? 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
                              : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                          }`}
                        >
                          <ShieldCheck className="w-4 h-4" />
                          {isPending ? '2. ตรวจสภาพ' : 'แก้ไขตรวจ'}
                     </button>
                     <button
                          onClick={() => onDelete(req.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition border border-transparent hover:border-red-200 shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                     </button>
                   </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View (Table) */}
        <table className="w-full text-left text-xs hidden lg:table">
          <thead>
            <tr className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider">
              <th className="py-3 px-4">Running No. / บริษัท</th>
              <th className="py-3 px-4">รายละเอียดถังดับเพลิง (สูงสุด 5 ถัง)</th>
              <th className="py-3 px-4">ผู้ขอ / ผู้ควบคุมงาน</th>
              <th className="py-3 px-4">ผู้ตรวจสภาพ (EHS)</th>
              <th className="py-3 px-4 text-center">ผลการตรวจ</th>
              <th className="py-3 px-4 text-right">การจัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {requests.map((req) => {
              const isPending = req.status === 'PENDING';
              const isFailed = req.status === 'FAILED';
              const isPassed = req.status === 'PASSED';
              const extinguisherItems = req.extinguishers || [];

              return (
                <tr key={req.id} className="hover:bg-slate-50/80 transition">
                  
                  {/* Running No / Company */}
                  <td className="py-3.5 px-4 align-top">
                    <div className="font-mono font-bold text-slate-900 text-xs">
                      {req.runningNo ? (
                        <span className="text-red-900 bg-red-50 px-2 py-1 rounded border border-red-200 font-black">
                          {req.runningNo}
                        </span>
                      ) : isFailed ? (
                        <span className="text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200 text-[11px] font-bold">
                          [ไม่ผ่าน - ไม่ออก Running No.]
                        </span>
                      ) : (
                        <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px] font-bold">
                          [รอออก Running No.]
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-bold text-slate-800 mt-1.5">
                      {req.company}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      วันที่ตรวจเช็ค: {formatDate(req.checkDate)}
                    </div>
                  </td>

                  {/* Vehicles List */}
                  <td className="py-3.5 px-4 align-top">
                    <div className="space-y-1">
                      {extinguisherItems.map((vh, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs">
                          <span className="w-4 h-4 bg-slate-800 text-white font-extrabold rounded text-[10px] flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-slate-900">{vh.equipmentName}</span>
                          <span className="text-red-900 font-mono font-extrabold bg-red-50 px-1.5 py-0.2 rounded border border-red-100">
                            {vh.serialNumber}
                          </span>
                          {vh.location && <span className="text-slate-500 text-[10px]">({vh.location})</span>}
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Requester & Supervisor */}
                  <td className="py-3.5 px-4 align-top">
                    <div className="font-bold text-slate-800">{req.supervisorName}</div>
                    <div className="text-[10px] text-slate-500">
                      หน่วยงาน: {req.department || 'MT Shop'}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      อนุญาต: {formatDate(req.permitStartDate)} - <span className="text-red-500 font-bold">{formatDate(req.permitEndDate)}</span>
                    </div>
                  </td>

                  {/* Inspector */}
                  <td className="py-3.5 px-4 align-top">
                    {req.inspectorName ? (
                      <div>
                        <div className="font-semibold text-slate-800">{req.inspectorName}</div>
                        <div className="text-[10px] text-slate-500">
                          วันที่ตรวจ: {formatDate(req.inspectionDate)}
                        </div>
                      </div>
                    ) : (
                      <span className="text-amber-600 font-medium italic text-[11px] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        รอดำเนินการตรวจ
                      </span>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 align-middle text-center">
                    {isPending && (
                      <span
                        title="รอตรวจ"
                        className="inline-flex items-center justify-center p-2 bg-amber-100 border border-amber-300 text-amber-700 rounded-xl shadow-sm"
                      >
                        <Clock className="w-5 h-5 animate-pulse" />
                      </span>
                    )}

                    {isPassed && (
                      <span
                        title="ผ่านการตรวจ"
                        className="inline-flex items-center justify-center p-2 bg-emerald-100 border border-emerald-300 text-emerald-700 rounded-xl shadow-sm"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </span>
                    )}

                    {isFailed && (
                      <span
                        title="ไม่ผ่านการตรวจ"
                        className="inline-flex items-center justify-center p-2 bg-red-100 border border-red-300 text-red-700 rounded-xl shadow-sm"
                      >
                        <AlertTriangle className="w-5 h-5" />
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 align-middle text-right">
                    <div className="flex items-center justify-end gap-2">
                      
                      {/* Step 2 Inspect button */}
                      <button
                        onClick={() => onInspect(req)}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs transition flex items-center gap-1 shadow-sm ${
                          isPending
                            ? 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
                            : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                        }`}
                        title={isPending ? 'ทำรายการตรวจสภาพ (Step 2)' : 'แก้ไขการตรวจสภาพ'}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {isPending ? '2. ตรวจสภาพ' : 'แก้ไขตรวจ'}
                      </button>

                      {/* View / Download PDF */}
                      <button
                        onClick={() => onViewPDF(req)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-800 rounded-lg font-medium text-xs transition border border-slate-200 flex items-center gap-1"
                        title="ดู / พิมพ์แบบฟอร์ม PDF (GCM PTA MM-F-0055-01)"
                      >
                        <Eye className="w-3.5 h-3.5 text-red-600" />
                        PDF
                      </button>

                      {/* Print Sticker */}
                      {req.status === 'PASSED' && onPrintSticker && (
                        <button
                          onClick={() => onPrintSticker(req)}
                          className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 rounded-lg font-medium text-xs transition border border-emerald-200 flex items-center gap-1"
                          title="พิมพ์สติ๊กเกอร์ (Niimbot)"
                        >
                          <Printer className="w-3.5 h-3.5 text-emerald-600" />
                          Sticker
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => onDelete(req.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="ลบรายการ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};


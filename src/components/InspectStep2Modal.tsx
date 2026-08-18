import React, { useState, useEffect } from 'react';
import { InspectionRequest, ExtinguisherDetail, ChecklistResult } from '../types';
import { CHECKLIST_ITEMS } from '../data/checklistItems';
import { getNextRunningNo } from '../utils/runningNo';
import { 
  ShieldCheck, CheckCircle2, AlertTriangle, Sparkles, UserCheck, Calendar, X,
  FireExtinguisher, Building2, MapPin, Clock, Wrench, Search, FileText
} from 'lucide-react';
import { searchEmployees, findEmployeeById, Employee } from '../data/employees';
import { formatDate } from '../utils/formatDate';

interface Props {
  request: InspectionRequest | null;
  allRequests: InspectionRequest[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedReq: InspectionRequest) => void;
}

export const InspectStep2Modal: React.FC<Props> = ({ request, allRequests, isOpen, onClose, onSave }) => {
  const [inspectorName, setInspectorName] = useState('');
  const [inspectorEmpId, setInspectorEmpId] = useState('');
  const [showEmpDropdown, setShowEmpDropdown] = useState(false);
  const [matchedEmployee, setMatchedEmployee] = useState<Employee | null>(null);

  const [inspectionDate, setInspectionDate] = useState('');
  const [runningNo, setRunningNo] = useState('');
  const [extinguishers, setExtinguishers] = useState<ExtinguisherDetail[]>([]);
  const [remarks, setRemarks] = useState('');

  // Sync internal state whenever request prop updates
  useEffect(() => {
    if (request) {
      const initDate = request.inspectionDate || new Date().toISOString().split('T')[0];
      setInspectorName(request.inspectorName || '');
      setInspectorEmpId(request.inspectorEmpId || '');
      setInspectionDate(initDate);

      let autoRunNo = '';
      if (request.runningNo) {
        const initYear = initDate.split('-')[0];
        const parts = request.runningNo.split('-');
        if (parts.length >= 4 && parts[2] !== initYear) {
          parts[2] = initYear;
          autoRunNo = parts.join('-');
        } else {
          autoRunNo = request.runningNo;
        }
      } else {
        autoRunNo = getNextRunningNo(allRequests, request.id, initDate);
      }
      setRunningNo(autoRunNo);

      setExtinguishers(
        (request.extinguishers || []).map((vh) => ({
          ...vh,
          checks: request.status === 'PENDING' ? {} : { ...vh.checks }
        }))
      );

      setRemarks(request.status === 'PENDING' ? '' : (request.remarks || ''));
    }
  }, [request, allRequests]);

  const selectEmployee = (emp: Employee) => {
    setInspectorEmpId(emp.empId);
    setInspectorName(emp.name);
    setMatchedEmployee(emp);
    setShowEmpDropdown(false);
  };

  const handleEmpIdChange = (idVal: string) => {
    setInspectorEmpId(idVal);
    const found = findEmployeeById(idVal);
    if (found) {
      setInspectorName(found.name);
      setMatchedEmployee(found);
      setShowEmpDropdown(false);
    } else {
      setMatchedEmployee(null);
      setShowEmpDropdown(true);
    }
  };

  const handleInspectionDateChange = (newDate: string) => {
    setInspectionDate(newDate);
    if (!newDate) return;
    const yearStr = newDate.split('-')[0];
    if (yearStr && yearStr.length === 4) {
      if (runningNo) {
        const parts = runningNo.split('-');
        if (parts.length >= 4) {
          parts[2] = yearStr;
          setRunningNo(parts.join('-'));
        } else {
          setRunningNo(getNextRunningNo(allRequests, request?.id, newDate));
        }
      } else {
        setRunningNo(getNextRunningNo(allRequests, request?.id, newDate));
      }
    }
  };

  if (!isOpen || !request) return null;

  // Handler for updating individual cell check result
  const handleCheckChange = (vIndex: number, itemId: number, result: ChecklistResult) => {
    const updated = [...extinguishers];
    updated[vIndex] = {
      ...updated[vIndex],
      checks: {
        ...updated[vIndex].checks,
        [itemId]: result
      }
    };
    setExtinguishers(updated);
  };

  // Quick Action: Mark all items as PASS (or NA based on extinguisher type)
  const getAutoCheckResult = (equipmentName: string, itemId: number): ChecklistResult => {
    return 'PASS'; // Fire extinguishers check all items to PASS by default
  };

  const handlePassAll = () => {
    const updated = extinguishers.map((vh) => {
      const allPassedChecks: Record<number, ChecklistResult> = {};
      CHECKLIST_ITEMS.forEach((item) => {
        allPassedChecks[item.id] = getAutoCheckResult(vh.equipmentName, item.id);
      });
      return {
        ...vh,
        checks: allPassedChecks
      };
    });
    setExtinguishers(updated);
  };

  // Quick Action: Mark all items as PASS for a specific extinguisher
  const handlePassVehicle = (vIndex: number) => {
    const updated = [...extinguishers];
    const vh = updated[vIndex];
    const allPassedChecks: Record<number, ChecklistResult> = {};
    CHECKLIST_ITEMS.forEach((item) => {
      allPassedChecks[item.id] = getAutoCheckResult(vh.equipmentName, item.id);
    });
    updated[vIndex] = {
      ...vh,
      checks: allPassedChecks
    };
    setExtinguishers(updated);
  };

  // Check if any check is FAIL
  const hasAnyFail = extinguishers.some((vh) =>
    Object.values(vh.checks).includes('FAIL')
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectorEmpId?.trim() && !inspectorName.trim()) {
      alert('กรุณาระบุรหัสพนักงานผู้ตรวจสภาพ');
      return;
    }

    
    const allChecked = extinguishers.every((vh) =>
      CHECKLIST_ITEMS.every((item) => vh.checks[item.id] !== undefined && vh.checks[item.id] !== null)
    );

    if (!allChecked) {
      alert('กรุณาตรวจสภาพให้ครบทุกข้อ (ระบุ ผ่าน/ไม่ผ่าน/ยกเว้น) ก่อนบันทึกผล');
      return;
    }

    const newStatus = hasAnyFail ? 'FAILED' : 'PASSED';

    const finalRunningNo = newStatus === 'PASSED' ? runningNo : '';

    const updatedRequest: InspectionRequest = {
      ...request,
      inspectorName,
      inspectorEmpId,
      inspectionDate,
      runningNo: finalRunningNo,
      extinguishers,
      status: newStatus,
      remarks: remarks,
      updatedAt: new Date().toISOString()
    };

    onSave(updatedRequest);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl overflow-hidden border border-slate-200 my-4 max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-200 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                  ขั้นตอนที่ 2 (Step 2)
                </span>
                <span className="text-xs font-mono text-emerald-300 font-bold">
                  MM-F-3061-12
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                ผู้ตรวจบันทึกผลตรวจ 10 ข้อ & ออกหมายเลข Running No. (MM-FX-202X-XX)
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
            
            {/* Request Overview Summary */}
          <div className="p-3.5 bg-red-50/70 border border-red-200 rounded-xl text-xs space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-red-900 font-bold border-b border-red-200 pb-2">
              <span className="flex items-center gap-1.5 text-sm">
                <Building2 className="w-4 h-4 text-red-700" />
                บริษัท {request.company}
              </span>
              <span className="text-slate-600 font-medium">
                วันที่ยื่นขอตรวจ: <strong className="text-slate-900">{formatDate(request.checkDate)}</strong>
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-700">
              <div><strong className="text-slate-900">ช่วงเวลา:</strong> {request.checkTimeSlot} {request.checkTimeSlotOther}</div>
              <div><strong className="text-slate-900">สถานที่ตรวจ:</strong> {request.checkLocation} {request.checkLocationOther}</div>
              <div><strong className="text-slate-900">ผู้ควบคุมงาน GC-M:</strong> {request.supervisorName} ({request.department || 'MT'})</div>
              <div className="sm:col-span-2"><strong className="text-slate-900">วัตถุประสงค์งาน:</strong> {request.jobDescription}</div>
              <div><strong className="text-slate-900">ระยะเวลาอนุญาต:</strong> {formatDate(request.permitStartDate)} ถึง <span className="text-red-600 font-bold">{formatDate(request.permitEndDate)}</span></div>
            </div>
          </div>

          {/* Inspector Details & Running No. */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="relative md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                ตรวจสภาพโดย (รหัสพนักงาน หรือ ชื่อผู้ตรวจ) <span className="text-red-500">*</span>
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="relative">
                  <input
                    type="text"
                    value={inspectorEmpId}
                    onChange={(e) => {
                      handleEmpIdChange(e.target.value);
                    }}
                    onFocus={() => setShowEmpDropdown(true)}
                    onBlur={() => setTimeout(() => setShowEmpDropdown(false), 200)}
                    placeholder="พิมพ์รหัสพนักงาน..."
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                  
                </div>
                
                <input
                  type="text"
                  value={inspectorName}
                  onChange={(e) => setInspectorName(e.target.value)}
                  placeholder="หรือพิมพ์ชื่อ-นามสกุล..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Employee Autocomplete Dropdown */}
              {showEmpDropdown && (
                <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-white border border-slate-300 rounded-xl shadow-2xl max-h-56 overflow-y-auto text-xs divide-y divide-slate-100">
                  {searchEmployees(inspectorEmpId || inspectorName || '').length > 0 ? (
                    searchEmployees(inspectorEmpId || inspectorName || '').map((emp) => (
                      <button
                        key={emp.empId}
                        type="button"
                        onClick={() => selectEmployee(emp)}
                        className="w-full text-left px-3 py-2 hover:bg-emerald-50 flex items-center justify-between transition group gap-2"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-mono font-bold text-emerald-900 bg-emerald-100 group-hover:bg-emerald-200 px-1.5 py-0.5 rounded text-[11px]">
                              {emp.empId}
                            </span>
                            <span className="text-slate-800 font-semibold truncate">{emp.name}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                            หน่วยงาน: <span className="font-bold text-slate-700">{emp.department}</span>
                          </div>
                        </div>
                        <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0" />
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-center text-slate-500 text-[11px]">
                      ไม่พบข้อมูลรหัสพนักงานนี้ในระบบ (ท่านสามารถพิมพ์ชื่อลงในช่องข้างๆ ได้)
                    </div>
                  )}
                  <div className="p-1.5 bg-slate-50 flex items-center justify-center text-[10px] text-slate-500">
                    <span>แสดงสูงสุด 10 รายการที่ตรงกัน</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                วันที่ตรวจสภาพ
              </label>
              <input
                type="date"
                value={inspectionDate}
                onChange={(e) => handleInspectionDateChange(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Running Number (รูปแบบ MM-FX-YYYY-XX)
              </label>
              {hasAnyFail ? (
                <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-xs font-bold text-red-700">
                  ❌ ผลตรวจไม่ผ่าน: ไม่ออกหมายเลข Running No.
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    value={runningNo}
                    onChange={(e) => setRunningNo(e.target.value)}
                    placeholder="เช่น MM-FX-2026-01"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-black text-red-900 focus:ring-2 focus:ring-emerald-500"
                    required={!hasAnyFail}
                  />
                  <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                    ✓ จะออกหมายเลข MM-FX-202X-XX อัตโนมัติเมื่อตรวจผ่านทุกข้อ
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Quick Fill Action & Status Indicator */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 p-3 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">สรุปผลการตรวจ:</span>
              {hasAnyFail ? (
                <span className="px-3 py-1 bg-red-600 text-white font-extrabold text-xs rounded-lg flex items-center gap-1 shadow-sm">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  ไม่ผ่านการตรวจสอบ (Not Pass) - ห้ามนำเข้าเขตผลิต
                </span>
              ) : (
                <span className="px-3 py-1 bg-emerald-600 text-white font-extrabold text-xs rounded-lg flex items-center gap-1 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  ผ่านการตรวจสอบ (PASSED)
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handlePassAll}
              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              ผ่านการตรวจทุกข้อ (Pass All)
            </button>
          </div>

          {/* Inspection Matrix Grid */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-300 shadow-sm">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="p-2 border-r border-slate-700 w-8 text-center">ข้อที่</th>
                  <th className="p-2 border-r border-slate-700 text-left min-w-[180px] max-w-[200px]">
                    รายการตรวจสภาพ (Checklist 8 ข้อ แบบฟอร์ม MM-F-0055-01)
                  </th>
                  {extinguishers.map((vh, idx) => (
                    <th key={`vh-head-${vh.id || idx}`} className="p-2 border-r last:border-r-0 border-slate-700 text-center min-w-[140px]">
                      <div className="font-extrabold text-amber-300 flex items-center justify-center gap-1">
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        ถังที่ {idx + 1}
                      </div>
                      <div className="text-[11px] font-bold text-white truncate max-w-[150px]" title={vh.equipmentName}>
                        {vh.equipmentName}
                      </div>
                      <div className="text-[10px] text-orange-300 font-mono font-extrabold">
                        {vh.serialNumber} ({vh.location})
                      </div>
                      
                      <div className="mt-2 flex justify-center">
                        <button
                          type="button"
                          onClick={() => handlePassVehicle(idx)}
                          className="flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] px-2 py-1.5 rounded-md shadow-sm transition w-full font-bold"
                          title="ผ่านทุกข้อสำหรับคันนี้"
                        >
                          <Sparkles className="w-3 h-3 text-amber-300" />
                          ผ่านทุกข้อ (ถังนี้)
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CHECKLIST_ITEMS.map((item) => (
                  <tr key={item.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="p-2 border-r border-slate-200 text-center font-bold text-slate-700">
                      {item.id}
                    </td>
                    <td className="p-2 border-r border-slate-200">
                      <div className="font-bold text-slate-800 text-xs">
                        {item.title}
                        
                      </div>
                      {item.subDetails && item.subDetails.length > 0 && (
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {item.subDetails.join(' / ')}
                        </div>
                      )}
                    </td>

                    {extinguishers.map((vh, idx) => {
                      const currentVal = vh.checks[item.id];
                      return (
                        <td key={`vh-cell-${item.id}-${vh.id || idx}`} className="p-2 border-r last:border-r-0 border-slate-200 text-center align-middle">
                          <div className="flex items-center justify-center gap-1">
                            
                            {/* Pass Button: O */}
                            <button
                              type="button"
                              onClick={() => handleCheckChange(idx, item.id, 'PASS')}
                              className={`w-8 h-7 rounded-md font-extrabold text-xs flex items-center justify-center transition ${
                                currentVal === 'PASS'
                                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-600 shadow-sm'
                                  : 'bg-slate-100 text-slate-400 hover:bg-emerald-100 hover:text-emerald-700'
                              }`}
                              title="ผ่าน (O)"
                            >
                              O
                            </button>

                            {/* Fail Button: X */}
                            <button
                              type="button"
                              onClick={() => handleCheckChange(idx, item.id, 'FAIL')}
                              className={`w-8 h-7 rounded-md font-extrabold text-xs flex items-center justify-center transition ${
                                currentVal === 'FAIL'
                                  ? 'bg-red-600 text-white ring-2 ring-red-600 shadow-sm animate-pulse'
                                  : 'bg-slate-100 text-slate-400 hover:bg-red-100 hover:text-red-700'
                              }`}
                              title="ไม่ผ่าน (X)"
                            >
                              X
                            </button>

                            {/* NA Button: - */}
                            <button
                              type="button"
                              onClick={() => handleCheckChange(idx, item.id, 'NA')}
                              className={`w-7 h-7 rounded-md font-extrabold text-xs flex items-center justify-center transition ${
                                currentVal === 'NA'
                                  ? 'bg-slate-700 text-white ring-2 ring-slate-700'
                                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                              }`}
                              title="ยกเว้น (-)"
                            >
                              -
                            </button>

                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Inspection Stacked Cards (Mobile) */}
          <div className="block md:hidden space-y-6">
            {extinguishers.map((vh, idx) => (
              <div key={`vh-mob-${vh.id || idx}`} className="border border-slate-300 rounded-xl overflow-hidden shadow-sm bg-white">
                <div className="bg-slate-900 text-white p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-extrabold text-amber-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      ถังที่ {idx + 1}
                    </div>
                    <button
                      type="button"
                      onClick={() => handlePassVehicle(idx)}
                      className="flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] px-2 py-1.5 rounded-md shadow-sm transition font-bold"
                    >
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      ผ่านทุกข้อ (ถังนี้)
                    </button>
                  </div>
                  <div className="text-sm font-bold text-white">{vh.equipmentName}</div>
                  <div className="text-xs text-orange-300 font-mono font-extrabold mb-1">{vh.serialNumber} ({vh.location})</div>
                </div>
                <div className="divide-y divide-slate-100">
                  {CHECKLIST_ITEMS.map((item) => {
                    const currentVal = vh.checks[item.id];
                    return (
                      <div key={item.id} className="p-3 hover:bg-slate-50 transition-colors">
                        <div className="flex flex-col gap-2">
                          <div>
                            <div className="font-bold text-slate-800 text-sm flex gap-1.5 items-start">
                              <span className="text-slate-400 w-4 shrink-0">{item.id}.</span>
                              <span className="leading-relaxed">
                                {item.title}
                              </span>
                            </div>
                            {item.subDetails && item.subDetails.length > 0 && (
                              <div className="text-xs text-slate-500 mt-1 ml-5 pl-0.5">
                                {item.subDetails.join(' / ')}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 ml-5 mt-1">
                            <button
                              type="button"
                              onClick={() => handleCheckChange(idx, item.id, 'PASS')}
                              className={`flex-1 h-10 rounded-md font-extrabold text-sm flex items-center justify-center transition ${
                                currentVal === 'PASS'
                                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-600 shadow-sm'
                                  : 'bg-slate-100 text-slate-400 hover:bg-emerald-100 hover:text-emerald-700'
                              }`}
                              title="ผ่าน (O)"
                            >
                              O
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCheckChange(idx, item.id, 'FAIL')}
                              className={`flex-1 h-10 rounded-md font-extrabold text-sm flex items-center justify-center transition ${
                                currentVal === 'FAIL'
                                  ? 'bg-red-600 text-white ring-2 ring-red-600 shadow-sm animate-pulse'
                                  : 'bg-slate-100 text-slate-400 hover:bg-red-100 hover:text-red-700'
                              }`}
                              title="ไม่ผ่าน (X)"
                            >
                              X
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCheckChange(idx, item.id, 'NA')}
                              className={`flex-1 h-10 rounded-md font-extrabold text-sm flex items-center justify-center transition ${
                                currentVal === 'NA'
                                  ? 'bg-slate-700 text-white ring-2 ring-slate-700'
                                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                              }`}
                              title="ยกเว้น (-)"
                            >
                              -
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Remarks input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              หมายเหตุเพิ่มเติมการตรวจสภาพ
            </label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="ระบุข้อเสนอแนะ หรือสาเหตุการไม่ผ่านการตรวจสภาพ (ถ้ามี)"
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          </div>

          {/* Action Buttons */}
          <div className="p-4 sm:px-6 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-md transition flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              บันทึกการตรวจสภาพ & ออก Running No.
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


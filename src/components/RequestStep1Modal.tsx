import React, { useState } from 'react';
import { InspectionRequest, ExtinguisherDetail } from '../types';
import { PlusCircle, FireExtinguisher, Building2, User, Calendar, X, Clock, MapPin, Shield, Wrench, Search, CheckCircle2 } from 'lucide-react';
import { findEmployeeById, searchEmployees, Employee } from '../data/employees';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newReq: Omit<InspectionRequest, 'id' | 'createdAt' | 'updatedAt' | 'runningNo' | 'status'>) => void;
}

export const RequestStep1Modal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  const [companyCode, setCompanyCode] = useState('');
  const [company, setCompany] = useState('');
  const [checkDate, setCheckDate] = useState(() => new Date().toISOString().split('T')[0]);
  
  const [checkTimeSlot, setCheckTimeSlot] = useState('08:30 - 09:30 น.');
  const [checkTimeSlotOther, setCheckTimeSlotOther] = useState('');
  
  const [checkLocation, setCheckLocation] = useState('พื้นที่ MT Shop');
  const [checkLocationOther, setCheckLocationOther] = useState('');

  const [supervisorEmpId, setSupervisorEmpId] = useState('');
  const [supervisorName, setSupervisorName] = useState('');
  const [showEmpDropdown, setShowEmpDropdown] = useState(false);
  const [matchedEmployee, setMatchedEmployee] = useState<Employee | null>(null);

  const [department, setDepartment] = useState('');
  const [supervisorDate, setSupervisorDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [supervisorTime, setSupervisorTime] = useState('08:00');

  const [jobDescription, setJobDescription] = useState('');
  const [permitStartDate, setPermitStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [permitEndDate, setPermitEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });

  const [extinguisherCount, setExtinguisherCount] = useState(1);
  const [extinguishers, setExtinguishers] = useState<Array<{ equipmentName: string; serialNumber: string; location: string }>>([
    { equipmentName: '', serialNumber: '', location: '' }
  ]);

  if (!isOpen) return null;

  const addDays = (dateStr: string, days: number): string => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  const handleCheckDateChange = (val: string) => {
    setCheckDate(val);
    setPermitStartDate(val);
    setPermitEndDate(addDays(val, 30));
  };

  const handlePermitStartDateChange = (val: string) => {
    setPermitStartDate(val);
    setPermitEndDate(addDays(val, 30));
  };

  const handleEmpIdChange = (idVal: string) => {
    setSupervisorEmpId(idVal);
    const found = findEmployeeById(idVal);
    if (found) {
      setSupervisorName(found.name);
      if (found.department) {
        setDepartment(found.department);
      }
      setMatchedEmployee(found);
      setShowEmpDropdown(false);
    } else {
      setMatchedEmployee(null);
      setShowEmpDropdown(true);
    }
  };

  const selectEmployee = (emp: Employee) => {
    setSupervisorEmpId(emp.empId);
    setSupervisorName(emp.name);
    if (emp.department) {
      setDepartment(emp.department);
    }
    setMatchedEmployee(emp);
    setShowEmpDropdown(false);
  };

  const handleExtinguisherCountChange = (count: number) => {
    const validCount = Math.max(1, Math.min(5, count)); // Max 5 extinguishers
    setExtinguisherCount(validCount);
    
    if (validCount > extinguishers.length) {
      const added = Array.from({ length: validCount - extinguishers.length }, (_, i) => ({
        equipmentName: '',
        serialNumber: '',
        location: ''
      }));
      setExtinguishers([...extinguishers, ...added]);
    } else {
      setExtinguishers(extinguishers.slice(0, validCount));
    }
  };

  const handleExtinguisherChange = (index: number, field: any, value: any) => {
    const updated = [...extinguishers];
    updated[index][field] = value;
    setExtinguishers(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim()) {
      alert('กรุณาระบุชื่อบริษัทที่ขอตรวจ');
      return;
    }
    if (!supervisorName.trim()) {
      alert('กรุณาระบุชื่อผู้ขอตรวจ');
      return;
    }

    const finalExtinguishers = extinguishers.map((v, idx) => ({
      id: idx + 1,
      equipmentName: v.equipmentName || `ถังดับเพลิงใบที่ ${idx + 1}`,
      serialNumber: v.serialNumber || '-',
      location: v.location || '-',
      checks: {}
    }));

    onSubmit({
      documentNo: 'MM-F-0055-01',
      company,
      companyCode: companyCode || 'GCM',
      checkDate,
      checkTimeSlot,
      checkTimeSlotOther,
      checkLocation,
      checkLocationOther,
      supervisorName,
      supervisorEmpId,
      department,
      supervisorDate,
      supervisorTime,
      jobDescription,
      permitStartDate,
      permitEndDate,
      inspectorName: '', // Step 2 fill
      extinguisherCount,
      extinguishers: finalExtinguishers,
      remarks: 'ยื่นคำขอตรวจสอบสภาพถังดับเพลิงแล้ว (ขั้นตอนที่ 1)'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-200 my-6">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-red-900 via-slate-900 to-red-950 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-500/20 rounded-xl backdrop-blur-md border border-orange-400/30">
              <FireExtinguisher className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-orange-200 bg-orange-900/60 px-2.5 py-0.5 rounded-full border border-orange-400/30">
                  ขั้นตอนที่ 1 (Step 1)
                </span>
                <span className="text-xs font-mono text-slate-300 font-bold">
                  MM-F-0055-01
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                ยื่นขอตรวจสภาพถังดับเพลิง
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

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[82vh] overflow-y-auto">
          <datalist id="equipment-options">
            <option value="ผงเคมีแห้ง (Dry Chemical) 10 ปอนด์" />
            <option value="ผงเคมีแห้ง (Dry Chemical) 15 ปอนด์" />
            <option value="ผงเคมีแห้ง (Dry Chemical) 20 ปอนด์" />
            <option value="คาร์บอนไดออกไซด์ (CO2) 10 ปอนด์" />
            <option value="คาร์บอนไดออกไซด์ (CO2) 15 ปอนด์" />
            <option value="น้ำยาเหลวระเหย (Clean Agent)" />
            <option value="โฟม (Foam)" />
          </datalist>


          
          {/* Section 1: General Info */}
          <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="text-xs font-bold text-red-900 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2 border-slate-200">
              <Building2 className="w-4 h-4 text-red-600" />
              ส่วนที่ 1 : ข้อมูลการขอตรวจสอบและอนุญาต
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Check Date */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-red-600" />
                  วันที่ตรวจเช็ค <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={checkDate}
                  onChange={(e) => handleCheckDateChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              {/* Company name */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ชื่อบริษัทที่ขอตรวจ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="เช่น บริษัท จีซีเอ็ม พีทีเอ จำกัด"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-red-900 focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              {/* Check time slot */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-red-600" />
                  ช่วงเวลาที่ตรวจ
                </label>
                <select
                  value={checkTimeSlot}
                  onChange={(e) => setCheckTimeSlot(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-red-500"
                >
                  <option value="" disabled>-- กรุณาเลือก --</option>
                  <option value="08:30 - 09:30 น.">08:30 - 09:30 น.</option>
                  <option value="13:00 - 14:00 น.">13:00 - 14:00 น.</option>
                  <option value="อื่นๆ">อื่นๆ ระบุ...</option>
                </select>
                {checkTimeSlot === 'อื่นๆ' && (
                  <input
                    type="text"
                    value={checkTimeSlotOther}
                    onChange={(e) => setCheckTimeSlotOther(e.target.value)}
                    placeholder="ระบุช่วงเวลา เช่น 15:00 - 16:00 น."
                    className="w-full mt-2 px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                  />
                )}
              </div>

              {/* Check Location */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-600" />
                  สถานที่ตรวจ
                </label>
                <select
                  value={checkLocation}
                  onChange={(e) => setCheckLocation(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-red-500"
                >
                  <option value="" disabled>-- กรุณาเลือก --</option>
                  <option value="พื้นที่ MT Shop">พื้นที่ MT Shop</option>
                  <option value="อื่นๆ">อื่นๆ ระบุ...</option>
                </select>
                {checkLocation === 'อื่นๆ' && (
                  <input
                    type="text"
                    value={checkLocationOther}
                    onChange={(e) => setCheckLocationOther(e.target.value)}
                    placeholder="ระบุสถานที่ตรวจ เช่น หน้าลานจอดรถคลังสินค้า"
                    className="w-full mt-2 px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                  />
                )}
              </div>

              {/* Supervisor GC-M PTA (With Employee ID Lookup) */}
              <div className="sm:col-span-2 bg-red-50/80 border border-red-200 p-3.5 rounded-xl space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-1 border-b border-red-200/80 pb-2">
                  <label className="font-bold text-red-950 text-xs flex items-center gap-1.5">
                    <User className="w-4 h-4 text-red-600" />
                    ผู้ควบคุมงาน GC-M PTA <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-red-700 font-medium">
                    พิมพ์รหัสพนักงานเพื่อค้นหาชื่ออัตโนมัติ
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Employee ID input */}
                  <div className="relative">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      รหัสพนักงานผู้ควบคุมงาน <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={supervisorEmpId}
                        onChange={(e) => {
                          handleEmpIdChange(e.target.value);
                        }}
                        onFocus={() => setShowEmpDropdown(true)}
                        onBlur={() => setTimeout(() => setShowEmpDropdown(false), 200)}
                        placeholder="พิมพ์รหัสพนักงาน เช่น 98014087, 26009299"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-red-950 focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    {/* Employee Autocomplete Dropdown */}
                    {showEmpDropdown && (
                      <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-white border border-slate-300 rounded-xl shadow-2xl max-h-56 overflow-y-auto text-xs divide-y divide-slate-100">
                        {searchEmployees(supervisorEmpId || supervisorName || '').length > 0 ? (
                          searchEmployees(supervisorEmpId || supervisorName || '').map((emp) => (
                            <button
                              key={emp.empId}
                              type="button"
                              onClick={() => selectEmployee(emp)}
                              className="w-full text-left px-3 py-2 hover:bg-red-50 flex items-center justify-between transition group gap-2"
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-mono font-bold text-red-900 bg-red-100 group-hover:bg-red-200 px-1.5 py-0.5 rounded text-[11px]">
                                    {emp.empId}
                                  </span>
                                  <span className="text-slate-800 font-semibold truncate">{emp.name}</span>
                                </div>
                                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                                  หน่วยงาน: <span className="font-bold text-slate-700">{emp.department}</span>
                                </div>
                              </div>
                              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-600 shrink-0" />
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

                  {/* Displayed Supervisor Name */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      ชื่อ-นามสกุล ผู้ควบคุมงาน <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={supervisorName}
                      onChange={(e) => setSupervisorName(e.target.value)}
                      placeholder="ชื่อ-นามสกุล ผู้ควบคุมงาน"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Department */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">
                    หน่วยงาน
                  </label>
                </div>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="เช่น PT-PD-MN-ICE, PE-PD-OP-RA"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              {/* Job Description */}
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  ใช้ในงาน (วัตถุประสงค์การนำเข้า) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="เช่น งานขนย้ายท่อและโครงสร้างเหล็กเข้าเขตกระบวนการผลิต"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              {/* Permit Period */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  อนุญาตให้ใช้ตั้งแต่วันที่
                </label>
                <input
                  type="date"
                  value={permitStartDate}
                  onChange={(e) => handlePermitStartDateChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">
                    ถึงวันที่
                  </label>
                  <span className="text-[10px] text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded font-medium">
                    นับอัตโนมัติ 30 วัน
                  </span>
                </div>
                <input
                  type="date"
                  value={permitEndDate}
                  onChange={(e) => setPermitEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50/50 focus:ring-2 focus:ring-red-500 font-medium text-slate-900"
                  required
                />
              </div>

            </div>
          </div>

          {/* Section 2: Extinguishers Info (Max 5 Extinguishers) */}
          <div className="space-y-3 pt-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2 border-slate-200">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-amber-600" />
                รายละเอียดถังดับเพลิงที่ขอตรวจ (สูงสุด 5 ถัง/ใบขอ)
              </h3>

              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-700">จำนวนที่ขอตรวจ:</label>
                <select
                  value={extinguisherCount}
                  onChange={(e) => handleExtinguisherCountChange(parseInt(e.target.value))}
                  className="px-3 py-1 bg-amber-50 border border-amber-300 rounded-lg text-xs font-black text-amber-900 focus:ring-2 focus:ring-amber-500"
                >
                  <option value={1}>1 ถัง</option>
                  <option value={2}>2 ถัง</option>
                  <option value={3}>3 ถัง</option>
                  <option value={4}>4 ถัง</option>
                  <option value={5}>5 ถัง (สูงสุด)</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {extinguishers.map((vh, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-red-900 border-b border-slate-200 pb-1.5">
                    <span className="w-6 h-6 rounded-md bg-red-900 text-white flex items-center justify-center text-xs">
                      {idx + 1}
                    </span>
                    <span>ถังดับเพลิงใบที่ {idx + 1}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        1. ชนิด / ขนาดถัง <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={vh.equipmentName}
                        list="equipment-options"
                        onChange={(e) => handleExtinguisherChange(idx, 'equipmentName', e.target.value)}
                        placeholder="เช่น ผงเคมีแห้ง 15 ปอนด์"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-red-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        2. หมายเลขถัง (S/N) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={vh.serialNumber}
                        onChange={(e) => handleExtinguisherChange(idx, 'serialNumber', e.target.value)}
                        placeholder="เช่น SN-12345"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-red-500 font-mono font-bold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        3. สถานที่ใช้งาน
                      </label>
                      <select
                        value={vh.location}
                        onChange={(e) => handleExtinguisherChange(idx, 'location', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-red-500"
                        required
                      >
                        <option value="">-- เลือกสถานที่ --</option>
                        <option value="รถ">รถ</option>
                        <option value="กระบวนการผลิต">กระบวนการผลิต</option>
                        <option value="อื่นๆ">อื่นๆ</option>
                      </select>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-red-900 hover:bg-red-800 rounded-lg shadow-md transition flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              ส่งรายการขอตรวจ (Step 1)
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

import React from 'react';
import { InspectionRequest } from '../types';
import { CHECKLIST_ITEMS } from '../data/checklistItems';
import { FireExtinguisher, CheckCircle2, AlertTriangle, Printer, Download, X } from 'lucide-react';
import { formatDate } from '../utils/formatDate';

interface Props {
  data: InspectionRequest;
  onClose?: () => void;
  onPrint?: () => void;
  onDownloadPDF?: () => void;
}

export const GCMFormPrintView: React.FC<Props> = ({ data, onClose, onPrint, onDownloadPDF }) => {
  const {
    documentNo = 'MM-F-0055-01',
    runningNo,
    company,
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
    inspectorName,
    inspectionDate,
    extinguishers = [],
    status,
    remarks
  } = data;

  // Helper for check status symbols: O (Pass), X (Fail), - (NA)
  const renderSymbol = (res: 'PASS' | 'FAIL' | 'NA' | undefined) => {
    if (res === 'PASS') return <span className="font-black text-emerald-800 text-sm">O</span>;
    if (res === 'FAIL') return <span className="font-black text-red-600 text-sm">X</span>;
    return <span className="text-slate-400 font-bold text-xs">-</span>;
  };

  const isFailed = status === 'FAILED' || extinguishers.some(vh => Object.values(vh.checks).includes('FAIL'));

  return (
    <div className="w-full max-w-5xl mx-auto bg-white p-4 sm:p-8 rounded-xl shadow-lg border border-slate-200 print:shadow-none print:border-none print:p-0">
      
      {/* Action Bar (Screen mode only) */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200 print:hidden">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-red-900 text-white text-xs font-bold rounded-full">
            แบบฟอร์ม MM-F-0055-01
          </span>
          {runningNo ? (
            <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-mono font-black rounded border border-emerald-300">
              เลขที่อนุญาต: {runningNo}
            </span>
          ) : (
            <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded border border-amber-300">
              [รอการอนุมัติ / ออก Running No.]
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onDownloadPDF && (
            <button
              onClick={onDownloadPDF}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-4 h-4" />
              ดาวน์โหลด PDF
            </button>
          )}

          {onPrint && (
            <button
              onClick={onPrint}
              className="px-4 py-2 bg-red-800 hover:bg-red-900 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              พิมพ์ Sticker
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Actual Printable Form Wrapper */}
      <div className="overflow-x-auto w-full print:hidden">
        <div id="gcm-form-pdf-container" className="bg-white text-slate-900 p-10 text-xs font-sans leading-relaxed border border-slate-400 min-w-[794px] w-[794px] h-[1123px] mx-auto box-border flex flex-col">
          
          {/* Header Section */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl9kdS0IYKjYC-iIzRU0efSyXgWKzoV9oXH29cAcpQww&s" 
                alt="GCM PTA Logo" 
                className="h-10 w-auto object-contain" 
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="text-center flex-1 mx-3">
              <h1 className="text-sm font-black text-slate-900 tracking-tight">
                แบบฟอร์มตรวจสภาพถังดับเพลิง
              </h1>
            </div>

            <div className="text-right text-[10px] font-mono border-2 border-emerald-600 px-2 py-1 bg-emerald-50 shrink-0">
              <div className="text-[9px] text-emerald-700 font-bold">เลขที่อนุญาต</div>
              <div className="font-extrabold text-emerald-700 text-sm">{runningNo || '-'}</div>
            </div>
          </div>

          {/* Form Fields Header Block */}
          <div className="space-y-2 mb-3 text-[11px] border-b pb-3 border-slate-300">
            
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-5 flex items-center gap-1.5">
                <span className="font-bold shrink-0">วันที่ตรวจเช็ค :</span>
                <span className="border-b border-slate-600 font-bold px-2 py-0.5 text-red-950 flex-1 min-w-[120px]">{formatDate(checkDate) || '-'}</span>
              </div>
              
              <div className="col-span-7 flex items-center gap-2 flex-wrap">
                <span className="font-bold shrink-0">ช่วงเวลาที่ตรวจ :</span>
                <span className="flex items-center gap-1">
                  <span className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${checkTimeSlot === '08:30 - 09:30 น.' ? 'border-red-900 bg-red-900 text-white' : 'border-slate-600 bg-white text-slate-400'}`}>
                    {checkTimeSlot === '08:30 - 09:30 น.' ? '✓' : ' '}
                  </span>
                  <span>08:30 - 09:30 น.</span>
                </span>
                <span className="flex items-center gap-1 ml-2">
                  <span className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${checkTimeSlot === '13:00 - 14:00 น.' ? 'border-red-900 bg-red-900 text-white' : 'border-slate-600 bg-white text-slate-400'}`}>
                    {checkTimeSlot === '13:00 - 14:00 น.' ? '✓' : ' '}
                  </span>
                  <span>13:00 - 14:00 น.</span>
                </span>
                <span className="flex items-center gap-1 ml-2">
                  <span className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${checkTimeSlot !== '08:30 - 09:30 น.' && checkTimeSlot !== '13:00 - 14:00 น.' ? 'border-red-900 bg-red-900 text-white' : 'border-slate-600 bg-white text-slate-400'}`}>
                    {checkTimeSlot !== '08:30 - 09:30 น.' && checkTimeSlot !== '13:00 - 14:00 น.' ? '✓' : ' '}
                  </span>
                  <span>อื่นๆ {checkTimeSlotOther || ''}</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-6 flex items-center gap-2">
                <span className="font-bold shrink-0">สถานที่ตรวจ :</span>
                <span className="flex items-center gap-1">
                  <span className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${checkLocation === 'พื้นที่ MT Shop' ? 'border-red-900 bg-red-900 text-white' : 'border-slate-600 bg-white text-slate-400'}`}>
                    {checkLocation === 'พื้นที่ MT Shop' ? '✓' : ' '}
                  </span>
                  <span>พื้นที่ MT Shop</span>
                </span>
                <span className="flex items-center gap-1 ml-2">
                  <span className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${checkLocation !== 'พื้นที่ MT Shop' ? 'border-red-900 bg-red-900 text-white' : 'border-slate-600 bg-white text-slate-400'}`}>
                    {checkLocation !== 'พื้นที่ MT Shop' ? '✓' : ' '}
                  </span>
                  <span>อื่นๆ {checkLocationOther || ''}</span>
                </span>
              </div>

              <div className="col-span-6 flex items-center gap-1.5">
                <span className="font-bold shrink-0">ชื่อบริษัทที่ขอตรวจ :</span>
                <span className="border-b border-slate-600 font-bold px-2 py-0.5 text-red-900 flex-1">{company || '-'}</span>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-6 flex items-center gap-1.5">
                <span className="font-bold shrink-0">ผู้ควบคุมงาน GC-M PTA :</span>
                <span className="border-b border-slate-600 font-bold px-2 py-0.5 flex-1">
                  {supervisorName ? (supervisorEmpId ? `${supervisorName} (${supervisorEmpId})` : supervisorName) : '-'}
                </span>
              </div>
              <div className="col-span-3 flex items-center gap-1.5">
                <span className="font-bold shrink-0">หน่วยงาน :</span>
                <span className="border-b border-slate-600 px-2 py-0.5 flex-1">{department || 'MT'}</span>
              </div>
              <div className="col-span-3 flex items-center gap-1.5">
                <span className="font-bold shrink-0">วันที่ :</span>
                <span className="border-b border-slate-600 px-2 py-0.5 flex-1">{formatDate(supervisorDate || checkDate) || '-'}</span>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-12 flex items-center gap-1.5">
                <span className="font-bold shrink-0">ใช้ในงาน :</span>
                <span className="border-b border-slate-600 px-2 py-0.5 flex-1 font-medium">{jobDescription || '-'}</span>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-7 flex items-center gap-1.5">
                <span className="font-bold shrink-0">อนุญาตให้ใช้ตั้งแต่วันที่ :</span>
                <span className="border-b border-slate-600 font-bold px-2 py-0.5 text-red-900">{formatDate(permitStartDate) || '-'}</span>
                <span className="font-bold shrink-0 ml-2">ถึงวันที่ :</span>
                <span className="border-b border-slate-600 font-bold px-2 py-0.5 text-red-600">{formatDate(permitEndDate) || '-'}</span>
              </div>
              <div className="col-span-5 flex items-center gap-1.5 justify-end">
                <span className="font-bold shrink-0">เลขที่อนุญาต (Running No.) :</span>
                <span className="border border-slate-800 bg-amber-50 font-mono font-black px-2 py-0.5 text-red-900 text-xs">
                  {runningNo || (isFailed ? '[ไม่ผ่านการตรวจ]' : '[รอการอนุมัติ]')}
                </span>
              </div>
            </div>

          </div>

          {/* Checklist Table + Right Warning Box Grid Layout */}
          <div className="flex flex-col gap-4 mb-4">
            
            {/* Main Inspection Checklist Table (Left side) */}
            <div>
              <table className="w-full border-collapse border border-slate-800 text-[10.5px]">
                <thead>
                  <tr className="bg-slate-200 text-slate-900 border-b border-slate-800">
                    <th className="border-r border-slate-800 p-1.5 w-8 text-center">ข้อที่</th>
                    <th className="border-r border-slate-800 p-1.5 text-left min-w-[200px]">รายการตรวจสอบ</th>
                    {Array.from({ length: Math.max(extinguishers.length, 1) }).map((_, idx) => {
                      const vh = extinguishers[idx];
                      return (
                        <th key={`print-th-${idx}`} className="border-r last:border-r-0 border-slate-800 p-2 text-center w-[110px] min-w-[100px] align-top">
                          <div className="font-extrabold text-red-950 text-[11px] mb-1">ถังที่ {idx + 1}</div>
                          <div className="text-[10px] font-bold text-slate-800 leading-snug mb-1 whitespace-normal break-words">
                            {vh?.equipmentName || '-'}
                          </div>
                          <div className="text-[10px] font-mono text-red-900 font-extrabold leading-tight">
                            {vh?.serialNumber || '-'}
                          </div>
                          
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {CHECKLIST_ITEMS.map((item) => (
                    <tr key={item.id} className="border-b border-slate-400 hover:bg-slate-50">
                      <td className="border-r border-slate-800 p-1.5 text-center font-bold text-slate-800">
                        {item.id}
                      </td>
                      <td className="border-r border-slate-800 p-1.5 leading-snug">
                        <div className="font-bold text-slate-900">
                          {item.title}
                        </div>
                      </td>
                      {Array.from({ length: Math.max(extinguishers.length, 1) }).map((_, idx) => {
                        const vh = extinguishers[idx];
                        const val = vh?.checks?.[item.id];
                        return (
                          <td key={`print-td-${item.id}-${idx}`} className="border-r last:border-r-0 border-slate-800 p-1.5 text-center align-middle">
                            {renderSymbol(val)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Right Side Warning Box (ตรงตาม Excel) */}
            <div className="border border-slate-800 p-3 bg-amber-50/50 rounded flex flex-col sm:flex-row justify-between gap-4 items-center">
              <div className="space-y-2 text-xs">
                <div className="font-extrabold text-red-700 text-sm border-b border-red-300 pb-1">
                  หมายเหตุ
                </div>
                <ol className="space-y-2 text-slate-900 font-bold list-decimal list-inside text-[11px] leading-relaxed">
                  <li className="text-red-700">ตรวจสอบสภาพและรับรองการตรวจสภาพโดยหน่วยงานเจ้าของงาน</li>
                  <li className="text-slate-900">ถ้าข้อใดข้อหนึ่งที่เกี่ยวข้องกับการตรวจสภาพไม่ผ่าน (Not Pass) ไม่อนุญาตให้ใช้งาน</li>
                </ol>

                <div className="mt-4 pt-3 border-t border-amber-300 text-[10px] text-slate-700 space-y-1">
                  <div className="font-bold text-slate-900">สัญลักษณ์ผลการตรวจ:</div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-emerald-800">( O ) ผ่าน</span>
                    <span className="font-bold text-red-600">( X ) ไม่ผ่าน</span>
                    <span className="font-bold text-slate-600">( - ) ยกเว้น</span>
                  </div>
                </div>
              </div>

              {/* Overall Status summary inside form */}
              <div className={`mt-4 sm:mt-0 p-3 rounded border text-center sm:min-w-[280px] shrink-0 ${
                isFailed ? 'bg-red-100 border-red-400 text-red-900 font-extrabold' : 'bg-emerald-100 border-emerald-400 text-emerald-900 font-extrabold'
              }`}>
                {isFailed ? '❌ ผลการตรวจ: ไม่ผ่าน (Not Pass)' : '✓ ผลการตรวจ: ผ่านการตรวจสภาพ (PASSED)'}
              </div>
            </div>

          </div>

          {/* Signatures & Approvals Section */}
          <div className="border border-slate-800 p-3 bg-slate-50/50 mt-auto">
            <div className="grid grid-cols-2 gap-4 text-center text-xs">
              
              {/* Requester Signature */}
              <div className="border-r border-slate-400 pr-3 space-y-3">
                <div className="font-bold text-slate-900 mb-4">ลงชื่อ ผู้ขออนุญาต / ผู้ควบคุมงาน GC-M PTA</div>
                {supervisorName ? (
                  <div className="text-red-800 font-medium italic text-lg" style={{ fontFamily: 'cursive' }}>{supervisorName}</div>
                ) : (
                  <>
                    <div className="pt-6 border-b border-dashed border-slate-800 max-w-[200px] mx-auto mb-2"></div>
                    <div className="font-bold text-slate-800">( ................................................ )</div>
                  </>
                )}
                <div className="text-[10px] text-slate-600">วันที่ {formatDate(supervisorDate || checkDate) || '......./......./.......'}</div>
              </div>

              {/* Inspector Signature */}
              <div className="pl-3 space-y-3">
                <div className="font-bold text-slate-900 mb-4">ลงชื่อ ผู้ตรวจสอบสภาพ</div>
                {inspectorName ? (
                  <div className="text-red-800 font-medium italic text-lg" style={{ fontFamily: 'cursive' }}>{inspectorName}</div>
                ) : (
                  <>
                    <div className="pt-6 border-b border-dashed border-slate-800 max-w-[200px] mx-auto mb-2"></div>
                    <div className="font-bold text-slate-800">( ................................................ )</div>
                  </>
                )}
                <div className="text-[10px] text-slate-600">วันที่ {formatDate(inspectionDate) || '......./......./.......'}</div>
              </div>

            </div>
          </div>

          {/* Footer Document Code */}
          <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono mt-2 pt-1 border-t border-slate-300">
            <div>GCM PTA Safety Inspection Management System</div>
            <div className="font-bold text-slate-700">{documentNo}</div>
          </div>

        </div>
      </div>

      {/* Print Sticker View (Only visible during window.print()) */}
      <div className="hidden print:flex flex-col gap-2 w-full items-center justify-center pt-2">
        {extinguishers.map((vh) => (
          <div key={vh.id} className="w-[480px] border-2 border-slate-900 bg-white p-3 relative flex flex-col" style={{ pageBreakInside: 'avoid' }}>
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl9kdS0IYKjYC-iIzRU0efSyXgWKzoV9oXH29cAcpQww&s" 
                  alt="GCM PTA Logo" 
                  className="h-10 w-auto object-contain" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-center font-mono border-2 border-emerald-600 px-3 py-1 shrink-0">
                <div className="text-[10px] text-emerald-700 font-bold mb-0.5 leading-none">เลขที่อนุญาต</div>
                <div className="font-extrabold text-emerald-700 text-lg tracking-wide leading-none">{runningNo || '-'}</div>
              </div>
            </div>

            {/* Info rows */}
            <div className="space-y-2 mb-4">
              <div className="flex items-end gap-2 text-[13px] font-bold">
                <span className="shrink-0 text-slate-900">ชื่อบริษัทที่ขอตรวจ :</span>
                <span className="flex-1 border-b-2 border-red-900 text-red-900 pb-0.5 text-center font-extrabold">
                  {company || '-'}
                </span>
              </div>
              <div className="flex items-end gap-2 text-[13px] font-bold">
                <span className="shrink-0 text-slate-900">อนุญาตให้ใช้ตั้งแต่วันที่ :</span>
                <span className="flex-1 border-b-2 border-red-900 text-red-900 pb-0.5 text-center font-extrabold">
                  {formatDate(permitStartDate) || '-'}
                </span>
                <span className="shrink-0 text-slate-900 ml-2">ถึงวันที่ :</span>
                <span className="flex-1 border-b-2 border-red-600 text-red-600 pb-0.5 text-center font-extrabold">
                  {formatDate(permitEndDate) || '-'}
                </span>
              </div>
            </div>

            {/* Bottom section */}
            <div className="flex justify-between items-end mt-2">
              <div className="flex flex-col items-center justify-center font-extrabold text-red-950 text-[14px] w-[40%] text-center pb-2 gap-1">
                <div>{vh.equipmentName || 'ถังดับเพลิง'}</div>
                <div>{vh.serialNumber || '1กข-8822'} {vh.location}</div>
              </div>
              <div className="flex flex-col items-center justify-end w-[60%]">
                <div className="font-extrabold text-slate-900 text-[14px] mb-2">ลงชื่อ ผู้ตรวจสอบสภาพ</div>
                <div className="font-extrabold text-red-950 text-[14px] mb-1">( {inspectorName || '................................................'} )</div>
                <div className="text-slate-600 text-[10px] font-bold">วันที่ {formatDate(inspectionDate) || '......./......./.......'}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

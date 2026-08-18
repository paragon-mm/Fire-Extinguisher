import React from 'react';
import { InspectionRequest } from '../types';
import { Printer, Download, X } from 'lucide-react';
import { formatDate } from '../utils/formatDate';


const AutoFitText: React.FC<{ text: string }> = ({ text }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const textRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const adjustSize = () => {
      if (containerRef.current && textRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        // reset scale to measure intrinsic width
        textRef.current.style.transform = 'scale(1)';
        const textWidth = textRef.current.scrollWidth;
        if (textWidth > containerWidth && containerWidth > 0) {
          const scale = containerWidth / textWidth;
          textRef.current.style.transform = `scale(${scale})`;
        }
      }
    };
    adjustSize();
    const timer = setTimeout(adjustSize, 100);
    return () => clearTimeout(timer);
  }, [text]);

  return (
    <div ref={containerRef} className="w-full flex justify-center items-end overflow-hidden">
      <div 
        ref={textRef} 
        className="whitespace-nowrap origin-bottom w-max"
      >
        {text}
      </div>
    </div>
  );
};

interface Props {
  data: InspectionRequest;
  onClose: () => void;
  onPrint: () => void;
}

export const NiimbotPrintView: React.FC<Props> = ({
  data,
  onClose,
  onPrint
}) => {
  // We need to print one sticker per vehicle
  return (
    <div className="flex flex-col h-full bg-white sm:rounded-2xl sm:shadow-2xl overflow-hidden relative print:overflow-visible print:shadow-none print:rounded-none print:block print:h-auto">
      
      {/* Non-printable Action Bar */}
      <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0 print:hidden sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 rounded-lg">
            <Printer className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold">พิมพ์สติ๊กเกอร์ (Niimbot 50x80mm)</h2>
            <div className="text-xs text-slate-400">ขนาด 80mm x 50mm จำนวน {data.extinguishers.length} ดวง (ตั้งค่าหน้ากระดาษก่อนพิมพ์ให้ตรงกับสติ๊กเกอร์)</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onPrint}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold transition flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">สั่งพิมพ์</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scrollable Print Area */}
      <div className="flex-1 overflow-y-auto bg-slate-100 p-8 print:p-0 print:bg-transparent flex flex-col items-center gap-8 print:block print:overflow-visible print:h-auto">
        
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            @page {
              size: 80mm 50mm;
              margin: 0;
            }
            body, html {
              margin: 0 !important;
              padding: 0 !important;
              background-color: white !important;
            }
            .print-page {
              width: 78mm !important;
              height: 48mm !important;
              margin: 1mm auto !important;
              page-break-after: always;
              break-after: page;
              border: none !important;
            }
            .print-page:last-child {
              page-break-after: auto;
              break-after: auto;
            }
            ::-webkit-scrollbar {
              display: none !important;
            }
          }
        `}} />

        {data.extinguishers.map((vh, index) => (
          <div 
            key={index} 
            className="print-page bg-white border-2 border-slate-900 relative flex flex-col justify-between overflow-hidden shrink-0 mx-auto"
            style={{ 
              width: '80mm',
              height: '50mm',
              padding: '2mm 3mm',
              boxSizing: 'border-box'
            }}
          >
            {/* Top Row: Logo & Permit No */}
            <div className="flex items-start justify-between">
              {/* GCM PTA Logo */}
              <div className="flex flex-col items-start leading-none mt-1 w-[26mm]">
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl9kdS0IYKjYC-iIzRU0efSyXgWKzoV9oXH29cAcpQww&s" 
                  alt="GCM PTA Logo" 
                  className="h-8 w-auto object-contain" 
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Permit Box */}
              <div className="border-[1.5px] border-emerald-600 rounded-md px-2 py-1 flex items-center justify-center bg-white min-w-[36mm]">
                <div className="text-emerald-600 font-black text-base tracking-wide">{data.runningNo || 'MM-FX-XXXX-XX'}</div>
              </div>
            </div>

            {/* Sticker Body */}
            <div className="mt-2 space-y-2.5 px-1 flex-1 flex flex-col justify-center pb-1">
              {/* Company */}
              <div className="flex items-end gap-2 text-[15px] font-extrabold">
                <span className="text-slate-800 whitespace-nowrap">ชื่อบริษัท :</span>
                <div className="text-red-800 border-b border-red-900 flex-1 pb-0.5 px-1 flex relative">
                  <AutoFitText text={data.companyCode || data.company || "-"} />
                </div>
              </div>
              
              {/* End Date */}
              <div className="flex items-end gap-2 text-[15px] font-extrabold">
                <span className="text-slate-800 whitespace-nowrap">อนุญาตให้ใช้ถึง :</span>
                <div className="text-red-600 border-b border-red-500 flex-1 pb-0.5 px-1 flex relative">
                  <AutoFitText text={data.permitEndDate ? formatDate(data.permitEndDate) : "-"} />
                </div>
              </div>

              {/* License Plate */}
              <div className="flex items-end gap-2 text-[15px] font-extrabold">
                <span className="text-slate-800 whitespace-nowrap">หมายเลขถัง :</span>
                <div className="text-red-800 border-b border-red-900 flex-1 pb-0.5 px-1 flex relative">
                  <AutoFitText text={vh.serialNumber} />
                </div>
              </div>

              {/* Inspector Name */}
              <div className="flex items-end gap-2 text-[15px] font-extrabold">
                <span className="text-slate-800 whitespace-nowrap">ชื่อผู้ตรวจ :</span>
                <div className="text-red-800 border-b border-red-900 flex-1 pb-0.5 px-1 flex relative">
                  <AutoFitText text={data.inspectorName || "................................"} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

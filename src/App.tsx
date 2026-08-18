import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { InspectionRequest } from './types';
import { getNextRunningNo } from './utils/runningNo';
import { Header } from './components/Header';
import { DashboardStats, StatusFilterType } from './components/DashboardStats';
import { InspectionList } from './components/InspectionList';
import { RequestStep1Modal } from './components/RequestStep1Modal';
import { InspectStep2Modal } from './components/InspectStep2Modal';
import { PinModal } from './components/PinModal';
import { GCMFormPrintView } from './components/GCMFormPrintView';
import { NiimbotPrintView } from './components/NiimbotPrintView';
import { exportToPDF, printForm } from './utils/pdfExport';
import { Printer, PlusCircle, ShieldCheck, FileCheck, CheckCircle2, FireExtinguisher } from 'lucide-react';
import { db } from './firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

const removeUndefinedFields = (obj: any): any => {
  return JSON.parse(JSON.stringify(obj));
};

export default function App() {
  const [requests, setRequests] = useState<InspectionRequest[]>([]);
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isStep1Open, setIsStep1Open] = useState<boolean>(false);
  const [pendingPinTarget, setPendingPinTarget] = useState<InspectionRequest | null>(null);
  const [step2Target, setStep2Target] = useState<InspectionRequest | null>(null);
  const [pdfTarget, setPdfTarget] = useState<InspectionRequest | null>(null);
  const [stickerTarget, setStickerTarget] = useState<InspectionRequest | null>(null);
  const [deletePinTarget, setDeletePinTarget] = useState<string | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  useEffect(() => {
    const q = query(collection(db, 'inspections'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InspectionRequest));
        setRequests(data);
      },
      (error) => {
        console.error("Firestore onSnapshot error (likely offline):", error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Step 1: Submit new request
  const handleCreateRequest = async (
    data: Omit<InspectionRequest, 'id' | 'createdAt' | 'updatedAt' | 'runningNo' | 'status'>
  ) => {
    const newReq = {
      ...data,
      runningNo: '', // No running number generated at Step 1
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    try {
      await addDoc(collection(db, 'inspections'), removeUndefinedFields(newReq));
      showToast(`ยื่นขอตรวจสภาพสำเร็จ! (รอดำเนินการตรวจสภาพและออก Running No. MM-FX-202X-XX เมื่อผ่านการตรวจ)`);
    } catch (e) {
      console.error(e);
      showToast('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  // Step 2: Save inspection rating
  const handleSaveInspection = async (updatedReq: InspectionRequest) => {
    let finalReq = { ...updatedReq };
    
    if (finalReq.status === 'PASSED') {
      // If passed and runningNo is missing or empty, assign next sequence using checkDate
      if (!finalReq.runningNo) {
        finalReq.runningNo = getNextRunningNo(requests, finalReq.id, finalReq.checkDate);
      } else if (finalReq.checkDate) {
        // Ensure 3rd segment (year) matches checkDate year
        const checkYear = finalReq.checkDate.split('-')[0];
        const parts = finalReq.runningNo.split('-');
        if (parts.length >= 4 && parts[2] !== checkYear) {
          parts[2] = checkYear;
          finalReq.runningNo = parts.join('-');
        }
      }
    } else {
      // If failed, clear running number so running numbers are not consumed on failed inspections
      finalReq.runningNo = '';
    }

    try {
      finalReq.updatedAt = new Date().toISOString();
      const docRef = doc(db, 'inspections', finalReq.id);
      
      const updateData = { ...finalReq };
      // Remove id from updateData to prevent id from being stored inside the document
      delete (updateData as any).id;
      
      await updateDoc(docRef, removeUndefinedFields(updateData));
      
      if (finalReq.status === 'PASSED') {
        showToast(`บันทึกผลการตรวจสภาพ: ผ่านการตรวจ (PASSED) - ออก Running No: ${finalReq.runningNo}`);
      } else {
        showToast(`บันทึกผลการตรวจสภาพ: ไม่ผ่าน (FAILED) - ไม่ออก Running No.`);
      }
    } catch (e) {
      console.error(e);
      showToast('เกิดข้อผิดพลาดในการอัพเดทข้อมูล');
    }
  };

  // Delete request
  const handleDeleteRequest = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'inspections', id));
      showToast('ลบรายการขอตรวจสภาพแล้ว');
    } catch (e) {
      console.error(e);
      showToast('เกิดข้อผิดพลาดในการลบข้อมูล');
    }
  };

  // Filter requests
  const filteredRequests = requests.filter((req) => {
    const matchesDept = departmentFilter === 'ALL' || req.department === departmentFilter;
    const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      req.runningNo?.toLowerCase().includes(q) ||
      req.supervisorName?.toLowerCase().includes(q) ||
      req.company?.toLowerCase().includes(q) ||
      req.documentNo?.toLowerCase().includes(q) ||
      req.extinguishers?.some(ex => ex.equipmentName?.toLowerCase().includes(q) || ex.serialNumber?.toLowerCase().includes(q));

    return matchesDept && matchesStatus && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col antialiased">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-slate-200" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <div className="print:hidden">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      </div>

      {/* Primary Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 print:hidden">

        {/* Action Banner */}
        <div className="w-full flex items-center justify-center mb-6">
          
          <div className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto">
            {/* Step 1 Card (Clickable - Highly Prominent) */}
            <div className="relative group">
              {/* Pulsing Aura */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-300 to-rose-400 rounded-xl blur opacity-60 group-hover:opacity-100 animate-pulse transition duration-500"></div>
              
              <motion.button 
                onClick={() => setIsStep1Open(true)}
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-full h-full bg-gradient-to-br from-red-50 via-white to-red-100 border-2 border-red-200 rounded-xl p-4 sm:p-6 flex items-center justify-center gap-4 sm:gap-6 text-left transition-all cursor-pointer overflow-hidden shadow-[0_0_25px_rgba(254,202,202,0.6)]"
              >
                <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 animate-[shimmer_2s_infinite]" />
                
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-red-600 text-white font-black flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                  <FireExtinguisher className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                
                <div className="flex-1">
                  <div className="text-xs sm:text-sm font-black text-red-800 uppercase flex items-center gap-1.5 drop-shadow-sm mb-1 sm:mb-2">
                    กดที่นี่เพื่อเริ่ม
                    <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5 ml-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-red-600"></span>
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-black text-red-950 tracking-wide drop-shadow-sm leading-tight">ยื่นตรวจถังดับเพลิง</div>
                </div>
                
                {/* Red Blinking Arrow on the Right, pointing left towards the text */}
                <div className="flex items-center justify-center shrink-0 ml-auto">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-600 rounded-full flex items-center justify-center animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.8)] border-2 border-white group-hover:bg-red-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-bounce-horizontal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </div>
                </div>
                

              </motion.button>
            </div>
          </div>
        </div>

        {/* Dashboard Stats */}
        <DashboardStats
          requests={requests}
          selectedStatus={statusFilter}
          onSelectStatus={setStatusFilter}
        />

        {/* Inspection List Table */}
        <InspectionList
          requests={filteredRequests}
          statusFilter={statusFilter}
          onResetStatusFilter={() => setStatusFilter('ALL')}
          onInspect={(req) => setPendingPinTarget(req)}
          onViewPDF={(req) => setPdfTarget(req)}
          onPrintSticker={(req) => setStickerTarget(req)}
          onDelete={(id) => setDeletePinTarget(id)}
          onNewRequest={() => setIsStep1Open(true)}
        />

      </main>

      {/* PIN Verification Modal */}
      <PinModal
        isOpen={!!pendingPinTarget}
        onClose={() => setPendingPinTarget(null)}
        onSuccess={() => {
          if (pendingPinTarget) {
            setStep2Target(pendingPinTarget);
            setPendingPinTarget(null);
          }
        }}
      />

      {/* Delete PIN Verification Modal */}
      <PinModal
        isOpen={!!deletePinTarget}
        onClose={() => setDeletePinTarget(null)}
        title="ลบรายการขอตรวจสภาพ"
        description="กรุณากรอกรหัส PIN 4 หลักเพื่อยืนยันการลบรายการ"
        onSuccess={() => {
          if (deletePinTarget) {
            handleDeleteRequest(deletePinTarget);
            setDeletePinTarget(null);
          }
        }}
      />

      {/* Step 1 Modal: Request Form */}
      <RequestStep1Modal
        isOpen={isStep1Open}
        onClose={() => setIsStep1Open(false)}
        onSubmit={handleCreateRequest}
      />

      {/* Step 2 Modal: Inspection Rating & Running No */}
      <InspectStep2Modal
        isOpen={!!step2Target}
        request={step2Target}
        allRequests={requests}
        onClose={() => setStep2Target(null)}
        onSave={handleSaveInspection}
      />

      {/* PDF View / Print Modal */}
      {pdfTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 overflow-y-auto print:static print:bg-white print:p-0 print:block print:overflow-visible">

          <div className="w-full max-w-5xl my-auto print:w-full print:max-w-none print:m-0 print:block print:overflow-visible">
            <GCMFormPrintView
              data={pdfTarget}
              onClose={() => setPdfTarget(null)}
              onPrint={printForm}
              onDownloadPDF={() => exportToPDF('gcm-form-pdf-container', `FireExtinguisherInspection_${pdfTarget.runningNo || 'MM-FX'}`)}
            />
          </div>
        </div>
      )}

      {/* Niimbot Sticker Print Modal */}
      {stickerTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 overflow-y-auto print:static print:bg-white print:p-0 print:block print:overflow-visible">
          <div className="w-full max-w-md my-auto print:w-full print:max-w-none print:m-0 print:block print:overflow-visible">
            <NiimbotPrintView
              data={stickerTarget}
              onClose={() => setStickerTarget(null)}
              onPrint={printForm}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-4 px-6 border-t border-slate-800 text-center text-xs mt-auto print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-2">
          <div>
            แบบตรวจสอบอุปกรณ์เครื่องยนต์, รถเครน, รถยนต์ ก่อนนำเข้าไปใช้งานในเขตกระบวนการผลิต &bull; รหัสเอกสาร <span className="font-mono text-slate-300">MM-F-3061-12</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

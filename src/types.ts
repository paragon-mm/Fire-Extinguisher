export type ChecklistResult = 'PASS' | 'FAIL' | 'NA';

export interface ChecklistItem {
  id: number; // 1 to 10
  title: string;
  shortTitle?: string;
  subDetails?: string[];
  iconName?: string;
}

export interface ExtinguisherDetail {
  id: number; // 1 to 5
  equipmentName: string; // ชนิด/ขนาดถัง e.g. ผงเคมีแห้ง 15 ปอนด์, CO2 10 ปอนด์
  serialNumber: string; // หมายเลขถัง / S/N
  location: string; // สถานที่ติดตั้ง/พื้นที่
  pj2File?: { name: string, data: string } | string | null; // Keeping this if they need to upload image per extinguisher
  checks: Record<number, ChecklistResult>; // itemId (1-8) -> PASS / FAIL / NA
}

export type InspectionStatus = 'PENDING' | 'PASSED' | 'FAILED';

export interface InspectionRequest {
  id: string;
  documentNo: string; // Form standard code: MM-F-0055-01
  runningNo: string; // Generated Running No. MM-FX-2026-XX
  company: string; // ชื่อบริษัทที่ขอตรวจ
  companyCode: string; // ตัวย่อบริษัทผู้ขอตรวจ e.g. GCM, PTA, MM
  checkDate: string; // วันที่ตรวจเช็ค YYYY-MM-DD
  checkTimeSlot: string; // ช่วงเวลาที่ตรวจ
  checkTimeSlotOther?: string;
  checkLocation: string; // สถานที่ตรวจ
  checkLocationOther?: string;
  supervisorName: string; // ผู้ขอตรวจ
  supervisorEmpId?: string; // รหัสผู้ขอตรวจ
  department: string; // หน่วยงาน
  supervisorDate: string; // วันที่
  supervisorTime?: string; // เวลา
  jobDescription: string; // ใช้ในงาน (Optional/Keep for compatibility if they use it)
  permitStartDate: string; // อนุญาตให้ใช้งานตั้งแต่วันที่
  permitEndDate: string; // ถึงวันที่
  inspectorName: string; // ผู้ตรวจสภาพ
  inspectorEmpId?: string; // รหัสผู้ตรวจสภาพ
  inspectionDate?: string; // วันที่ตรวจ
  extinguisherCount: number; // 1 to 5
  extinguishers: ExtinguisherDetail[];
  status: InspectionStatus;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export type CompanyOption = {
  code: string;
  name: string;
};



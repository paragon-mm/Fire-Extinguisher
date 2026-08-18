import { ChecklistItem, CompanyOption } from '../types';

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 1,
    title: 'มีป้ายบอกชนิดของถังดับเพลิงและประเภทไฟที่ดับ',
    shortTitle: 'ป้ายบอกชนิดถัง/ประเภทไฟ',
    subDetails: [
      'ป้ายบอกชนิดและประเภทไฟชัดเจน'
    ],
    iconName: 'Tags'
  },
  {
    id: 2,
    title: 'มีป้ายมาตรฐานรับรอง',
    shortTitle: 'ป้ายมาตรฐานรับรอง',
    subDetails: [
      'มีป้ายมาตรฐานรับรอง (เช่น UL, มอก.)'
    ],
    iconName: 'Award'
  },
  {
    id: 3,
    title: 'ขนาดของถังดับเพลิงและประสิทธิภาพการดับไฟ',
    shortTitle: 'ขนาดและประสิทธิภาพ',
    subDetails: [
      '- ชนิดผงเคมีแห้ง ต้องมีขนาด >= 15ปอนด์ 6A:20B',
      '- ชนิดคาร์บอนไดออกไซด์ ต้องมีขนาด >= 10ปอนด์ 10B:C'
    ],
    iconName: 'Weight'
  },
  {
    id: 4,
    title: 'สภาพถังและคันบีบไม่ชำรุดเสียหาย',
    shortTitle: 'สภาพถังและคันบีบ',
    subDetails: [
      '- สภาพถังต้องไม่บุบ บวม หรือขึ้นสนิม',
      '- สภาพคันบีบต้องไม่บิดเบี้ยว ต้องสามารถบีบใช้งานได้'
    ],
    iconName: 'Cylinder'
  },
  {
    id: 5,
    title: 'สายฉีดไม่แตกไม่รั่ว ไม่ตัน ข้อต่อแน่น',
    shortTitle: 'สภาพสายฉีด',
    subDetails: [
      'สายฉีดไม่แตก ไม่รั่ว ไม่ตัน และข้อต่อต่างๆ ขันแน่น'
    ],
    iconName: 'Stethoscope'
  },
  {
    id: 6,
    title: 'มีสลักล็อคคันบีบ',
    shortTitle: 'สลักล็อคคันบีบ',
    subDetails: [
      '- มีสลักเสียบอยู่ สลักไม่บิดงอ ต้องสามารถดึงออกได้'
    ],
    iconName: 'Lock'
  },
  {
    id: 7,
    title: 'มาตรวัดอยู่ตำแหน่งปกติ ชี้สีเขียว',
    shortTitle: 'มาตรวัดแรงดัน',
    subDetails: [
      'เข็มมาตรวัดแรงดันต้องชี้อยู่ในแถบสีเขียว'
    ],
    iconName: 'Gauge'
  },
  {
    id: 8,
    title: 'สารดับไฟ ในถังพร้อมใช้งาน',
    shortTitle: 'สารดับไฟพร้อมใช้งาน',
    subDetails: [
      '- แบบผงเคมีแห้ง ตรวจโดยให้ยกถังกลับคว่ำหัวลงแล้วฟังเสียง ต้องมีการไหลของผง',
      '- แบบ CO2 ตรวจโดยน้ำหนักถังต้องลดลงไม่เกิน 10% ของน้ำหนักปกติ'
    ],
    iconName: 'CheckCircle2'
  }
];

export const COMPANY_OPTIONS: CompanyOption[] = [
  { code: 'GCM', name: 'บริษัท จีซีเอ็ม พีทีเอ จำกัด (GCM PTA)' },
  { code: 'PTA', name: 'บริษัท พีทีเอ จำกัด (PTA)' },
  { code: 'MM', name: 'หน่วยงาน MM (Material Management)' },
  { code: 'PTTAC', name: 'บริษัท พีทีที อาซาฮี เคมีคอล จำกัด (PTTAC)' },
  { code: 'GC', name: 'บริษัท พีทีที โกลบอล เคมิคอล จำกัด (มหาชน) (GC)' },
  { code: 'OTHER', name: 'บริษัท/หน่วยงานผู้รับเหมาอื่นๆ (Other)' },
];



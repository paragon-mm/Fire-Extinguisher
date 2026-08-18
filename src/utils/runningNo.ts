import { InspectionRequest } from '../types';

/**
 * Calculates the next available running number in the format MM-VH-YYYY-XX
 * based on the inspection year and existing requests that already have assigned running numbers.
 */
export function getNextRunningNo(
  requests: InspectionRequest[],
  excludeRequestId?: string,
  inspectionDateOrYear?: string | number
): string {
  let targetYear = new Date().getFullYear();

  if (typeof inspectionDateOrYear === 'number' && !isNaN(inspectionDateOrYear)) {
    targetYear = inspectionDateOrYear;
  } else if (typeof inspectionDateOrYear === 'string' && inspectionDateOrYear.trim()) {
    // Format could be "YYYY-MM-DD" or "YYYY"
    const yearPart = inspectionDateOrYear.trim().split('-')[0];
    const parsedYear = parseInt(yearPart, 10);
    if (!isNaN(parsedYear) && parsedYear > 1900 && parsedYear < 2100) {
      targetYear = parsedYear;
    }
  }

  let maxSeq = 0;

  requests.forEach((req) => {
    // Exclude current request if updating/re-inspecting
    if (excludeRequestId && req.id === excludeRequestId) {
      return;
    }

    if (req.runningNo && req.runningNo.trim()) {
      const parts = req.runningNo.trim().split('-');
      // Parse running number format MM-VH-YYYY-XX
      if (parts.length >= 4) {
        const reqYear = parseInt(parts[2], 10);
        const seq = parseInt(parts[3], 10);

        // Check if matching target year
        if (!isNaN(reqYear) && reqYear === targetYear) {
          if (!isNaN(seq) && seq > maxSeq) {
            maxSeq = seq;
          }
        }
      } else if (parts.length > 0) {
        const lastPart = parts[parts.length - 1];
        const seq = parseInt(lastPart, 10);
        if (!isNaN(seq) && seq > maxSeq) {
          maxSeq = seq;
        }
      }
    }
  });

  const nextSeq = (maxSeq + 1).toString().padStart(2, '0');
  return `MM-FX-${targetYear}-${nextSeq}`;
}



import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Canvas 2D helper to convert any CSS color string (including oklch, oklab, color()) to exact rgb/rgba
const colorCanvas = document.createElement('canvas');
colorCanvas.width = 1;
colorCanvas.height = 1;
const colorCtx = colorCanvas.getContext('2d', { willReadFrequently: true });

export function parseCssColorToRgb(colorStr: string): string {
  if (!colorCtx || !colorStr) return colorStr;
  const trimmed = colorStr.trim();
  if (!trimmed || trimmed === 'transparent' || trimmed === 'inherit' || trimmed === 'initial' || trimmed === 'none') {
    return trimmed;
  }

  // Fast path for simple rgb, rgba, hex
  if (/^#([0-9a-f]{3,8})$/i.test(trimmed) || /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+/i.test(trimmed)) {
    return trimmed;
  }

  try {
    colorCtx.clearRect(0, 0, 1, 1);
    colorCtx.fillStyle = 'rgba(0,0,0,0)';
    colorCtx.fillStyle = trimmed;
    colorCtx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = colorCtx.getImageData(0, 0, 1, 1).data;
    if (a === 0) return 'transparent';
    const alpha = (a / 255).toFixed(3);
    if (a === 255) return `rgb(${r}, ${g}, ${b})`;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } catch {
    return trimmed;
  }
}

export function sanitizeCssString(cssText: string): string {
  if (!cssText || !/(oklch|oklab|color)\(/i.test(cssText)) {
    return cssText;
  }
  return cssText.replace(/(oklch|oklab|color)\([^)]+\)/gi, (match) => {
    return parseCssColorToRgb(match);
  });
}

export async function exportToPDF(containerId: string, filename: string): Promise<void> {
  const origElement = document.getElementById(containerId);
  if (!origElement) {
    alert('ไม่พบบล็อกเนื้อหาแบบฟอร์ม');
    return;
  }

  try {
    const canvas = await html2canvas(origElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      onclone: (clonedDoc) => {
        // 1. Convert all oklch/oklab/color in all <style> tags to computed rgb(...)
        const styleTags = Array.from(clonedDoc.querySelectorAll('style'));
        styleTags.forEach((styleTag) => {
          if (styleTag.textContent) {
            styleTag.textContent = sanitizeCssString(styleTag.textContent);
          }
        });

        // 2. Convert inline style attributes in all elements
        const allElements = Array.from(clonedDoc.querySelectorAll('*'));
        allElements.forEach((el) => {
          const htmlEl = el as HTMLElement;
          const styleAttr = htmlEl.getAttribute('style');
          if (styleAttr) {
            htmlEl.setAttribute('style', sanitizeCssString(styleAttr));
          }
        });

        // 3. For all elements inside the cloned container, explicitly copy computed styles from original DOM
        const clonedElement = clonedDoc.getElementById(containerId);
        if (clonedElement) {
          const origNodes = [origElement, ...Array.from(origElement.querySelectorAll('*'))];
          const clonedNodes = [clonedElement, ...Array.from(clonedElement.querySelectorAll('*'))];

          origNodes.forEach((origNode, idx) => {
            const clonedNode = clonedNodes[idx] as HTMLElement;
            if (!clonedNode || !(origNode instanceof HTMLElement)) return;

            const computed = window.getComputedStyle(origNode);

            if (computed.color) clonedNode.style.color = parseCssColorToRgb(computed.color);
            if (computed.backgroundColor && computed.backgroundColor !== 'rgba(0, 0, 0, 0)' && computed.backgroundColor !== 'transparent') {
              clonedNode.style.backgroundColor = parseCssColorToRgb(computed.backgroundColor);
            }
            if (computed.borderTopColor) clonedNode.style.borderTopColor = parseCssColorToRgb(computed.borderTopColor);
            if (computed.borderRightColor) clonedNode.style.borderRightColor = parseCssColorToRgb(computed.borderRightColor);
            if (computed.borderBottomColor) clonedNode.style.borderBottomColor = parseCssColorToRgb(computed.borderBottomColor);
            if (computed.borderLeftColor) clonedNode.style.borderLeftColor = parseCssColorToRgb(computed.borderLeftColor);

            if (computed.fontSize) clonedNode.style.fontSize = computed.fontSize;
            if (computed.fontWeight) clonedNode.style.fontWeight = computed.fontWeight;
            if (computed.fontFamily) clonedNode.style.fontFamily = computed.fontFamily;
            if (computed.lineHeight) clonedNode.style.lineHeight = computed.lineHeight;
            if (computed.textAlign) clonedNode.style.textAlign = computed.textAlign;
          });
        }
      }
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    const ratio = Math.min((pdfWidth - 10) / imgWidth, (pdfHeight - 10) / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 5;

    pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save(`${filename}.pdf`);
  } catch (err) {
    console.error('PDF Generation failed:', err);
    window.print();
  }
}

export function printForm(): void {
  window.print();
}

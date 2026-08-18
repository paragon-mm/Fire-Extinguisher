import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Lock, X, AlertCircle, KeyRound } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
}

export const PinModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, title, description }) => {
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState(false);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (isOpen) {
      setPin(['', '', '', '']);
      setError(false);
      setTimeout(() => {
        inputRefs[0].current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }

    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError(false);

    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    // Auto verify if all 4 digits filled
    if (newPin.every((digit) => digit !== '')) {
      const fullPin = newPin.join('');
      if (fullPin === '2525') {
        onSuccess();
      } else {
        setError(true);
        setTimeout(() => {
          setPin(['', '', '', '']);
          setError(false);
          inputRefs[0].current?.focus();
        }, 800);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.join('') === '2525') {
      onSuccess();
    } else {
      setError(true);
      setTimeout(() => {
        setPin(['', '', '', '']);
        setError(false);
        inputRefs[0].current?.focus();
      }, 800);
    }
  };

  const handleKeypadClick = (num: string) => {
    const firstEmptyIndex = pin.findIndex((p) => p === '');
    if (firstEmptyIndex !== -1) {
      handleChange(firstEmptyIndex, num);
    }
  };

  const handleClear = () => {
    setPin(['', '', '', '']);
    setError(false);
    inputRefs[0].current?.focus();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-5 text-white text-center relative">
          <button
            onClick={onClose}
            type="button"
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <KeyRound className="w-6 h-6" />
          </div>

          <h3 className="text-base font-bold text-white">
            {title || 'การเข้าตรวจสอบ (Step 2)'}
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            {description || 'กรุณากรอกรหัส PIN 4 หลักเพื่อเข้าสู่หน้าตรวจสภาพ'}
          </p>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          
          {/* PIN Input Boxes */}
          <div className="flex justify-center items-center gap-3 mb-4">
            {pin.map((digit, idx) => (
              <input
                key={idx}
                ref={inputRefs[idx]}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className={`w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 transition-all outline-none ${
                  error
                    ? 'border-red-500 bg-red-50 text-red-600 ring-2 ring-red-200'
                    : digit
                    ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 ring-2 ring-emerald-200'
                    : 'border-slate-300 bg-slate-50 text-slate-800 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-200'
                }`}
              />
            ))}
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center justify-center gap-1.5 text-red-600 text-xs font-semibold mb-4 bg-red-50 py-2 px-3 rounded-lg border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>รหัส PIN ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง</span>
            </div>
          )}

          {/* Numeric Keypad for convenience */}
          <div className="grid grid-cols-3 gap-2 mb-5 max-w-[240px] mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeypadClick(num)}
                className="py-2.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-bold text-base rounded-xl transition shadow-sm"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              className="py-2.5 bg-slate-200 hover:bg-slate-300 active:bg-slate-400 text-slate-700 font-bold text-xs rounded-xl transition"
            >
              ล้าง
            </button>
            <button
              type="button"
              onClick={() => handleKeypadClick('0')}
              className="py-2.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-bold text-base rounded-xl transition shadow-sm"
            >
              0
            </button>
            <button
              type="submit"
              className="py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl transition flex items-center justify-center shadow-sm"
            >
              ตกลง
            </button>
          </div>

          {/* Direct submit button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition shadow-md flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              ยืนยัน PIN
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

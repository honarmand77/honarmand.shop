// src/components/auth/OTPInput.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const OTPInput = ({
  value,
  onChange,
  onComplete,
  loading = false,
  error = '',
  length = 6,
  disabled = false,
  autoFocus = true,
}) => {
  const [otp, setOtp] = useState(value || '');
  const inputRefs = useRef([]);

  useEffect(() => {
    if (value && value.length === length) {
      setOtp(value);
    }
  }, [value, length]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [autoFocus]);

  const handleChange = (index, e) => {
    const digit = e.target.value.replace(/\D/g, '');
    if (digit.length > 1) return;

    const newOtp = otp.split('');
    newOtp[index] = digit;
    const newOtpStr = newOtp.join('');
    setOtp(newOtpStr);
    onChange(newOtpStr);

    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtpStr.length === length) {
      setTimeout(() => {
        onComplete(newOtpStr);
      }, 300);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '');
    if (pastedData.length === length) {
      setOtp(pastedData);
      onChange(pastedData);
      setTimeout(() => {
        onComplete(pastedData);
      }, 300);
    }
  };

  const isComplete = otp.length === length;
  const isError = !!error;

  return (
    <div className="space-y-3">
      <div className="flex justify-center gap-3" dir="ltr">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={otp[index] || ''}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            disabled={disabled || loading}
            className={`w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 transition-all duration-200
              ${
                isError
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : isComplete && !loading
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'
              }
              ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
              focus:outline-none text-gray-900 dark:text-white
            `}
          />
        ))}
      </div>

      {isComplete && !loading && !isError && (
        <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 text-sm">
          <CheckCircle className="h-4 w-4" />
          <span>کد کامل شد</span>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>در حال تایید...</span>
        </div>
      )}

      {isError && (
        <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default OTPInput;
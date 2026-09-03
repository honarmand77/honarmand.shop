// src/components/auth/Register.jsx
import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Phone,
  Mail,
  Lock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Shield,
  Eye,
  EyeOff,
  ArrowRight,
  Smartphone,
} from 'lucide-react';
import {
  useSendOTPMutation,
  useVerifyOTPMutation,
  useRegisterMutation,
} from '../../features/auth/authAPI';
import {
  setPhoneNumber,
  setVerificationCode,
  resetToPhoneStep,
  clearError,
  setStep,
  setCountdown,
  selectAuth,
} from '../../features/auth/authSlice';
import OTPInput from './OTPInput';

export const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    isLoading: authLoading,
    step,
    phoneNumber,
    verificationCode,
    error: authError,
    countdown,
    isAuthenticated,
  } = useSelector(selectAuth);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [sendOTP, { isLoading: isSendingOTP }] = useSendOTPMutation();
  const [verifyOTP, { isLoading: isVerifyingOTP }] = useVerifyOTPMutation();
  const [registerUser, { isLoading: isRegistering }] = useRegisterMutation();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (authError) {
      setLocalError(authError);
      const timer = setTimeout(() => {
        setLocalError('');
        dispatch(clearError());
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [authError, dispatch]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        dispatch(setCountdown(countdown - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown, dispatch]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'نام و نام خانوادگی الزامی است';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'نام باید حداقل ۳ کاراکتر باشد';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'شماره موبایل الزامی است';
    } else if (!/^09\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'شماره موبایل معتبر نیست';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'ایمیل معتبر نیست';
    }

    if (!formData.password) {
      newErrors.password = 'رمز عبور الزامی است';
    } else if (formData.password.length < 8) {
      newErrors.password = 'رمز عبور باید حداقل ۸ کاراکتر باشد';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'رمز عبور و تکرار آن مطابقت ندارند';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setIsLoading(true);
      setLocalError('');
      setErrors({});

      try {
        const { confirmPassword, ...registerData } = formData;

        await registerUser({
          ...registerData,
          phone: registerData.phone,
        }).unwrap();

        await sendOTP(registerData.phone).unwrap();
        dispatch(setPhoneNumber(registerData.phone));
        dispatch(setStep('verify'));
        dispatch(setCountdown(60));
        setSuccessMessage('✅ کد تایید به شماره شما ارسال شد');
      } catch (err) {
        setLocalError(err?.data?.message || 'خطا در ثبت نام');
      } finally {
        setIsLoading(false);
      }
    },
    [formData, dispatch, registerUser, sendOTP]
  );

  const handleVerifyOTP = useCallback(
    async (code) => {
      if (!code || code.length < 6) {
        setLocalError('لطفاً کد تایید ۶ رقمی را وارد کنید');
        return;
      }

      setIsLoading(true);
      setLocalError('');

      try {
        await verifyOTP({
          phone: phoneNumber,
          code,
        }).unwrap();

        setSuccessMessage('✅ ثبت نام با موفقیت تکمیل شد');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } catch (err) {
        setLocalError(err?.data?.message || 'خطا در تایید کد');
      } finally {
        setIsLoading(false);
      }
    },
    [phoneNumber, verifyOTP, navigate]
  );

  const handleResendCode = async () => {
    if (countdown === 0) {
      setIsLoading(true);
      try {
        await sendOTP(phoneNumber).unwrap();
        dispatch(setCountdown(60));
        setSuccessMessage('✅ کد مجدداً ارسال شد');
      } catch (err) {
        setLocalError(err?.data?.message || 'خطا در ارسال مجدد کد');
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (step === 'verify') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="rounded-3xl transform transition-all duration-500 hover:scale-[1.02]">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25 mb-4 transform transition-all duration-300 hover:scale-110 hover:rotate-3">
                <Smartphone className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                تایید کد
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                کد تایید به شماره{' '}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {phoneNumber}
                </span>{' '}
                ارسال شد
              </p>
            </div>

            {successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-green-50/80 backdrop-blur-sm border border-green-200/50 text-green-600 text-sm flex items-center gap-2 animate-slideDown">
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {localError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50/80 backdrop-blur-sm border border-red-200/50 text-red-600 text-sm flex items-center gap-2 animate-shake">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{localError}</span>
                <button
                  type="button"
                  onClick={() => {
                    setLocalError('');
                    dispatch(clearError());
                  }}
                  className="text-red-400 hover:text-red-600 transition-colors mr-auto"
                >
                  ×
                </button>
              </div>
            )}

            <OTPInput
              value={verificationCode}
              onChange={(code) => dispatch(setVerificationCode(code))}
              onComplete={handleVerifyOTP}
              loading={isLoading || authLoading || isVerifyingOTP}
              error={localError}
              length={6}
              disabled={isLoading || authLoading || isVerifyingOTP}
              autoFocus={true}
            />

            <div className="mt-6 flex flex-col gap-3">
              <div className="text-center">
                {countdown > 0 ? (
                  <span className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    ارسال مجدد کد پس از {countdown} ثانیه
                  </span>
                ) : (
                  <button
                    onClick={handleResendCode}
                    disabled={isLoading || authLoading || isSendingOTP}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    ارسال مجدد کد
                  </button>
                )}
              </div>

              <button
                onClick={() => dispatch(resetToPhoneStep())}
                disabled={isLoading || authLoading}
                className="w-full py-3 rounded-xl bg-gray-100/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 font-semibold border-2 border-gray-200 dark:border-gray-600 hover:bg-gray-200/80 dark:hover:bg-gray-600/80 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                <User className="h-5 w-5 group-hover:scale-110 transition-transform" />
                تغییر شماره
              </button>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes blob {
            0%, 100% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slideDown {
            animation: slideDown 0.3s ease-out;
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
            20%, 40%, 60%, 80% { transform: translateX(2px); }
          }
          .animate-shake {
            animation: shake 0.5s ease-in-out;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="rounded-3xl shadow-2xl p-8 md:p-10 transform transition-all duration-500 hover:scale-[1.02]">
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50/50 dark:bg-indigo-900/30 backdrop-blur-sm">
              <Shield className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                ثبت نام امن
              </span>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25 mb-5 transform transition-all duration-300 hover:scale-110 hover:rotate-3">
              <User className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              ثبت نام
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
              برای ایجاد حساب کاربری اطلاعات زیر را تکمیل کنید
            </p>
          </div>

          {localError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50/80 backdrop-blur-sm border border-red-200/50 text-red-600 text-sm flex items-center gap-2 animate-shake">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{localError}</span>
              <button
                type="button"
                onClick={() => {
                  setLocalError('');
                  dispatch(clearError());
                }}
                className="text-red-400 hover:text-red-600 transition-colors mr-auto"
              >
                ×
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                نام و نام خانوادگی
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="مثال: علی محمدی"
                  className={`w-full px-4 py-3.5 pl-12 rounded-xl border-2 transition-all duration-300 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm
                    ${
                      errors.name
                        ? 'border-red-500 focus:ring-4 focus:ring-red-500/20'
                        : 'border-gray-200 dark:border-gray-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20'
                    }
                    focus:outline-none text-gray-900 dark:text-white placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed`}
                  disabled={isLoading || authLoading || isRegistering}
                />
              </div>
              {errors.name && (
                <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                شماره موبایل
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                  <Phone className="h-5 w-5" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  className={`w-full px-4 py-3.5 pl-12 rounded-xl border-2 transition-all duration-300 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm
                    ${
                      errors.phone
                        ? 'border-red-500 focus:ring-4 focus:ring-red-500/20'
                        : 'border-gray-200 dark:border-gray-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20'
                    }
                    focus:outline-none text-gray-900 dark:text-white placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed`}
                  dir="ltr"
                  maxLength={11}
                  inputMode="numeric"
                  disabled={isLoading || authLoading || isRegistering}
                />
              </div>
              {errors.phone && (
                <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                ایمیل{' '}
                <span className="text-gray-400 dark:text-gray-500 text-xs font-normal">
                  (اختیاری)
                </span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className={`w-full px-4 py-3.5 pl-12 rounded-xl border-2 transition-all duration-300 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm
                    ${
                      errors.email
                        ? 'border-red-500 focus:ring-4 focus:ring-red-500/20'
                        : 'border-gray-200 dark:border-gray-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20'
                    }
                    focus:outline-none text-gray-900 dark:text-white placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed`}
                  dir="ltr"
                  disabled={isLoading || authLoading || isRegistering}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                رمز عبور
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="حداقل ۸ کاراکتر"
                  className={`w-full px-4 py-3.5 pl-12 pr-12 rounded-xl border-2 transition-all duration-300 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm
                    ${
                      errors.password
                        ? 'border-red-500 focus:ring-4 focus:ring-red-500/20'
                        : 'border-gray-200 dark:border-gray-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20'
                    }
                    focus:outline-none text-gray-900 dark:text-white placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed`}
                  disabled={isLoading || authLoading || isRegistering}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                تکرار رمز عبور
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="تکرار رمز عبور"
                  className={`w-full px-4 py-3.5 pl-12 pr-12 rounded-xl border-2 transition-all duration-300 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm
                    ${
                      errors.confirmPassword
                        ? 'border-red-500 focus:ring-4 focus:ring-red-500/20'
                        : 'border-gray-200 dark:border-gray-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20'
                    }
                    focus:outline-none text-gray-900 dark:text-white placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed`}
                  disabled={isLoading || authLoading || isRegistering}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || authLoading || isRegistering}
              className="group w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 text-base relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
              {isLoading || authLoading || isRegistering ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  در حال ثبت نام...
                </>
              ) : (
                <>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  ثبت نام
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              قبلاً حساب کاربری دارید؟{' '}
              <Link
                to="/ورود"
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
              >
                ورود به حساب
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
            <p className="text-center text-xs text-gray-500 dark:text-gray-400">
              با ثبت نام در سایت،{' '}
              <a
                href="/terms"
                className="text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors hover:underline"
              >
                شرایط و قوانین
              </a>{' '}
              و{' '}
              <a
                href="/privacy"
                className="text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors hover:underline"
              >
                حریم خصوصی
              </a>{' '}
              را می‌پذیرید
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Register;
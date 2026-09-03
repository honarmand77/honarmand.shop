// src/components/auth/Login.jsx
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Phone,
  Shield,
  AlertCircle,
  Loader2,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  User,
  Smartphone,
  ChevronLeft,
  Sparkles,
  Fingerprint,
} from 'lucide-react';

import {
  useSendOTPMutation,
  useVerifyOTPMutation,
} from '../../features/auth/authAPI';

import {
  setPhoneNumber,
  setVerificationCode,
  resetToPhoneStep,
  clearError,
  setStep,
  setCountdown,
  selectAuth,
  setAuthenticated,
  setToken,
} from '../../features/auth/authSlice';

import OTPInput from './OTPInput';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    isLoading = false,
    step = 'phone',
    phoneNumber = '',
    verificationCode = '',
    error = null,
    countdown = 0,
    isAuthenticated = false,
  } = useSelector(selectAuth);

  const [phoneInput, setPhoneInput] = useState('');
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const [sendOTP, { isLoading: isSendingOTP }] = useSendOTPMutation();
  const [verifyOTP, { isLoading: isVerifyingOTP }] = useVerifyOTPMutation();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (step === 'phone' && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [step]);

  useEffect(() => {
    if (isAuthenticated && isClient) {
      const from = location.state?.from?.pathname || '/پروفایل';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location, isClient]);

  useEffect(() => {
    if (error) {
      setLocalError(error);
      setSuccessMessage('');
      const timer = setTimeout(() => {
        setLocalError('');
        dispatch(clearError());
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        dispatch(setCountdown(countdown - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown, dispatch]);

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    const cleanPhone = phoneInput.replace(/\s/g, '');

    if (!cleanPhone || cleanPhone.length < 10) {
      setLocalError('لطفاً شماره تماس معتبر وارد کنید');
      setIsSubmitting(false);
      return;
    }

    if (!/^09\d{9}$/.test(cleanPhone)) {
      setLocalError('شماره تماس باید با 09 شروع شود و ۱۱ رقم باشد');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await sendOTP(cleanPhone).unwrap();
      console.log('📤 Send OTP Response:', response);

      // اگر پاسخ شامل توکن JWT است
      if (response?.token) {
        dispatch(setToken(response.token));
        localStorage.setItem('auth_token', response.token);
        
        if (response.user) {
          dispatch(setAuthenticated(response.user));
          localStorage.setItem('user_data', JSON.stringify(response.user));
          
          setTimeout(() => {
            const from = location.state?.from?.pathname || '/پروفایل';
            navigate(from, { replace: true });
          }, 500);
          return;
        }
      }

      // اگر فقط OTP ارسال شده
      if (response?.success) {
        dispatch(setPhoneNumber(cleanPhone));
        dispatch(setStep('verify'));
        dispatch(setCountdown(60));
        setSuccessMessage('✅ کد تایید با موفقیت ارسال شد');
      } else {
        setLocalError(response?.message || '❌ خطا در ارسال کد تایید');
      }
    } catch (err) {
      console.error('❌ Send OTP Error:', err);
      setLocalError(err?.data?.message || err?.message || '❌ خطا در ارسال کد تایید');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    if (!verificationCode || verificationCode.length < 6) {
      setLocalError('لطفاً کد تایید ۶ رقمی را وارد کنید');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await verifyOTP({
        phone: phoneNumber,
        code: verificationCode,
      }).unwrap();

      console.log('🔍 Verify OTP Response:', result);

      // ============================================
      // 1. ذخیره توکن
      // ============================================
      let token = result?.data?.token || result?.token || result?.accessToken;
      
      if (token) {
        // تمیز کردن توکن (حذف "Bearer " اگر وجود داشته باشد)
        const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;
        dispatch(setToken(cleanToken));
        localStorage.setItem('auth_token', cleanToken);
        console.log('✅ Token saved successfully');
      } else {
        console.warn('⚠️ No token found in response');
        setLocalError('❌ توکن دریافت نشد');
        setIsSubmitting(false);
        return;
      }

      // ============================================
      // 2. ذخیره اطلاعات کاربر
      // ============================================
      let userData = result?.data?.user || result?.user || null;
      
      if (userData) {
        // تکمیل اطلاعات کاربر اگر ناقص است
        const completeUserData = {
          id: userData.id || 'guest',
          display_name: userData.display_name || userData.name || userData.username || 'کاربر',
          email: userData.email || '',
          username: userData.username || '',
          phone: phoneNumber,
          roles: userData.roles || ['subscriber'],
        };
        
        dispatch(setAuthenticated(completeUserData));
        localStorage.setItem('user_data', JSON.stringify(completeUserData));
      } else if (token) {
        // اگر اطلاعات کاربر در پاسخ نبود، با توکن دریافت کن
        try {
          const userResponse = await fetch(
            'https://api.honarmand.shop/wp-json/auth/v1/me',
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );
          
          if (userResponse.ok) {
            const userDataFromAPI = await userResponse.json();
            if (userDataFromAPI.success && userDataFromAPI.user) {
              const userInfo = {
                id: userDataFromAPI.user.id || 'guest',
                display_name: userDataFromAPI.user.display_name || 
                            userDataFromAPI.user.name || 
                            userDataFromAPI.user.username || 'کاربر',
                email: userDataFromAPI.user.email || '',
                username: userDataFromAPI.user.username || '',
                phone: phoneNumber,
                roles: userDataFromAPI.user.roles || ['subscriber'],
              };
              dispatch(setAuthenticated(userInfo));
              localStorage.setItem('user_data', JSON.stringify(userInfo));
            }
          } else {
            // اگر درخواست با خطا مواجه شد
            console.warn('⚠️ Could not fetch user data from /auth/v1/me');
            
            // تلاش با مسیر دوم
            try {
              const userResponse2 = await fetch(
                'https://api.honarmand.shop/wp-json/wp/v2/users/me',
                {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                }
              );
              
              if (userResponse2.ok) {
                const userDataFromAPI2 = await userResponse2.json();
                const userInfo = {
                  id: userDataFromAPI2.id || 'guest',
                  display_name: userDataFromAPI2.name || 
                              userDataFromAPI2.username || 'کاربر',
                  email: userDataFromAPI2.email || '',
                  username: userDataFromAPI2.username || '',
                  phone: phoneNumber,
                  roles: userDataFromAPI2.roles || ['subscriber'],
                };
                dispatch(setAuthenticated(userInfo));
                localStorage.setItem('user_data', JSON.stringify(userInfo));
              }
            } catch (err2) {
              console.warn('⚠️ Could not fetch user data from /wp/v2/users/me:', err2);
              const fallbackUser = {
                id: 'guest',
                display_name: 'کاربر',
                phone: phoneNumber,
              };
              dispatch(setAuthenticated(fallbackUser));
              localStorage.setItem('user_data', JSON.stringify(fallbackUser));
            }
          }
        } catch (err) {
          console.warn('⚠️ Could not fetch user data:', err);
          const fallbackUser = {
            id: 'guest',
            display_name: 'کاربر',
            phone: phoneNumber,
          };
          dispatch(setAuthenticated(fallbackUser));
          localStorage.setItem('user_data', JSON.stringify(fallbackUser));
        }
      } else {
        // اگر هیچ توکنی وجود نداشت
        setLocalError('❌ خطا در دریافت اطلاعات کاربر');
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage('✅ ورود با موفقیت انجام شد');

      // ============================================
      // 3. هدایت به صفحه پروفایل
      // ============================================
      setTimeout(() => {
        const from = location.state?.from?.pathname || '/پروفایل';
        navigate(from, { replace: true });
      }, 500);
    } catch (err) {
      console.error('❌ Verify OTP Error:', err);
      setLocalError(err?.data?.message || err?.message || '❌ خطا در تایید کد');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown === 0 && !isSubmitting) {
      setLocalError('');
      setSuccessMessage('');

      try {
        const response = await sendOTP(phoneNumber).unwrap();
        if (response?.success) {
          dispatch(setCountdown(60));
          setSuccessMessage('✅ کد مجدداً ارسال شد');
        } else {
          setLocalError(response?.message || '❌ خطا در ارسال مجدد کد');
        }
      } catch (err) {
        setLocalError(err?.data?.message || err?.message || '❌ خطا در ارسال مجدد کد');
      }
    }
  };

  const handleResetToPhone = () => {
    dispatch(resetToPhoneStep());
    setPhoneInput('');
  };

  if (step === 'authenticated' && isClient) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="rounded-3xl p-8 md:p-10 transform transition-all duration-500 hover:scale-[1.02]">
          
          {/* Badge */}
          <div className="flex justify-center m-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50/50 dark:bg-indigo-900/30 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">ورود امن</span>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25 mb-5 transform transition-all duration-300 hover:scale-110 hover:rotate-3">
              {step === 'phone' ? (
                <Smartphone className="w-12 h-12 text-white" />
              ) : (
                <Shield className="w-12 h-12 text-white" />
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
              {step === 'phone' ? 'خوش آمدید' : 'تایید کد'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {step === 'phone'
                ? 'برای ورود، شماره تماس خود را وارد کنید'
                : `کد تایید به شماره ${phoneNumber || ''} ارسال شد`}
            </p>
          </div>

          {/* Phone Step */}
          {step === 'phone' && (
            <form onSubmit={handleRequestCode} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">شماره تماس</label>
                <div className={`relative transition-all duration-300 ${isFocused ? 'scale-[1.02]' : ''}`}>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                    <Phone className="h-5 w-5" />
                  </div>
                  <input
                    ref={inputRef}
                    type="tel"
                    placeholder="مثال: 09123456789"
                    value={phoneInput || ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 11) {
                        setPhoneInput(value);
                      }
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    disabled={isLoading || isSubmitting || isSendingOTP}
                    className="w-full px-4 py-3.5 pl-12 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-right text-base"
                    maxLength={11}
                    autoComplete="tel"
                    inputMode="numeric"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {phoneInput && phoneInput.length >= 10 && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">کد تایید به این شماره ارسال خواهد شد</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">{(phoneInput || '').length}/11</span>
                </div>
              </div>

              {successMessage && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50/80 backdrop-blur-sm border border-green-200/50 text-green-600 text-sm animate-slideDown">
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {localError && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50/80 backdrop-blur-sm border border-red-200/50 text-red-600 text-sm animate-shake">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span className="flex-1">{localError}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setLocalError('');
                      dispatch(clearError());
                    }}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || isSubmitting || isSendingOTP || !phoneInput || (phoneInput || '').length < 10}
                className="group w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 text-base relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                {isLoading || isSubmitting || isSendingOTP ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    در حال ارسال...
                  </>
                ) : (
                  <>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    دریافت کد تایید
                  </>
                )}
              </button>

              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                حساب کاربری ندارید؟{' '}
                <Link to="/ثبت-نام" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                  ثبت نام
                </Link>
              </p>

              <button
                type="button"
                onClick={() => navigate('/')}
                disabled={isLoading || isSubmitting || isSendingOTP}
                className="w-full py-2 text-gray-500 dark:text-gray-400 text-sm hover:text-gray-700 dark:hover:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 group"
              >
                <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                بازگشت به صفحه اصلی
              </button>
            </form>
          )}

          {/* Verify Step */}
          {step === 'verify' && (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                  <Fingerprint className="w-4 h-4 text-indigo-500" />
                  <span>کد تایید را وارد کنید</span>
                </div>

                <OTPInput
                  value={verificationCode || ''}
                  onChange={(code) => dispatch(setVerificationCode(code))}
                  onComplete={(code) => {
                    if (!isLoading && !isSubmitting && !isVerifyingOTP) {
                      setTimeout(() => {
                        handleVerifyCode(new Event('submit'));
                      }, 300);
                    }
                  }}
                  loading={isLoading || isSubmitting || isVerifyingOTP}
                  error={localError}
                  length={6}
                  disabled={isLoading || isSubmitting || isVerifyingOTP}
                  autoFocus={true}
                />

                <div className="flex justify-between items-center text-sm px-1">
                  <span className="text-gray-600 dark:text-gray-400">
                    کد به شماره <span className="font-semibold text-gray-900 dark:text-white">{phoneNumber || ''}</span> ارسال شد
                  </span>
                  {countdown > 0 && (
                    <span className="inline-flex items-center gap-1 text-indigo-600 font-semibold">
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      {countdown} ثانیه
                    </span>
                  )}
                </div>
              </div>

              {localError && !isLoading && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50/80 backdrop-blur-sm border border-red-200/50 text-red-600 text-sm animate-shake">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span className="flex-1">{localError}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setLocalError('');
                      dispatch(clearError());
                    }}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              )}

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isLoading || isSubmitting || isVerifyingOTP || !verificationCode || (verificationCode || '').length < 6}
                  className="group w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 text-base relative overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                  {isLoading || isSubmitting || isVerifyingOTP ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      در حال تایید...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      تایید و ورود
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleResetToPhone}
                  disabled={isLoading || isSubmitting || isVerifyingOTP}
                  className="w-full py-3 rounded-xl bg-gray-100/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 font-semibold border-2 border-gray-200 dark:border-gray-600 hover:bg-gray-200/80 dark:hover:bg-gray-600/80 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  <User className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  تغییر شماره
                </button>
              </div>

              <div className="text-center">
                {countdown === 0 ? (
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={isLoading || isSubmitting || isSendingOTP}
                    className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto group"
                  >
                    <RefreshCw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
                    ارسال مجدد کد
                  </button>
                ) : (
                  <span className="text-gray-600 dark:text-gray-400 text-sm flex items-center justify-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    ارسال مجدد کد پس از {countdown} ثانیه
                  </span>
                )}
              </div>
            </form>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
            <p className="text-center text-xs text-gray-500 dark:text-gray-400">
              با ورود به حساب کاربری،{' '}
              <a href="/terms" className="text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors hover:underline">
                شرایط و قوانین
              </a>{' '}
              و{' '}
              <a href="/privacy" className="text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors hover:underline">
                حریم خصوصی
              </a>{' '}
              را می‌پذیرید
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
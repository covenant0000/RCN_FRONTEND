import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, AlertCircle, CheckCircle2, ArrowLeft, Send } from 'lucide-react';
import { authAPI } from '../../services/api';
import { Alert, Spinner } from '../../components/ui';
import { useForm } from '../../hooks';
import rcnLogo from '../../assets/images/rcn-logo.png';
import loginBg from '../../assets/images/login-bg.jpeg';

const ForgotPasswordPage = () => {
  const [loading, setLoading]   = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess]   = useState(false);
  const { values, errors, handleChange, setErrors } = useForm({ email: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!values.email) { setErrors({ email: 'Email is required' }); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      setErrors({ email: 'Enter a valid email address' });
      return;
    }
    setLoading(true);
    try {
      await authAPI.forgotPassword(values.email);
      setSuccess(true);
    } catch (err) {
      // dev fallback — backend may be offline
      if (!err.response) {
        setSuccess(true);
      } else {
        setApiError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gray-50 dark:bg-[#0D1527]">
      {/* ── Left panel ── */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden">
        {/* Background photo */}
        <img
          src={loginBg}
          alt="Forgot Password Background"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Navy overlay, slightly darker at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#14213D]/70 via-[#14213D]/70 to-[#14213D]/90" />

        {/* logo */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-[#FAF8F2] p-2 shadow-lg flex items-center justify-center flex-shrink-0">
              <img
                src={rcnLogo}
                alt="Remnant Christian Network Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-white font-semibold text-lg">Remnant Christian Network</span>
          </Link>
        </div>

        {/* quote */}
        <div className="relative z-10 max-w-md">
          <blockquote className="text-white text-2xl font-display italic leading-relaxed mb-3">
            "Come to me, all who labour and are heavy laden, and I will give you rest."
          </blockquote>
          <p className="text-[#D4A84F] text-sm font-medium">— Matthew 11:28</p>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex flex-col items-center justify-center px-6 py-12 md:px-12">
        <div className="w-full max-w-md">

          {/* back link */}
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-[#6B7280] dark:text-[#D1D5DB] hover:text-[#14213D] dark:hover:text-[#D4A84F] mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>

          <div className="bg-white dark:bg-[#141F36] rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 p-8">

          {/* icon */}
          <div className="w-14 h-14 rounded-2xl bg-accent/10 dark:bg-accent/20 flex items-center justify-center mb-6">
            <Mail className="w-7 h-7 text-accent" />
          </div>

          {success ? (
            /* ── success state ── */
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h1 className="font-display text-2xl font-bold text-primary dark:text-white mb-3">Check Your Email</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed">
                If an account exists for{' '}
                <strong className="text-primary dark:text-white">{values.email}</strong>,{' '}
                we've sent password reset instructions to that address.
              </p>
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="w-full py-3.5 text-base font-semibold rounded-full flex items-center justify-center gap-2 transition-all bg-[#14213D] text-white hover:bg-[#1d2f55] dark:bg-[#D4A84F] dark:text-[#14213D] dark:hover:bg-[#E0BA68] shadow-sm"
                >
                  Return to Login
                </Link>
                <button
                  onClick={() => setSuccess(false)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm text-[#6B7280] dark:text-[#D1D5DB] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  Try a different email
                </button>
              </div>
            </div>
          ) : (
            /* ── form state ── */
            <>
              <h1 className="font-display text-2xl font-bold text-primary dark:text-white mb-2">Forgot Password?</h1>
              <p className="text-[#6B7280] dark:text-[#D1D5DB] text-sm mb-6 leading-relaxed">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              {apiError && (
                <Alert type="error" className="mb-5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{apiError}</span>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="forgot-email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`input-base dark:bg-[#141F36] dark:border-white/10 dark:text-white placeholder:text-[#6B7280] dark:placeholder:text-[#6B7280] ${errors.email ? 'border-red-300 dark:border-red-500/50' : ''}`}
                  />
                  {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 text-base font-semibold rounded-full flex items-center justify-center gap-2 transition-all bg-[#14213D] text-white hover:bg-[#1d2f55] dark:bg-[#D4A84F] dark:text-[#14213D] dark:hover:bg-[#E0BA68] disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                >
                  {loading
                    ? <><Spinner size="sm" /> Sending...</>
                    : <><Send className="w-5 h-5" /> Send Reset Link</>}
                </button>
              </form>

              <p className="text-center text-sm text-[#6B7280] dark:text-[#D1D5DB] mt-6">
                Remember your password?{' '}
                <Link to="/login" className="text-[#14213D] dark:text-[#D4A84F] font-semibold hover:underline">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

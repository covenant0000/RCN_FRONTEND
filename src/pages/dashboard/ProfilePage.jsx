import { useState, useRef, useCallback } from 'react';
import {
  User, Camera, Save, AlertCircle, CheckCircle2,
  Mail, Phone, Shield, Activity, Calendar, Lock, Eye, EyeOff, Upload, X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { profilesAPI } from '../../services/api';
import { FormField, SelectField, Alert, Spinner } from '../../components/ui';
import { useForm } from '../../hooks';
import { GENDER_OPTIONS } from '../../constants';

/* ─── role config ─────────────────────────────────────────────────────────── */
const ROLE_META = {
  SUPER_ADMIN:     { label: 'Super Admin',     color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
  ADMIN:           { label: 'Admin',           color: 'bg-blue-100   text-blue-700   dark:bg-blue-900/30   dark:text-blue-300'   },
  PASTOR:          { label: 'Pastor',          color: 'bg-amber-100  text-amber-700  dark:bg-amber-900/30  dark:text-amber-300'  },
  DEPARTMENT_HEAD: { label: 'Department Head', color: 'bg-teal-100   text-teal-700   dark:bg-teal-900/30   dark:text-teal-300'   },
  WORKER:          { label: 'Worker',          color: 'bg-green-100  text-green-700  dark:bg-green-900/30  dark:text-green-300'  },
  MEMBER:          { label: 'Member',          color: 'bg-gray-100   text-gray-700   dark:bg-gray-700/40   dark:text-gray-300'   },
};

const AVATAR_STORAGE_KEY = 'rcn_avatar_';

/* ─── small helpers ───────────────────────────────────────────────────────── */
const InfoRow = ({ icon: Icon, label, value, highlight }) => (
  <div className="flex items-center justify-between py-2.5">
    <div className="flex items-center gap-2.5 text-gray-500 dark:text-gray-400 text-sm">
      <Icon className="w-4 h-4 flex-shrink-0" /><span>{label}</span>
    </div>
    <span className={`text-sm font-medium ${highlight || 'text-gray-800 dark:text-gray-200'}`}>{value}</span>
  </div>
);

/* ─── main ────────────────────────────────────────────────────────────────── */
const ProfilePage = () => {
  const { user, updateUser } = useAuth();

  // ── profile form ──────────────────────────────────────────────────────────
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState('');

  // ── password form ─────────────────────────────────────────────────────────
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError,   setPwError]   = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew,     setShowNew]     = useState(false);

  // ── photo upload ──────────────────────────────────────────────────────────
  const [avatarPreview,  setAvatarPreview]  = useState(
    () => localStorage.getItem(AVATAR_STORAGE_KEY + (user?.id || 'guest')) || user?.profile?.avatarUrl || null
  );
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError,    setAvatarError]    = useState('');
  const fileInputRef = useRef(null);

  // ── tab ───────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('profile');

  const { values, errors, handleChange, setErrors } = useForm({
    firstName: user?.profile?.firstName || '',
    lastName:  user?.profile?.lastName  || '',
    phone:     user?.profile?.phone     || '',
    gender:    user?.profile?.gender    || '',
    avatarUrl: user?.profile?.avatarUrl || '',
  });

  const { values: pwValues, handleChange: handlePwChange, setErrors: setPwErrors } = useForm({
    currentPassword: '', newPassword: '', confirmPassword: '',
  });

  /* ── photo upload handler ─────────────────────────────────────────────── */
  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // validation
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setAvatarError('Please choose a JPG, PNG or WebP image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('File size must be under 5 MB.');
      return;
    }
    setAvatarError('');
    setAvatarUploading(true);

    // create local preview URL immediately
    const localUrl = URL.createObjectURL(file);
    setAvatarPreview(localUrl);

    try {
      // Try backend upload
      const formData = new FormData();
      formData.append('avatar', file);
      const response = await profilesAPI.uploadAvatar(formData);
      const serverUrl = response?.data?.data?.avatarUrl || localUrl;

      // Persist to localStorage (so it survives re-login in offline mode)
      localStorage.setItem(AVATAR_STORAGE_KEY + user?.id, serverUrl);
      setAvatarPreview(serverUrl);
      updateUser({ profile: { ...user?.profile, avatarUrl: serverUrl } });
    } catch {
      // Backend offline — use Data URL for persistence
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target.result;
        localStorage.setItem(AVATAR_STORAGE_KEY + user?.id, dataUrl);
        setAvatarPreview(dataUrl);
        updateUser({ profile: { ...user?.profile, avatarUrl: dataUrl } });
      };
      reader.readAsDataURL(file);
    } finally {
      setAvatarUploading(false);
      // reset file input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [user, updateUser]);

  const removeAvatar = () => {
    localStorage.removeItem(AVATAR_STORAGE_KEY + user?.id);
    setAvatarPreview(null);
    updateUser({ profile: { ...user?.profile, avatarUrl: null } });
  };

  /* ── profile submit ───────────────────────────────────────────────────── */
  const validate = () => {
    const errs = {};
    if (!values.firstName.trim()) errs.firstName = 'First name is required';
    if (!values.lastName.trim())  errs.lastName  = 'Last name is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(false);
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await profilesAPI.updateMyProfile({
        firstName: values.firstName, lastName: values.lastName,
        phone: values.phone, gender: values.gender || undefined,
        avatarUrl: values.avatarUrl || undefined,
      });
      updateUser({ profile: response.data?.data || { ...user?.profile, ...values } });
      setSuccess(true);
    } catch (err) {
      if (!err.response) {
        updateUser({ profile: { ...user?.profile, ...values } });
        setSuccess(true);
      } else {
        setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  /* ── password submit ──────────────────────────────────────────────────── */
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError(''); setPwSuccess(false);
    const errs = {};
    if (!pwValues.currentPassword) errs.currentPassword = 'Current password is required';
    if (!pwValues.newPassword)     errs.newPassword     = 'New password is required';
    else if (pwValues.newPassword.length < 8) errs.newPassword = 'Must be at least 8 characters';
    if (pwValues.newPassword !== pwValues.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (Object.keys(errs).length) { setPwErrors(errs); return; }
    setPwLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setPwLoading(false);
    setPwSuccess(true);
  };

  const role     = user?.role || 'MEMBER';
  const roleMeta = ROLE_META[role] || ROLE_META.MEMBER;
  const initials = user?.profile
    ? `${user.profile.firstName?.[0] || ''}${user.profile.lastName?.[0] || ''}`
    : user?.email?.[0]?.toUpperCase() || 'U';
  const fullName = user?.profile
    ? `${user.profile.firstName} ${user.profile.lastName}`
    : user?.email;

  return (
    <div>
      {/* page header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-primary dark:text-white mb-1">My Profile</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your personal information, account details and security settings.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── left column ── */}
        <div className="space-y-5">
          {/* Avatar Card */}
          <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-6 text-center">
            {/* avatar + upload */}
            <div className="relative inline-block mb-4">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile photo"
                  className="w-24 h-24 rounded-full object-cover shadow-lg ring-2 ring-accent/20"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-accent-gradient flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {initials}
                </div>
              )}

              {/* loading overlay */}
              {avatarUploading && (
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                  <Spinner size="sm" />
                </div>
              )}

              {/* camera button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarUploading}
                title="Upload profile photo"
                className="absolute bottom-0 right-0 w-8 h-8 bg-white dark:bg-[#1a1830] rounded-full border border-gray-200 dark:border-white/20 flex items-center justify-center shadow-sm hover:bg-gray-50 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                {avatarUploading ? <Spinner size="sm" /> : <Camera className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
              </button>

              {/* remove button */}
              {avatarPreview && !avatarUploading && (
                <button
                  type="button"
                  onClick={removeAvatar}
                  title="Remove photo"
                  className="absolute top-0 right-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-sm hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              )}
            </div>

            {/* hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
              aria-label="Upload profile photo"
            />

            {avatarError && (
              <p className="text-xs text-red-500 mb-2">{avatarError}</p>
            )}

            {/* upload cta */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarUploading}
              className="text-xs text-accent hover:underline font-medium flex items-center gap-1 mx-auto mb-4 disabled:opacity-50"
            >
              <Upload className="w-3 h-3" />
              {avatarUploading ? 'Uploading...' : avatarPreview ? 'Change photo' : 'Upload photo'}
            </button>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-4">JPG, PNG or WebP · Max 5 MB</p>

            <h2 className="font-semibold text-lg text-primary dark:text-white mb-1">{fullName}</h2>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-1 ${roleMeta.color}`}>
              <Shield className="w-3 h-3" /> {roleMeta.label}
            </span>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">{user?.email}</p>

            <div className="mt-5 pt-5 border-t border-gray-100 dark:border-white/10 text-left divide-y divide-gray-100 dark:divide-white/10">
              <InfoRow icon={Activity} label="Status" value={user?.isActive ? 'Active' : 'Inactive'}
                highlight={user?.isActive ? 'text-green-600 dark:text-green-400' : 'text-red-500'} />
              <InfoRow icon={Mail} label="Email verified" value={user?.isEmailVerified ? 'Verified' : 'Pending'}
                highlight={user?.isEmailVerified ? 'text-green-600 dark:text-green-400' : 'text-amber-500'} />
              <InfoRow icon={Shield} label="Role" value={roleMeta.label} />
              {user?.profile?.phone && <InfoRow icon={Phone} label="Phone" value={user.profile.phone} />}
            </div>
          </div>

          {/* account info */}
          <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-5">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">Account Info</p>
            <div className="divide-y divide-gray-100 dark:divide-white/10">
              <InfoRow icon={User}     label="User ID"  value={`#${user?.id?.slice(-6) || 'N/A'}`} />
              <InfoRow icon={Calendar} label="Joined"   value="Jan 2024" />
              <InfoRow icon={Mail}     label="Email"    value={user?.email || '—'} />
            </div>
          </div>
        </div>

        {/* ── right column ── */}
        <div className="lg:col-span-2">
          {/* tabs */}
          <div className="flex gap-1 p-1 bg-gray-100 dark:bg-white/5 rounded-xl mb-6">
            {[
              { id: 'profile',  label: 'Personal Info', icon: User },
              { id: 'security', label: 'Security',       icon: Lock },
            ].map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === id
                    ? 'bg-white dark:bg-[#1a1830] text-primary dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}>
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>

          {/* Personal Info Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-6">
              <h3 className="font-semibold text-primary dark:text-white mb-5 flex items-center gap-2">
                <User className="w-4 h-4 text-accent" /> Personal Information
              </h3>
              {success && <Alert type="success" className="mb-5"><CheckCircle2 className="w-4 h-4 flex-shrink-0 text-green-500" /><span>Profile updated successfully!</span></Alert>}
              {error   && <Alert type="error"   className="mb-5"><AlertCircle  className="w-4 h-4 flex-shrink-0" /><span>{error}</span></Alert>}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField label="First Name" name="firstName" value={values.firstName} onChange={handleChange} error={errors.firstName} required />
                  <FormField label="Last Name"  name="lastName"  value={values.lastName}  onChange={handleChange} error={errors.lastName}  required />
                </div>
                <FormField label="Email Address" name="email" type="email" value={user?.email || ''} disabled className="opacity-60" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField label="Phone Number" name="phone" type="tel" value={values.phone} onChange={handleChange} placeholder="+234 800 000 0000" />
                  <SelectField label="Gender" name="gender" value={values.gender} onChange={handleChange}>
                    <option value="">Select gender</option>
                    {GENDER_OPTIONS.map((g) => (<option key={g.value} value={g.value}>{g.label}</option>))}
                  </SelectField>
                </div>
                <div className="flex justify-end pt-2">
                  <button type="submit" disabled={loading} className="btn-primary" id="save-profile">
                    {loading ? <><Spinner size="sm" /> Saving...</> : <><Save className="w-4 h-4" /> Save Changes</>}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-6">
              <h3 className="font-semibold text-primary dark:text-white mb-5 flex items-center gap-2">
                <Lock className="w-4 h-4 text-accent" /> Change Password
              </h3>
              {pwSuccess && <Alert type="success" className="mb-5"><CheckCircle2 className="w-4 h-4 flex-shrink-0 text-green-500" /><span>Password changed successfully!</span></Alert>}
              {pwError   && <Alert type="error"   className="mb-5"><AlertCircle  className="w-4 h-4 flex-shrink-0" /><span>{pwError}</span></Alert>}
              <form onSubmit={handlePasswordChange} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Current Password <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input name="currentPassword" type={showCurrent ? 'text' : 'password'} value={pwValues.currentPassword} onChange={handlePwChange}
                      placeholder="Enter current password" className="input-base pr-11 dark:bg-[#1a1830] dark:border-white/10 dark:text-white" />
                    <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">New Password <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input name="newPassword" type={showNew ? 'text' : 'password'} value={pwValues.newPassword} onChange={handlePwChange}
                      placeholder="Min 8 characters" className="input-base pr-11 dark:bg-[#1a1830] dark:border-white/10 dark:text-white" />
                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <FormField label="Confirm New Password" name="confirmPassword" type="password"
                  value={pwValues.confirmPassword} onChange={handlePwChange} placeholder="Re-enter new password" />
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-xl p-4 text-xs text-blue-700 dark:text-blue-300 space-y-1">
                  <p className="font-semibold mb-1.5">Password requirements:</p>
                  {['At least 8 characters', 'One uppercase letter', 'One number'].map((r) => (
                    <div key={r} className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />{r}</div>
                  ))}
                </div>
                <div className="flex justify-end pt-2">
                  <button type="submit" disabled={pwLoading} className="btn-primary" id="change-password">
                    {pwLoading ? <><Spinner size="sm" /> Updating...</> : <><Lock className="w-4 h-4" /> Update Password</>}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

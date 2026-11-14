import { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react';
import PublicLayout from '../components/layout/PublicLayout';
import { PageHero, FormField, TextareaField, SelectField, Alert, Spinner } from '../components/ui';
import { useForm } from '../hooks';

const PrayerPage = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const { values, errors, handleChange, setErrors, reset } = useForm({
    name: '',
    email: '',
    phone: '',
    category: '',
    request: '',
    isConfidential: false,
  });

  const validate = () => {
    const errs = {};
    if (!values.name.trim()) errs.name = 'Name is required';
    if (!values.request.trim()) errs.request = 'Prayer request is required';
    else if (values.request.trim().length < 20)
      errs.request = 'Please provide more detail (at least 20 characters)';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);
    try {
      // NOTE: Prayer requests are handled via the E-Church portal
      // This would eventually POST to a prayer-request endpoint
      await new Promise((r) => setTimeout(r, 1200)); // Simulated delay
      setSuccess(true);
      reset();
    } catch {
      setError('Failed to submit your prayer request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <PageHero
        title="Prayer Request"
        subtitle="We believe in the power of prayer. Share your request and our prayer team will stand with you."
        breadcrumb={['Home', 'E-Church', 'Prayer Request']}
        bgImage="/prayer-bg.jpg"
      />

      <section className="section-padding bg-gray-50 dark:bg-[#0D1527]">
        <div className="container-custom grid lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {/* Sidebar Info */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <p className="text-accent text-xs font-semibold uppercase tracking-[0.2em] mb-3">
                We Pray Together
              </p>
              <h2 className="font-display text-2xl font-bold text-primary mb-4">
                Your Request Matters
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                The RCN Prayer Ministry intercedes daily for members and families. Submit your request and
                know that you are covered in prayer.
              </p>
            </div>

            <div className="bg-white dark:bg-[#141F36] rounded-2xl p-5 border border-gray-100 space-y-4">
              <h3 className="font-semibold text-primary text-sm">Prayer Meeting Times</h3>
              {[
                { day: 'Monday–Friday', time: '6:00 AM – 7:00 AM', label: 'Morning Devotion' },
                { day: 'Wednesday', time: '6:00 PM – 8:00 PM', label: 'Mid-week Prayer' },
                { day: 'Friday', time: '10:00 PM – 12:00 AM', label: 'Night Vigil' },
                { day: 'Sunday', time: 'After Service', label: 'Altars of Prayer' },
              ].map((t) => (
                <div key={t.label} className="border-l-2 border-accent/30 pl-3">
                  <div className="text-xs font-medium text-gray-900">{t.label}</div>
                  <div className="text-xs text-gray-500">{t.day} · {t.time}</div>
                </div>
              ))}
            </div>

            <div className="bg-primary-gradient rounded-2xl p-5 text-white text-sm">
              <p className="font-semibold mb-1">📖 Scripture</p>
              <blockquote className="text-white/80 italic leading-relaxed">
                "Do not be anxious about anything, but in every situation, by prayer and petition,
                with thanksgiving, present your requests to God."
              </blockquote>
              <p className="text-white/50 mt-2 text-xs">Philippians 4:6</p>
            </div>
          </div>

          {/* Prayer Form */}
          <div className="lg:col-span-2 bg-white dark:bg-[#141F36] rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 className="font-display text-xl font-bold text-primary mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-accent" /> Submit Your Prayer Request
            </h3>

            {success ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Prayer Request Submitted</h4>
                <p className="text-gray-500 text-sm mb-6">
                  Thank you for sharing your heart. Our prayer team will intercede on your behalf.
                </p>
                <button onClick={() => setSuccess(false)} className="btn-primary">
                  Submit Another Request
                </button>
              </div>
            ) : (
              <>
                {error && (
                  <Alert type="error" className="mb-5">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </Alert>
                )}
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      label="Full Name"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      error={errors.name}
                      placeholder="Your name"
                      required
                    />
                    <FormField
                      label="Email Address"
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      placeholder="Optional"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      value={values.phone}
                      onChange={handleChange}
                      placeholder="Optional"
                    />
                    <SelectField
                      label="Category"
                      name="category"
                      value={values.category}
                      onChange={handleChange}
                    >
                      <option value="">Select category</option>
                      {['Health', 'Family', 'Finance', 'Salvation', 'Career', 'Relationships', 'Spiritual Growth', 'Other'].map(
                        (c) => <option key={c} value={c}>{c}</option>
                      )}
                    </SelectField>
                  </div>

                  <TextareaField
                    label="Prayer Request"
                    name="request"
                    value={values.request}
                    onChange={handleChange}
                    error={errors.request}
                    placeholder="Share your prayer request here. Be as detailed as you'd like..."
                    rows={5}
                    required
                  />

                  <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-700">
                    <input
                      type="checkbox"
                      name="isConfidential"
                      checked={values.isConfidential}
                      onChange={handleChange}
                      className="rounded text-accent focus:ring-accent"
                    />
                    Keep my request confidential (only seen by prayer leaders)
                  </label>

                  <button type="submit" disabled={loading} className="btn-primary w-full py-3.5" id="prayer-submit">
                    {loading ? <><Spinner size="sm" /> Submitting...</> : 'Submit Prayer Request'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default PrayerPage;

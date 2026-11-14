import { useState } from 'react';
import { CheckCircle2, AlertCircle, Star, MessageSquare } from 'lucide-react';
import PublicLayout from '../components/layout/PublicLayout';
import { PageHero, FormField, TextareaField, SelectField, Alert, Spinner } from '../components/ui';
import { useForm } from '../hooks';

const TestimonyPage = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const { values, errors, handleChange, setErrors, reset } = useForm({
    name: '',
    email: '',
    category: '',
    testimony: '',
    sharePublicly: true,
  });

  const validate = () => {
    const errs = {};
    if (!values.name.trim()) errs.name = 'Your name is required';
    if (!values.testimony.trim()) errs.testimony = 'Please share your testimony';
    else if (values.testimony.trim().length < 30) errs.testimony = 'Please share more detail (at least 30 characters)';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      setSuccess(true);
      reset();
    } catch {
      setError('Failed to submit your testimony. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const testimonies = [
    { name: 'Sister Grace', category: 'Healing', text: 'After months of illness, God healed me completely during one of the prayer meetings. I am forever grateful to RCN.' },
    { name: 'Brother James', category: 'Finance', text: 'I had been without a job for over a year. Through prayer and fasting with the RCN community, I got a breakthrough within weeks.' },
    { name: 'Pastor Emmanuel', category: 'Spiritual Growth', text: 'My understanding of God\'s Word has grown tremendously through Dr. Arome\'s teachings. RCN changed my ministry completely.' },
  ];

  return (
    <PublicLayout>
      <PageHero
        title="Share Your Testimony"
        subtitle="Declare the goodness of God and strengthen the faith of others through your story"
        breadcrumb={['Home', 'E-Church', 'Testimony']}
        bgImage="/community-bg.jpg"
      />

      <section className="section-padding bg-[#FAF8F2] dark:bg-[#0D1527]">
        <div className="container-custom grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Form */}
          <div className="bg-white dark:bg-[#141F36] rounded-2xl border border-gray-100 shadow-sm p-8">
            <h3 className="font-display text-xl font-bold text-primary mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-accent" /> Your Testimony
            </h3>

            {success ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h4 className="font-semibold text-[#252525] dark:text-white mb-2">Testimony Submitted!</h4>
                <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm mb-6">
                  Thank you for sharing how God has worked in your life. Your testimony will encourage many.
                </p>
                <button onClick={() => setSuccess(false)} className="btn-primary">Share Another</button>
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
                    <FormField label="Your Name" name="name" value={values.name} onChange={handleChange} error={errors.name} placeholder="Full name" required />
                    <FormField label="Email" name="email" type="email" value={values.email} onChange={handleChange} placeholder="Optional" />
                  </div>
                  <SelectField label="Category" name="category" value={values.category} onChange={handleChange}>
                    <option value="">Select category</option>
                    {['Healing', 'Finance / Provision', 'Marriage / Family', 'Spiritual Growth', 'Career', 'Salvation', 'Other'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </SelectField>
                  <TextareaField
                    label="Your Testimony" name="testimony" value={values.testimony}
                    onChange={handleChange} error={errors.testimony}
                    placeholder="Share what God has done in your life..."
                    rows={6} required
                  />
                  <label className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer">
                    <input type="checkbox" name="sharePublicly" checked={values.sharePublicly} onChange={handleChange}
                      className="rounded text-accent focus:ring-accent" />
                    I'm happy for my testimony to be shared publicly (with first name only)
                  </label>
                  <button type="submit" disabled={loading} className="btn-primary w-full py-3.5" id="testimony-submit">
                    {loading ? <><Spinner size="sm" /> Submitting...</> : 'Submit Testimony'}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Recent Testimonies */}
          <div>
            <p className="text-accent text-xs font-semibold uppercase tracking-[0.2em] mb-3">What God is Doing</p>
            <h2 className="font-display text-2xl font-bold text-primary mb-6">Recent Testimonies</h2>
            <div className="space-y-4">
              {testimonies.map((t) => (
                <div key={t.name} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-9 h-9 rounded-full bg-accent-gradient flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {t.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-[#252525] dark:text-white text-sm">{t.name}</div>
                      <div className="text-xs text-accent">{t.category}</div>
                    </div>
                    <div className="ml-auto flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <blockquote className="text-sm text-[#6B7280] dark:text-[#9CA3AF] italic leading-relaxed">"{t.text}"</blockquote>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-primary-gradient rounded-2xl p-5 text-white text-sm">
              <p className="font-semibold mb-1">📖 Scripture</p>
              <blockquote className="text-white/80 italic">
                "They triumphed over him by the blood of the Lamb and by the word of their testimony."
              </blockquote>
              <p className="text-white/50 mt-2 text-xs">Revelation 12:11</p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default TestimonyPage;

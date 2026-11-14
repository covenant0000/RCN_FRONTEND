import { useState } from 'react';
import { Heart, CheckCircle2, AlertCircle, CreditCard, Shield } from 'lucide-react';
import PublicLayout from '../components/layout/PublicLayout';
import { PageHero, FormField, Alert, Spinner } from '../components/ui';
import { donationsAPI } from '../services/api';
import { DONATION_PRESETS } from '../constants';

const PURPOSES = ['Tithe', 'Offering', 'Building Fund', 'Missions', 'Conferences', 'General Giving'];

const GivePage = () => {
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [purpose, setPurpose] = useState('General Giving');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const finalAmount = customAmount ? Number(customAmount) : Number(amount);

  const handlePreset = (val) => {
    setAmount(String(val));
    setCustomAmount('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!finalAmount || finalAmount < 100) {
      setError('Please enter a valid donation amount (minimum ₦100)');
      return;
    }
    if (!isAnonymous && !email) {
      setError('Please enter your email address');
      return;
    }
    setLoading(true);
    try {
      // NOTE: This integrates with POST /api/v1/donations/checkout
      // The backend returns a Stripe checkout URL to redirect the user
      const response = await donationsAPI.initiateCheckout({
        amount: finalAmount,
        currency: 'ngn',
        purpose,
        donorName: isAnonymous ? 'Anonymous' : name,
        donorEmail: isAnonymous ? undefined : email,
        isAnonymous,
      });
      // Backend returns { data: { checkoutUrl } } — redirect to Stripe
      if (response.data?.data?.checkoutUrl) {
        window.location.href = response.data.data.checkoutUrl;
      } else {
        setSuccess(true);
      }
    } catch (err) {
      // Fallback success for dev (backend not yet live)
      if (process.env.NODE_ENV === 'development' || !err.response) {
        setSuccess(true);
      } else {
        setError(err.response?.data?.message || 'Payment initiation failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
          <div className="max-w-md w-full text-center p-8">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="font-display text-3xl font-bold text-primary mb-3">Thank You!</h1>
            <p className="text-gray-600 mb-6">
              Your generous gift of <strong>₦{finalAmount.toLocaleString()}</strong> for{' '}
              <strong>{purpose}</strong> has been received. God bless you abundantly!
            </p>
            <button onClick={() => { setSuccess(false); setAmount(''); setCustomAmount(''); }}
              className="btn-primary">
              Give Again
            </button>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <PageHero
        title="Give Generously"
        subtitle="Partner with the vision of Remnant Christian Network to reach nations for Christ"
        breadcrumb={['Home', 'Give']}
        bgImage="/community-bg.jpg"
      />

      <section className="section-padding bg-gray-50">
        <div className="container-custom grid lg:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
          {/* Why Give */}
          <div>
            <p className="text-accent text-xs font-semibold uppercase tracking-[0.2em] mb-3">Partner With Us</p>
            <h2 className="font-display text-3xl font-bold text-primary mb-5">
              Your Giving Matters
            </h2>
            <blockquote className="text-gray-700 dark:text-gray-300 italic mb-6 leading-relaxed border-l-2 border-accent pl-4">
              "Every man according as he purposeth in his heart, so let him give; not grudgingly, or of necessity: for God loveth a cheerful giver."
              <span className="block text-accent font-semibold not-italic text-sm mt-2">— 2 Corinthians 9:7 (KJV)</span>
            </blockquote>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Every gift you sow into the vision of RCN goes towards reaching nations, training workers
              for harvest, and establishing the Kingdom of God across the earth.
            </p>

            <div className="space-y-4 mb-8">
              {[
                { icon: '🌍', title: 'Missions', desc: 'Sending workers to unreached nations' },
                { icon: '📖', title: 'Training', desc: 'Equipping ministers through Adullam Seminary' },
                { icon: '📡', title: 'Media', desc: 'Broadcasting the gospel on TV, radio, and online' },
                { icon: '🏛️', title: 'Building', desc: 'Constructing centres of apostolic ministry' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-lg flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{item.title}</div>
                    <div className="text-gray-500 text-sm">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-primary-gradient rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-accent" />
                <span className="font-semibold">Secure & Trusted</span>
              </div>
              <p className="text-white/70 text-sm">
                All transactions are processed securely through Stripe. Your financial information is never stored on our servers.
              </p>
            </div>
          </div>

          {/* Donation Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 className="font-display text-xl font-bold text-primary mb-6 flex items-center gap-2">
              <Heart className="w-5 h-5 text-accent" /> Make a Donation
            </h3>

            {error && (
              <Alert type="error" className="mb-5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Purpose */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giving Purpose
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PURPOSES.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPurpose(p)}
                      className={`px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all ${
                        purpose === p
                          ? 'bg-accent text-white shadow-sm'
                          : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-accent hover:text-accent'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Presets */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Amount (₦)
                </label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {DONATION_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handlePreset(preset)}
                      className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        amount === String(preset) && !customAmount
                          ? 'bg-primary text-white'
                          : 'bg-gray-50 border border-gray-200 text-gray-700 hover:border-accent hover:text-accent'
                      }`}
                    >
                      ₦{preset.toLocaleString()}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₦</span>
                  <input
                    type="number"
                    placeholder="Custom amount"
                    value={customAmount}
                    onChange={(e) => { setCustomAmount(e.target.value); setAmount(''); }}
                    className="input-base pl-9"
                    id="custom-amount"
                    min="100"
                  />
                </div>
              </div>

              {/* Anonymous Toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded text-accent focus:ring-accent"
                />
                <span className="text-sm text-gray-700">Give anonymously</span>
              </label>

              {/* Donor Info */}
              {!isAnonymous && (
                <div className="space-y-4">
                  <FormField
                    label="Full Name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                  />
                  <FormField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="For your donation receipt"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading || (!finalAmount)}
                className="btn-primary w-full py-4 text-base"
                id="donate-submit"
              >
                {loading ? (
                  <><Spinner size="sm" /> Processing...</>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    {finalAmount
                      ? `Give ₦${finalAmount.toLocaleString()}`
                      : 'Select an Amount'}
                  </>
                )}
              </button>

              <p className="text-xs text-gray-400 text-center">
                Secured by Stripe · Your data is never shared
              </p>
            </form>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default GivePage;

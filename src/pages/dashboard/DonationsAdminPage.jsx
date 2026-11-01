import { useState } from 'react';
import { CreditCard, TrendingUp, DollarSign, Eye, Heart, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Badge, Modal } from '../../components/ui';
import { mockDonations } from '../../services/mock/mockData';
import { useAuth } from '../../context/AuthContext';

const DonationsAdminPage = () => {
  const { hasRole } = useAuth();
  const [donations] = useState(mockDonations);
  const [selectedPurpose, setSelectedPurpose] = useState('All');
  const [viewDonation, setViewDonation] = useState(null);

  const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
  const byPurpose = donations.reduce((acc, d) => {
    acc[d.purpose] = (acc[d.purpose] || 0) + d.amount;
    return acc;
  }, {});

  const filteredDonations = selectedPurpose === 'All'
    ? donations
    : donations.filter((d) => d.purpose === selectedPurpose);

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-white/10">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Giving, Tithes & Stewardship
          </h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Confidential financial records, covenant partner contributions and ministry funds.
          </p>
        </div>
      </div>

      {/* ── KPI Summary Cards ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
            <DollarSign className="w-5 h-5" />
          </div>
          <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            ₦{totalAmount.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400 mt-1">Total Partnership Giving</div>
        </div>

        <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-5">
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-3">
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            {donations.length}
          </div>
          <div className="text-xs text-gray-400 mt-1">Confirmed Gifts</div>
        </div>

        <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            ₦{Math.round(totalAmount / donations.length).toLocaleString()}
          </div>
          <div className="text-xs text-gray-400 mt-1">Average Seed Gift</div>
        </div>

        <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
            <Heart className="w-5 h-5" />
          </div>
          <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            ₦{Math.max(...donations.map((d) => d.amount)).toLocaleString()}
          </div>
          <div className="text-xs text-gray-400 mt-1">Major Kingdom Seed</div>
        </div>
      </div>

      {/* ── Table & Purpose Breakdown ────────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Transactions Table */}
        <div className="lg:col-span-2 bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-semibold text-gray-900 dark:text-white text-base">Recent Transactions</h2>

              {/* Purpose Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {['All', 'Tithe', 'Offering', 'Building Fund', 'Missions'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSelectedPurpose(p)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      selectedPurpose === p
                        ? 'bg-accent text-white shadow-sm'
                        : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:text-accent'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm text-left">
                <thead className="border-b border-gray-100 dark:border-white/10 bg-gray-50/70 dark:bg-white/5 text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-5 py-3.5">Purpose & Donor</th>
                    <th className="px-5 py-3.5 hidden sm:table-cell">Date</th>
                    <th className="px-5 py-3.5">Amount</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {filteredDonations.map((donation) => (
                    <tr key={donation.id} className="hover:bg-gray-50/70 dark:hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
                            <CreditCard className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white text-xs md:text-sm">
                              {donation.purpose}
                            </p>
                            <p className="text-[11px] text-gray-400">{donation.donor?.name || 'Anonymous'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-400 text-xs hidden sm:table-cell">
                        {new Date(donation.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-4 font-bold text-gray-900 dark:text-white">
                        ₦{donation.amount.toLocaleString()}
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant="success">{donation.status}</Badge>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setViewDonation(donation)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-accent hover:bg-accent/10 transition-colors"
                          title="View receipt"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 px-6 border-t border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 text-xs text-gray-400">
            Showing {filteredDonations.length} records. Audited under pastoral oversight.
          </div>
        </div>

        {/* By Purpose Breakdown Card */}
        <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white text-base mb-4">Allocation By Fund</h2>
            <div className="space-y-4">
              {Object.entries(byPurpose).map(([purpose, amount]) => {
                const pct = Math.round((amount / totalAmount) * 100);
                return (
                  <div key={purpose}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{purpose}</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        ₦{amount.toLocaleString()} <span className="text-[10px] text-gray-400 font-normal">({pct}%)</span>
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent-gradient rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/10 text-xs text-gray-400">
            All giving records are encrypted and protected under financial confidentiality policies.
          </div>
        </div>
      </div>

      {/* ── Receipt Modal ───────────────────────────────────────────────── */}
      {viewDonation && (
        <Modal
          isOpen={Boolean(viewDonation)}
          onClose={() => setViewDonation(null)}
          title="Donation Receipt"
        >
          <div className="space-y-4 text-xs md:text-sm">
            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 text-center">
              <span className="text-gray-400 uppercase text-[10px] tracking-widest font-semibold">Seed Recorded</span>
              <p className="font-display font-bold text-2xl md:text-3xl text-accent mt-1">
                ₦{viewDonation.amount.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">{viewDonation.purpose}</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-white/10">
                <span className="text-gray-400">Donor</span>
                <span className="font-semibold text-gray-900 dark:text-white">{viewDonation.donor?.name || 'Anonymous Partner'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-white/10">
                <span className="text-gray-400">Transaction ID</span>
                <span className="font-mono text-gray-600 dark:text-gray-300">{viewDonation.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-white/10">
                <span className="text-gray-400">Payment Channel</span>
                <span className="text-gray-600 dark:text-gray-300">Online Gateway / Transfer</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-white/10">
                <span className="text-gray-400">Status</span>
                <Badge variant="success">{viewDonation.status}</Badge>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setViewDonation(null)}
                className="btn-primary text-xs px-5 py-2"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DonationsAdminPage;

import { Link } from 'react-router-dom';
import { MapPin, Clock, Church, ArrowRight, Navigation } from 'lucide-react';
import PublicLayout from '../components/layout/PublicLayout';
import { PageHero } from '../components/ui';
import { otherCenters } from '../data/centers';

const OtherCentersPage = () => {
  return (
    <PublicLayout>
      <PageHero
        title="RCN Centers"
        subtitle="Our family of centres"
        breadcrumb={['Home', 'Centers']}
        bgImage="/community-bg.jpg"
      />

      <section className="section-padding bg-[#FAF8F2] dark:bg-[#0D1527]">
        <div className="container-custom">
          {/* Home centre banner */}
          <div className="mb-10 p-5 rounded-2xl bg-white dark:bg-[#141F36] border border-[#D4A84F]/30 dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#D4A84F]/15 flex items-center justify-center flex-shrink-0 text-[#D4A84F]">
                <Church className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#D4A84F]">
                  Our Home Centre
                </p>
                <p className="text-base font-semibold text-[#14213D] dark:text-white">
                  Visit our home centre: RCN Anambra
                </p>
              </div>
            </div>
            <Link
              to="/our-centre"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-[#D4A84F] text-[#14213D] hover:bg-[#E0BA68] transition-colors shadow-sm flex-shrink-0"
            >
              Visit RCN Anambra <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Grid of other centres */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherCenters.map((center) => (
              <div
                key={center.id || center.name}
                className="bg-white dark:bg-[#141F36] rounded-2xl shadow-sm border border-[rgba(20,33,61,0.08)] dark:border-white/10 p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-display text-xl font-bold text-[#14213D] dark:text-white">
                      {center.name}
                    </h3>
                    {center.sample && (
                      <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded bg-gray-100 dark:bg-white/10 text-[#6B7280] dark:text-gray-400 border border-gray-200 dark:border-white/10 flex-shrink-0">
                        Sample
                      </span>
                    )}
                  </div>

                  {(center.city || center.state) && (
                    <div className="flex items-center gap-1.5 text-sm text-[#6B7280] dark:text-[#D1D5DB] mb-4">
                      <MapPin className="w-4 h-4 text-[#D4A84F] flex-shrink-0" />
                      <span>
                        {[center.city, center.state].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  )}

                  {center.pastor && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF] mb-0.5">
                        Resident Pastor
                      </p>
                      <p className="text-sm font-medium text-[#252525] dark:text-white">
                        {center.pastor}
                      </p>
                    </div>
                  )}
                </div>

                {/* Service times & Actions */}
                <div>
                  {center.serviceTimes && center.serviceTimes.length > 0 && (
                    <div className="pt-4 border-t border-[rgba(20,33,61,0.08)] dark:border-white/10">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#14213D] dark:text-[#D4A84F] mb-2 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#D4A84F]" />
                        Service Times
                      </p>
                      <div className="space-y-1.5">
                        {center.serviceTimes.map((st, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-xs bg-[#FAF8F2] dark:bg-[#0D1527] px-3 py-2 rounded-lg border border-[rgba(20,33,61,0.05)] dark:border-white/5"
                          >
                            <span className="font-medium text-[#14213D] dark:text-white">
                              {st.day}
                            </span>
                            <span className="text-[#6B7280] dark:text-[#D1D5DB]">
                              {st.time} {st.label && `(${st.label})`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {center.address && (
                    <div className="pt-4 mt-4 border-t border-[rgba(20,33,61,0.08)] dark:border-white/10">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          center.mapQuery || center.address
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-[#D4A84F] text-[#14213D] hover:bg-[#E0BA68] transition-colors shadow-sm"
                      >
                        <Navigation className="w-3.5 h-3.5" /> Get Directions
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default OtherCentersPage;

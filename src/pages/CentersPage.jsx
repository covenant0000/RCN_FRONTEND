import { MapPin, Clock, Phone, Mail, MessageCircle, Navigation } from 'lucide-react';
import PublicLayout from '../components/layout/PublicLayout';
import { PageHero } from '../components/ui';
import { homeCenter } from '../data/centers';

const CentersPage = () => {
  const {
    name,
    area,
    address,
    serviceTimes = [],
    pastor,
    phone,
    whatsapp,
    email,
    mapQuery,
  } = homeCenter;

  const hasAddress = Boolean(address || mapQuery);
  const query = encodeURIComponent(mapQuery || address || '');

  return (
    <PublicLayout>
      <PageHero
        title="RCN Centre"
        subtitle="Join us at RCN Anambra"
        breadcrumb={['Home', 'Our Centre']}
        bgImage="/community-bg.jpg"
      />

      <section className="section-padding bg-[#FAF8F2] dark:bg-[#0D1527]">
        <div className="container-custom">
          <div
            className={
              hasAddress
                ? 'grid lg:grid-cols-2 gap-8 items-start max-w-5xl mx-auto'
                : 'max-w-2xl mx-auto'
            }
          >
            {/* Centre details card */}
            <div className="bg-white dark:bg-[#141F36] rounded-2xl shadow-sm border border-[rgba(20,33,61,0.08)] dark:border-white/10 p-6 sm:p-8 lg:p-10">
              {area && (
                <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#D4A84F] bg-[#D4A84F]/10 border border-[#D4A84F]/20 px-3 py-1 rounded-full mb-3">
                  {area}
                </span>
              )}

              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#14213D] dark:text-white mb-4">
                {name}
              </h2>

              {pastor && (
                <div className="mb-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] dark:text-[#D1D5DB] mb-1">
                    Resident Pastor
                  </p>
                  <p className="text-base font-semibold text-[#14213D] dark:text-white">
                    {pastor}
                  </p>
                </div>
              )}

              {address && (
                <div className="flex items-start gap-3 text-sm text-[#252525] dark:text-[#D1D5DB] mb-6">
                  <MapPin className="w-5 h-5 text-[#D4A84F] flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{address}</span>
                </div>
              )}

              {/* Service Times */}
              {serviceTimes && serviceTimes.length > 0 && (
                <div className="mb-6 pt-5 border-t border-[rgba(20,33,61,0.08)] dark:border-white/10">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-[#14213D] dark:text-[#D4A84F] mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#D4A84F]" />
                    Service Times
                  </h3>
                  <ul className="space-y-2.5">
                    {serviceTimes.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm bg-[#FAF8F2] dark:bg-[#0D1527] px-4 py-3 rounded-xl border border-[rgba(20,33,61,0.05)] dark:border-white/5"
                      >
                        <span className="font-semibold text-[#14213D] dark:text-white">
                          {item.day}
                        </span>
                        <div className="flex items-center gap-2 text-[#6B7280] dark:text-[#D1D5DB]">
                          <span className="text-xs font-medium bg-[#D4A84F]/15 text-[#14213D] dark:text-[#D4A84F] px-2.5 py-0.5 rounded-full">
                            {item.time}
                          </span>
                          {item.label && <span className="text-xs">({item.label})</span>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Contact lines */}
              {(phone || whatsapp || email) && (
                <div className="space-y-3 mb-6 pt-5 border-t border-[rgba(20,33,61,0.08)] dark:border-white/10 text-sm">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-[#14213D] dark:text-[#D4A84F] mb-3">
                    Contact
                  </h3>
                  {phone && (
                    <div className="flex items-center gap-3 text-[#252525] dark:text-[#D1D5DB]">
                      <Phone className="w-4 h-4 text-[#D4A84F] flex-shrink-0" />
                      <a href={`tel:${phone}`} className="hover:text-[#D4A84F] transition-colors">
                        {phone}
                      </a>
                    </div>
                  )}
                  {whatsapp && (
                    <div className="flex items-center gap-3 text-[#252525] dark:text-[#D1D5DB]">
                      <MessageCircle className="w-4 h-4 text-[#D4A84F] flex-shrink-0" />
                      <a
                        href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#D4A84F] transition-colors"
                      >
                        {whatsapp}
                      </a>
                    </div>
                  )}
                  {email && (
                    <div className="flex items-center gap-3 text-[#252525] dark:text-[#D1D5DB]">
                      <Mail className="w-4 h-4 text-[#D4A84F] flex-shrink-0" />
                      <a href={`mailto:${email}`} className="hover:text-[#D4A84F] transition-colors">
                        {email}
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Action buttons */}
              {(hasAddress || phone || whatsapp) && (
                <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-[rgba(20,33,61,0.08)] dark:border-white/10">
                  {hasAddress && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${query}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#D4A84F] text-[#14213D] hover:bg-[#E0BA68] px-5 py-2.5 rounded-full font-semibold text-sm inline-flex items-center gap-2 transition-colors shadow-sm"
                    >
                      <Navigation className="w-4 h-4" /> Get Directions
                    </a>
                  )}
                  {phone && (
                    <a
                      href={`tel:${phone}`}
                      className="bg-white dark:bg-[#141F36] text-[#14213D] dark:text-white border border-[#14213D]/20 dark:border-white/10 hover:border-[#D4A84F] hover:text-[#D4A84F] px-5 py-2.5 rounded-full font-semibold text-sm inline-flex items-center gap-2 transition-colors shadow-sm"
                    >
                      <Phone className="w-4 h-4" /> Call
                    </a>
                  )}
                  {whatsapp && (
                    <a
                      href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white dark:bg-[#141F36] text-[#14213D] dark:text-white border border-[#14213D]/20 dark:border-white/10 hover:border-[#D4A84F] hover:text-[#D4A84F] px-5 py-2.5 rounded-full font-semibold text-sm inline-flex items-center gap-2 transition-colors shadow-sm"
                    >
                      <MessageCircle className="w-4 h-4" /> WhatsApp
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Embedded Google Map (only if address/mapQuery provided) */}
            {hasAddress && (
              <div className="w-full">
                <iframe
                  title={`${name} Location Map`}
                  src={`https://www.google.com/maps?q=${query}&output=embed`}
                  className="w-full h-[320px] lg:h-[400px] rounded-2xl border border-[rgba(20,33,61,0.08)] dark:border-white/10 shadow-sm"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default CentersPage;

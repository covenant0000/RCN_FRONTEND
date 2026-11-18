import { useState, useEffect } from 'react';
import {
  Building2, Users, Check, CheckCircle2,
  Music, Flame, Globe2, Radio, Sparkles
} from 'lucide-react';
import PublicLayout from '../components/layout/PublicLayout';
import { PageHero } from '../components/ui';
import { mockDepartments } from '../services/mock/mockData';
import { useAuth } from '../context/AuthContext';

// Shared helper to get the localStorage key for joined departments per user
export const getDepartmentStorageKey = (userId) =>
  userId ? `rcn_joined_departments_${userId}` : 'rcn_joined_departments_guest';

// Map department IDs or names to intuitive icons
export const DEPARTMENT_ICONS = {
  'dep-001': Music,     // Worship & Arts (Choir)
  'dep-002': Flame,     // Prayer Ministry
  'dep-003': Globe2,    // Evangelism
  'dep-004': Users,     // Ushering
  'dep-005': Radio,     // Media & Technology
  'dep-006': Sparkles,  // Children Ministry
};

const DepartmentsPage = () => {
  const { user } = useAuth();
  const [departments, setDepartments] = useState(mockDepartments);
  const [toastMessage, setToastMessage] = useState('');

  // NOTE: Department membership (Join/Joined state) is stored in localStorage for now;
  // this should move to the backend API later.
  const storageKey = getDepartmentStorageKey(user?.id);

  const [joinedDeptIds, setJoinedDeptIds] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setJoinedDeptIds(saved ? JSON.parse(saved) : []);
    } catch {
      setJoinedDeptIds([]);
    }
  }, [storageKey]);

  const handleJoin = (dept) => {
    if (joinedDeptIds.includes(dept.id)) return;

    const updated = [...joinedDeptIds, dept.id];
    setJoinedDeptIds(updated);

    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save joined department:', e);
    }

    setToastMessage(`You have successfully joined ${dept.name}!`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  return (
    <PublicLayout>
      <PageHero
        title="Departments & Ministries"
        subtitle="Discover your calling and serve with us in Remnant Christian Network"
        breadcrumb={['Home', 'Departments']}
        bgImage="/community-bg.jpg"
      />

      <section className="section-padding bg-[#FAF8F2] dark:bg-[#0D1527]">
        <div className="container-custom">
          {/* Header intro */}
          <div className="max-w-2xl mx-auto text-center mb-12">
            <p className="text-[#D4A84F] text-xs font-semibold uppercase tracking-[0.2em] mb-3">
              Ministry Service Units
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#14213D] dark:text-white mb-4">
              Find Your Place of Service
            </h2>
            <p className="text-[#6B7280] dark:text-[#D1D5DB] text-sm md:text-base leading-relaxed">
              Every believer is equipped with gifts to build the body of Christ. Choose a ministry unit
              below to join and serve in our worship services, outreaches, and sanctuary operations.
            </p>
          </div>

          {/* Departments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => {
              const IconComponent = DEPARTMENT_ICONS[dept.id] || Building2;
              const isJoined = joinedDeptIds.includes(dept.id);

              return (
                <div
                  key={dept.id}
                  className="bg-white dark:bg-[#141F36] rounded-2xl shadow-sm border border-[rgba(20,33,61,0.08)] dark:border-white/10 p-6 sm:p-7 flex flex-col justify-between hover:border-[#D4A84F]/40 dark:hover:border-[#D4A84F]/40 transition-all duration-200 group"
                >
                  <div>
                    {/* Top unit icon & status */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-[#D4A84F]/15 text-[#14213D] dark:text-[#D4A84F] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#D4A84F] bg-[#D4A84F]/10 px-2.5 py-1 rounded-md border border-[#D4A84F]/20">
                        {dept.isActive ? 'Active Unit' : 'Sanctuary Unit'}
                      </span>
                    </div>

                    <h3 className="font-display text-xl font-bold text-[#14213D] dark:text-white mb-2 group-hover:text-[#D4A84F] transition-colors">
                      {dept.name}
                    </h3>

                    <p className="text-sm text-[#6B7280] dark:text-[#D1D5DB] leading-relaxed mb-6">
                      {dept.description}
                    </p>
                  </div>

                  {/* Footer with worker count and Join button */}
                  <div className="pt-5 border-t border-[rgba(20,33,61,0.08)] dark:border-white/10 flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-[#6B7280] dark:text-[#D1D5DB]">
                      <Users className="w-4 h-4 text-[#D4A84F]" />
                      {(dept.memberCount || 0) + (isJoined ? 1 : 0)} Active Workers
                    </span>

                    {isJoined ? (
                      <span
                        className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 cursor-default shadow-sm"
                        title="You are a member of this department"
                      >
                        <Check className="w-3.5 h-3.5" /> Joined
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleJoin(dept)}
                        className="bg-[#D4A84F] text-[#14213D] hover:bg-[#E0BA68] px-5 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        Join
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl bg-emerald-600 text-white text-sm font-medium animate-fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </PublicLayout>
  );
};

export default DepartmentsPage;

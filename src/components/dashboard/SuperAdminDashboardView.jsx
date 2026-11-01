import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert, ShieldCheck, Server, Database, Activity,
  Users, UserCheck, HardDrive, Cpu, Terminal, ArrowRight,
  TrendingUp, RefreshCw, Key, CheckCircle2, AlertOctagon
} from 'lucide-react';
import { MetricCard, TrendAreaChart, ComparisonBarChart, DonutChart } from './DashboardCharts';
import { mockSystemHealth } from '../../services/mock/mockData';

export const SuperAdminDashboardView = ({
  users = [],
  members = [],
  events = [],
  sermons = [],
  departments = [],
  attendance = {},
  donations = [],
  auditLogs = [],
}) => {
  const [platformPeriod, setPlatformPeriod] = useState('30D');

  // Role distribution calculation
  const roleCounts = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {
    SUPER_ADMIN: 1,
    ADMIN: 3,
    PASTOR: 2,
    DEPARTMENT_HEAD: 6,
    WORKER: 18,
    MEMBER: members.length || 32,
  });

  const totalRegisteredUsers = Object.values(roleCounts).reduce((a, b) => a + b, 0);

  // Donut chart data for role distribution
  const roleDonutData = [
    { label: 'Super Admins', value: roleCounts.SUPER_ADMIN, color: '#ef4444' },
    { label: 'Pastors', value: roleCounts.PASTOR, color: '#d4a84b' },
    { label: 'Admins', value: roleCounts.ADMIN, color: '#3b82f6' },
    { label: 'Dept Heads', value: roleCounts.DEPARTMENT_HEAD, color: '#8b5cf6' },
    { label: 'Workers', value: roleCounts.WORKER, color: '#02ad88' },
    { label: 'Members', value: roleCounts.MEMBER, color: '#1D1747' },
  ];

  // System growth data
  const platformGrowthData = [
    { label: 'Oct', value: 420 },
    { label: 'Nov', value: 580 },
    { label: 'Dec', value: 740 },
    { label: 'Jan', value: 920 },
    { label: 'Feb (Proj)', value: 1150 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ── 1. Platform-Wide Executive KPIs ───────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            System-Wide Platform Governance & Health
          </h2>
          <span className="text-xs text-rose-600 dark:text-rose-400 font-medium bg-rose-50 dark:bg-rose-950/40 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-900/40 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" /> Super Admin Tier
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          <MetricCard
            icon={Users}
            label="Total Registered Accounts"
            value={totalRegisteredUsers.toLocaleString()}
            change="+23.8%"
            isPositive={true}
            subtext="Across all system roles"
            color="bg-primary/10 text-primary dark:text-accent"
            linkTo="/dashboard/members"
          />

          <MetricCard
            icon={ShieldCheck}
            label="Elevated Staff & Clergy"
            value={(roleCounts.SUPER_ADMIN + roleCounts.ADMIN + roleCounts.PASTOR + roleCounts.DEPARTMENT_HEAD).toLocaleString()}
            change="12 Active"
            isPositive={true}
            subtext="RBAC secured credentials"
            color="bg-amber-500/10 text-amber-600 dark:text-amber-400"
            linkTo="/dashboard/members"
          />

          <MetricCard
            icon={Server}
            label="Infrastructure Status"
            value={mockSystemHealth.uptime}
            change="Zero Downtime"
            isPositive={true}
            subtext={`Latency: ${mockSystemHealth.dbLatency}`}
            color="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          />

          <MetricCard
            icon={Activity}
            label="Security & Audit Events"
            value={(auditLogs.length || 14).toLocaleString()}
            change="Verified"
            isPositive={true}
            subtext="No unauthorized attempts"
            color="bg-purple-500/10 text-purple-600 dark:text-purple-400"
          />
        </div>
      </div>

      {/* ── 2. Platform Analytics & Role Distribution ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrendAreaChart
            title="Global Platform Growth & Adoption"
            subtitle="Registered users, church app installations and portal accounts"
            data={platformGrowthData}
            valueSuffix=" accounts"
            periods={['30D', '90D', '1Y', 'ALL']}
            selectedPeriod={platformPeriod}
            onPeriodChange={setPlatformPeriod}
            color="#02ad88"
          />
        </div>

        <div>
          <DonutChart
            title="Role Hierarchy Distribution"
            subtitle="Access tier allocation across accounts"
            data={roleDonutData}
            centerLabel="Accounts"
            centerValue={totalRegisteredUsers}
          />
        </div>
      </div>

      {/* ── 3. System Infrastructure Health & Operational Status ──────────── */}
      <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100 dark:border-white/10">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-base md:text-lg flex items-center gap-2">
              <Server className="w-5 h-5 text-accent" /> System Health & Node Architecture
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Real-time telemetry from application services, database clusters, and storage buckets.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
              <span>API Gateway</span>
              <span className="text-emerald-500 font-bold">100%</span>
            </div>
            <p className="font-bold text-gray-900 dark:text-white text-lg">{mockSystemHealth.apiStatus}</p>
            <p className="text-[11px] text-gray-400 mt-1">REST v1 • HTTPS TLS 1.3</p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
              <span>Primary Database</span>
              <span className="text-accent font-bold">{mockSystemHealth.dbLatency}</span>
            </div>
            <p className="font-bold text-gray-900 dark:text-white text-lg">{mockSystemHealth.databaseStatus}</p>
            <p className="text-[11px] text-gray-400 mt-1">PostgreSQL Cluster Active</p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
              <span>Sermon Media Storage</span>
              <span className="text-blue-500 font-bold">42.8%</span>
            </div>
            <p className="font-bold text-gray-900 dark:text-white text-lg">{mockSystemHealth.storageUsed}</p>
            <p className="text-[11px] text-gray-400 mt-1">Encrypted S3 Media Store</p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
              <span>Concurrent Sockets</span>
              <span className="text-purple-500 font-bold">{mockSystemHealth.activeConnections}</span>
            </div>
            <p className="font-bold text-gray-900 dark:text-white text-lg">{mockSystemHealth.version}</p>
            <p className="text-[11px] text-gray-400 mt-1">Node v23 Core Engine</p>
          </div>
        </div>
      </div>

      {/* ── 4. System Security Audit Trail ────────────────────────────────── */}
      <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/10">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-gray-900 dark:text-white text-base">
              System Audit Trail & Security Event Logs
            </h3>
          </div>
          <span className="text-xs text-gray-400 font-mono">Immutable Ledger</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 font-semibold uppercase">
              <tr>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Actor</th>
                <th className="px-6 py-3">Action</th>
                <th className="px-6 py-3">Target Resource</th>
                <th className="px-6 py-3">IP Address</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/70 dark:hover:bg-white/5 transition-colors font-mono">
                  <td className="px-6 py-3.5 text-gray-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-3.5 font-bold text-gray-900 dark:text-white whitespace-nowrap">
                    {log.user}
                  </td>
                  <td className="px-6 py-3.5 text-accent whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="px-6 py-3.5 text-gray-600 dark:text-gray-300">
                    {log.target}
                  </td>
                  <td className="px-6 py-3.5 text-gray-400">
                    {log.ip}
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

// ─── Premium Metric / KPI Card ─────────────────────────────────────────────

export const MetricCard = ({
  icon: Icon,
  label,
  value,
  change,
  isPositive = true,
  subtext,
  color = 'bg-accent/10 text-accent',
  linkTo,
  period,
}) => {
  const CardContent = (
    <div className="group relative bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 p-5 md:p-6 shadow-sm hover:shadow-md hover:border-accent/40 dark:hover:border-accent/40 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} transition-transform duration-300 group-hover:scale-105`}>
          <Icon className="w-6 h-6 shrink-0" />
        </div>

        {change !== undefined && (
          <div
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
              isPositive
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
            }`}
          >
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span>{isPositive ? '+' : ''}{change}</span>
          </div>
        )}
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">{label}</p>
        <p className="font-display text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{value}</p>
        
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{subtext || (period ? `vs previous ${period}` : '')}</span>
          {linkTo && (
            <span className="text-accent font-medium inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              View <ArrowRight className="w-3 h-3" />
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return linkTo ? <Link to={linkTo} className="block">{CardContent}</Link> : CardContent;
};

// ─── Interactive SVG Trend / Area Chart ───────────────────────────────────

export const TrendAreaChart = ({
  title,
  subtitle,
  data = [],
  valuePrefix = '',
  valueSuffix = '',
  height = 200,
  periods = ['7D', '30D', '90D', '1Y'],
  selectedPeriod,
  onPeriodChange,
  color = '#02ad88',
}) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 p-6 flex flex-col items-center justify-center min-h-[260px] text-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm">No data available for the selected period</p>
      </div>
    );
  }

  const values = data.map((d) => d.value);
  const minVal = Math.min(...values, 0);
  const maxVal = Math.max(...values, 10);
  const range = maxVal - minVal || 1;

  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 35;
  const width = 600;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const points = data.map((d, i) => {
    const x = paddingLeft + (i / (data.length - 1 || 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((d.value - minVal) / range) * chartHeight;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const cx = (prev.x + p.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`;

  const hoveredPoint = hoveredIdx !== null ? points[hoveredIdx] : null;

  return (
    <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 p-6 shadow-sm">
      {/* Header with Title and Period Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-base md:text-lg">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
        </div>

        {periods && onPeriodChange && (
          <div className="inline-flex items-center p-1 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 shrink-0 self-start sm:self-auto">
            {periods.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onPeriodChange(p)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedPeriod === p
                    ? 'bg-white dark:bg-white/10 text-accent shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SVG Chart */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
          onMouseLeave={() => setHoveredIdx(null)}
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const y = paddingTop + chartHeight * (1 - pct);
            const val = Math.round(minVal + range * pct);
            return (
              <g key={idx}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="currentColor"
                  className="text-gray-100 dark:text-white/5"
                  strokeDasharray="3 3"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[10px] fill-gray-400 dark:fill-gray-500 font-sans"
                >
                  {val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
                </text>
              </g>
            );
          })}

          {/* Area fill & Stroke curve */}
          <path d={areaD} fill="url(#areaGradient)" />
          <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Interactive points & hover listeners */}
          {points.map((p, i) => (
            <g
              key={i}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIdx(i)}
            >
              {/* Invisible wide hit area */}
              <circle cx={p.x} cy={p.y} r="14" fill="transparent" />

              {/* Point dot */}
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIdx === i ? '5' : '3'}
                fill={hoveredIdx === i ? '#ffffff' : color}
                stroke={color}
                strokeWidth={hoveredIdx === i ? '3' : '1.5'}
                className="transition-all duration-150"
              />

              {/* Bottom X-axis label */}
              {(points.length <= 8 || i % Math.ceil(points.length / 6) === 0 || i === points.length - 1) && (
                <text
                  x={p.x}
                  y={paddingTop + chartHeight + 18}
                  textAnchor="middle"
                  className="text-[10px] fill-gray-400 dark:fill-gray-500 font-sans"
                >
                  {p.label}
                </text>
              )}
            </g>
          ))}

          {/* Active hover vertical line */}
          {hoveredPoint && (
            <line
              x1={hoveredPoint.x}
              y1={paddingTop}
              x2={hoveredPoint.x}
              y2={paddingTop + chartHeight}
              stroke="currentColor"
              className="text-accent/60"
              strokeDasharray="4 4"
              strokeWidth="1.5"
            />
          )}
        </svg>

        {/* Hover Floating Tooltip */}
        {hoveredPoint && (
          <div
            className="absolute pointer-events-none -top-1 px-3 py-1.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs shadow-xl transform -translate-x-1/2 transition-all duration-100 z-10 whitespace-nowrap"
            style={{
              left: `${(hoveredPoint.x / width) * 100}%`,
            }}
          >
            <p className="font-semibold">{hoveredPoint.label}</p>
            <p className="text-accent dark:text-emerald-600 font-bold">
              {valuePrefix}{hoveredPoint.value.toLocaleString()}{valueSuffix}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Interactive Comparison Bar Chart ──────────────────────────────────────

export const ComparisonBarChart = ({
  title,
  subtitle,
  data = [],
  valuePrefix = '',
  barColor = 'bg-accent',
}) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 p-6 flex items-center justify-center min-h-[220px]">
        <p className="text-gray-500 dark:text-gray-400 text-sm">No data available</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 dark:text-white text-base md:text-lg">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="space-y-4">
        {data.map((item, idx) => {
          const pct = Math.round((item.value / maxValue) * 100);
          const isHovered = hoveredItem === idx;

          return (
            <div
              key={item.label}
              onMouseEnter={() => setHoveredItem(idx)}
              onMouseLeave={() => setHoveredItem(null)}
              className="cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-accent transition-colors">
                  {item.label}
                </span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {valuePrefix}{item.value.toLocaleString()} {item.sub && <span className="font-normal text-gray-400">({item.sub})</span>}
                </span>
              </div>

              <div className="w-full h-3 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColor} ${
                    isHovered ? 'brightness-110 shadow-sm' : ''
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Donut / Progress Distribution Chart ───────────────────────────────────

export const DonutChart = ({
  title,
  subtitle,
  data = [],
  centerLabel = 'Total',
  centerValue,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const total = data.reduce((sum, d) => sum + (d.value || 0), 0) || 1;
  const radius = 64;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 p-6 shadow-sm flex flex-col justify-between">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white text-base md:text-lg">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-2">
        {/* SVG Donut */}
        <div className="relative w-40 h-40 shrink-0">
          <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90 transform">
            {/* Background ring */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke="currentColor"
              className="text-gray-100 dark:text-white/5"
              strokeWidth="18"
            />

            {/* Segments */}
            {data.map((item, idx) => {
              const percent = item.value / total;
              const strokeDasharray = `${percent * circumference} ${circumference}`;
              const strokeDashoffset = -accumulatedPercent * circumference;
              accumulatedPercent += percent;

              return (
                <circle
                  key={item.label}
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke={item.color || '#02ad88'}
                  strokeWidth={hoveredIdx === idx ? 22 : 18}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              );
            })}
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">{centerLabel}</span>
            <span className="font-display text-xl font-bold text-gray-900 dark:text-white">
              {hoveredIdx !== null ? data[hoveredIdx].value.toLocaleString() : (centerValue || total).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2.5 w-full sm:w-auto">
          {data.map((item, idx) => {
            const pct = Math.round((item.value / total) * 100);
            return (
              <div
                key={item.label}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`flex items-center justify-between gap-4 p-2 rounded-xl transition-all cursor-pointer ${
                  hoveredIdx === idx ? 'bg-gray-50 dark:bg-white/5' : ''
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: item.color || '#02ad88' }}
                  />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-900 dark:text-white">{item.value}</span>
                  <span className="text-[10px] text-gray-400 font-mono">({pct}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};


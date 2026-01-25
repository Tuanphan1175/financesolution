import React from "react";

export type IconProps = React.SVGProps<SVGSVGElement>;

/* =========================
   CORE ICONS
========================= */

export const ChartPieIcon: React.FC<IconProps> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
    <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
  </svg>
);

export const CollectionIcon: React.FC<IconProps> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2V9a2 2 0 012-2h10a2 2 0 012 2v2z" />
  </svg>
);

export const ClipboardListIcon: React.FC<IconProps> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2
         M9 5a2 2 0 002 2h2a2 2 0 002-2
         M9 5a2 2 0 012-2h2a2 2 0 012 2
         m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

export const DocumentReportIcon: React.FC<IconProps> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      d="M9 17v-2m3 2v-4m3 4v-6
         m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586
         a1 1 0 01.707.293l5.414 5.414
         a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export const CurrencyDollarIcon: React.FC<IconProps> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      d="M12 6v12m-3-3l1 .75c1.5 1.125 4 1.125 5.5 0
         1.5-1.125 1.5-3 0-4.125
         C14 10.5 13 10.25 12 10.25
         c-1 0-2-.25-2.75-.75
         -1.25-1.125-1.25-3 0-4.125
         1-1 2.5-1.375 4-.75
         1 .25 2 .75 2.75 1.5" />
  </svg>
);

/* =========================
   COMMON UI ICONS
========================= */

export const PlusIcon = (p: IconProps) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth={2} strokeLinecap="round" d="M12 6v12m6-6H6" /></svg>;
export const XIcon = (p: IconProps) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth={2} strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>;
export const MenuIcon = (p: IconProps) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth={2} strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" /></svg>;
export const ArrowRightIcon = (p: IconProps) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth={2} strokeLinecap="round" d="M14 5l7 7-7 7M3 12h18" /></svg>;
export const CheckIcon = (p: IconProps) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth={2} strokeLinecap="round" d="M5 13l4 4L19 7" /></svg>;

/* =========================
   SPECIAL ICONS
========================= */

export const ShieldCheckIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const TrendingUpIcon = (p: IconProps) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      d="M3 17l6-6 4 4 8-8" />
  </svg>
);

/* =========================
   PYRAMID (FIXED)
========================= */

export const PyramidIcon: React.FC<IconProps> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      d="M12 3L2 21h20L12 3z" />
    <path strokeWidth={2} strokeLinecap="round" d="M6 15h12" />
    <path strokeWidth={2} strokeLinecap="round" d="M8.5 11h7" />
  </svg>
);

/* =========================
   ICON MAP
========================= */

export const IconMap: Record<string, React.FC<IconProps>> = {
  ChartPie: ChartPieIcon,
  ShieldCheck: ShieldCheckIcon,
  TrendingUp: TrendingUpIcon,
  Pyramid: PyramidIcon,
};

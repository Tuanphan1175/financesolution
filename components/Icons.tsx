// components/Icons.tsx
import React from "react";

export type IconProps = React.SVGProps<SVGSVGElement> & { title?: string };

function SvgBase({
  children,
  title,
  ...props
}: React.SVGProps<SVGSVGElement> & { title?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

// --- Common icons used across app ---
export const SparklesIcon: React.FC<IconProps> = (props) => (
  <SvgBase {...props}>
    <path d="M12 2l1.5 5L19 8.5l-5.5 1.5L12 15l-1.5-5L5 8.5 10.5 7 12 2z" />
    <path d="M5 13l.8 2.7L8.5 16.5l-2.7.8L5 20l-.8-2.7L1.5 16.5l2.7-.8L5 13z" />
    <path d="M19 13l.8 2.7 2.7.8-2.7.8L19 20l-.8-2.7-2.7-.8 2.7-.8L19 13z" />
  </SvgBase>
);

export const ArrowUpIcon: React.FC<IconProps> = (props) => (
  <SvgBase {...props}>
    <path d="M12 19V5" />
    <path d="M5 12l7-7 7 7" />
  </SvgBase>
);

// --- Category icons (the ones in constants.ts) ---
export const BriefcaseIcon: React.FC<IconProps> = (props) => (
  <SvgBase {...props}>
    <path d="M9 6V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1" />
    <rect x="3" y="6" width="18" height="14" rx="2" />
    <path d="M3 12h18" />
  </SvgBase>
);

export const ShoppingCartIcon: React.FC<IconProps> = (props) => (
  <SvgBase {...props}>
    <circle cx="9" cy="20" r="1" />
    <circle cx="17" cy="20" r="1" />
    <path d="M3 4h2l2.2 10.4A2 2 0 0 0 9.2 16H17a2 2 0 0 0 2-1.6L21 8H6" />
  </SvgBase>
);

export const HomeIcon: React.FC<IconProps> = (props) => (
  <SvgBase {...props}>
    <path d="M3 10.5L12 3l9 7.5" />
    <path d="M5 10v10h14V10" />
  </SvgBase>
);

export const BusIcon: React.FC<IconProps> = (props) => (
  <SvgBase {...props}>
    <rect x="6" y="3" width="12" height="14" rx="2" />
    <path d="M6 7h12" />
    <path d="M8 17v2" />
    <path d="M16 17v2" />
    <circle cx="9" cy="14" r="1" />
    <circle cx="15" cy="14" r="1" />
  </SvgBase>
);

export const TicketIcon: React.FC<IconProps> = (props) => (
  <SvgBase {...props}>
    <path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V7z" />
    <path d="M12 6v12" />
  </SvgBase>
);

export const PencilIcon: React.FC<IconProps> = (props) => (
  <SvgBase {...props}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </SvgBase>
);

export const LightningBoltIcon: React.FC<IconProps> = (props) => (
  <SvgBase {...props}>
    <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
  </SvgBase>
);

export const HeartIcon: React.FC<IconProps> = (props) => (
  <SvgBase {...props}>
    <path d="M12 21s-7-4.6-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.4-9.5 9-9.5 9z" />
  </SvgBase>
);

export const ChartPieIcon: React.FC<IconProps> = (props) => (
  <SvgBase {...props}>
    <path d="M12 12V2a10 10 0 1 1-9.9 12H12z" />
    <path d="M12 2a10 10 0 0 1 10 10H12V2z" />
  </SvgBase>
);

// --- UI actions icons moved to bottom or replaced with more detailed versions ---

/**
 * ICON MAP cho Category.icon (string)
 * Lưu ý: key phải khớp đúng string trong constants.ts (Briefcase, ShoppingCart, ...)
 */
// --- Navigation / Action icons ---
export const CollectionIcon: React.FC<IconProps> = (props) => (
  <SvgBase {...props}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </SvgBase>
);

export const ClipboardListIcon: React.FC<IconProps> = (props) => (
  <SvgBase {...props}>
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <path d="M9 12h6" />
    <path d="M9 16h6" />
  </SvgBase>
);

export const DocumentReportIcon: React.FC<IconProps> = (props) => (
  <SvgBase {...props}>
    <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" />
  </SvgBase>
);

export const CurrencyDollarIcon: React.FC<IconProps> = (props) => (
  <SvgBase {...props}>
    <path d="M12 2v20" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </SvgBase>
);

export const ShieldCheckIcon: React.FC<IconProps> = (props) => (
  <SvgBase {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </SvgBase>
);

export const TrendingUpIcon: React.FC<IconProps> = (props) => (
  <SvgBase {...props}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </SvgBase>
);

export const ScaleIcon: React.FC<IconProps> = (props) => (
  <SvgBase {...props}>
    <path d="M12 3v18" />
    <path d="M16 7l-8 0" />
    <path d="M4 10h4l2 7H4l2-7z" />
    <path d="M16 10h4l-2 7h-4l2-7z" />
  </SvgBase>
);

export const CalendarIcon: React.FC<IconProps> = (props) => (
  <SvgBase {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </SvgBase>
);

export const BookOpenIcon: React.FC<IconProps> = (props) => (
  <SvgBase {...props}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </SvgBase>
);

export const RefreshIcon: React.FC<IconProps> = (props) => (
  <SvgBase {...props}>
    <path d="M23 4v6h-6" />
    <path d="M1 20v-6h6" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </SvgBase>
);

export const ArrowRightIcon: React.FC<IconProps> = (props) => (
  <SvgBase {...props}>
    <path d="M5 12h14" />
    <path d="M12 5l7 7-7 7" />
  </SvgBase>
);

export const XIcon: React.FC<IconProps> = (props) => (
  <SvgBase {...props}>
    <path d="M18 6L6 18" />
    <path d="M6 6l12 12" />
  </SvgBase>
);

export const CheckCircleIcon: React.FC<IconProps> = (props) => (
  <SvgBase {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9 12l2 2 4-4" />
  </SvgBase>
);

export const SaveDiskIcon: React.FC<IconProps> = (props) => (
  <SvgBase {...props}>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </SvgBase>
);

export const ExclamationIcon: React.FC<IconProps> = (props) => (
  <SvgBase {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </SvgBase>
);

export const CashIcon: React.FC<IconProps> = (props) => (
  <SvgBase {...props}>
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <circle cx="12" cy="12" r="3" />
    <path d="M6 12h.01M18 12h.01" />
  </SvgBase>
);

export const CreditCardIcon: React.FC<IconProps> = (props) => (
  <SvgBase {...props}>
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </SvgBase>
);

export const FilterIcon: React.FC<IconProps> = (props) => (
  <SvgBase {...props}>
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </SvgBase>
);

export const DownloadIcon: React.FC<IconProps> = (props) => (
  <SvgBase {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </SvgBase>
);

export const ArrowDownIcon: React.FC<IconProps> = (props) => (
  <SvgBase {...props}>
    <path d="M12 5v14" />
    <path d="M19 12l-7 7-7-7" />
  </SvgBase>
);

export const LockClosedIcon: React.FC<IconProps> = (props) => (
  <SvgBase {...props}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </SvgBase>
);

export const FlagIcon: React.FC<IconProps> = (props) => (
  <SvgBase {...props}>
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </SvgBase>
);

export const CogIcon: React.FC<IconProps> = (props) => (
  <SvgBase {...props}>
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </SvgBase>
);

export const TrashIcon: React.FC<IconProps> = (props) => (
  <SvgBase {...props}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </SvgBase>
);

export const CheckIcon: React.FC<IconProps> = (props) => (
  <SvgBase {...props}>
    <polyline points="20 6 9 17 4 12" />
  </SvgBase>
);

export const PlusIcon: React.FC<IconProps> = (props) => (
  <SvgBase {...props}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </SvgBase>
);

export const IconMap: Record<string, React.FC<IconProps>> = {
  Briefcase: BriefcaseIcon,
  ShoppingCart: ShoppingCartIcon,
  Home: HomeIcon,
  Bus: BusIcon,
  Ticket: TicketIcon,
  Pencil: PencilIcon,
  LightningBolt: LightningBoltIcon,
  Heart: HeartIcon,
  TrendingUp: TrendingUpIcon,
  ChartPie: ChartPieIcon,
  Cash: CashIcon,
  CreditCard: CreditCardIcon,
  Plus: PlusIcon,
  Trash: TrashIcon,
  Check: CheckIcon,
};

// components/Icons.tsx
import React from "react";

export type IconProps = React.SVGProps<SVGSVGElement>;

const Svg: React.FC<IconProps & { children: React.ReactNode }> = ({
  children,
  ...props
}) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    {children}
  </svg>
);

/* =========================
   NAV / DASHBOARD ICONS
========================= */

export const ChartPieIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
    />
  </Svg>
);

export const CollectionIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
    />
  </Svg>
);

export const ClipboardListIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
    />
  </Svg>
);

export const DocumentReportIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </Svg>
);

export const CurrencyDollarIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182.95-.75 2.162-1.085 3.32-.934 1.146.152 2.107.643 2.898 1.401"
    />
  </Svg>
);

export const ShieldCheckIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </Svg>
);

export const TrendingUpIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
    />
  </Svg>
);

export const ScaleIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
    />
  </Svg>
);

export const CalendarIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </Svg>
);

export const SparklesIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    />
  </Svg>
);

export const BookOpenIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </Svg>
);

export const PencilIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
    />
  </Svg>
);

export const RefreshIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </Svg>
);

/* =========================
   COMMON UI ICONS
========================= */

export const MenuIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </Svg>
);

export const XIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </Svg>
);

export const ArrowUpIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 10l7-7m0 0l7 7m-7-7v18"
    />
  </Svg>
);

export const ArrowDownIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 14l-7 7m0 0l-7-7m7 7V3"
    />
  </Svg>
);

export const ArrowRightIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </Svg>
);

export const CheckIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </Svg>
);

/* =========================
   FORM / TOOL ICONS (Transactions, Budgets, etc.)
========================= */

export const PlusIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </Svg>
);

export const FilterIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5h18l-7 8v6l-4 2v-8L3 5z"
    />
  </Svg>
);

export const CogIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35.51-.124.93-.47 1.066-1.066.136-.595-.003-1.158-.32-1.506-.94-1.543.826-3.31 2.37-2.37.348.317.91.456 1.506.32.596-.136.942-.556 1.066-1.066z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </Svg>
);

export const CashIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 12h-8m0 0l3-3m-3 3l3 3"
    />
  </Svg>
);

export const SaveDiskIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 3h11l3 3v15a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 3v6h8V3M8 21v-7h8v7"
    />
  </Svg>
);

export const ExclamationIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v4m0 4h.01"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.29 3.86l-7.1 12.3A1.5 1.5 0 004.5 18h15a1.5 1.5 0 001.31-2.24l-7.1-12.3a1.5 1.5 0 00-2.62 0z"
    />
  </Svg>
);

/* =========================
   CATEGORY ICONS + ICON MAP
========================= */

export const DefaultCategoryIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6v6l4 2"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </Svg>
);

export const FoodIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 3v7a4 4 0 004 4v7M8 3v7M12 3v18M16 3v7a4 4 0 01-4 4"
    />
  </Svg>
);

export const HomeIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 10l9-7 9 7v10a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1V10z"
    />
  </Svg>
);

export const ShoppingBagIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 7l1-3h10l1 3"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 7h14l-1 14H6L5 7z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 10a3 3 0 006 0"
    />
  </Svg>
);

export const CarIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 13l2-6a2 2 0 012-1h10a2 2 0 012 1l2 6"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13h14v6H5v-6z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM16.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
    />
  </Svg>
);

export const HeartIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 21s-7-4.35-9.5-8.5C.5 8.5 3 6 6 6c1.8 0 3.2 1 4 2 0 0 1.6-2 4-2 3 0 5.5 2.5 3.5 6.5C19 16.65 12 21 12 21z"
    />
  </Svg>
);

export const GraduationCapIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3L2 8l10 5 10-5-10-5z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 10v6c0 1.5 3 3 6 3s6-1.5 6-3v-6"
    />
  </Svg>
);

export const GiftIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20 12v9a1 1 0 01-1 1H5a1 1 0 01-1-1v-9"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M22 7H2v5h20V7z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 22V7"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 7c-1.5 0-3-1.5-3-3 0-1.5 1-2 2-2 2 0 4 5 4 5s-2 0-3 0z"
    />
  </Svg>
);

export const IconMap: Record<string, React.FC<IconProps>> = {
  // expenses
  food: FoodIcon,
  groceries: FoodIcon,
  dining: FoodIcon,
  home: HomeIcon,
  rent: HomeIcon,
  utilities: HomeIcon,
  shopping: ShoppingBagIcon,
  transport: CarIcon,
  travel: CarIcon,
  health: HeartIcon,
  education: GraduationCapIcon,
  gift: GiftIcon,

  // income
  salary: CurrencyDollarIcon,
  income: CurrencyDollarIcon,
  bonus: SparklesIcon,
  investment: TrendingUpIcon,

  // fallback
  other: DefaultCategoryIcon,
};

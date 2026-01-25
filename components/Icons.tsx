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
   DASHBOARD / NAV ICONS
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
  <Svg {...props} strokeWidth={1.5}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
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

export const PlusIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 5v14M5 12h14"
    />
  </Svg>
);

export const FilterIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5h18l-7 8v6l-4-2v-4L3 5z"
    />
  </Svg>
);

export const CogIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19.4 15a7.8 7.8 0 00.1-2l2-1.2-2-3.6-2.3.7a7.7 7.7 0 00-1.7-1L15 3h-6l-.5 4a7.7 7.7 0 00-1.7 1L4.5 7.2l-2 3.6 2 1.2a7.8 7.8 0 00.1 2l-2 1.2 2 3.6 2.3-.7a7.7 7.7 0 001.7 1l.5 4h6l.5-4a7.7 7.7 0 001.7-1l2.3.7 2-3.6-2-1.2z"
    />
  </Svg>
);

export const CashIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 7h18v10H3V7z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 10h.01M17 14h.01M12 15a3 3 0 100-6 3 3 0 000 6z"
    />
  </Svg>
);

/* SaveDiskIcon: dùng cho nút lưu (Transactions.tsx đang import) */
export const SaveDiskIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 4h11l3 3v13a1 1 0 01-1 1H6a1 1 0 01-1-1V4z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 4v6h8V4M8 21v-7h8v7"
    />
  </Svg>
);

/* =========================
   CATEGORY ICONS + ICON MAP
   (Transactions/AddTransactionForm hay dùng IconMap[name])
========================= */

export const FoodIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 3v8M7 11a3 3 0 006 0V3M17 3v8a3 3 0 01-3 3" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 21h14" />
  </Svg>
);

export const HomeIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1V10.5z" />
  </Svg>
);

export const CarIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-1 2m12-2l1 2M6 10l1-3h10l1 3" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 16h14a1 1 0 001-1v-3a2 2 0 00-2-2H6a2 2 0 00-2 2v3a1 1 0 001 1z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7.5 16a1.5 1.5 0 103 0m6 0a1.5 1.5 0 10-3 0" />
  </Svg>
);

export const HealthIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21s-7-4.35-9.5-8.5C.5 8 3 5 6 5c2 0 3.5 1.2 6 4 2.5-2.8 4-4 6-4 3 0 5.5 3 3.5 7.5C19 16.65 12 21 12 21z" />
  </Svg>
);

export const GiftIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12v9H4v-9" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 7h20v5H2V7z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 7v14" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 7h4a2 2 0 000-4c-2 0-3 2-4 4zM12 7H8a2 2 0 010-4c2 0 3 2 4 4z" />
  </Svg>
);

export const ShoppingBagIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 7l1-3h10l1 3" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 7h14l-1 14H6L5 7z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a3 3 0 006 0" />
  </Svg>
);

export const WalletIcon: React.FC<IconProps> = (props) => (
  <Svg {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V9a2 2 0 012-2z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 13h.01" />
  </Svg>
);

/**
 * IconMap:
 * - Transactions.tsx / AddTransactionForm.tsx hay dùng IconMap[iconName]
 * - Nếu iconName không khớp, fallback sẽ dùng WalletIcon hoặc CashIcon.
 */
export const IconMap: Record<string, React.FC<IconProps>> = {
  // payment / money
  cash: CashIcon,
  money: CashIcon,
  wallet: WalletIcon,
  income: CurrencyDollarIcon,
  expense: WalletIcon,

  // categories phổ biến
  food: FoodIcon,
  home: HomeIcon,
  rent: HomeIcon,
  car: CarIcon,
  travel: CarIcon,
  health: HealthIcon,
  medical: HealthIcon,
  gift: GiftIcon,
  shopping: ShoppingBagIcon,
  groceries: ShoppingBagIcon,

  // UI fallbacks
  default: WalletIcon,
};

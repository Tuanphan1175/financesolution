const NavItem: React.FC<{
  view: View;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-500 group relative mb-1 ${
        isActive
          ? 'bg-gradient-to-r from-luxury-gold to-amber-600 text-black shadow-luxury'
          : 'text-slate-500 hover:text-white hover:bg-slate-800/50'
      }`}
    >
      <div
        className={`transition-all duration-500 group-hover:scale-110 ${
          isActive ? 'text-black' : 'text-slate-600 group-hover:text-luxury-gold'
        }`}
      >
        {React.cloneElement(icon as React.ReactElement, { className: 'h-6 w-6' })}
      </div>

      <span className="ml-5 truncate">{label}</span>

      {isActive && (
        <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-black/40"></div>
      )}
    </button>
  );
};

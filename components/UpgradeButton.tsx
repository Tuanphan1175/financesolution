import React from 'react';
import { SparklesIcon } from './Icons';

interface UpgradeButtonProps {
  onClick: () => void;
}

export const UpgradeButton: React.FC<UpgradeButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 flex items-center px-6 py-3 bg-luxury-gold text-black font-black rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-pulse-gold border border-luxury-gold/50"
      title="Nâng cấp VIP"
    >
      <SparklesIcon className="h-6 w-6 mr-2" />
      <span className="text-sm uppercase tracking-widest">Nâng cấp VIP</span>
    </button>
  );
};
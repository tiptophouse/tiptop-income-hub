
import React from 'react';
import { ChartBar } from 'lucide-react';

interface InsightsHeaderProps {
  address: string;
  propertySize?: string;
  accentText: string;
}

const InsightsHeader: React.FC<InsightsHeaderProps> = ({ address, propertySize, accentText }) => (
  <div className={`w-full max-w-5xl mx-auto rounded-3xl p-8 bg-gradient-to-tr from-[#9b87f5] via-[#f5e7ff] to-[#ffe4d8] shadow-[0_20px_60px_rgba(155,135,245,0.4)] relative overflow-hidden flex flex-col md:flex-row items-center gap-8`}>
    <div className="relative z-20 flex md:items-center gap-5 w-full">
      <span className="block bg-white/90 rounded-full p-3 shadow-lg border border-white/60 flex-shrink-0">
        <ChartBar className="h-8 w-8 text-[#8B5CF6]" />
      </span>
      <div className="text-left max-w-md">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-[#f3eefd] tracking-tight mb-1 leading-tight truncate">
          Property Analysis
        </h1>
        <p className="font-semibold text-gray-700 dark:text-[#ded9f3] text-base sm:text-lg truncate max-w-[300px]">
          AI-powered insights for <span className={accentText}>{address.length > 25 ? address.substring(0, 25) + '...' : address}</span>
        </p>
        {propertySize && (
          <p className="text-sm mt-2 text-[#B993FE] font-extrabold tracking-widest">
            Estimated Size: {propertySize}
          </p>
        )}
      </div>
    </div>
    <div className="absolute right-0 bottom-0 z-0 w-1/3 h-44 hidden md:block" aria-hidden>
      <svg width="100%" height="100%" viewBox="0 0 200 60" fill="none"><ellipse cx="100" cy="30" rx="100" ry="30" fill="#ece2fe" /></svg>
    </div>
  </div>
);

export default InsightsHeader;


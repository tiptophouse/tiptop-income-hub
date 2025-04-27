
import React from 'react';
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface AssetCardProps {
  color: string;
  title: string;
  main: string;
  details: string;
  value: string;
  icon: React.ReactNode;
  glassStyle: string;
  accentText: string;
}

const AssetCard: React.FC<AssetCardProps> = ({
  color, title, main, details, value, icon, glassStyle, accentText
}) => (
  <div className={`relative overflow-hidden rounded-2xl ${glassStyle} group hover:scale-[1.02] transition-all duration-300 border-l-4 ${color} cursor-pointer h-full`}>
    <div className="absolute top-2 right-2 z-10">
      <span className={`inline-block px-2 py-1 bg-white/90 text-xs font-bold rounded-full uppercase tracking-wider ${accentText} shadow-sm`}>{title}</span>
    </div>
    <CardHeader className="pb-1 pt-3 pr-2 bg-transparent flex flex-col">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <CardTitle className="text-sm md:text-lg font-bold text-[#6E59A5] truncate max-w-[90%]">{main}</CardTitle>
      </div>
      <CardDescription className="text-xs md:text-sm font-medium text-gray-700 line-clamp-2 min-h-[2.5rem]">{details}</CardDescription>
    </CardHeader>
    <CardContent className="pt-0 pb-3 md:pb-4">
      <div className="text-xl md:text-2xl font-extrabold text-[#8B5CF6]">{value}</div>
    </CardContent>
  </div>
);

export default AssetCard;

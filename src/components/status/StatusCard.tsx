"use client";

interface StatusCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

export const StatusCard = ({ title, value, icon }: StatusCardProps) => (
  <div className="bg-black/20 border border-white/[0.08] rounded-md p-2 flex items-center transition-all duration-200 relative">
    <div className="p-1 rounded-md bg-black/30 border border-white/20 mr-2">
      {icon}
    </div>
    <div>
      <h3 className="text-white/60 text-[10px] leading-none mb-0.5">{title}</h3>
      <p className="text-white text-xs font-medium">{value}</p>
    </div>
  </div>
);

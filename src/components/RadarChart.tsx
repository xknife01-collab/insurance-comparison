import React from 'react';
import { motion } from 'motion/react';

interface RadarChartProps {
  data: {
    label: string;
    value: number; // 0-100
    target: number; // 0-100 (평균/권장)
  }[];
  size?: number;
}

const RadarChart: React.FC<RadarChartProps> = ({ data, size = 300 }) => {
  const center = size / 2;
  const radius = (size / 2) * 0.8;
  const angleStep = (Math.PI * 2) / data.length;

  const getPoint = (index: number, value: number) => {
    if (isNaN(value) || value === undefined) return { x: center, y: center };
    const angle = index * angleStep - Math.PI / 2;
    const r = (Math.max(0, value) / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  const [focused, setFocused] = React.useState<'user' | 'target'>('user');

  const targetPoints = data.map((d, i) => getPoint(i, d.target));
  const userPoints = data.map((d, i) => getPoint(i, d.value));

  const targetPath = targetPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
  const userPath = userPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background Grid Circles */}
        {[20, 40, 60, 80, 100].map((tick) => (
          <circle
            key={tick}
            cx={center}
            cy={center}
            r={(tick / 100) * radius}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="1"
          />
        ))}

        {/* Axis Lines */}
        {data.map((d, i) => {
          const pt = getPoint(i, 100);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={pt.x}
              y2={pt.y}
              stroke="#f3f4f6"
              strokeWidth="1"
            />
          );
        })}

        {/* Labels */}
        {data.map((d, i) => {
          const pt = getPoint(i, 115);
          return (
            <text
              key={i}
              x={pt.x}
              y={pt.y}
              textAnchor="middle"
              className={`text-[10px] font-black uppercase tracking-tighter transition-all duration-300 ${focused === 'user' ? 'fill-gray-400' : 'fill-gray-600 font-bold'}`}
            >
              {d.label}
            </text>
          );
        })}

        {/* Target Area (Average) */}
        <motion.path
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: focused === 'target' ? 0.6 : 0.1,
            strokeWidth: focused === 'target' ? 3 : 1
          }}
          d={targetPath}
          fill="rgba(107, 114, 128, 0.4)"
          stroke="rgba(107, 114, 128, 0.8)"
          strokeDasharray={focused === 'target' ? "0" : "4 2"}
          className="transition-all duration-500 cursor-pointer"
          onClick={() => setFocused('target')}
        />

        {/* User Area (Current) */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: 1, 
            opacity: focused === 'user' ? 1 : 0.2,
            strokeWidth: focused === 'user' ? 4 : 1 
          }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          d={userPath}
          fill={focused === 'user' ? "rgba(249, 115, 22, 0.3)" : "rgba(249, 115, 22, 0.05)"}
          stroke="#f97316"
          className="cursor-pointer"
          onClick={() => setFocused('user')}
        />

        {/* Dots */}
        {focused === 'user' && userPoints.map((p, i) => (
          <motion.circle
            key={i}
            initial={{ r: 0 }}
            animate={{ r: 5 }}
            transition={{ delay: i * 0.05 }}
            cx={p.x}
            cy={p.y}
            fill="#f97316"
            stroke="white"
            strokeWidth="2"
          />
        ))}
      </svg>
      
      <div className="flex gap-6 mt-12 px-6 py-3 bg-gray-50/50 rounded-full border border-gray-100 shadow-sm">
        <button 
          onClick={() => setFocused('user')}
          className={`flex items-center gap-2 text-[10px] font-black transition-all ${focused === 'user' ? 'opacity-100 scale-110 text-orange-600' : 'opacity-30 hover:opacity-100'}`}
        >
          <div className="w-3 h-3 bg-orange-500 rounded-full shadow-lg"></div>
          내 현재 보장
        </button>
        <div className="w-[1px] h-3 bg-gray-200"></div>
        <button 
          onClick={() => setFocused('target')}
          className={`flex items-center gap-2 text-[10px] font-black transition-all ${focused === 'target' ? 'opacity-100 scale-110 text-gray-900' : 'opacity-30 hover:opacity-100'}`}
        >
          <div className="w-3 h-3 bg-gray-400 rounded-full border-2 border-dashed border-gray-200"></div>
          동일 연령대 평균
        </button>
      </div>
    </div>
  );
};

export default RadarChart;

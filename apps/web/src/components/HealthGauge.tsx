interface GaugeProps {
  value: number; // 0-100
  label: string;
  status: string;
  color: string;
}

export default function HealthGauge({ value, label, status, color }: GaugeProps) {
  const r = 40;
  const circumference = Math.PI * r;
  const offset = circumference - (value / 100) * circumference;
  const dashArray = `${offset} ${circumference}`;

  return (
    <div className="text-center">
      <svg width="100" height="58" viewBox="0 0 100 58">
        <path
          d="M10,50 A40,40 0 0,1 90,50"
          fill="none"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M10,50 A40,40 0 0,1 90,50"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={dashArray}
        />
        <text
          x="50" y="52"
          textAnchor="middle"
          fontSize="12"
          fontWeight="700"
          fill={color}
          fontFamily="Vazirmatn"
        >
          {Math.round(value)}%
        </text>
      </svg>
      <div className="text-[11px] text-gray-500 mt-0.5">{label}</div>
      <div className="text-xs font-bold" style={{ color }}>{status}</div>
    </div>
  );
}

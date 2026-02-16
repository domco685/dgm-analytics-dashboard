interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: string;
}

export default function MetricCard({ title, value, change, trend, icon }: MetricCardProps) {
  const trendColor = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-gray-500',
  };

  const trendIcon = {
    up: '↑',
    down: '↓',
    neutral: '→',
  };

  return (
    <div className="bg-dgm-gray-dark border border-dgm-gray rounded-lg p-6 hover:border-dgm-gold transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-white mb-2">{value}</p>
          {change && trend && (
            <p className={`text-sm flex items-center gap-1 ${trendColor[trend]}`}>
              <span>{trendIcon[trend]}</span>
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="text-3xl opacity-50">{icon}</div>
        )}
      </div>
    </div>
  );
}

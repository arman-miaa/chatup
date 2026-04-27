type Metric = {
  title: string;
  value: string | number;
  description?: string;
};

interface MetricCardProps {
  metrics: Metric[];
}

const MetricCard = ({ metrics }: MetricCardProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center rounded-xl bg-primary p-10 text-center shadow-md transition-transform duration-200 hover:scale-105"
        >
          <h1 className="text-3xl font-bold text-primary-foreground">
            {metric.value}
          </h1>
          <p className="mt-2 text-sm font-medium text-primary-foreground/80">
            {metric.title}
          </p>
          {metric.description && (
            <span className="mt-1 text-xs text-primary-foreground/60">
              {metric.description}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default MetricCard;

import { DollarSign, TrendingUp, RefreshCw, Layers } from "lucide-react";

function StatsCard({ title, value, subtitle, icon: Icon, gradient }) {
  return (
    <div className="bg-card border rounded-lg p-4 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          <p className="text-[10px] text-muted-foreground">{subtitle}</p>
        </div>
        <div className={`h-10 w-10 rounded-md ${gradient} flex items-center justify-center shadow-md`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );
}

export default function StatsCards({ currencies, totalFilteredItems }) {

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

      <StatsCard
        title="TOTAL CURRENCIES"
        value={currencies.length}
        subtitle="Codes available"
        icon={DollarSign}
        gradient="bg-gradient-to-br from-blue-500 to-blue-600"
      />

      <StatsCard
        title="VISIBLE ITEMS"
        value={totalFilteredItems}
        subtitle="Matching current search"
        icon={Layers}
        gradient="bg-gradient-to-br from-green-500 to-green-600"
      />

      <StatsCard
        title="SYSTEM STATUS"
        value="Operational"
        subtitle="Last API call successful"
        icon={RefreshCw}
        gradient="bg-gradient-to-br from-purple-500 to-purple-600"
      />
    </div>
  );
}
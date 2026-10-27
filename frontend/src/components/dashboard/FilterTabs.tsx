import { Badge } from "../ui/Badge";

type FilterTab = {
  key: string;
  label: string;
  count?: number;
};

type FilterTabsProps = {
  tabs: FilterTab[];
  activeKey: string;
  onChange: (key: string) => void;
};

export function FilterTabs({ tabs, activeKey, onChange }: FilterTabsProps) {
  return (
    <div className="inline-flex gap-2 rounded-xl border border-gray-200 bg-white p-1.5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <Badge active={isActive}>{tab.count}</Badge>
            )}
          </button>
        );
      })}
    </div>
  );
}

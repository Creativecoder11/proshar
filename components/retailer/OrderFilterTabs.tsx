'use client';

interface FilterTab {
    id: string;
    label: string;
}

interface OrderFilterTabsProps {
    tabs: FilterTab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

export default function OrderFilterTabs({
    tabs,
    activeTab,
    onTabChange,
}: OrderFilterTabsProps) {
    return (
        <div className="flex items-center gap-2">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`
            px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
            ${activeTab === tab.id
                            ? 'bg-[#3A21C0] text-white'
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                        }
          `}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

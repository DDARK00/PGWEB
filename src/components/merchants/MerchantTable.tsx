import React from "react";
import type { Merchant } from "../../types/types";
import type {
  SortKey,
  SortDirection,
} from "../../hooks/useFilterSortMerchants";
import MerchantRow from "./MerchantRow";

type Props = {
  items: Merchant[];
  sortKey?: SortKey | null;
  sortDirection?: SortDirection;
  onToggleSort: (k: SortKey) => void;
  onRowClick?: (m: Merchant) => void;
};

const HeaderCell: React.FC<{
  label: string;
  sortKey: SortKey;
  activeKey?: SortKey | null;
  direction?: SortDirection;
  onToggle: (k: SortKey) => void;
}> = ({ label, sortKey, activeKey, direction, onToggle }) => {
  const isActive = activeKey === sortKey && direction !== "default";
  return (
    <div
      className="cursor-pointer select-none flex items-center gap-2"
      onClick={() => onToggle(sortKey)}
    >
      <span
        className={`text-sm font-medium ${
          isActive ? "text-slate-900" : "text-slate-600"
        }`}
      >
        {label}
      </span>
      <span className="text-xs text-slate-400">
        {isActive ? (direction === "asc" ? "▲" : "▼") : "↕"}
      </span>
    </div>
  );
};

export default function MerchantTable({
  items,
  sortKey,
  sortDirection,
  onToggleSort,
  onRowClick,
}: Props) {
  return (
    <div className="bg-white max-h-[520px] border rounded shadow overflow-hidden flex flex-col">
      <div className="hidden md:flex items-center gap-3 px-3 py-2 border-b bg-slate-50 sticky top-0 z-10">
        <div className="w-1/6">
          <HeaderCell
            label="가맹점 코드"
            sortKey="mchtCode"
            activeKey={sortKey}
            direction={sortDirection}
            onToggle={onToggleSort}
          />
        </div>
        <div className="w-1/6">
          <HeaderCell
            label="사업유형"
            sortKey="bizType"
            activeKey={sortKey}
            direction={sortDirection}
            onToggle={onToggleSort}
          />
        </div>
        <div className="flex-1">
          <HeaderCell
            label="가맹점명"
            sortKey="mchtName"
            activeKey={sortKey}
            direction={sortDirection}
            onToggle={onToggleSort}
          />
        </div>
        <div className="w-28 text-right text-sm text-slate-600">상태</div>
      </div>

      {/* list */}

      <div className="min-h-56 md:min-h-80 overflow-y-auto flex-1">
        <div className="flex flex-col min-h-full">
          {items.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-500">
              조회된 가맹점이 없습니다.
            </div>
          ) : (
            items.map((m) => (
              <MerchantRow key={m.mchtCode} m={m} onClick={onRowClick} />
            ))
          )}
        </div>
      </div>

      {/* Footer: show total matched items */}
      <div className="px-3 py-2 border-t text-sm text-slate-600 text-right bg-white">
        총 {items.length}건
      </div>
    </div>
  );
}

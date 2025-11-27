import type { MerchantDetail } from "../../types/types";

type Props = {
  detail: MerchantDetail | null;
  loading: boolean;
  error?: string | null;
  onClose?: () => void;
};

function renderStatusBadge(status?: string | null) {
  const s = (status ?? "").toString().toUpperCase();
  const base = "px-2 py-1 rounded text-xs font-semibold";
  if (s === "ACTIVE")
    return (
      <span className={`${base} bg-emerald-100 text-emerald-800`}>{s}</span>
    );
  if (s === "READY")
    return <span className={`${base} bg-yellow-100 text-yellow-800`}>{s}</span>;
  if (s === "CLOSED")
    return <span className={`${base} bg-red-100 text-red-800`}>{s}</span>;
  return (
    <span className={`${base} bg-gray-100 text-gray-700`}>
      {s || "UNKNOWN"}
    </span>
  );
}

function formatKST(dateStr?: string | null) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  const opts: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Seoul",
  };
  return d.toLocaleString("ko-KR", opts) + " KST";
}

export default function MerchantDetailPanel({
  detail,
  loading,
  error,
  onClose,
}: Props) {
  return (
    <div className="w-80 min-w-[320px] bg-white border rounded shadow p-4 sticky top-6 h-[520px] overflow-auto">
      <div className="flex items-start justify-between gap-2 mb-3">
        <h2 className="text-lg font-semibold">가맹점 상세</h2>
        <button
          className="text-sm text-slate-500 hover:text-slate-700"
          onClick={onClose}
        >
          닫기
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <svg
            className="w-4 h-4 animate-spin text-slate-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <div>로딩 중...</div>
        </div>
      ) : error ? (
        <div className="text-sm text-red-600">{error}</div>
      ) : detail ? (
        <div className="space-y-3 text-sm text-slate-700">
          <div>
            <div className="text-xs text-slate-500">가맹점 코드</div>
            <div className="font-medium">{detail.mchtCode}</div>
          </div>

          <div>
            <div className="text-xs text-slate-500">가맹점명</div>
            <div className="font-medium">{detail.mchtName}</div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-xs text-slate-500">상태</div>
              <div className="mt-1">{renderStatusBadge(detail.status)}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">사업유형</div>
              <div className="font-medium">{detail.bizType}</div>
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500">사업자번호</div>
            <div className="font-medium">{detail.bizNo}</div>
          </div>

          <div>
            <div className="text-xs text-slate-500">주소</div>
            <div className="font-medium">{detail.address}</div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-xs text-slate-500">전화번호</div>
              <div className="font-medium">{detail.phone}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">이메일</div>
              <div className="font-medium">{detail.email}</div>
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500">등록일</div>
            <div className="font-medium">{formatKST(detail.registeredAt)}</div>
          </div>

          <div>
            <div className="text-xs text-slate-500">수정일</div>
            <div className="font-medium">{formatKST(detail.updatedAt)}</div>
          </div>
        </div>
      ) : (
        <div className="text-sm text-slate-500">가맹점을 선택해주세요.</div>
      )}
    </div>
  );
}

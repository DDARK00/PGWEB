import { useMemo } from "react";
import { useMerchantsQuery } from "../hooks/useMerchants";
import useStore from "../store/useStore";

function MerchantListPage() {
  const query = useMerchantsQuery();
  const merchants = useStore((s) => s.merchants);

  const list = useMemo(
    () => merchants ?? query.data ?? [],
    [merchants, query.data]
  );

  if (query.isLoading) return <div>Loading merchants...</div>;
  if (query.isError) return <div>Error loading merchants</div>;

  return (
    <div>
      <h1>가맹점 조회 페이지</h1>
      <ul>
        {list?.map((m) => (
          <li key={m.mchtCode}>{m.mchtName}</li>
        ))}
      </ul>
    </div>
  );
}

export default MerchantListPage;

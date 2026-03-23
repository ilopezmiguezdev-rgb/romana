import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { SimplifiedDebt } from "../types/database";

export function useBalances(groupId: string) {
  const [debts, setDebts] = useState<SimplifiedDebt[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchBalances() {
    setLoading(true);
    const { data, error } = await supabase.rpc("simplify_debts", {
      p_group_id: groupId,
    });

    if (!error && data) {
      setDebts(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchBalances();
  }, [groupId]);

  return { debts, loading, refetch: fetchBalances };
}

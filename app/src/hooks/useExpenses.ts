import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Expense } from "../types/database";

export function useExpenses(groupId: string) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchExpenses() {
    setLoading(true);
    const { data, error } = await supabase
      .from("expenses")
      .select("*, profiles!paid_by(display_name)")
      .eq("group_id", groupId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      const mapped = data.map((row: any) => ({
        ...row,
        paid_by_name: row.profiles?.display_name ?? "Unknown",
      }));
      setExpenses(mapped);
    } else if (error) {
      console.error("useExpenses: failed to fetch expenses", error);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchExpenses();
  }, [groupId]);

  return { expenses, loading, refetch: fetchExpenses };
}

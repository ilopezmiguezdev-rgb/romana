import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Member = {
  user_id: string;
  role: string;
  display_name: string;
};

export function useGroupDetail(groupId: string) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchMembers() {
    setLoading(true);
    const { data, error } = await supabase
      .from("group_members")
      .select("user_id, role, profiles(display_name)")
      .eq("group_id", groupId);

    if (!error && data) {
      const mapped = data.map((row: any) => ({
        user_id: row.user_id,
        role: row.role,
        display_name: row.profiles?.display_name ?? "Unknown",
      }));
      setMembers(mapped);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchMembers();
  }, [groupId]);

  return { members, loading, refetch: fetchMembers };
}

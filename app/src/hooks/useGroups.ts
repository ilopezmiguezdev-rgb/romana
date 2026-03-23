import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Group = {
  id: string;
  name: string;
  invite_code: string;
  created_at: string;
};

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchGroups() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("group_members")
      .select("group:groups(id, name, invite_code, created_at)")
      .eq("user_id", user.id);

    if (!error && data) {
      const mapped = data
        .map((row: any) => row.group)
        .filter(Boolean)
        .sort((a: Group, b: Group) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      setGroups(mapped);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchGroups();
  }, []);

  return { groups, loading, refetch: fetchGroups };
}

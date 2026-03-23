import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Share,
} from "react-native";
import { supabase } from "../../lib/supabase";
import { useGroupDetail } from "../../hooks/useGroupDetail";
import { useEffect, useState } from "react";

type Props = {
  route: any;
  navigation: any;
};

export function GroupSettingsScreen({ route, navigation }: Props) {
  const { groupId } = route.params;
  const { members } = useGroupDetail(groupId);
  const [inviteCode, setInviteCode] = useState("");

  useEffect(() => {
    async function fetchCode() {
      const { data, error } = await supabase
        .from("groups")
        .select("invite_code")
        .eq("id", groupId)
        .single();
      if (error) console.error("GroupSettings: failed to fetch invite code", error);
      if (data) setInviteCode(data.invite_code);
    }
    fetchCode();
  }, [groupId]);

  async function shareInviteCode() {
    await Share.share({
      message: `Join my group on Romana! Use code: ${inviteCode}`,
    });
  }

  async function leaveGroup() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    Alert.alert("Leave group?", "You must settle all balances first.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Leave",
        style: "destructive",
        onPress: async () => {
          const { error } = await supabase
            .from("group_members")
            .delete()
            .eq("group_id", groupId)
            .eq("user_id", user.id);

          if (error) {
            Alert.alert("Error", error.message);
          } else {
            navigation.popToTop();
          }
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Invite Code</Text>
        <View style={styles.codeRow}>
          <Text style={styles.code}>{inviteCode}</Text>
          <TouchableOpacity onPress={shareInviteCode}>
            <Text style={styles.shareLink}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Members ({members.length})</Text>
        <FlatList
          data={members}
          keyExtractor={(item) => item.user_id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.memberRow}>
              <Text style={styles.memberName}>{item.display_name}</Text>
              {item.role === "admin" && (
                <Text style={styles.adminBadge}>Admin</Text>
              )}
            </View>
          )}
        />
      </View>

      <TouchableOpacity style={styles.leaveButton} onPress={leaveGroup}>
        <Text style={styles.leaveText}>Leave Group</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#fff" },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 12 },
  codeRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  code: { fontSize: 24, fontWeight: "bold", letterSpacing: 4 },
  shareLink: { color: "#007AFF", fontSize: 16 },
  memberRow: {
    flexDirection: "row", justifyContent: "space-between",
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#eee",
  },
  memberName: { fontSize: 14 },
  adminBadge: { fontSize: 12, color: "#007AFF", fontWeight: "600" },
  leaveButton: {
    marginTop: 24, padding: 14, borderRadius: 8,
    borderWidth: 1, borderColor: "#dc3545", alignItems: "center",
  },
  leaveText: { color: "#dc3545", fontSize: 16, fontWeight: "600" },
});

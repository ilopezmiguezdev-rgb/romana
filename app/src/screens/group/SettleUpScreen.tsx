import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { supabase } from "../../lib/supabase";
import { useBalances } from "../../hooks/useBalances";
import { useGroupDetail } from "../../hooks/useGroupDetail";

type Props = {
  route: any;
  navigation: any;
};

export function SettleUpScreen({ route, navigation }: Props) {
  const { groupId } = route.params;
  const { debts, refetch } = useBalances(groupId);
  const { members } = useGroupDetail(groupId);
  const [recording, setRecording] = useState<string | null>(null);

  function getMemberName(userId: string): string {
    return members.find((m) => m.user_id === userId)?.display_name ?? "Unknown";
  }

  async function recordSettlement(fromUser: string, toUser: string, amount: number) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.id !== fromUser) {
      Alert.alert("Error", "Only the person who owes can record this payment.");
      return;
    }

    Alert.alert(
      "Record payment?",
      `Record $${amount.toFixed(2)} payment to ${getMemberName(toUser)}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Record",
          onPress: async () => {
            setRecording(`${fromUser}-${toUser}`);
            const { error } = await supabase.from("settlements").insert({
              group_id: groupId,
              from_user: fromUser,
              to_user: toUser,
              amount,
            });

            if (error) {
              Alert.alert("Error", error.message);
              setRecording(null);
            } else {
              await refetch();
              setRecording(null);
            }
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settle Up</Text>
      <Text style={styles.subtitle}>Tap a debt to record payment</Text>

      {debts.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.settled}>All settled up!</Text>
        </View>
      ) : (
        <FlatList
          data={debts}
          keyExtractor={(item) => `${item.from_user}-${item.to_user}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.debtCard}
              onPress={() => recordSettlement(item.from_user, item.to_user, item.amount)}
              disabled={recording !== null}
            >
              <View>
                <Text style={styles.debtText}>
                  <Text style={styles.name}>{getMemberName(item.from_user)}</Text>
                  {" pays "}
                  <Text style={styles.name}>{getMemberName(item.to_user)}</Text>
                </Text>
              </View>
              <Text style={styles.debtAmount}>${item.amount.toFixed(2)}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 24 },
  settled: { fontSize: 18, color: "#28a745", fontWeight: "600" },
  debtCard: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    padding: 16, backgroundColor: "#f8f9fa", borderRadius: 8, marginBottom: 8,
  },
  debtText: { fontSize: 14 },
  name: { fontWeight: "600" },
  debtAmount: { fontSize: 18, fontWeight: "bold", color: "#dc3545" },
});

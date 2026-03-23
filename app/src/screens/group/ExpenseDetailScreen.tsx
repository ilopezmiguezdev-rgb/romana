import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../../lib/supabase";

type Share = {
  user_id: string;
  display_name: string;
  amount: number;
};

type Props = {
  route: any;
  navigation: any;
};

export function ExpenseDetailScreen({ route, navigation }: Props) {
  const { expenseId } = route.params;
  const [expense, setExpense] = useState<any>(null);
  const [shares, setShares] = useState<Share[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);

      const { data: expData, error: expError } = await supabase
        .from("expenses")
        .select("*, payer:profiles!paid_by(display_name)")
        .eq("id", expenseId)
        .single();

      const { data: shareData, error: shareError } = await supabase
        .from("expense_shares")
        .select("user_id, amount, profile:profiles(display_name)")
        .eq("expense_id", expenseId);

      if (expError) console.error("ExpenseDetail: failed to load expense", expError);
      if (shareError) console.error("ExpenseDetail: failed to load shares", shareError);

      if (expData) setExpense(expData);
      if (shareData) {
        setShares(
          shareData.map((s: any) => ({
            user_id: s.user_id,
            display_name: s.profile?.display_name ?? "Unknown",
            amount: s.amount,
          }))
        );
      }
      setLoading(false);
    }
    loadData();
  }, [expenseId]);

  async function deleteExpense() {
    Alert.alert("Delete expense?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const { error } = await supabase.from("expenses").delete().eq("id", expenseId);
          if (error) {
            Alert.alert("Error", error.message);
          } else {
            navigation.goBack();
          }
        },
      },
    ]);
  }

  if (loading || !expense) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const canDelete = expense.paid_by === currentUserId;

  return (
    <View style={styles.container}>
      <Text style={styles.description}>{expense.description}</Text>
      <Text style={styles.amount}>${Number(expense.amount).toFixed(2)}</Text>
      <Text style={styles.meta}>
        Paid by {expense.payer?.display_name} · {expense.split_type} split
      </Text>

      <Text style={styles.sectionTitle}>Breakdown</Text>
      <FlatList
        data={shares}
        keyExtractor={(item) => item.user_id}
        renderItem={({ item }) => (
          <View style={styles.shareRow}>
            <Text style={styles.shareName}>{item.display_name}</Text>
            <Text style={styles.shareAmount}>${Number(item.amount).toFixed(2)}</Text>
          </View>
        )}
      />

      {canDelete && (
        <TouchableOpacity style={styles.deleteButton} onPress={deleteExpense}>
          <Text style={styles.deleteText}>Delete Expense</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  description: { fontSize: 24, fontWeight: "bold", marginBottom: 4 },
  amount: { fontSize: 32, fontWeight: "bold", color: "#007AFF", marginBottom: 8 },
  meta: { fontSize: 14, color: "#666", marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 12 },
  shareRow: {
    flexDirection: "row", justifyContent: "space-between",
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#eee",
  },
  shareName: { fontSize: 14 },
  shareAmount: { fontSize: 14, fontWeight: "600" },
  deleteButton: {
    marginTop: 24, padding: 14, borderRadius: 8,
    backgroundColor: "#dc3545", alignItems: "center",
  },
  deleteText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

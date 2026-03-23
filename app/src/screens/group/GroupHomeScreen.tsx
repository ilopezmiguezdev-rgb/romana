import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useBalances } from "../../hooks/useBalances";
import { useExpenses } from "../../hooks/useExpenses";
import { useGroupDetail } from "../../hooks/useGroupDetail";
import { BalanceCard } from "../../components/BalanceCard";
import { ExpenseListItem } from "../../components/ExpenseListItem";
import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";

type Props = {
  route: any;
  navigation: any;
};

export function GroupHomeScreen({ route, navigation }: Props) {
  const { groupId } = route.params;
  const { debts, loading: balancesLoading, refetch: refetchBalances } = useBalances(groupId);
  const { expenses, loading: expensesLoading, refetch: refetchExpenses } = useExpenses(groupId);
  const { members } = useGroupDetail(groupId);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setCurrentUserId(user.id);
    });
  }, []);

  function refetch() {
    refetchBalances();
    refetchExpenses();
  }

  const memberNameMap = Object.fromEntries(
    members.map((m) => [m.user_id, m.display_name])
  );

  const myDebts = debts.filter(
    (d) => d.from_user === currentUserId || d.to_user === currentUserId
  );

  return (
    <ScrollView style={styles.container}>
      {/* Balances section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Balances</Text>
        {balancesLoading ? (
          <ActivityIndicator />
        ) : myDebts.length === 0 ? (
          <Text style={styles.settled}>All settled up!</Text>
        ) : (
          myDebts.map((debt, i) => (
            <BalanceCard
              key={i}
              fromName={memberNameMap[debt.from_user] ?? debt.from_user}
              toName={memberNameMap[debt.to_user] ?? debt.to_user}
              amount={debt.amount}
            />
          ))
        )}
      </View>

      {/* Recent expenses */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Expenses</Text>
        {expensesLoading ? (
          <ActivityIndicator />
        ) : expenses.length === 0 ? (
          <Text style={styles.emptyText}>No expenses yet</Text>
        ) : (
          expenses.slice(0, 10).map((expense) => (
            <TouchableOpacity
              key={expense.id}
              onPress={() => navigation.navigate("ExpenseDetail", { expenseId: expense.id })}
            >
              <ExpenseListItem
                description={expense.description}
                amount={expense.amount}
                paidByName={expense.paid_by_name ?? expense.paid_by}
                createdAt={expense.created_at}
              />
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.fabButton}
          onPress={() => navigation.navigate("AddExpense", { groupId, members })}
        >
          <Text style={styles.fabText}>+ Add Expense</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.fabButton, styles.settleButton]}
          onPress={() => navigation.navigate("SettleUp", { groupId })}
        >
          <Text style={styles.fabText}>Settle Up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  section: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#eee" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  settled: { color: "#28a745", fontSize: 14 },
  emptyText: { color: "#888", fontSize: 14 },
  actions: { padding: 16, gap: 8 },
  fabButton: {
    backgroundColor: "#007AFF", borderRadius: 8, padding: 14, alignItems: "center",
  },
  settleButton: { backgroundColor: "#28a745" },
  fabText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

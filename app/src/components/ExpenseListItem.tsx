import { View, Text, StyleSheet } from "react-native";

type Props = {
  description: string;
  amount: number;
  paidByName: string;
  createdAt: string;
};

export function ExpenseListItem({ description, amount, paidByName, createdAt }: Props) {
  const date = new Date(createdAt).toLocaleDateString();
  return (
    <View style={styles.row}>
      <View style={styles.info}>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.meta}>Paid by {paidByName} · {date}</Text>
      </View>
      <Text style={styles.amount}>${amount.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    padding: 12, borderBottomWidth: 1, borderBottomColor: "#eee",
  },
  info: { flex: 1 },
  description: { fontSize: 15, fontWeight: "500" },
  meta: { fontSize: 12, color: "#888", marginTop: 2 },
  amount: { fontSize: 16, fontWeight: "bold" },
});

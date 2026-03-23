import { View, Text, StyleSheet } from "react-native";

type Props = {
  fromName: string;
  toName: string;
  amount: number;
};

export function BalanceCard({ fromName, toName, amount }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.text}>
        <Text style={styles.name}>{fromName}</Text>
        {" owes "}
        <Text style={styles.name}>{toName}</Text>
      </Text>
      <Text style={styles.amount}>${amount.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    padding: 12, backgroundColor: "#f8f8f8", borderRadius: 8, marginBottom: 8,
  },
  text: { fontSize: 14, flex: 1 },
  name: { fontWeight: "600" },
  amount: { fontSize: 16, fontWeight: "bold", color: "#dc3545" },
});

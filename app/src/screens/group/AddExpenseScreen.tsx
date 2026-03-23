import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { supabase } from "../../lib/supabase";
import { useGroupDetail } from "../../hooks/useGroupDetail";
import { SplitTypeSelector } from "../../components/SplitTypeSelector";
import { ParticipantSelector } from "../../components/ParticipantSelector";

type SplitType = "even" | "percent" | "item";

type Props = {
  route: any;
  navigation: any;
};

export function AddExpenseScreen({ route, navigation }: Props) {
  const { groupId } = route.params;
  const { members } = useGroupDetail(groupId);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [splitType, setSplitType] = useState<SplitType>("even");
  const [participants, setParticipants] = useState<string[]>([]);
  const [percentages, setPercentages] = useState<Record<string, string>>({});
  const [itemAmounts, setItemAmounts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Pre-select all members once loaded
  if (participants.length === 0 && members.length > 0) {
    setParticipants(members.map((m) => m.user_id));
  }

  function toggleParticipant(userId: string) {
    setParticipants((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  }

  async function submit() {
    const amountNum = parseFloat(amount);
    if (!description.trim() || isNaN(amountNum) || amountNum <= 0) {
      Alert.alert("Error", "Please enter a description and valid amount.");
      return;
    }
    if (participants.length === 0) {
      Alert.alert("Error", "Select at least one participant.");
      return;
    }

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    let pctArray: number[] | null = null;
    let itemArray: number[] | null = null;

    if (splitType === "percent") {
      pctArray = participants.map((uid) => parseFloat(percentages[uid] || "0"));
    } else if (splitType === "item") {
      itemArray = participants.map((uid) => parseFloat(itemAmounts[uid] || "0"));
    }

    const { error } = await supabase.rpc("create_expense", {
      p_group_id: groupId,
      p_paid_by: user.id,
      p_description: description.trim(),
      p_amount: amountNum,
      p_split_type: splitType,
      p_participant_ids: participants,
      p_percentages: pctArray,
      p_item_amounts: itemArray,
    });

    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      navigation.goBack();
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        placeholder="Dinner, groceries..."
        value={description}
        onChangeText={setDescription}
        autoFocus
      />

      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        placeholder="0.00"
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
      />

      <Text style={styles.label}>Split type</Text>
      <SplitTypeSelector selected={splitType} onSelect={setSplitType} />

      <Text style={styles.label}>Split with</Text>
      <ParticipantSelector
        members={members}
        selected={participants}
        onToggle={toggleParticipant}
      />

      {splitType === "percent" && participants.map((uid) => (
        <View key={uid} style={styles.splitRow}>
          <Text style={styles.splitName}>
            {members.find((m) => m.user_id === uid)?.display_name}
          </Text>
          <TextInput
            style={styles.splitInput}
            placeholder="%"
            value={percentages[uid] || ""}
            onChangeText={(val) => setPercentages((prev) => ({ ...prev, [uid]: val }))}
            keyboardType="decimal-pad"
          />
        </View>
      ))}

      {splitType === "item" && participants.map((uid) => (
        <View key={uid} style={styles.splitRow}>
          <Text style={styles.splitName}>
            {members.find((m) => m.user_id === uid)?.display_name}
          </Text>
          <TextInput
            style={styles.splitInput}
            placeholder="$0.00"
            value={itemAmounts[uid] || ""}
            onChangeText={(val) => setItemAmounts((prev) => ({ ...prev, [uid]: val }))}
            keyboardType="decimal-pad"
          />
        </View>
      ))}

      <TouchableOpacity
        style={styles.button}
        onPress={submit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "Saving..." : "Save Expense"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 24 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 8, color: "#333" },
  input: {
    borderWidth: 1, borderColor: "#ccc", borderRadius: 8,
    padding: 12, fontSize: 16, marginBottom: 16,
  },
  splitRow: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginBottom: 8,
  },
  splitName: { flex: 1, fontSize: 14 },
  splitInput: {
    width: 80, borderWidth: 1, borderColor: "#ccc",
    borderRadius: 8, padding: 8, textAlign: "center",
  },
  button: {
    backgroundColor: "#007AFF", borderRadius: 8, padding: 14,
    alignItems: "center", marginTop: 16,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

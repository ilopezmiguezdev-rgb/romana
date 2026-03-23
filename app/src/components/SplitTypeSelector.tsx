import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type SplitType = "even" | "percent" | "item";

type Props = {
  selected: SplitType;
  onSelect: (type: SplitType) => void;
};

const options: { value: SplitType; label: string }[] = [
  { value: "even", label: "Even" },
  { value: "percent", label: "%" },
  { value: "item", label: "By Item" },
];

export function SplitTypeSelector({ selected, onSelect }: Props) {
  return (
    <View style={styles.container}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={[styles.option, selected === opt.value && styles.selected]}
          onPress={() => onSelect(opt.value)}
        >
          <Text style={[styles.label, selected === opt.value && styles.selectedLabel]}>
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", gap: 8, marginBottom: 16 },
  option: {
    flex: 1, padding: 10, borderRadius: 8, borderWidth: 1,
    borderColor: "#ccc", alignItems: "center",
  },
  selected: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
  label: { fontSize: 14, color: "#333" },
  selectedLabel: { color: "#fff", fontWeight: "600" },
});

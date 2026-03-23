import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type Member = {
  user_id: string;
  display_name: string;
};

type Props = {
  members: Member[];
  selected: string[];
  onToggle: (userId: string) => void;
};

export function ParticipantSelector({ members, selected, onToggle }: Props) {
  return (
    <View style={styles.container}>
      {members.map((member) => {
        const isSelected = selected.includes(member.user_id);
        return (
          <TouchableOpacity
            key={member.user_id}
            style={[styles.chip, isSelected && styles.chipSelected]}
            onPress={() => onToggle(member.user_id)}
          >
            <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
              {member.display_name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  chip: {
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1, borderColor: "#ccc",
  },
  chipSelected: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
  chipText: { fontSize: 14, color: "#333" },
  chipTextSelected: { color: "#fff" },
});

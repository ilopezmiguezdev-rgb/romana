import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { supabase } from "../../lib/supabase";

type Props = {
  userId: string;
  onComplete: () => void;
};

export function SetDisplayNameScreen({ userId, onComplete }: Props) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function saveName() {
    if (!name.trim()) return;
    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({ display_name: name.trim() })
      .eq("id", userId);

    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      onComplete();
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What should we call you?</Text>
      <TextInput
        style={styles.input}
        placeholder="Your name"
        value={name}
        onChangeText={setName}
        autoFocus
      />
      <TouchableOpacity
        style={styles.button}
        onPress={saveName}
        disabled={loading || !name.trim()}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 24 },
  input: {
    borderWidth: 1, borderColor: "#ccc", borderRadius: 8,
    padding: 12, fontSize: 16, marginBottom: 16,
  },
  button: {
    backgroundColor: "#007AFF", borderRadius: 8, padding: 14, alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

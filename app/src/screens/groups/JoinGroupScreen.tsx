import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../../lib/supabase";

type Props = {
  navigation: any;
};

export function JoinGroupScreen({ navigation }: Props) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function joinGroup() {
    if (!code.trim()) return;
    setLoading(true);

    const { data, error } = await supabase.rpc("join_group", {
      p_invite_code: code.trim().toUpperCase(),
    });

    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      navigation.replace("GroupHome", {
        groupId: data,
        groupName: "Group",
      });
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter invite code</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. ROME01"
        value={code}
        onChangeText={(t) => setCode(t.toUpperCase())}
        autoCapitalize="characters"
        autoFocus
      />
      <TouchableOpacity
        style={styles.button}
        onPress={joinGroup}
        disabled={loading || !code.trim()}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Join Group</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  label: { fontSize: 14, color: "#666", marginBottom: 8 },
  input: {
    borderWidth: 1, borderColor: "#ccc", borderRadius: 8,
    padding: 12, fontSize: 20, marginBottom: 24, letterSpacing: 4,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007AFF", borderRadius: 8, padding: 14, alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

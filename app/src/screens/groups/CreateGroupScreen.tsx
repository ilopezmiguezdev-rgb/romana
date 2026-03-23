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

export function CreateGroupScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function createGroup() {
    if (!name.trim()) return;
    setLoading(true);

    const { data, error } = await supabase.rpc("create_group", {
      group_name: name.trim(),
    });

    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      navigation.replace("GroupHome", {
        groupId: data,
        groupName: name.trim(),
      });
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Group name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Trip to Rome"
        value={name}
        onChangeText={setName}
        autoFocus
      />
      <TouchableOpacity
        style={styles.button}
        onPress={createGroup}
        disabled={loading || !name.trim()}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Create Group</Text>
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
    padding: 12, fontSize: 16, marginBottom: 24,
  },
  button: {
    backgroundColor: "#007AFF", borderRadius: 8, padding: 14, alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

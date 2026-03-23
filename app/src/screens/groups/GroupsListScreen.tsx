import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useGroups } from "../../hooks/useGroups";

type Props = {
  navigation: any;
};

export function GroupsListScreen({ navigation }: Props) {
  const { groups, loading, refetch } = useGroups();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (groups.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>No groups yet</Text>
        <Text style={styles.emptySubtitle}>Create a group to start splitting expenses</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("CreateGroup")}
        >
          <Text style={styles.buttonText}>Create Group</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate("JoinGroup")}
        >
          <Text style={[styles.buttonText, styles.secondaryText]}>Join Group</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.groupRow}
            onPress={() => navigation.navigate("GroupHome", { groupId: item.id, groupName: item.name })}
          >
            <Text style={styles.groupName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        onRefresh={refetch}
        refreshing={loading}
      />
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("CreateGroup")}
        >
          <Text style={styles.buttonText}>Create Group</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate("JoinGroup")}
        >
          <Text style={[styles.buttonText, styles.secondaryText]}>Join Group</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  emptyTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: "#666", marginBottom: 24, textAlign: "center" },
  groupRow: {
    padding: 16, borderBottomWidth: 1, borderBottomColor: "#eee",
  },
  groupName: { fontSize: 16, fontWeight: "500" },
  bottomActions: { padding: 16, gap: 8 },
  button: {
    backgroundColor: "#007AFF", borderRadius: 8, padding: 14, alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  secondaryButton: { backgroundColor: "#f0f0f0" },
  secondaryText: { color: "#007AFF" },
});

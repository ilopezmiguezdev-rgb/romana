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

export function WelcomeScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithMagicLink() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Check your email", "We sent you a magic link to sign in.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Romana</Text>
      <Text style={styles.subtitle}>Split expenses with friends</Text>

      <TextInput
        style={styles.input}
        placeholder="your@email.com"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={signInWithMagicLink}
        disabled={loading || !email}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign in with email</Text>
        )}
      </TouchableOpacity>

      {/* TODO: OAuth buttons — requires Google/Apple developer account setup
      <TouchableOpacity style={[styles.button, styles.oauthButton]}>
        <Text style={styles.oauthText}>Continue with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.oauthButton]}>
        <Text style={styles.oauthText}>Continue with Apple</Text>
      </TouchableOpacity>
      */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 32, fontWeight: "bold", textAlign: "center", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#666", textAlign: "center", marginBottom: 32 },
  input: {
    borderWidth: 1, borderColor: "#ccc", borderRadius: 8,
    padding: 12, fontSize: 16, marginBottom: 16,
  },
  button: {
    backgroundColor: "#007AFF", borderRadius: 8, padding: 14, alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  oauthButton: { backgroundColor: "#f0f0f0", marginTop: 8 },
  oauthText: { color: "#333", fontSize: 16, fontWeight: "600" },
});

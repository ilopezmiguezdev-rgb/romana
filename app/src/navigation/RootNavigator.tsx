import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useSession } from "../hooks/useSession";
import { supabase } from "../lib/supabase";
import { AuthStack } from "./AuthStack";
import { MainTabs } from "./MainTabs";
import { SetDisplayNameScreen } from "../screens/auth/SetDisplayNameScreen";

export function RootNavigator() {
  const { session, loading } = useSession();
  const [needsName, setNeedsName] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(false);

  useEffect(() => {
    if (!session) return;

    // Check if user has set their display name (not just the auto-generated one from email)
    async function checkProfile() {
      setCheckingProfile(true);
      const { data } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", session!.user.id)
        .single();

      // If display_name matches the email prefix, they haven't set a custom name
      const emailPrefix = session!.user.email?.split("@")[0] ?? "";
      if (data && data.display_name === emailPrefix) {
        setNeedsName(true);
      }
      setCheckingProfile(false);
    }
    checkProfile();
  }, [session]);

  if (loading || checkingProfile) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!session) return <AuthStack />;

  if (needsName) {
    return (
      <SetDisplayNameScreen
        userId={session.user.id}
        onComplete={() => setNeedsName(false)}
      />
    );
  }

  return <MainTabs />;
}

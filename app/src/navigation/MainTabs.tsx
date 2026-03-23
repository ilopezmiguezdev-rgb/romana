import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text } from "react-native";
import { GroupStack } from "./GroupStack";

const Tab = createBottomTabNavigator();

function ProfilePlaceholder() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Profile</Text>
    </View>
  );
}

export function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Groups" component={GroupStack} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfilePlaceholder} />
    </Tab.Navigator>
  );
}

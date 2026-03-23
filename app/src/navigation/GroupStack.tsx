import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text } from "react-native";

const Stack = createNativeStackNavigator();

function GroupsListPlaceholder() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Groups List (coming next)</Text>
    </View>
  );
}

export function GroupStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="GroupsList" component={GroupsListPlaceholder} options={{ title: "Groups" }} />
    </Stack.Navigator>
  );
}

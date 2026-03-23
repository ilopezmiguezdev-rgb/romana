import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GroupsListScreen } from "../screens/groups/GroupsListScreen";
import { CreateGroupScreen } from "../screens/groups/CreateGroupScreen";
import { JoinGroupScreen } from "../screens/groups/JoinGroupScreen";
import { GroupHomeScreen } from "../screens/group/GroupHomeScreen";
import { View, Text } from "react-native";

const Stack = createNativeStackNavigator();

function Placeholder({ route }: any) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>{route.name} (coming soon)</Text>
    </View>
  );
}

export function GroupStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="GroupsList" component={GroupsListScreen} options={{ title: "Groups" }} />
      <Stack.Screen name="CreateGroup" component={CreateGroupScreen} options={{ title: "Create Group" }} />
      <Stack.Screen name="JoinGroup" component={JoinGroupScreen} options={{ title: "Join Group" }} />
      <Stack.Screen name="GroupHome" component={GroupHomeScreen} />
      <Stack.Screen name="AddExpense" component={Placeholder} options={{ title: "Add Expense" }} />
      <Stack.Screen name="ExpenseDetail" component={Placeholder} options={{ title: "Expense" }} />
      <Stack.Screen name="SettleUp" component={Placeholder} options={{ title: "Settle Up" }} />
    </Stack.Navigator>
  );
}

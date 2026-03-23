import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity, Text } from "react-native";
import { GroupsListScreen } from "../screens/groups/GroupsListScreen";
import { CreateGroupScreen } from "../screens/groups/CreateGroupScreen";
import { JoinGroupScreen } from "../screens/groups/JoinGroupScreen";
import { GroupHomeScreen } from "../screens/group/GroupHomeScreen";
import { AddExpenseScreen } from "../screens/group/AddExpenseScreen";
import { ExpenseDetailScreen } from "../screens/group/ExpenseDetailScreen";
import { SettleUpScreen } from "../screens/group/SettleUpScreen";
import { GroupSettingsScreen } from "../screens/group/GroupSettingsScreen";

const Stack = createNativeStackNavigator();

export function GroupStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="GroupsList" component={GroupsListScreen} options={{ title: "Groups" }} />
      <Stack.Screen name="CreateGroup" component={CreateGroupScreen} options={{ title: "Create Group" }} />
      <Stack.Screen name="JoinGroup" component={JoinGroupScreen} options={{ title: "Join Group" }} />
      <Stack.Screen
        name="GroupHome"
        component={GroupHomeScreen}
        options={({ route, navigation }: any) => ({
          title: route.params.groupName,
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate("GroupSettings", { groupId: route.params.groupId })}>
              <Text style={{ color: "#007AFF", fontSize: 16 }}>Settings</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen name="AddExpense" component={AddExpenseScreen} options={{ title: "Add Expense" }} />
      <Stack.Screen name="ExpenseDetail" component={ExpenseDetailScreen} options={{ title: "Expense" }} />
      <Stack.Screen name="SettleUp" component={SettleUpScreen} options={{ title: "Settle Up" }} />
      <Stack.Screen name="GroupSettings" component={GroupSettingsScreen} options={{ title: "Settings" }} />
    </Stack.Navigator>
  );
}

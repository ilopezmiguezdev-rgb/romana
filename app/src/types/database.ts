export type SplitType = "even" | "percent" | "item";
export type MemberRole = "admin" | "member";

export interface Profile {
  id: string;
  display_name: string;
  created_at: string;
}

export interface Group {
  id: string;
  name: string;
  invite_code: string;
  created_by: string;
  created_at: string;
}

export interface GroupMember {
  group_id: string;
  user_id: string;
  role: MemberRole;
  joined_at: string;
  // Joined fields (not in DB, populated via join)
  display_name?: string;
}

export interface Expense {
  id: string;
  group_id: string;
  paid_by: string;
  description: string;
  amount: number;
  split_type: SplitType;
  created_at: string;
  // Joined fields
  paid_by_name?: string;
}

export interface ExpenseShare {
  id: string;
  expense_id: string;
  user_id: string;
  amount: number;
  // Joined fields
  display_name?: string;
}

export interface Settlement {
  id: string;
  group_id: string;
  from_user: string;
  to_user: string;
  amount: number;
  created_at: string;
}

export interface GroupEvent {
  id: string;
  group_id: string;
  actor_id: string | null;
  event_type: string;
  payload: Record<string, unknown> | null;
  created_at: string;
}

// RPC return types
export interface SimplifiedDebt {
  from_user: string;
  to_user: string;
  amount: number;
}

// Convenience types for hooks
export interface GroupWithBalance extends Group {
  net_balance: number; // positive = owed to you, negative = you owe
}

export interface GroupDetailMember extends GroupMember {
  display_name: string;
  net_balance: number;
}

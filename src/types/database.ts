
/**
 * Database types
 */

export interface DatabaseUser {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  status: string;
  plan_id: string;
  created_at: string;
  updated_at: string;
}

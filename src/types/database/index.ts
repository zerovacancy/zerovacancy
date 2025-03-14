
/**
 * Database types
 */

export interface DatabaseRecord {
  id: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserRecord extends DatabaseRecord {
  email: string;
  name?: string;
  avatar_url?: string;
}

export interface WaitlistRecord extends DatabaseRecord {
  email: string;
  source?: string;
  status: 'pending' | 'approved' | 'rejected';
  metadata?: Record<string, any>;
}

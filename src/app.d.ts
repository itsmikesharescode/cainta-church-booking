import type { Database } from '$lib/database.types';
import type streamAccounts from '$lib/db_calls/streamAccounts';
import type streamChurches from '$lib/db_calls/streamChurches';
import type { Session, SupabaseClient, User } from '@supabase/supabase-js';

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      supabase: SupabaseClient<Database>;
      supabaseAdmin: SupabaseClient<Database>;
      safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
      session: Session | null;
      user: User | null;
      transformImage: (
        file: File,
        options?: { maxSizeInMB?: number; maxWidth?: number; maxHeight?: number; quality?: number }
      ) => Promise<File | null>;
    }
    interface PageData {
      session: Session | null;
      user?: User | null;
      supabase?: SupabaseClient<Database>;
      getChurches?: typeof streamChurches;
      getAccounts?: typeof streamAccounts;
    }
    // interface PageState {}
    // interface Platform {}
  }
}

export {};

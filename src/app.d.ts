import type { Session, SupabaseClient, User } from '@supabase/supabase-js';

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      supabase: SupabaseClient;
      supabaseAdmin: SupabaseClient;
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
      supabase?: SupabaseClient;
    }
    // interface PageState {}
    // interface Platform {}
  }
}

export {};

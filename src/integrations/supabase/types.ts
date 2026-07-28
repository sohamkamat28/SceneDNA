type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      analyses: {
        Row: {
          aspect_ratio: string | null;
          change_notes: string | null;
          completed_at: string | null;
          created_at: string;
          duration_ms: number | null;
          error_code: string | null;
          id: string;
          model: string | null;
          orientation: string | null;
          overall_confidence: number | null;
          prompt_depth: string;
          result: Json | null;
          retain_source: boolean;
          source_bytes: number | null;
          source_height: number | null;
          source_mime: string | null;
          source_path: string | null;
          source_width: number | null;
          started_at: string | null;
          status: string;
          target_generator: string;
          title: string | null;
          updated_at: string;
          use_case: string;
          user_id: string;
        };
        Insert: {
          aspect_ratio?: string | null;
          change_notes?: string | null;
          completed_at?: string | null;
          created_at?: string;
          duration_ms?: number | null;
          error_code?: string | null;
          id?: string;
          model?: string | null;
          orientation?: string | null;
          overall_confidence?: number | null;
          prompt_depth?: string;
          result?: Json | null;
          retain_source?: boolean;
          source_bytes?: number | null;
          source_height?: number | null;
          source_mime?: string | null;
          source_path?: string | null;
          source_width?: number | null;
          started_at?: string | null;
          status?: string;
          target_generator?: string;
          title?: string | null;
          updated_at?: string;
          use_case?: string;
          user_id: string;
        };
        Update: {
          aspect_ratio?: string | null;
          change_notes?: string | null;
          completed_at?: string | null;
          created_at?: string;
          duration_ms?: number | null;
          error_code?: string | null;
          id?: string;
          model?: string | null;
          orientation?: string | null;
          overall_confidence?: number | null;
          prompt_depth?: string;
          result?: Json | null;
          retain_source?: boolean;
          source_bytes?: number | null;
          source_height?: number | null;
          source_mime?: string | null;
          source_path?: string | null;
          source_width?: number | null;
          started_at?: string | null;
          status?: string;
          target_generator?: string;
          title?: string | null;
          updated_at?: string;
          use_case?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          default_retain_source: boolean;
          full_name: string | null;
          id: string;
          plan: string;
          preferred_depth: string;
          preferred_generator: string;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          default_retain_source?: boolean;
          full_name?: string | null;
          id: string;
          plan?: string;
          preferred_depth?: string;
          preferred_generator?: string;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          default_retain_source?: boolean;
          full_name?: string | null;
          id?: string;
          plan?: string;
          preferred_depth?: string;
          preferred_generator?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

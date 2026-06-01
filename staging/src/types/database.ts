export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type JobStatus = "pending" | "processing" | "completed" | "failed";
export type ManualPostingStatus = "waiting" | "ready" | "posted" | "skipped" | "needs_fix";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          slug: string;
          description: string | null;
          avatar_url: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          slug: string;
          description?: string | null;
          avatar_url?: string | null;
          status?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      profile_tags: {
        Row: {
          id: string;
          profile_id: string;
          tag_group: string;
          tag_key: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          tag_group: string;
          tag_key: string;
        };
        Update: Partial<Database["public"]["Tables"]["profile_tags"]["Insert"]>;
        Relationships: [];
      };
      profile_members: {
        Row: {
          id: string;
          profile_id: string;
          user_id: string;
          role_id: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          user_id: string;
          role_id: string;
          status?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profile_members"]["Insert"]>;
        Relationships: [];
      };
      ai_jobs: {
        Row: {
          id: string;
          user_id: string;
          profile_id: string | null;
          type: string;
          status: JobStatus;
          payload: Json;
          result: Json | null;
          error_message: string | null;
          attempts: number;
          max_attempts: number;
          started_at: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          profile_id?: string | null;
          type: string;
          status?: JobStatus;
          payload?: Json;
          max_attempts?: number;
        };
        Update: Partial<Database["public"]["Tables"]["ai_jobs"]["Insert"]> & {
          result?: Json | null;
          error_message?: string | null;
          attempts?: number;
          started_at?: string | null;
          completed_at?: string | null;
        };
        Relationships: [];
      };
      media_assets: {
        Row: {
          id: string;
          user_id: string;
          profile_id: string | null;
          content_id: string | null;
          job_id: string | null;
          asset_type: string;
          storage_provider: string;
          r2_key: string;
          public_url: string | null;
          mime_type: string | null;
          size_bytes: number | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          profile_id?: string | null;
          content_id?: string | null;
          job_id?: string | null;
          asset_type: string;
          storage_provider?: string;
          r2_key: string;
          public_url?: string | null;
          mime_type?: string | null;
          size_bytes?: number | null;
          metadata?: Json;
        };
        Update: Partial<Database["public"]["Tables"]["media_assets"]["Insert"]>;
        Relationships: [];
      };
      audit_logs: {
        Row: Record<string, Json>;
        Insert: Record<string, Json | undefined>;
        Update: Record<string, Json | undefined>;
        Relationships: [];
      };
      content_items: {
        Row: {
          id: string;
          profile_id: string;
          created_by: string;
          title: string;
          content_type: string;
          status: string;
          idea: string | null;
          script: string | null;
          caption: string | null;
          hashtags: string[] | null;
          platform: string | null;
          scheduled_for: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          created_by: string;
          title: string;
          content_type: string;
          status?: string;
          idea?: string | null;
          script?: string | null;
          caption?: string | null;
          hashtags?: string[] | null;
          platform?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["content_items"]["Insert"]> & {
          scheduled_for?: string | null;
          published_at?: string | null;
        };
        Relationships: [];
      };
      library_items: {
        Row: {
          id: string;
          profile_id: string;
          created_by: string;
          type: string;
          title: string;
          body: string | null;
          status: string;
          metadata: Json;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          created_by: string;
          type: string;
          title: string;
          body?: string | null;
          status?: string;
          metadata?: Json;
          deleted_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["library_items"]["Insert"]>;
        Relationships: [];
      };
      manual_posting_queue: {
        Row: {
          id: string;
          profile_id: string;
          content_id: string;
          platform: string;
          status: ManualPostingStatus;
          checklist: Json;
          caption_to_copy: string | null;
          hashtags_to_copy: string[] | null;
          media_asset_id: string | null;
          planned_date: string | null;
          posted_at: string | null;
          posted_by: string | null;
          post_url: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          content_id: string;
          platform: string;
          status?: ManualPostingStatus;
          checklist?: Json;
          caption_to_copy?: string | null;
          hashtags_to_copy?: string[] | null;
          media_asset_id?: string | null;
          planned_date?: string | null;
          post_url?: string | null;
          notes?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["manual_posting_queue"]["Insert"]> & {
          posted_at?: string | null;
          posted_by?: string | null;
        };
        Relationships: [];
      };
      health_logs: {
        Row: Record<string, Json>;
        Insert: Record<string, Json | undefined>;
        Update: Record<string, Json | undefined>;
        Relationships: [];
      };
      agent_runs: {
        Row: Record<string, Json>;
        Insert: Record<string, Json | undefined>;
        Update: Record<string, Json | undefined>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

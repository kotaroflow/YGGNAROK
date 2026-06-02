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
          result?: Json | null;
          error_message?: string | null;
          attempts?: number;
          max_attempts?: number;
          started_at?: string | null;
          completed_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["ai_jobs"]["Insert"]>;
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
       agent_runs: {
        Row: {
          id: string;
          job_id: string | null;
          user_id: string;
          profile_id: string | null;
          agent_key: string;
          module: string;
          input: Json;
          output: Json;
          status: string;
          error_message: string | null;
          started_at: string | null;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          job_id?: string | null;
          user_id: string;
          profile_id?: string | null;
          agent_key: string;
          module: string;
          input?: Json;
          output?: Json;
          status?: string;
          error_message?: string | null;
          started_at?: string | null;
          completed_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["agent_runs"]["Insert"]>;
        Relationships: [];
      };
      chat_projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          path_label: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          path_label?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["chat_projects"]["Insert"]> & { updated_at?: string };
        Relationships: [];
      };
      chat_conversations: {
        Row: {
          id: string;
          user_id: string;
          project_id: string | null;
          title: string;
          last_message_preview: string | null;
          model_id: string | null;
          pinned: boolean;
          updated_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id?: string | null;
          title?: string;
          model_id?: string | null;
          pinned?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["chat_conversations"]["Insert"]> & {
          last_message_preview?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      chat_messages: {
        Row: {
          id: string;
          conversation_id: string;
          user_id: string;
          role: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          user_id: string;
          role: string;
          content: string;
        };
        Update: Partial<Database["public"]["Tables"]["chat_messages"]["Insert"]>;
        Relationships: [];
      };
      health_logs: {
        Row: {
          id: string;
          source: string;
          status: string;
          message: string;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          source: string;
          status: string;
          message: string;
          metadata?: Json;
        };
        Update: Partial<Database["public"]["Tables"]["health_logs"]["Insert"]>;
        Relationships: [];
      };
      ai_council_agents: {
        Row: {
          key: string;
          name: string;
          role: string;
          status: string;
          risk_level: string;
          paused_reason: string | null;
          last_seen_at: string | null;
          provider_preference: Json;
          config: Json;
          created_at: string;
        };
        Insert: {
          key: string;
          name: string;
          role: string;
          status?: string;
          risk_level?: string;
          paused_reason?: string | null;
          last_seen_at?: string | null;
          provider_preference?: Json;
          config?: Json;
        };
        Update: Partial<Database["public"]["Tables"]["ai_council_agents"]["Insert"]>;
        Relationships: [];
      };
      ai_provider_status: {
        Row: {
          provider: string;
          status: string;
          last_checked_at: string | null;
          latency_ms: number | null;
          error_message: string | null;
          metadata: Json;
        };
        Insert: {
          provider: string;
          status?: string;
          last_checked_at?: string | null;
          latency_ms?: number | null;
          error_message?: string | null;
          metadata?: Json;
        };
        Update: Partial<Database["public"]["Tables"]["ai_provider_status"]["Insert"]>;
        Relationships: [];
      };
      ai_council_decisions: {
        Row: {
          id: string;
          job_id: string | null;
          decision_type: string;
          status: string;
          risk: string;
          authority: string;
          summary: string;
          payload: Json;
          result: Json;
          created_at: string;
          approved_at: string | null;
        };
        Insert: {
          id?: string;
          job_id?: string | null;
          decision_type: string;
          status?: string;
          risk?: string;
          authority?: string;
          summary: string;
          payload?: Json;
          result?: Json;
          approved_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["ai_council_decisions"]["Insert"]>;
        Relationships: [];
      };
      ai_automations: {
        Row: {
          key: string;
          name: string;
          status: string;
          interval_ms: number;
          last_run_at: string | null;
          next_run_at: string | null;
          metadata: Json;
        };
        Insert: {
          key: string;
          name: string;
          status?: string;
          interval_ms: number;
          last_run_at?: string | null;
          next_run_at?: string | null;
          metadata?: Json;
        };
        Update: Partial<Database["public"]["Tables"]["ai_automations"]["Insert"]>;
        Relationships: [];
      };
      ai_memory_candidates: {
        Row: {
          id: string;
          library_item_id: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          library_item_id: string;
          status?: string;
        };
        Update: Partial<Database["public"]["Tables"]["ai_memory_candidates"]["Insert"]>;
        Relationships: [];
      };
      ai_cost_ledger: {
        Row: {
          id: string;
          job_id: string | null;
          provider: string;
          model: string | null;
          estimated_cost: number;
          currency: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          job_id?: string | null;
          provider: string;
          model?: string | null;
          estimated_cost: number;
          currency?: string;
        };
        Update: Partial<Database["public"]["Tables"]["ai_cost_ledger"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

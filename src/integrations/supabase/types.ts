export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      membership_tiers: {
        Row: {
          annual_price: number
          blood_work_frequency: string
          consultation_frequency: string
          created_at: string
          discount_pct: number
          features: Json | null
          id: string
          monthly_price: number
          name: string
          priority_support: boolean
          slug: string
          sort_order: number
          square_plan_id: string | null
          square_plan_id_annual: string | null
        }
        Insert: {
          annual_price: number
          blood_work_frequency: string
          consultation_frequency: string
          created_at?: string
          discount_pct?: number
          features?: Json | null
          id?: string
          monthly_price: number
          name: string
          priority_support?: boolean
          slug: string
          sort_order?: number
          square_plan_id?: string | null
          square_plan_id_annual?: string | null
        }
        Update: {
          annual_price?: number
          blood_work_frequency?: string
          consultation_frequency?: string
          created_at?: string
          discount_pct?: number
          features?: Json | null
          id?: string
          monthly_price?: number
          name?: string
          priority_support?: boolean
          slug?: string
          sort_order?: number
          square_plan_id?: string | null
          square_plan_id_annual?: string | null
        }
        Relationships: []
      }
      memberships: {
        Row: {
          billing_cycle: string
          cancelled_at: string | null
          created_at: string
          id: string
          renews_at: string | null
          started_at: string
          status: string
          tier_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_cycle?: string
          cancelled_at?: string | null
          created_at?: string
          id?: string
          renews_at?: string | null
          started_at?: string
          status?: string
          tier_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_cycle?: string
          cancelled_at?: string | null
          created_at?: string
          id?: string
          renews_at?: string | null
          started_at?: string
          status?: string
          tier_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memberships_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "membership_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          peptide_id: string
          quantity: number
          unit_price: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          peptide_id: string
          quantity?: number
          unit_price?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          peptide_id?: string
          quantity?: number
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_peptide_id_fkey"
            columns: ["peptide_id"]
            isOneToOne: false
            referencedRelation: "peptides"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          expected_delivery: string | null
          id: string
          notes: string | null
          status: Database["public"]["Enums"]["order_status"]
          total_amount: number | null
          tracking_number: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expected_delivery?: string | null
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total_amount?: number | null
          tracking_number?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expected_delivery?: string | null
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total_amount?: number | null
          tracking_number?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      patient_peptides: {
        Row: {
          created_at: string
          dosage: string | null
          id: string
          notes: string | null
          peptide_id: string
          quantity_remaining: number | null
          started_at: string | null
          updated_at: string
          usage_per_day: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          dosage?: string | null
          id?: string
          notes?: string | null
          peptide_id: string
          quantity_remaining?: number | null
          started_at?: string | null
          updated_at?: string
          usage_per_day?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          dosage?: string | null
          id?: string
          notes?: string | null
          peptide_id?: string
          quantity_remaining?: number | null
          started_at?: string | null
          updated_at?: string
          usage_per_day?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_peptides_peptide_id_fkey"
            columns: ["peptide_id"]
            isOneToOne: false
            referencedRelation: "peptides"
            referencedColumns: ["id"]
          },
        ]
      }
      peptide_requests: {
        Row: {
          created_at: string
          delivery_method: string | null
          deny_reason: string | null
          id: string
          include_injection_kit: boolean
          payment_url: string | null
          peptide_id: string
          peptide_name: string
          price: number | null
          square_order_id: string | null
          status: string
          updated_at: string
          user_id: string
          variation_label: string | null
        }
        Insert: {
          created_at?: string
          delivery_method?: string | null
          deny_reason?: string | null
          id?: string
          include_injection_kit?: boolean
          payment_url?: string | null
          peptide_id: string
          peptide_name: string
          price?: number | null
          square_order_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
          variation_label?: string | null
        }
        Update: {
          created_at?: string
          delivery_method?: string | null
          deny_reason?: string | null
          id?: string
          include_injection_kit?: boolean
          payment_url?: string | null
          peptide_id?: string
          peptide_name?: string
          price?: number | null
          square_order_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          variation_label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "peptide_requests_peptide_id_fkey"
            columns: ["peptide_id"]
            isOneToOne: false
            referencedRelation: "peptides"
            referencedColumns: ["id"]
          },
        ]
      }
      peptides: {
        Row: {
          administration: string | null
          benefits: string | null
          candidates: string | null
          category: string | null
          cost: number | null
          created_at: string
          description: string | null
          id: string
          name: string
          price: number | null
          unit: string | null
        }
        Insert: {
          administration?: string | null
          benefits?: string | null
          candidates?: string | null
          category?: string | null
          cost?: number | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          price?: number | null
          unit?: string | null
        }
        Update: {
          administration?: string | null
          benefits?: string | null
          candidates?: string | null
          category?: string | null
          cost?: number | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          price?: number | null
          unit?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address_city: string | null
          address_line1: string | null
          address_state: string | null
          address_zip: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          square_customer_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address_city?: string | null
          address_line1?: string | null
          address_state?: string | null
          address_zip?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          square_customer_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address_city?: string | null
          address_line1?: string | null
          address_state?: string | null
          address_zip?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          square_customer_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "patient" | "admin"
      order_status:
        | "pending"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["patient", "admin"],
      order_status: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
    },
  },
} as const

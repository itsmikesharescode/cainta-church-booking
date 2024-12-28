export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      cert_requests_tb: {
        Row: {
          church_id: number
          created_at: string
          date: string
          final_time: string
          id: number
          initial_time: string
          name: string
          price: number | null
          reference_id: string
          status: string
          user_id: string
        }
        Insert: {
          church_id: number
          created_at?: string
          date: string
          final_time: string
          id?: number
          initial_time: string
          name: string
          price?: number | null
          reference_id: string
          status?: string
          user_id: string
        }
        Update: {
          church_id?: number
          created_at?: string
          date?: string
          final_time?: string
          id?: number
          initial_time?: string
          name?: string
          price?: number | null
          reference_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cert_requests_tb_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_tb"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cert_requests_tb_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_tb"
            referencedColumns: ["user_id"]
          },
        ]
      }
      churches_tb: {
        Row: {
          address: string
          certs: Json
          close_time: string
          created_at: string
          description: string
          events: Json
          id: number
          name: string
          open_time: string
          photo_link: string
        }
        Insert: {
          address: string
          certs: Json
          close_time: string
          created_at?: string
          description: string
          events: Json
          id?: number
          name: string
          open_time: string
          photo_link: string
        }
        Update: {
          address?: string
          certs?: Json
          close_time?: string
          created_at?: string
          description?: string
          events?: Json
          id?: number
          name?: string
          open_time?: string
          photo_link?: string
        }
        Relationships: []
      }
      finished_payments_tb: {
        Row: {
          cert_request_id: string | null
          church_id: string
          created_at: string
          id: number
          reservation_id: string | null
          user_id: string
          xendit_callback: Json
        }
        Insert: {
          cert_request_id?: string | null
          church_id: string
          created_at?: string
          id?: number
          reservation_id?: string | null
          user_id: string
          xendit_callback: Json
        }
        Update: {
          cert_request_id?: string | null
          church_id?: string
          created_at?: string
          id?: number
          reservation_id?: string | null
          user_id?: string
          xendit_callback?: Json
        }
        Relationships: []
      }
      reservations_tb: {
        Row: {
          church_id: number
          created_at: string
          date: string
          event_name: string
          final_time: string
          id: number
          initial_time: string
          message: string
          number_of_guest: number
          price: number | null
          reference_id: string
          status: string
          user_id: string
        }
        Insert: {
          church_id: number
          created_at?: string
          date: string
          event_name: string
          final_time: string
          id?: number
          initial_time: string
          message: string
          number_of_guest: number
          price?: number | null
          reference_id: string
          status?: string
          user_id: string
        }
        Update: {
          church_id?: number
          created_at?: string
          date?: string
          event_name?: string
          final_time?: string
          id?: number
          initial_time?: string
          message?: string
          number_of_guest?: number
          price?: number | null
          reference_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_tb_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_tb"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_tb_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_tb"
            referencedColumns: ["user_id"]
          },
        ]
      }
      roles_tb: {
        Row: {
          created_at: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      users_tb: {
        Row: {
          created_at: string
          user_id: string
          user_meta_data: Json
        }
        Insert: {
          created_at?: string
          user_id: string
          user_meta_data: Json
        }
        Update: {
          created_at?: string
          user_id?: string
          user_meta_data?: Json
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_admin_dashboard_counts: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_user_church_reservations_data: {
        Args: {
          church_id: number
        }
        Returns: {
          church_id: number
          created_at: string
          date: string
          event_name: string
          final_time: string
          id: number
          initial_time: string
          message: string
          number_of_guest: number
          price: number | null
          reference_id: string
          status: string
          user_id: string
        }[]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      process_payment: {
        Args: {
          external_id: string
          xendit_callback: Json
        }
        Returns: undefined
      }
      reservation: {
        Args: {
          p_church_id: number
          p_reference_id: string
          p_event_name: string
          p_number_of_guest: number
          p_date: string
          p_initial_time: string
          p_final_time: string
          p_message: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never


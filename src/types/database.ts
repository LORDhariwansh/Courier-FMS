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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      attachments: {
        Row: {
          bucket_name: string
          created_at: string
          field_id: string | null
          file_size: number | null
          id: string
          mime_type: string | null
          original_filename: string | null
          record_id: string
          storage_path: string
          uploaded_by: string | null
        }
        Insert: {
          bucket_name: string
          created_at?: string
          field_id?: string | null
          file_size?: number | null
          id?: string
          mime_type?: string | null
          original_filename?: string | null
          record_id: string
          storage_path: string
          uploaded_by?: string | null
        }
        Update: {
          bucket_name?: string
          created_at?: string
          field_id?: string | null
          file_size?: number | null
          id?: string
          mime_type?: string | null
          original_filename?: string | null
          record_id?: string
          storage_path?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attachments_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "workflow_fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attachments_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "fms_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attachments_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "v_fms_current_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attachments_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "v_fms_pending_stages"
            referencedColumns: ["record_id"]
          },
          {
            foreignKeyName: "attachments_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          field_id: string | null
          id: string
          ip_address: unknown
          new_value: Json | null
          old_value: Json | null
          record_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          field_id?: string | null
          id?: string
          ip_address?: unknown
          new_value?: Json | null
          old_value?: Json | null
          record_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          field_id?: string | null
          id?: string
          ip_address?: unknown
          new_value?: Json | null
          old_value?: Json | null
          record_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "workflow_fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "fms_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "v_fms_current_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "v_fms_pending_stages"
            referencedColumns: ["record_id"]
          },
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      courier_agents: {
        Row: {
          contact_number: string | null
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          contact_number?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          contact_number?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          city: string | null
          contact_person: string | null
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      employees: {
        Row: {
          created_at: string
          department_id: string | null
          email: string | null
          employee_code: string | null
          id: string
          is_active: boolean
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          department_id?: string | null
          email?: string | null
          employee_code?: string | null
          id?: string
          is_active?: boolean
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          department_id?: string | null
          email?: string | null
          employee_code?: string | null
          id?: string
          is_active?: boolean
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employees_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      field_dependencies: {
        Row: {
          action: string
          created_at: string
          depends_on_field_id: string
          expected_value: Json | null
          field_id: string
          id: string
          operator: string
        }
        Insert: {
          action?: string
          created_at?: string
          depends_on_field_id: string
          expected_value?: Json | null
          field_id: string
          id?: string
          operator: string
        }
        Update: {
          action?: string
          created_at?: string
          depends_on_field_id?: string
          expected_value?: Json | null
          field_id?: string
          id?: string
          operator?: string
        }
        Relationships: [
          {
            foreignKeyName: "field_dependencies_depends_on_field_id_fkey"
            columns: ["depends_on_field_id"]
            isOneToOne: false
            referencedRelation: "workflow_fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "field_dependencies_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "workflow_fields"
            referencedColumns: ["id"]
          },
        ]
      }
      field_options: {
        Row: {
          created_at: string
          field_id: string
          id: string
          is_active: boolean
          metadata: Json
          option_label: string
          option_value: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          field_id: string
          id?: string
          is_active?: boolean
          metadata?: Json
          option_label: string
          option_value: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          field_id?: string
          id?: string
          is_active?: boolean
          metadata?: Json
          option_label?: string
          option_value?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "field_options_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "workflow_fields"
            referencedColumns: ["id"]
          },
        ]
      }
      fms_record_values: {
        Row: {
          created_at: string
          field_id: string
          id: string
          record_id: string
          updated_at: string
          value_boolean: boolean | null
          value_date: string | null
          value_datetime: string | null
          value_json: Json | null
          value_number: number | null
          value_text: string | null
        }
        Insert: {
          created_at?: string
          field_id: string
          id?: string
          record_id: string
          updated_at?: string
          value_boolean?: boolean | null
          value_date?: string | null
          value_datetime?: string | null
          value_json?: Json | null
          value_number?: number | null
          value_text?: string | null
        }
        Update: {
          created_at?: string
          field_id?: string
          id?: string
          record_id?: string
          updated_at?: string
          value_boolean?: boolean | null
          value_date?: string | null
          value_datetime?: string | null
          value_json?: Json | null
          value_number?: number | null
          value_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fms_record_values_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "workflow_fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fms_record_values_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "fms_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fms_record_values_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "v_fms_current_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fms_record_values_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "v_fms_pending_stages"
            referencedColumns: ["record_id"]
          },
        ]
      }
      fms_records: {
        Row: {
          archived_at: string | null
          assigned_to: string | null
          cancelled_at: string | null
          completed_at: string | null
          created_at: string
          created_by: string | null
          current_stage_id: string | null
          department_id: string | null
          fms_type_id: string
          id: string
          metadata: Json
          record_number: number
          status: Database["public"]["Enums"]["fms_record_status"]
          updated_at: string
          workflow_id: string
        }
        Insert: {
          archived_at?: string | null
          assigned_to?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          current_stage_id?: string | null
          department_id?: string | null
          fms_type_id: string
          id?: string
          metadata?: Json
          record_number?: never
          status?: Database["public"]["Enums"]["fms_record_status"]
          updated_at?: string
          workflow_id: string
        }
        Update: {
          archived_at?: string | null
          assigned_to?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          current_stage_id?: string | null
          department_id?: string | null
          fms_type_id?: string
          id?: string
          metadata?: Json
          record_number?: never
          status?: Database["public"]["Enums"]["fms_record_status"]
          updated_at?: string
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fms_records_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fms_records_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fms_records_current_stage_id_fkey"
            columns: ["current_stage_id"]
            isOneToOne: false
            referencedRelation: "workflow_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fms_records_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fms_records_fms_type_id_fkey"
            columns: ["fms_type_id"]
            isOneToOne: false
            referencedRelation: "fms_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fms_records_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      fms_stage_history: {
        Row: {
          action: string
          id: string
          metadata: Json
          new_status: string | null
          notes: string | null
          old_status: string | null
          performed_at: string
          performed_by: string | null
          record_id: string
          stage_id: string | null
        }
        Insert: {
          action: string
          id?: string
          metadata?: Json
          new_status?: string | null
          notes?: string | null
          old_status?: string | null
          performed_at?: string
          performed_by?: string | null
          record_id: string
          stage_id?: string | null
        }
        Update: {
          action?: string
          id?: string
          metadata?: Json
          new_status?: string | null
          notes?: string | null
          old_status?: string | null
          performed_at?: string
          performed_by?: string | null
          record_id?: string
          stage_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fms_stage_history_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fms_stage_history_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "fms_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fms_stage_history_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "v_fms_current_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fms_stage_history_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "v_fms_pending_stages"
            referencedColumns: ["record_id"]
          },
          {
            foreignKeyName: "fms_stage_history_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "workflow_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      fms_stage_instances: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          completed_by: string | null
          completion_notes: string | null
          created_at: string
          delay_hours: number | null
          id: string
          planned_at: string | null
          record_id: string
          stage_id: string
          started_at: string | null
          status: Database["public"]["Enums"]["stage_status"]
          tat_hours: number | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          completed_by?: string | null
          completion_notes?: string | null
          created_at?: string
          delay_hours?: number | null
          id?: string
          planned_at?: string | null
          record_id: string
          stage_id: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["stage_status"]
          tat_hours?: number | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          completed_by?: string | null
          completion_notes?: string | null
          created_at?: string
          delay_hours?: number | null
          id?: string
          planned_at?: string | null
          record_id?: string
          stage_id?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["stage_status"]
          tat_hours?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fms_stage_instances_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fms_stage_instances_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fms_stage_instances_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "fms_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fms_stage_instances_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "v_fms_current_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fms_stage_instances_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "v_fms_pending_stages"
            referencedColumns: ["record_id"]
          },
          {
            foreignKeyName: "fms_stage_instances_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "workflow_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      fms_types: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      holidays: {
        Row: {
          created_at: string
          holiday_date: string
          id: string
          is_working_day: boolean
          name: string | null
        }
        Insert: {
          created_at?: string
          holiday_date: string
          id?: string
          is_working_day?: boolean
          name?: string | null
        }
        Update: {
          created_at?: string
          holiday_date?: string
          id?: string
          is_working_day?: boolean
          name?: string | null
        }
        Relationships: []
      }
      materials: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      notification_logs: {
        Row: {
          body: string | null
          channel: string
          created_at: string
          error_message: string | null
          id: string
          recipient: string | null
          record_id: string | null
          sent_at: string | null
          status: string | null
          subject: string | null
          template_id: string | null
        }
        Insert: {
          body?: string | null
          channel: string
          created_at?: string
          error_message?: string | null
          id?: string
          recipient?: string | null
          record_id?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          template_id?: string | null
        }
        Update: {
          body?: string | null
          channel?: string
          created_at?: string
          error_message?: string | null
          id?: string
          recipient?: string | null
          record_id?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_logs_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "fms_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_logs_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "v_fms_current_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_logs_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "v_fms_pending_stages"
            referencedColumns: ["record_id"]
          },
          {
            foreignKeyName: "notification_logs_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "notification_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_templates: {
        Row: {
          cc_expression: string | null
          created_at: string
          email_body: string | null
          enabled: boolean
          id: string
          metadata: Json
          name: string
          recipient_expression: string | null
          repeat_days: number | null
          repeat_enabled: boolean
          repeat_hours: number | null
          sender_email: string | null
          subject: string | null
          trigger_condition: Json | null
          trigger_type: string | null
          updated_at: string
          whatsapp_body: string | null
          whatsapp_recipient_expression: string | null
          workflow_id: string | null
        }
        Insert: {
          cc_expression?: string | null
          created_at?: string
          email_body?: string | null
          enabled?: boolean
          id?: string
          metadata?: Json
          name: string
          recipient_expression?: string | null
          repeat_days?: number | null
          repeat_enabled?: boolean
          repeat_hours?: number | null
          sender_email?: string | null
          subject?: string | null
          trigger_condition?: Json | null
          trigger_type?: string | null
          updated_at?: string
          whatsapp_body?: string | null
          whatsapp_recipient_expression?: string | null
          workflow_id?: string | null
        }
        Update: {
          cc_expression?: string | null
          created_at?: string
          email_body?: string | null
          enabled?: boolean
          id?: string
          metadata?: Json
          name?: string
          recipient_expression?: string | null
          repeat_days?: number | null
          repeat_enabled?: boolean
          repeat_hours?: number | null
          sender_email?: string | null
          subject?: string | null
          trigger_condition?: Json | null
          trigger_type?: string | null
          updated_at?: string
          whatsapp_body?: string | null
          whatsapp_recipient_expression?: string | null
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_templates_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          permission_key: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          permission_key: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          permission_key?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          department_id: string | null
          email: string | null
          employee_code: string | null
          full_name: string | null
          id: string
          is_active: boolean
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          department_id?: string | null
          email?: string | null
          employee_code?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          department_id?: string | null
          email?: string | null
          employee_code?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      reminders: {
        Row: {
          created_at: string
          email_enabled: boolean
          enabled: boolean
          hours_after: number | null
          hours_before: number | null
          id: string
          name: string
          reminder_type: string | null
          stage_id: string | null
          template_id: string | null
          updated_at: string
          whatsapp_enabled: boolean
          workflow_id: string | null
        }
        Insert: {
          created_at?: string
          email_enabled?: boolean
          enabled?: boolean
          hours_after?: number | null
          hours_before?: number | null
          id?: string
          name: string
          reminder_type?: string | null
          stage_id?: string | null
          template_id?: string | null
          updated_at?: string
          whatsapp_enabled?: boolean
          workflow_id?: string | null
        }
        Update: {
          created_at?: string
          email_enabled?: boolean
          enabled?: boolean
          hours_after?: number | null
          hours_before?: number | null
          id?: string
          name?: string
          reminder_type?: string | null
          stage_id?: string | null
          template_id?: string | null
          updated_at?: string
          whatsapp_enabled?: boolean
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reminders_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "workflow_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminders_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "notification_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminders_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string
          permission_id: string
          role_id: string
        }
        Insert: {
          created_at?: string
          permission_id: string
          role_id: string
        }
        Update: {
          created_at?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          is_system_role: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_system_role?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_system_role?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      saved_reports: {
        Row: {
          allowed_roles: Json | null
          configuration: Json
          created_at: string
          description: string | null
          fms_type_id: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          allowed_roles?: Json | null
          configuration?: Json
          created_at?: string
          description?: string | null
          fms_type_id?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          allowed_roles?: Json | null
          configuration?: Json
          created_at?: string
          description?: string | null
          fms_type_id?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_reports_fms_type_id_fkey"
            columns: ["fms_type_id"]
            isOneToOne: false
            referencedRelation: "fms_types"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          city: string | null
          contact_person: string | null
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          role_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          role_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_fields: {
        Row: {
          calculation_expression: string | null
          column_width: number | null
          configuration: Json
          created_at: string
          data_type: Database["public"]["Enums"]["field_data_type"]
          default_value: Json | null
          display_order: number
          field_key: string
          field_label: string
          filter_type: string | null
          id: string
          is_filterable: boolean
          is_freeze: boolean
          is_hidden: boolean
          is_readonly: boolean
          is_required: boolean
          is_searchable: boolean
          stage_id: string | null
          updated_at: string
          validation_rules: Json | null
          workflow_id: string
        }
        Insert: {
          calculation_expression?: string | null
          column_width?: number | null
          configuration?: Json
          created_at?: string
          data_type: Database["public"]["Enums"]["field_data_type"]
          default_value?: Json | null
          display_order?: number
          field_key: string
          field_label: string
          filter_type?: string | null
          id?: string
          is_filterable?: boolean
          is_freeze?: boolean
          is_hidden?: boolean
          is_readonly?: boolean
          is_required?: boolean
          is_searchable?: boolean
          stage_id?: string | null
          updated_at?: string
          validation_rules?: Json | null
          workflow_id: string
        }
        Update: {
          calculation_expression?: string | null
          column_width?: number | null
          configuration?: Json
          created_at?: string
          data_type?: Database["public"]["Enums"]["field_data_type"]
          default_value?: Json | null
          display_order?: number
          field_key?: string
          field_label?: string
          filter_type?: string | null
          id?: string
          is_filterable?: boolean
          is_freeze?: boolean
          is_hidden?: boolean
          is_readonly?: boolean
          is_required?: boolean
          is_searchable?: boolean
          stage_id?: string | null
          updated_at?: string
          validation_rules?: Json | null
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_fields_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "workflow_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_fields_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_permissions: {
        Row: {
          can_assign: boolean
          can_complete: boolean
          can_edit: boolean
          can_view: boolean
          created_at: string
          field_id: string | null
          id: string
          role_id: string | null
          stage_id: string | null
          workflow_id: string
        }
        Insert: {
          can_assign?: boolean
          can_complete?: boolean
          can_edit?: boolean
          can_view?: boolean
          created_at?: string
          field_id?: string | null
          id?: string
          role_id?: string | null
          stage_id?: string | null
          workflow_id: string
        }
        Update: {
          can_assign?: boolean
          can_complete?: boolean
          can_edit?: boolean
          can_view?: boolean
          created_at?: string
          field_id?: string | null
          id?: string
          role_id?: string | null
          stage_id?: string | null
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_permissions_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "workflow_fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_permissions_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "workflow_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_permissions_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_stages: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          sort_order: number
          stage_name: string
          stage_number: number
          tat_hours: number | null
          updated_at: string
          workflow_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          sort_order: number
          stage_name: string
          stage_number: number
          tat_hours?: number | null
          updated_at?: string
          workflow_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          sort_order?: number
          stage_name?: string
          stage_number?: number
          tat_hours?: number | null
          updated_at?: string
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_stages_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflows: {
        Row: {
          created_at: string
          fms_type_id: string
          id: string
          is_active: boolean
          name: string
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          fms_type_id: string
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
          version?: number
        }
        Update: {
          created_at?: string
          fms_type_id?: string
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "workflows_fms_type_id_fkey"
            columns: ["fms_type_id"]
            isOneToOne: false
            referencedRelation: "fms_types"
            referencedColumns: ["id"]
          },
        ]
      }
      working_hours: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string | null
          id: string
          is_working_day: boolean
          start_time: string | null
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time?: string | null
          id?: string
          is_working_day?: boolean
          start_time?: string | null
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string | null
          id?: string
          is_working_day?: boolean
          start_time?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      v_fms_current_status: {
        Row: {
          completed_at: string | null
          created_at: string | null
          delay_hours: number | null
          fms_name: string | null
          fms_type: string | null
          id: string | null
          planned_at: string | null
          record_number: number | null
          record_status: Database["public"]["Enums"]["fms_record_status"] | null
          stage_name: string | null
          stage_number: number | null
          stage_status: Database["public"]["Enums"]["stage_status"] | null
          started_at: string | null
          tat_hours: number | null
          updated_at: string | null
        }
        Relationships: []
      }
      v_fms_pending_stages: {
        Row: {
          assigned_to: string | null
          delay_hours: number | null
          fms_type: string | null
          planned_at: string | null
          record_id: string | null
          record_number: number | null
          stage_name: string | null
          stage_number: number | null
          started_at: string | null
          status: Database["public"]["Enums"]["stage_status"] | null
          tat_hours: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fms_records_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      current_user_has_permission: {
        Args: { permission_name: string }
        Returns: boolean
      }
      current_user_has_role: { Args: { role_name: string }; Returns: boolean }
    }
    Enums: {
      field_data_type:
        | "text"
        | "textarea"
        | "number"
        | "date"
        | "datetime"
        | "time"
        | "boolean"
        | "checkbox"
        | "dropdown"
        | "multi_select"
        | "file"
        | "image"
        | "email"
        | "phone"
        | "user"
        | "employee"
        | "calculated"
        | "readonly"
      fms_record_status:
        | "draft"
        | "active"
        | "completed"
        | "overdue"
        | "archived"
        | "cancelled"
      stage_status:
        | "pending"
        | "active"
        | "completed"
        | "skipped"
        | "overdue"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      field_data_type: [
        "text",
        "textarea",
        "number",
        "date",
        "datetime",
        "time",
        "boolean",
        "checkbox",
        "dropdown",
        "multi_select",
        "file",
        "image",
        "email",
        "phone",
        "user",
        "employee",
        "calculated",
        "readonly",
      ],
      fms_record_status: [
        "draft",
        "active",
        "completed",
        "overdue",
        "archived",
        "cancelled",
      ],
      stage_status: [
        "pending",
        "active",
        "completed",
        "skipped",
        "overdue",
        "cancelled",
      ],
    },
  },
} as const


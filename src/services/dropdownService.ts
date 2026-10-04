import { supabase } from '../lib/supabase'

export interface DropdownOption {
  id: string
  label: string
  metadata?: any
}

interface DropdownConfig {
  source_table: string
  label_column: string
  value_column: string
  search_columns?: string[]
}

export const KNOWN_TABLES: Record<string, DropdownConfig> = {
  courier_agents: { source_table: 'courier_agents', label_column: 'name', value_column: 'id', search_columns: ['name', 'contact_number'] },
  materials: { source_table: 'materials', label_column: 'name', value_column: 'id', search_columns: ['name'] },
  departments: { source_table: 'departments', label_column: 'name', value_column: 'id', search_columns: ['name'] },
  users: { source_table: 'profiles', label_column: 'full_name', value_column: 'id', search_columns: ['full_name', 'email'] },
  profiles: { source_table: 'profiles', label_column: 'full_name', value_column: 'id', search_columns: ['full_name', 'email'] },
  customers: { source_table: 'customers', label_column: 'name', value_column: 'id', search_columns: ['name', 'contact_person', 'phone'] },
}

export async function fetchDropdownOptions(
  tableName: string, 
  searchTerm: string = '', 
  dependencyFilter?: { column: string, value: any }
): Promise<DropdownOption[]> {
  const config = KNOWN_TABLES[tableName]
  if (!config || !supabase) return []

  let query = supabase
    .from(config.source_table as any)
    .select('*')
    .eq('is_active', true) // Only active records by default for operational dropdowns

  if (dependencyFilter && dependencyFilter.value) {
    query = query.eq(dependencyFilter.column, dependencyFilter.value)
  }

  if (searchTerm && config.search_columns && config.search_columns.length > 0) {
    // Generate OR condition for search
    const orCondition = config.search_columns.map(col => `${col}.ilike.%${searchTerm}%`).join(',')
    query = query.or(orCondition)
  }

  // Limit to 50 for performance (server-side pagination equivalent for search)
  query = query.limit(50).order(config.label_column)

  const { data, error } = await query
  if (error) {
    console.warn(`Dropdown search failed for ${tableName}:`, error)
    return []
  }

  return (data as any[]).map(item => ({
    id: String(item[config.value_column]),
    label: String(item[config.label_column]),
    metadata: item
  }))
}

import type { WorkflowField } from './fmsService'

export interface FieldBehavior {
  visible: boolean
  editable: boolean
  required: boolean
  executionType: 'user_input' | 'dependent_input' | 'system_timestamp' | 'tat_timestamp' | 'formula' | 'action' | 'system_hidden'
  autoCalculate: boolean
  sourceConfig?: {
    type: 'master_data' | 'static' | 'user' | 'dependent'
    table?: string
    dependsOn?: string
    returnField?: string
    options?: string[]
  }
}

export function getFieldBehavior(field: WorkflowField, _context?: any): FieldBehavior {
  const config = (field.configuration as Record<string, any>) || {}
  const execType = config.execution_type || 'user_input'
  
  return {
    visible: !field.is_hidden && execType !== 'system_hidden',
    editable: !field.is_readonly && ['user_input', 'action'].includes(execType),
    required: field.is_required,
    executionType: execType as any,
    autoCalculate: ['system_timestamp', 'tat_timestamp', 'formula', 'dependent_input'].includes(execType),
    sourceConfig: config.source_config
  }
}

export function evaluateDependencies(fields: WorkflowField[], currentData: Record<string, any>, context?: any): Record<string, any> {
  const updates: Record<string, any> = {}
  let changed = false

  do {
    changed = false
    for (const field of fields) {
      const config = (field.configuration as Record<string, any>) || {}
      
      // Handle DEPEND source logic (lookups)
      if (config.source_config?.type === 'dependent' && config.source_config.lookup_table) {
         const dependsOnField = config.depends_on?.field_key || config.source_config.depends_on
         if (dependsOnField && currentData[dependsOnField]) {
            const masterList = context?.masterData?.[config.source_config.lookup_table] || []
            const match = masterList.find((m: any) => m.name === currentData[dependsOnField])
            if (match && config.source_config.return_field) {
               const resolvedValue = match[config.source_config.return_field]
               if (resolvedValue && currentData[field.field_key] !== resolvedValue) {
                  updates[field.field_key] = resolvedValue
                  changed = true
               }
            }
         }
      }

      const dependsOn = config.depends_on
      if (!dependsOn || !dependsOn.operator) continue

      const sourceValue = currentData[dependsOn.field_key] || updates[dependsOn.field_key]
      const currentValue = currentData[field.field_key] || updates[field.field_key]

      if (dependsOn.operator === 'NOT_NULL') {
        if (sourceValue && !currentValue) {
          updates[field.field_key] = new Date().toISOString()
          changed = true
        }
      } else if (dependsOn.operator === 'TRUE') {
        if (sourceValue === true && !currentValue) {
          updates[field.field_key] = new Date().toISOString()
          changed = true
        }
      } else if (dependsOn.operator === 'TIME') {
        if (sourceValue && !currentValue && config.tat_hours) {
          const startTime = new Date(sourceValue)
          const tatTime = new Date(startTime.getTime() + config.tat_hours * 60 * 60 * 1000)
          updates[field.field_key] = tatTime.toISOString()
          changed = true
        }
      }
    }
    // merge updates into current data for cascading dependencies
    Object.assign(currentData, updates)
  } while (changed)

  return updates
}

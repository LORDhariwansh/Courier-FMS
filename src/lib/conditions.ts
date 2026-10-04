import type { WorkflowField } from './fmsService'

export type ConditionOperator = 
  | 'equals' 
  | 'not_equals' 
  | 'is_empty' 
  | 'is_not_empty'
  | 'TRUE'
  | 'FALSE'
  | 'exists'
  | 'does_not_exist'
  | 'greater_than'
  | 'less_than'
  | 'contains'

export interface ConditionRule {
  field_key: string
  operator: ConditionOperator
  value?: any
}

export interface ConditionConfig {
  operator: 'AND' | 'OR'
  rules: ConditionRule[]
}

/**
 * Validates a record's metadata against a set of condition rules.
 * Used by the Central Transition Service to block stage progression 
 * if requirements are not met.
 */
export function evaluateConditions(
  metadata: Record<string, any>, 
  config: ConditionConfig
): { passed: boolean; failedRules: ConditionRule[] } {
  
  const failedRules: ConditionRule[] = []

  for (const rule of config.rules) {
    const fieldValue = metadata[rule.field_key]
    let rulePassed = false

    switch (rule.operator) {
      case 'equals':
        rulePassed = fieldValue === rule.value
        break
      case 'not_equals':
        rulePassed = fieldValue !== rule.value
        break
      case 'is_empty':
      case 'does_not_exist':
        rulePassed = fieldValue === null || fieldValue === undefined || fieldValue === ''
        break
      case 'is_not_empty':
      case 'exists':
        rulePassed = fieldValue !== null && fieldValue !== undefined && fieldValue !== ''
        break
      case 'TRUE':
        rulePassed = fieldValue === true || fieldValue === 'true'
        break
      case 'FALSE':
        rulePassed = fieldValue === false || fieldValue === 'false' || fieldValue === null || fieldValue === undefined
        break
      case 'greater_than':
        rulePassed = Number(fieldValue) > Number(rule.value)
        break
      case 'less_than':
        rulePassed = Number(fieldValue) < Number(rule.value)
        break
      case 'contains':
        rulePassed = String(fieldValue || '').toLowerCase().includes(String(rule.value).toLowerCase())
        break
      default:
        rulePassed = false
    }

    if (!rulePassed) {
      failedRules.push(rule)
    }
  }

  // Evaluate final logic block
  if (config.operator === 'AND') {
    return { passed: failedRules.length === 0, failedRules }
  } else {
    // OR condition - if ANY rule passed, it passes
    const passedRulesCount = config.rules.length - failedRules.length
    return { 
      passed: passedRulesCount > 0 || config.rules.length === 0, 
      failedRules: passedRulesCount === 0 ? failedRules : [] 
    }
  }
}

/**
 * Convenience function to auto-generate basic completion conditions 
 * based on all configured "is_required" fields for a stage.
 */
export function generateRequiredFieldConditions(fields: WorkflowField[]): ConditionConfig {
  const rules: ConditionRule[] = fields
    .filter(f => f.is_required)
    .map(f => ({
      field_key: f.field_key,
      operator: 'is_not_empty'
    }))

  return { operator: 'AND', rules }
}

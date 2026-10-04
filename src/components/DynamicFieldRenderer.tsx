import type { WorkflowField } from '../lib/fmsService'
import { getFieldBehavior } from '../lib/fieldBehavior'
import { SearchableSupabaseSelect } from './SearchableSupabaseSelect'

interface DynamicFieldRendererProps {
  field: WorkflowField
  value: any
  onChange: (value: any) => void
  disabled?: boolean
  context?: any
}

export function DynamicFieldRenderer({ field, value, onChange, disabled, context }: DynamicFieldRendererProps) {
  const behavior = getFieldBehavior(field, context)

  if (!behavior.visible) return null

  // If autoCalculate or read-only, render a disabled display
  const isEffectivelyDisabled = disabled || !behavior.editable || behavior.autoCalculate
  
  if (field.data_type === 'textarea') {
    return (
      <div className="form-group">
        <label>{field.field_label} {behavior.required && '*'}</label>
        <textarea
          rows={3}
          required={behavior.required}
          disabled={isEffectivelyDisabled}
          value={value || ''}
          onChange={e => onChange(e.target.value)}
        />
      </div>
    )
  }

  if (field.data_type === 'date') {
    return (
      <div className="form-group">
        <label>{field.field_label} {behavior.required && '*'}</label>
        <input
          type="date"
          required={behavior.required}
          disabled={isEffectivelyDisabled}
          value={value || ''}
          onChange={e => onChange(e.target.value)}
        />
      </div>
    )
  }

  if (field.data_type === 'datetime') {
    return (
      <div className="form-group">
        <label>{field.field_label} {behavior.required && '*'}</label>
        {isEffectivelyDisabled ? (
           <div style={{ padding: '8px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px' }}>
              {value ? new Date(value).toLocaleString() : 'Pending...'}
           </div>
        ) : (
          <input
            type="datetime-local"
            required={behavior.required}
            disabled={isEffectivelyDisabled}
            value={value || ''}
            onChange={e => onChange(e.target.value)}
          />
        )}
      </div>
    )
  }

  if (field.data_type === 'boolean') {
    return (
      <div className="form-group">
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            required={behavior.required}
            disabled={isEffectivelyDisabled}
            checked={!!value}
            onChange={e => onChange(e.target.checked)}
          />
          {field.field_label} {behavior.required && '*'}
        </label>
      </div>
    )
  }

  if (field.data_type === 'dropdown') {
    const sourceConfig = behavior.sourceConfig
    if (sourceConfig?.type === 'static' && sourceConfig.options) {
      return (
        <div className="form-group">
          <label>{field.field_label} {behavior.required && '*'}</label>
          <select
            required={behavior.required}
            disabled={isEffectivelyDisabled}
            value={value || ''}
            onChange={e => onChange(e.target.value)}
          >
            <option value="">Select...</option>
            {sourceConfig.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      )
    }

    if (sourceConfig?.type === 'master_data') {
       // Extract dependency filter if this field depends on another
       let dependencyFilter = undefined
       if (field.configuration && typeof field.configuration === 'object') {
         const dependsOn = (field.configuration as any).depends_on
         if (dependsOn?.operator === 'DEPEND' && context?.metadata?.[dependsOn.field_key]) {
           dependencyFilter = {
             column: (field.configuration as any).source_config?.dependent_column || 'company_id', 
             value: context.metadata[dependsOn.field_key]
           }
         }
       }

       return (
        <div className="form-group">
          <label>{field.field_label} {behavior.required && '*'}</label>
          <SearchableSupabaseSelect
            sourceTable={sourceConfig.table!}
            value={value}
            onChange={(val: any, meta: any) => {
              // we can inject full meta to form context if needed, but for now just pass value
              onChange(val)
              // If context has a setMetadata, we can store it for dependency engine
              if (context?.setMetadata) {
                context.setMetadata((prev: any) => ({...prev, [field.field_key]: val, [`${field.field_key}_meta`]: meta}))
              }
            }}
            disabled={isEffectivelyDisabled}
            required={behavior.required}
            dependencyFilter={dependencyFilter}
          />
        </div>
       )
    }
  }
  
  if (field.data_type === 'user') {
    return (
      <div className="form-group">
        <label>{field.field_label} {behavior.required && '*'}</label>
        <SearchableSupabaseSelect
          sourceTable="profiles"
          value={value}
          onChange={(val: any) => onChange(val)}
          disabled={isEffectivelyDisabled}
          required={behavior.required}
          placeholder="Search User..."
        />
      </div>
    )
  }

  if (field.data_type === 'file' || field.data_type === 'image') {
    return (
      <div className="form-group">
        <label>{field.field_label} {behavior.required && '*'}</label>
        <input
          type="text"
          placeholder="Enter file URL (simulated upload)..."
          required={behavior.required}
          disabled={isEffectivelyDisabled}
          value={value || ''}
          onChange={e => onChange(e.target.value)}
        />
      </div>
    )
  }

  // Default Text
  return (
    <div className="form-group">
      <label>{field.field_label} {behavior.required && '*'}</label>
      <input
        type="text"
        required={behavior.required}
        disabled={isEffectivelyDisabled}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}

import type { WorkflowField } from '../lib/fmsService'
import { getFieldBehavior } from '../lib/fieldBehavior'

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
       // Ideally this uses a generic master data fetcher. For now, we mock static or context-passed lists
       // We can pass context.masterData[table]
       const list = context?.masterData?.[sourceConfig.table!] || []
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
            {list.map((item: any) => <option key={item.id || item.name} value={item.name}>{item.name}</option>)}
          </select>
        </div>
       )
    }
  }
  
  if (field.data_type === 'user') {
    const users = context?.masterData?.users || []
    return (
      <div className="form-group">
        <label>{field.field_label} {behavior.required && '*'}</label>
        <select
          required={behavior.required}
          disabled={isEffectivelyDisabled}
          value={value || ''}
          onChange={e => onChange(e.target.value)}
        >
          <option value="">Select User...</option>
          {users.map((u: any) => <option key={u.id} value={u.full_name}>{u.full_name}</option>)}
        </select>
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

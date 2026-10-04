import { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import type { CourierAgent, Department, WorkflowField } from '../lib/fmsService'
import { canEditField, canViewField } from '../lib/permissions'

interface CreateRecordModalProps {
  workflowType: 'outward' | 'inward'
  isOpen: boolean
  onClose: () => void
  onSubmit: (formData: Record<string, any>) => Promise<void>
  courierAgents: CourierAgent[]
  departments: Department[]
  fields: WorkflowField[]
  workflowId: string
  stageId: string
}

export function CreateRecordModal({
  workflowType,
  isOpen,
  onClose,
  onSubmit,
  courierAgents,
  departments,
  fields,
  workflowId,
  stageId
}: CreateRecordModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (isOpen) {
      // Initialize with defaults from fields
      const initial: Record<string, any> = {}
      fields.forEach(f => {
        if (f.default_value !== null) {
          initial[f.field_key] = f.default_value
        } else {
          initial[f.field_key] = ''
        }
      })
      // Set sensible defaults if available
      if (departments.length > 0 && !initial.department_name) initial.department_name = departments[0].name
      if (courierAgents.length > 0 && !initial.courier_agent_name) initial.courier_agent_name = courierAgents[0].name
      
      setFormData(initial)
    }
  }, [isOpen, fields, departments, courierAgents])

  if (!isOpen) return null

  const isOutward = workflowType === 'outward'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(formData)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  // Filter fields by permission
  const visibleFields = fields.filter(f => !f.is_hidden && canViewField(workflowId, stageId, f.id))
  
  // Sort by display_order
  visibleFields.sort((a, b) => a.display_order - b.display_order)

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <h2>{isOutward ? 'New Outward Courier Request' : 'New Inward Docket Receipt'}</h2>
            <p>
              {isOutward
                ? 'Initiates Stage 1: Request with sender and dispatch requirements'
                : 'Initiates Stage 1: Docket Received with reception intake log'}
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {visibleFields.length === 0 ? (
            <p className="text-sm text-gray-500">No fields configured or permission denied.</p>
          ) : (
            visibleFields.map(field => {
              const editable = !field.is_readonly && canEditField(workflowId, stageId, field.id)
              
              let inputControl = null
              
              if (field.data_type === 'dropdown') {
                let options: string[] = []
                if (field.field_key === 'department_name' || field.field_key === 'department') {
                   options = departments.map(d => d.name)
                } else if (field.field_key === 'courier_agent_name' || field.field_key === 'courier_agent') {
                   options = courierAgents.map(a => a.name)
                } else if (field.configuration && typeof field.configuration === 'object' && 'options' in field.configuration) {
                   options = (field.configuration as any).options as string[]
                }
                
                inputControl = (
                  <select
                    required={field.is_required}
                    disabled={!editable}
                    value={formData[field.field_key] || ''}
                    onChange={e => setFormData({ ...formData, [field.field_key]: e.target.value })}
                  >
                    <option value="">Select...</option>
                    {options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                )
              } else if (field.data_type === 'textarea') {
                inputControl = (
                  <textarea
                    rows={2}
                    required={field.is_required}
                    disabled={!editable}
                    placeholder={`Enter ${field.field_label}...`}
                    value={formData[field.field_key] || ''}
                    onChange={e => setFormData({ ...formData, [field.field_key]: e.target.value })}
                  />
                )
              } else if (field.data_type === 'date') {
                 inputControl = (
                  <input
                    type="date"
                    required={field.is_required}
                    disabled={!editable}
                    value={formData[field.field_key] || ''}
                    onChange={e => setFormData({ ...formData, [field.field_key]: e.target.value })}
                  />
                 )
              } else {
                inputControl = (
                  <input
                    type="text"
                    required={field.is_required}
                    disabled={!editable}
                    placeholder={`e.g., ${field.field_label}`}
                    value={formData[field.field_key] || ''}
                    onChange={e => setFormData({ ...formData, [field.field_key]: e.target.value })}
                  />
                )
              }

              return (
                <div className="form-group" key={field.id}>
                  <label>{field.field_label} {field.is_required && '*'}</label>
                  {inputControl}
                </div>
              )
            })
          )}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              <Plus size={16} />
              <span>{loading ? 'Creating Record?' : 'Submit Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

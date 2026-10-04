import { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import type { CourierAgent, Department, WorkflowField } from '../lib/fmsService'
import { canEditField, canViewField } from '../lib/permissions'
import { DynamicFieldRenderer } from './DynamicFieldRenderer'
import { evaluateDependencies } from '../lib/fieldBehavior'

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
  context?: any
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
  stageId,
  context
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
              return (
                <DynamicFieldRenderer
                  key={field.id}
                  field={field}
                  value={formData[field.field_key]}
                  disabled={!editable}
                  context={context}
                  onChange={(val) => {
                    const newFormData = { ...formData, [field.field_key]: val }
                    // Trigger dependency evaluation
                    evaluateDependencies(fields, newFormData, context)
                    setFormData(newFormData)
                  }}
                />
              )
            })
          )}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <span>Creating...</span>
              ) : (
                <>
                  <Plus size={16} />
                  <span>Create {isOutward ? 'Request' : 'Docket'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

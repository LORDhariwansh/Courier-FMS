import { useState, useEffect } from 'react'
import { ArrowRight, CheckCircle, X } from 'lucide-react'
import type { RecordWithDetails, WorkflowStage, WorkflowField } from '../lib/fmsService'
import { canEditField, canViewField } from '../lib/permissions'
import { DynamicFieldRenderer } from './DynamicFieldRenderer'
import { evaluateDependencies } from '../lib/fieldBehavior'

interface AdvanceStageModalProps {
  record: RecordWithDetails | null
  stages: WorkflowStage[]
  fields: WorkflowField[]
  isOpen: boolean
  onClose: () => void
  onAdvance: (recordId: string, currentStageId: string, nextStageId: string | null, notes: string, stageValues: Record<string, any>) => Promise<void>
  context?: any
}

export function AdvanceStageModal({
  record,
  stages,
  fields,
  isOpen,
  onClose,
  onAdvance,
  context
}: AdvanceStageModalProps) {
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (isOpen && record) {
      const meta = (typeof record.metadata === 'object' && record.metadata !== null) ? record.metadata as Record<string, any> : {}
      setFormData(meta)
      setNotes('')
    }
  }, [isOpen, record])

  if (!isOpen || !record) return null

  // Find current stage index and next stage
  const sortedStages = [...stages].sort((a, b) => a.stage_number - b.stage_number)
  const currentStageIndex = sortedStages.findIndex(s => s.id === record.current_stage_id)
  const currentStage = currentStageIndex >= 0 ? sortedStages[currentStageIndex] : null
  const nextStage = currentStageIndex >= 0 && currentStageIndex + 1 < sortedStages.length
    ? sortedStages[currentStageIndex + 1]
    : null

  const isFinalStage = !nextStage

  // Filter fields for current stage
  const currentStageFields = currentStage ? fields.filter(f => f.stage_id === currentStage.id) : []
  const visibleFields = currentStageFields.filter(f => !f.is_hidden && canViewField(record.workflow_id, currentStage?.id || '', f.id))
  visibleFields.sort((a, b) => a.display_order - b.display_order)

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault()
    if (!currentStage) return
    setLoading(true)
    try {
      await onAdvance(record!.id, currentStage.id, nextStage?.id || null, notes, formData)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <h2>Complete Stage {currentStage?.stage_number}: {currentStage?.stage_name}</h2>
            <p>
              Update record details and transition to {nextStage ? `Stage ${nextStage.stage_number}: ${nextStage.stage_name}` : 'Completion'}
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleConfirm} className="modal-form">
          {visibleFields.length > 0 && (
            <div className="stage-fields-section" style={{ paddingBottom: '16px', borderBottom: '1px solid #eee', marginBottom: '16px' }}>
              <h4 style={{ marginBottom: '12px', fontSize: '14px', color: '#555' }}>Stage Requirements</h4>
              {visibleFields.map(field => {
                const editable = !field.is_readonly && canEditField(record!.workflow_id, currentStage!.id, field.id)
                return (
                  <DynamicFieldRenderer
                    key={field.id}
                    field={field}
                    value={formData[field.field_key]}
                    disabled={!editable}
                    context={context}
                    onChange={(val) => {
                      const newFormData = { ...formData, [field.field_key]: val }
                      evaluateDependencies(fields, newFormData, context)
                      setFormData(newFormData)
                    }}
                  />
                )
              })}
            </div>
          )}

          <div className="form-group">
            <label>Transition Notes / Handoff Memo</label>
            <textarea
              rows={3}
              placeholder="e.g., Package inspected and transferred to delivery queue."
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          <div className="modal-actions" style={{ marginTop: 24 }}>
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className={`btn-primary ${isFinalStage ? 'btn-success' : ''}`} disabled={loading}>
              {loading ? (
                <span>Processing...</span>
              ) : isFinalStage ? (
                <>
                  <CheckCircle size={16} />
                  <span>Complete Workflow</span>
                </>
              ) : (
                <>
                  <span>Advance to Stage {nextStage.stage_number}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

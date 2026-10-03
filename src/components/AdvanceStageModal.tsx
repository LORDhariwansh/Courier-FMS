import { useState } from 'react'
import { ArrowRight, CheckCircle, X } from 'lucide-react'
import type { RecordWithDetails, WorkflowStage } from '../lib/fmsService'

interface AdvanceStageModalProps {
  record: RecordWithDetails | null
  stages: WorkflowStage[]
  isOpen: boolean
  onClose: () => void
  onAdvance: (recordId: string, currentStageId: string, nextStageId: string | null, notes: string) => Promise<void>
}

export function AdvanceStageModal({
  record,
  stages,
  isOpen,
  onClose,
  onAdvance,
}: AdvanceStageModalProps) {
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen || !record) return null

  // Find current stage index and next stage
  const sortedStages = [...stages].sort((a, b) => a.stage_number - b.stage_number)
  const currentStageIndex = sortedStages.findIndex(s => s.id === record.current_stage_id)
  const currentStage = currentStageIndex >= 0 ? sortedStages[currentStageIndex] : null
  const nextStage = currentStageIndex >= 0 && currentStageIndex + 1 < sortedStages.length
    ? sortedStages[currentStageIndex + 1]
    : null

  const isFinalStage = !nextStage

  async function handleConfirm() {
    if (!record || !record.current_stage_id) return
    setLoading(true)
    try {
      await onAdvance(record.id, record.current_stage_id, nextStage ? nextStage.id : null, notes)
      setNotes('')
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
            <h2>Advance Stage: Record #{record.record_number || '1'}</h2>
            <p>{record.item_description} · {record.courier_agent_name}</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="stage-transition-card">
          <div className="transition-step from">
            <span className="step-label">Current Stage</span>
            <strong>{currentStage ? `${currentStage.stage_number}. ${currentStage.stage_name}` : 'Initial Stage'}</strong>
            <small>Status: Active</small>
          </div>

          <div className="transition-arrow">
            <ArrowRight size={20} />
          </div>

          <div className="transition-step to">
            <span className="step-label">{isFinalStage ? 'Outcome' : 'Target Next Stage'}</span>
            <strong>{nextStage ? `${nextStage.stage_number}. ${nextStage.stage_name}` : 'Completed / Delivered'}</strong>
            <small>{isFinalStage ? 'Final stage sign-off' : `TAT: ${nextStage?.tat_hours || 24} hours`}</small>
          </div>
        </div>

        <div className="form-group" style={{ marginTop: '16px' }}>
          <label>Stage Completion Notes / Action Summary</label>
          <textarea
            rows={3}
            placeholder={
              isFinalStage
                ? 'e.g., Package received and acknowledged by recipient with digital sign.'
                : 'e.g., Manifest verified and handed over to logistics partner.'
            }
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>

        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={handleConfirm}
            disabled={loading}
          >
            {isFinalStage ? <CheckCircle size={16} /> : <ArrowRight size={16} />}
            <span>{loading ? 'Advancing…' : isFinalStage ? 'Complete Workflow' : 'Confirm & Move to Next Stage'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

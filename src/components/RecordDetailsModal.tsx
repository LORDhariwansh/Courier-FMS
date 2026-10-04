import { Check, Clock, X } from 'lucide-react'
import type { RecordWithDetails, WorkflowStage, WorkflowField } from '../lib/fmsService'
import { canViewField } from '../lib/permissions'

interface RecordDetailsModalProps {
  record: RecordWithDetails | null
  stages: WorkflowStage[]
  fields: WorkflowField[]
  isOpen: boolean
  onClose: () => void
}

export function RecordDetailsModal({
  record,
  stages,
  fields,
  isOpen,
  onClose,
}: RecordDetailsModalProps) {
  if (!isOpen || !record) return null

  const sortedStages = [...stages].sort((a, b) => a.stage_number - b.stage_number)
  const currentStageIndex = sortedStages.findIndex(s => s.id === record.current_stage_id)

  const meta = (typeof record.metadata === 'object' && record.metadata !== null)
    ? (record.metadata as Record<string, unknown>)
    : {}

  // Filter fields this user can view
  const visibleFields = fields.filter(f => !f.is_hidden && canViewField(record.workflow_id, f.stage_id || '', f.id))
  visibleFields.sort((a, b) => a.display_order - b.display_order)

  return (
    <div className="modal-backdrop">
      <div className="modal-card wide">
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2>Record #{record.display_record_number || record.record_number || 1}</h2>
              <span className={`status-pill ${record.status}`}>{record.status.toUpperCase()}</span>
            </div>
            <p>{record.item_description}</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="details-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {visibleFields.length > 0 ? (
            visibleFields.map(field => {
              const val = meta[field.field_key]
              if (val === undefined || val === null || val === '') return null
              return (
                <div className="detail-row" key={field.id}>
                  <span className="label" style={{ fontWeight: 'bold' }}>{field.field_label}:</span>
                  <span className="value">
                    {field.data_type === 'image' || field.data_type === 'file' 
                      ? <a href={String(val)} target="_blank" rel="noreferrer" style={{color: 'blue'}}>View {field.data_type}</a>
                      : String(val)}
                  </span>
                </div>
              )
            })
          ) : (
            <div className="details-section">
              <h4>Basic Info</h4>
              <p className="text-sm text-gray-500">Using fallback layout (no fields configured or access denied).</p>
              <div className="detail-row">
                <span className="label">Sender:</span>
                <span className="value">{record.sender_name}</span>
              </div>
              <div className="detail-row">
                <span className="label">Recipient:</span>
                <span className="value">{record.recipient_name}</span>
              </div>
            </div>
          )}
        </div>

        <div className="timeline-section">
          <h4><Clock size={15} /> Stage Flow Progress</h4>
          <div className="timeline-list">
            {sortedStages.map((st, i) => {
              const isPast = currentStageIndex > i || record.status === 'completed'
              const isCurrent = currentStageIndex === i && record.status !== 'completed'

              return (
                <div key={st.id} className={`timeline-item ${isPast ? 'done' : isCurrent ? 'current' : 'future'}`}>
                  <div className="timeline-marker">
                    {isPast ? <Check size={12} /> : <span>{st.stage_number}</span>}
                  </div>
                  <div className="timeline-body">
                    <div className="timeline-title-row">
                      <strong>Stage {st.stage_number}: {st.stage_name}</strong>
                      {isCurrent && <span className="current-badge">IN PROGRESS</span>}
                      {isPast && <span className="done-badge">COMPLETED</span>}
                    </div>
                    <p className="timeline-desc">{st.description || `TAT: ${st.tat_hours || 24}h target`}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

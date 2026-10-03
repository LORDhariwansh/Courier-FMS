import { Check, Clock, Truck, User, X } from 'lucide-react'
import type { RecordWithDetails, WorkflowStage } from '../lib/fmsService'

interface RecordDetailsModalProps {
  record: RecordWithDetails | null
  stages: WorkflowStage[]
  isOpen: boolean
  onClose: () => void
}

export function RecordDetailsModal({
  record,
  stages,
  isOpen,
  onClose,
}: RecordDetailsModalProps) {
  if (!isOpen || !record) return null

  const sortedStages = [...stages].sort((a, b) => a.stage_number - b.stage_number)
  const currentStageIndex = sortedStages.findIndex(s => s.id === record.current_stage_id)

  const meta = (typeof record.metadata === 'object' && record.metadata !== null)
    ? (record.metadata as Record<string, unknown>)
    : {}

  return (
    <div className="modal-backdrop">
      <div className="modal-card wide">
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2>Record #{record.record_number || 1}</h2>
              <span className={`status-pill ${record.status}`}>{record.status.toUpperCase()}</span>
            </div>
            <p>{record.item_description}</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="details-grid">
          <div className="details-section">
            <h4><User size={15} /> Personnel & Location</h4>
            <div className="detail-row">
              <span className="label">Sender / Dept:</span>
              <span className="value">{record.sender_name} ({record.department_name})</span>
            </div>
            <div className="detail-row">
              <span className="label">Recipient:</span>
              <span className="value">{record.recipient_name}</span>
            </div>
            {Boolean(meta.recipient_address) && (
              <div className="detail-row">
                <span className="label">Destination:</span>
                <span className="value">{String(meta.recipient_address)}</span>
              </div>
            )}
          </div>

          <div className="details-section">
            <h4><Truck size={15} /> Courier Logistics</h4>
            <div className="detail-row">
              <span className="label">Carrier:</span>
              <span className="value">{record.courier_agent_name}</span>
            </div>
            <div className="detail-row">
              <span className="label">Tracking / Docket:</span>
              <span className="value font-mono">{record.tracking_number || 'Awaiting assignment'}</span>
            </div>
            {Boolean(meta.package_weight) && (
              <div className="detail-row">
                <span className="label">Weight / Units:</span>
                <span className="value">{String(meta.package_weight)}</span>
              </div>
            )}
          </div>
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

        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

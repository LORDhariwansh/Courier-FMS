import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import type { CourierAgent, Department } from '../lib/fmsService'

interface CreateRecordModalProps {
  workflowType: 'outward' | 'inward'
  isOpen: boolean
  onClose: () => void
  onSubmit: (formData: RecordFormValues) => Promise<void>
  courierAgents: CourierAgent[]
  departments: Department[]
}

export interface RecordFormValues {
  sender_name: string
  recipient_name: string
  recipient_address: string
  department_name: string
  courier_agent_name: string
  tracking_number: string
  item_description: string
  package_weight: string
  notes: string
}

export function CreateRecordModal({
  workflowType,
  isOpen,
  onClose,
  onSubmit,
  courierAgents,
  departments,
}: CreateRecordModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<RecordFormValues>({
    sender_name: '',
    recipient_name: '',
    recipient_address: '',
    department_name: departments[0]?.name || 'Operations',
    courier_agent_name: courierAgents[0]?.name || 'Blue Dart Express',
    tracking_number: '',
    item_description: 'Legal & Business Documents',
    package_weight: '0.5 kg',
    notes: '',
  })

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
          <div className="form-row">
            <div className="form-group">
              <label>{isOutward ? 'Sender / Originator *' : 'Sender / Vendor *'}</label>
              <input
                type="text"
                required
                placeholder={isOutward ? 'e.g., Harivansh (Finance)' : 'e.g., ABC Suppliers Ltd.'}
                value={formData.sender_name}
                onChange={e => setFormData({ ...formData, sender_name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>{isOutward ? 'Recipient Name / Client *' : 'Internal Recipient *'}</label>
              <input
                type="text"
                required
                placeholder={isOutward ? 'e.g., Tata Motors Logistics' : 'e.g., Accounts Dept'}
                value={formData.recipient_name}
                onChange={e => setFormData({ ...formData, recipient_name: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Department *</label>
              <select
                value={formData.department_name}
                onChange={e => setFormData({ ...formData, department_name: e.target.value })}
              >
                {departments.length > 0 ? (
                  departments.map(d => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Administration & Facilities">Administration & Facilities</option>
                    <option value="Finance & Accounts">Finance & Accounts</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Legal & Compliance">Legal & Compliance</option>
                    <option value="Operations & Procurement">Operations & Procurement</option>
                  </>
                )}
              </select>
            </div>

            <div className="form-group">
              <label>Courier Carrier / Partner *</label>
              <select
                value={formData.courier_agent_name}
                onChange={e => setFormData({ ...formData, courier_agent_name: e.target.value })}
              >
                {courierAgents.length > 0 ? (
                  courierAgents.map(a => (
                    <option key={a.id} value={a.name}>
                      {a.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Blue Dart Express">Blue Dart Express</option>
                    <option value="DTDC Courier">DTDC Courier</option>
                    <option value="DHL Express">DHL Express</option>
                    <option value="Delhivery">Delhivery</option>
                    <option value="India Post (Speed Post)">India Post (Speed Post)</option>
                    <option value="FedEx India">FedEx India</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Docket / AWB / Tracking #</label>
              <input
                type="text"
                placeholder="e.g., BD-984729103"
                value={formData.tracking_number}
                onChange={e => setFormData({ ...formData, tracking_number: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Package Weight / Quantity</label>
              <input
                type="text"
                placeholder="e.g., 0.5 kg (1 envelope)"
                value={formData.package_weight}
                onChange={e => setFormData({ ...formData, package_weight: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Destination / Delivery Address</label>
            <input
              type="text"
              placeholder="e.g., Unit 402, Trade Tower, Bandra Kurla Complex, Mumbai"
              value={formData.recipient_address}
              onChange={e => setFormData({ ...formData, recipient_address: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Material / Contents Description *</label>
            <input
              type="text"
              required
              placeholder="e.g., Signed Agreement Deeds & Cheque"
              value={formData.item_description}
              onChange={e => setFormData({ ...formData, item_description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Instructions / Dispatch Notes</label>
            <textarea
              rows={2}
              placeholder="e.g., Deliver before 5 PM, urgent priority"
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              <Plus size={16} />
              <span>{loading ? 'Creating Record…' : 'Submit Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

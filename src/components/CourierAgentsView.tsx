import { useState } from 'react'
import { Mail, Phone, Plus, ShieldCheck, Truck } from 'lucide-react'
import type { CourierAgent } from '../lib/fmsService'
import { supabase } from '../lib/supabase'

interface CourierAgentsViewProps {
  agents: CourierAgent[]
  onRefresh: () => void
}

export function CourierAgentsView({ agents, onRefresh }: CourierAgentsViewProps) {
  const [showAdd, setShowAdd] = useState(false)
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleAddAgent(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase || !name.trim()) return
    setLoading(true)
    try {
      await supabase.from('courier_agents').insert({
        name: name.trim(),
        contact_number: contact.trim() || null,
        email: email.trim() || null,
        is_active: true,
      })
      setName('')
      setContact('')
      setEmail('')
      setShowAdd(false)
      onRefresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="agents-view-wrap">
      <div className="section-header-row">
        <div>
          <h2>Courier Logistics Partners</h2>
          <p>Approved carriers and delivery providers configured in Courier FMS.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(!showAdd)}>
          <Plus size={16} />
          <span>Add Courier Partner</span>
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAddAgent} className="add-partner-card">
          <h3>Add New Logistics Partner</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Partner / Agency Name *</label>
              <input
                type="text"
                required
                placeholder="e.g., Trackon Couriers"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Support Contact Number</label>
              <input
                type="text"
                placeholder="e.g., +91 1800 123 4567"
                value={contact}
                onChange={e => setContact(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Support Email Address</label>
              <input
                type="email"
                placeholder="e.g., support@carrier.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="modal-actions" style={{ marginTop: '12px' }}>
            <button type="button" className="btn-secondary" onClick={() => setShowAdd(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving…' : 'Save Partner'}
            </button>
          </div>
        </form>
      )}

      <div className="agents-grid">
        {agents.map(a => (
          <div key={a.id} className="agent-card">
            <div className="agent-card-top">
              <div className="agent-icon">
                <Truck size={18} />
              </div>
              <span className="agent-status-pill">
                <span className="dot" />
                Active Carrier
              </span>
            </div>
            <h3>{a.name}</h3>
            <div className="agent-contact-list">
              <div className="contact-item">
                <Phone size={13} />
                <span>{a.contact_number || 'No phone provided'}</span>
              </div>
              <div className="contact-item">
                <Mail size={13} />
                <span>{a.email || 'No email registered'}</span>
              </div>
            </div>
            <div className="agent-card-footer">
              <ShieldCheck size={14} />
              <span>Verified Supabase Master Record</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

import { CheckCircle2, Clock, Package, TrendingUp } from 'lucide-react'

interface StatsCardsProps {
  total: number
  active: number
  completed: number
  overdue: number
}

export function StatsCards({ total, active, completed, overdue }: StatsCardsProps) {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon blue">
          <Package size={20} />
        </div>
        <div className="stat-content">
          <span className="stat-label">Total Shipments</span>
          <span className="stat-value">{total}</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon amber">
          <TrendingUp size={20} />
        </div>
        <div className="stat-content">
          <span className="stat-label">Active In-Flow</span>
          <span className="stat-value">{active}</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon green">
          <CheckCircle2 size={20} />
        </div>
        <div className="stat-content">
          <span className="stat-label">Completed / Delivered</span>
          <span className="stat-value">{completed}</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon purple">
          <Clock size={20} />
        </div>
        <div className="stat-content">
          <span className="stat-label">Action Pending</span>
          <span className="stat-value">{overdue}</span>
        </div>
      </div>
    </div>
  )
}

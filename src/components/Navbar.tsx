import { Boxes, LogOut, PackageCheck, RefreshCw, Settings, Truck, Users } from 'lucide-react'

interface NavbarProps {
  activeTab: 'outward' | 'inward' | 'agents' | 'setup'
  onSelectTab: (tab: 'outward' | 'inward' | 'agents' | 'setup') => void
  userEmail: string
  onSignOut: () => void
  onRefresh?: () => void
  refreshing?: boolean
}

export function Navbar({ activeTab, onSelectTab, userEmail, onSignOut, onRefresh, refreshing }: NavbarProps) {
  return (
    <header className="fms-header">
      <div className="fms-header-brand">
        <div className="brand-icon">
          <Boxes size={22} />
        </div>
        <div>
          <b>Courier FMS</b>
          <small>FLOW MANAGEMENT SYSTEM</small>
        </div>
      </div>

      <nav className="fms-nav-tabs">
        <button
          className={`fms-tab-btn ${activeTab === 'outward' ? 'active' : ''}`}
          onClick={() => onSelectTab('outward')}
        >
          <Truck size={16} />
          <span>Outward Courier</span>
          <span className="tab-pill">7 Stages</span>
        </button>

        <button
          className={`fms-tab-btn ${activeTab === 'inward' ? 'active' : ''}`}
          onClick={() => onSelectTab('inward')}
        >
          <PackageCheck size={16} />
          <span>Inward Tracking</span>
          <span className="tab-pill">3 Stages</span>
        </button>

        <button
          className={`fms-tab-btn ${activeTab === 'agents' ? 'active' : ''}`}
          onClick={() => onSelectTab('agents')}
        >
          <Users size={16} />
          <span>Courier Partners</span>
        </button>

        <button
          className={`fms-tab-btn ${activeTab === 'setup' ? 'active' : ''}`}
          onClick={() => onSelectTab('setup')}
        >
          <Settings size={16} />
          <span>Database Setup</span>
        </button>
      </nav>

      <div className="fms-header-user">
        {onRefresh && (
          <button
            className="signout-btn"
            onClick={onRefresh}
            title="Refresh Data"
            disabled={refreshing}
            style={{ color: '#2563eb' }}
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            <span>{refreshing ? 'Syncing…' : 'Sync'}</span>
          </button>
        )}
        <div className="user-badge" title={userEmail}>
          <span className="user-avatar">{userEmail.charAt(0).toUpperCase()}</span>
          <span className="user-email">{userEmail}</span>
        </div>
        <button className="signout-btn" onClick={onSignOut} title="Sign Out">
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  )
}

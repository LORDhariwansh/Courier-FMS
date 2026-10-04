import { LayoutDashboard, Truck, PackageCheck, ListTodo, FileText, AlertCircle, Clock, CheckCircle2, Users, FileStack, Settings, LogOut, Search, Bell } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
  activeTab: string
  setActiveTab: (tab: string) => void
  userEmail: string
  onSignOut: () => void
  onNewRequest?: () => void
}

export function EnterpriseLayout({ children, activeTab, setActiveTab, userEmail, onSignOut, onNewRequest }: LayoutProps) {
  return (
    <div className="flex h-screen w-full bg-[#f8fafc] text-slate-900 overflow-hidden font-sans">
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 shrink-0">
          <Truck className="text-blue-500 mr-3" size={24} />
          <div className="flex flex-col">
            <span className="font-bold text-white tracking-wide text-sm">FMS PLATFORM</span>
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Operations Center</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-thin">
          
          <div className="space-y-2">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">Overview</div>
            <SidebarItem icon={LayoutDashboard} label="Dashboard" isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          </div>

          <div className="space-y-2">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">Operations</div>
            <SidebarItem icon={Truck} label="Outward Courier" isActive={activeTab === 'outward'} onClick={() => setActiveTab('outward')} />
            <SidebarItem icon={PackageCheck} label="Inward Courier" isActive={activeTab === 'inward'} onClick={() => setActiveTab('inward')} />
          </div>

          <div className="space-y-2">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">Workflow</div>
            <SidebarItem icon={ListTodo} label="My Tasks" isActive={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} />
            <SidebarItem icon={AlertCircle} label="Delayed" isActive={activeTab === 'delayed'} onClick={() => setActiveTab('delayed')} badge="4" badgeColor="bg-red-500" />
            <SidebarItem icon={Clock} label="Due Soon" isActive={activeTab === 'due_soon'} onClick={() => setActiveTab('due_soon')} badge="12" badgeColor="bg-amber-500" />
            <SidebarItem icon={CheckCircle2} label="Completed" isActive={activeTab === 'completed'} onClick={() => setActiveTab('completed')} />
          </div>

          <div className="space-y-2">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">Master Data</div>
            <SidebarItem icon={Users} label="Courier Agents" isActive={activeTab === 'agents'} onClick={() => setActiveTab('agents')} />
            <SidebarItem icon={Users} label="Customers" isActive={activeTab === 'customers'} onClick={() => setActiveTab('customers')} />
            <SidebarItem icon={FileStack} label="Materials" isActive={activeTab === 'materials'} onClick={() => setActiveTab('materials')} />
          </div>

          <div className="space-y-2">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">Admin</div>
            <SidebarItem icon={Settings} label="Workflow Builder" isActive={activeTab === 'setup'} onClick={() => setActiveTab('setup')} />
            <SidebarItem icon={FileText} label="Reports" isActive={activeTab === 'reports'} onClick={() => setActiveTab('reports')} />
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 shrink-0">
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-blue-400 font-bold text-xs">
              {userEmail.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs text-white truncate">{userEmail}</span>
              <span className="text-[10px] text-slate-500">Administrator</span>
            </div>
          </div>
          <button onClick={onSignOut} className="w-full flex items-center gap-3 px-2 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors">
            <LogOut size={16} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* RIGHT CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOP HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 shadow-sm">
          <div className="flex items-center text-slate-400">
            <Search size={20} className="mr-3" />
            <input 
              type="text" 
              placeholder="Search records, tracking numbers, customers..." 
              className="bg-transparent border-none outline-none text-sm w-96 text-slate-700 placeholder-slate-400"
            />
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <button 
              onClick={onNewRequest}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors"
            >
              + New Request
            </button>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-8 scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  )
}

function SidebarItem({ icon: Icon, label, isActive, onClick, badge, badgeColor }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
        isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} className={isActive ? 'text-white' : 'text-slate-500'} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      {badge && (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${badgeColor}`}>
          {badge}
        </span>
      )}
    </button>
  )
}

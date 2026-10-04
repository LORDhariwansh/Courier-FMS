import { useState, useEffect, useRef } from 'react'
import { fetchDropdownOptions, DropdownOption, KNOWN_TABLES } from '../services/dropdownService'
import { Search, ChevronDown, X } from 'lucide-react'

interface SearchableSupabaseSelectProps {
  sourceTable: string
  value: any
  onChange: (value: any, metadata?: any) => void
  disabled?: boolean
  required?: boolean
  dependencyFilter?: { column: string, value: any }
  placeholder?: string
}

export function SearchableSupabaseSelect({
  sourceTable,
  value,
  onChange,
  disabled,
  required,
  dependencyFilter,
  placeholder = "Search..."
}: SearchableSupabaseSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [options, setOptions] = useState<DropdownOption[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(null)
  
  const containerRef = useRef<HTMLDivElement>(null)

  // Fetch selected value label on initial load
  useEffect(() => {
    if (value && !selectedOption && !disabled) {
      // If we have a value but no selectedOption, we should fetch it
      const loadInitialValue = async () => {
        const config = KNOWN_TABLES[sourceTable]
        if (!config) return
        import('../lib/supabase').then(async ({ supabase }) => {
          if (!supabase) return
          const { data } = await supabase.from(config.source_table as any).select('*').eq(config.value_column, value).single()
          if (data) {
            setSelectedOption({
              id: (data as any)[config.value_column],
              label: (data as any)[config.label_column],
              metadata: data
            })
          }
        })
      }
      loadInitialValue()
    }
  }, [value, sourceTable, disabled])

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Debounced Search
  useEffect(() => {
    if (!isOpen) return
    const timer = setTimeout(() => {
      setLoading(true)
      fetchDropdownOptions(sourceTable, searchTerm, dependencyFilter)
        .then(res => setOptions(res))
        .finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm, isOpen, sourceTable, dependencyFilter])

  const handleSelect = (opt: DropdownOption) => {
    setSelectedOption(opt)
    setIsOpen(false)
    setSearchTerm('')
    onChange(opt.id, opt.metadata)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedOption(null)
    onChange(null)
  }

  return (
    <div className="relative" ref={containerRef}>
      <div 
        className={`flex items-center justify-between p-2 border rounded-md cursor-pointer bg-white ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'border-gray-300 hover:border-gray-400'}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="truncate">
          {selectedOption ? selectedOption.label : <span className="text-gray-400">{placeholder}</span>}
        </div>
        <div className="flex items-center gap-1">
          {selectedOption && !disabled && (
            <X size={14} className="text-gray-400 hover:text-gray-600" onClick={handleClear} />
          )}
          <ChevronDown size={16} className="text-gray-400" />
        </div>
      </div>

      {/* Hidden input for HTML required validation */}
      <input type="text" className="opacity-0 absolute w-0 h-0 pointer-events-none" required={required} value={value || ''} readOnly />

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 flex flex-col">
          <div className="p-2 border-b border-gray-100 flex items-center gap-2">
            <Search size={14} className="text-gray-400" />
            <input 
              type="text" 
              className="w-full text-sm outline-none"
              placeholder="Type to search..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <div className="overflow-y-auto p-1">
            {loading ? (
              <div className="p-2 text-sm text-gray-500 text-center">Loading...</div>
            ) : options.length === 0 ? (
              <div className="p-2 text-sm text-gray-500 text-center">No matching records</div>
            ) : (
              options.map(opt => (
                <div 
                  key={opt.id}
                  className="p-2 text-sm hover:bg-slate-50 cursor-pointer rounded-md truncate"
                  onClick={() => handleSelect(opt)}
                >
                  {opt.label}
                  {opt.metadata?.contact_number && <div className="text-xs text-gray-400">{opt.metadata.contact_number}</div>}
                  {opt.metadata?.department && <div className="text-xs text-gray-400">{opt.metadata.department}</div>}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

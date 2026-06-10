import { useState, useRef, useEffect } from 'react'
import { MultiSelectFilter } from './MultiSelectFilter'

function FilterIcon() {
    return (
        <svg className="filter-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
        </svg>
    )
}

export function GlobalFilterPanel({
    columns,
    columnFilters,
    onFilterChange,
    onResetFilters,
    hasActiveFilters
}) {
    const [isOpen, setIsOpen] = useState(false)
    const panelRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="global-filter-container" ref={panelRef} style={{ position: 'relative' }}>
            <button 
                className={`global-filter-btn ${hasActiveFilters ? 'active' : ''} ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                title="Global Filters"
            >
                <FilterIcon />
                {hasActiveFilters && <span className="global-filter-badge"></span>}
            </button>

            {isOpen && (
                <div className="global-filter-popover" style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--slate-200)',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-lg)',
                    width: '260px',
                    zIndex: 100,
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <h3 style={{ margin: 0, fontSize: '14px', color: '#1f2937', fontWeight: 600 }}>Filters</h3>
                        {hasActiveFilters && (
                            <button 
                                onClick={onResetFilters} 
                                style={{ background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', fontSize: '12px', fontWeight: 500, padding: 0 }}
                            >
                                Reset All
                            </button>
                        )}
                    </div>
                    
                    <div className="global-filter-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {columns.map(col => (
                            <div key={col.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '13px', color: '#4b5563', fontWeight: 500 }}>{col.title}</span>
                                <MultiSelectFilter 
                                    title={col.title}
                                    options={col.options}
                                    selectedValues={columnFilters[col.key] || []}
                                    onChange={(val) => onFilterChange(col.key, val)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

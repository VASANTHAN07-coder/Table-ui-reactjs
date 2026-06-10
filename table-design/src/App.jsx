import { useState, useEffect } from 'react'
import './App.css'
import { useDevices } from './hooks/useDevices'
import { MultiSelectFilter } from './components/MultiSelectFilter'
import { GlobalFilterPanel } from './components/GlobalFilterPanel'

// Simple vector search icon component
function SearchIcon() {
    return (
        <svg className="search-svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
    )
}

function App() {
    const { devices: allDevices, loading, error, refetch } = useDevices()
    const [globalSearch, setGlobalSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    const [columnSearches, setColumnSearches] = useState({
        name: '',
        type: '',
        location: '',
        assigned_to: '',
        status: '',
        condition: ''
    })

    const [columnFilters, setColumnFilters] = useState({
        name: [],
        type: [],
        location: [],
        assigned_to: [],
        status: [],
        condition: []
    })

    useEffect(() => {
        setCurrentPage(1)
    }, [globalSearch, columnSearches, columnFilters, pageSize])

    const handleSearchChange = (key, value) => {
        setColumnSearches(prev => ({
            ...prev,
            [key]: value
        }))
    }

    const handleFilterChange = (key, value) => {
        setColumnFilters(prev => ({
            ...prev,
            [key]: value
        }))
    }

    const handleResetFilters = () => {
        setGlobalSearch('')
        setColumnSearches({
            name: '',
            type: '',
            location: '',
            assigned_to: '',
            status: '',
            condition: ''
        })
        setColumnFilters({
            name: [],
            type: [],
            location: [],
            assigned_to: [],
            status: [],
            condition: []
        })
    }

    const hasActiveFilters = globalSearch !== '' || 
        Object.values(columnSearches).some(v => v !== '') || 
        Object.values(columnFilters).some(v => v.length > 0)

    
    const filteredDevices = allDevices.filter(device => {
        
        const matchesGlobal = globalSearch === '' || [
            device.name, device.type, device.location, device.assigned_to, device.status, device.condition
        ].some(val => (val || '').toString().toLowerCase().includes(globalSearch.toLowerCase()))

        if (!matchesGlobal) return false

        return Object.keys(columnSearches).every(key => {
            const searchValue = (columnSearches[key] || '').toLowerCase()
            const filterValue = columnFilters[key] || []
            
            const itemValue = (device[key] || '').toString()
            
            const matchesSearch = itemValue.toLowerCase().includes(searchValue)
            const matchesFilter = filterValue.length === 0 || filterValue.includes(itemValue)
            
            return matchesSearch && matchesFilter
        })
    })

    
    const totalItems = filteredDevices.length
    const totalPages = Math.ceil(totalItems / pageSize)
    const paginatedDevices = filteredDevices.slice((currentPage - 1) * pageSize, currentPage * pageSize)

    const getUniqueValues = (key) => {
        const values = allDevices.map(d => d[key]).filter(Boolean)
        return [...new Set(values)].sort()
    }

    const startIdx = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
    const endIdx = Math.min(currentPage * pageSize, totalItems)

    return (
               <div className="container">
        
            <div className="table-header-toolbar">
                <centre>

                <div className="toolbar-left">
                    <h2>Device Inventory</h2>
                    <p className="toolbar-count">
                        Showing <strong>{startIdx}-{endIdx}</strong> of <strong>{totalItems}</strong> items
                    </p>
                </div>
                </centre>
                <div className="toolbar-right">
                    
                    <div className={`search-wrapper-expandable ${globalSearch ? 'has-content' : ''}`}>
                        <span className="search-icon-trigger"><SearchIcon /></span>
                        <input 
                            type="text" 
                            placeholder="Type to search..."
                            value={globalSearch}
                            onChange={(e) => setGlobalSearch(e.target.value)}
                            className="expandable-search-input"
                        />
                        {globalSearch && (
                            <button className="clear-search-btn" onClick={() => setGlobalSearch('')}>×</button>
                        )}
                    </div>

                    <GlobalFilterPanel 
                        columns={[
                            { key: 'name', title: 'Name', options: getUniqueValues('name') },
                            { key: 'type', title: 'Type', options: getUniqueValues('type') },
                            { key: 'location', title: 'Location', options: getUniqueValues('location') },
                            { key: 'assigned_to', title: 'Assignee', options: getUniqueValues('assigned_to') },
                            { key: 'status', title: 'Status', options: getUniqueValues('status') },
                            { key: 'condition', title: 'Condition', options: getUniqueValues('condition') }
                        ]}
                        columnFilters={columnFilters}
                        onFilterChange={handleFilterChange}
                        onResetFilters={handleResetFilters}
                        hasActiveFilters={Object.values(columnFilters).some(v => v.length > 0)}
                    />

            
                    {hasActiveFilters && (
                        <button className="reset-all-btn-mini" onClick={handleResetFilters} title="Reset all ">
                         Reset
                        </button>
                    )}
                </div>
            </div>

        
            


                <div className="table-card-wrapper">
                    <div className="table-scroll-container">
                        <table className="inventory-table">
                            <thead>
                                <tr>
                                    <th>
                                        <div className="th-header-wrapper">
                                            <span className="th-title">
                                                Device Name
                                                
                                            </span>
                                            <div className="th-actions">
                                                <div className={`th-search-container ${columnSearches.name ? 'has-value' : ''}`}>
                                                    <span className="th-search-icon"><SearchIcon /></span>
                                                    <input 
                                                        type="text" 
                                                        placeholder="Search..."
                                                        value={columnSearches.name}
                                                        onChange={(e) => handleSearchChange('name', e.target.value)}
                                                        className="th-search-input"
                                                    />
                                                </div>
                                                <MultiSelectFilter 
                                                    title="Name"
                                                    options={getUniqueValues('name')}
                                                    selectedValues={columnFilters.name}
                                                    onChange={(val) => handleFilterChange('name', val)}
                                                />
                                            </div>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="th-header-wrapper">
                                            <span className="th-title">
                                                Type
                                            </span>
                                            <div className="th-actions">
                                                <div className={`th-search-container ${columnSearches.type ? 'has-value' : ''}`}>
                                                    <span className="th-search-icon"><SearchIcon /></span>
                                                    <input 
                                                        type="text" 
                                                        placeholder="Search..."
                                                        value={columnSearches.type}
                                                        onChange={(e) => handleSearchChange('type', e.target.value)}
                                                        className="th-search-input"
                                                    />
                                                </div>
                                                <MultiSelectFilter 
                                                    title="Type"
                                                    options={getUniqueValues('type')}
                                                    selectedValues={columnFilters.type}
                                                    onChange={(val) => handleFilterChange('type', val)}
                                                />
                                            </div>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="th-header-wrapper">
                                            <span className="th-title">
                                                Location
                                            </span>
                                            <div className="th-actions">
                                                <div className={`th-search-container ${columnSearches.location ? 'has-value' : ''}`}>
                                                    <span className="th-search-icon"><SearchIcon /></span>
                                                    <input 
                                                        type="text" 
                                                        placeholder="Search..."
                                                        value={columnSearches.location}
                                                        onChange={(e) => handleSearchChange('location', e.target.value)}
                                                        className="th-search-input"
                                                    />
                                                </div>
                                                <MultiSelectFilter 
                                                    title="Location"
                                                    options={getUniqueValues('location')}
                                                    selectedValues={columnFilters.location}
                                                    onChange={(val) => handleFilterChange('location', val)}
                                                />
                                            </div>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="th-header-wrapper">
                                            <span className="th-title">
                                                Assigned To
                                            </span>
                                            <div className="th-actions">
                                                <div className={`th-search-container ${columnSearches.assigned_to ? 'has-value' : ''}`}>
                                                    <span className="th-search-icon"><SearchIcon /></span>
                                                    <input 
                                                        type="text" 
                                                        placeholder="Search..."
                                                        value={columnSearches.assigned_to}
                                                        onChange={(e) => handleSearchChange('assigned_to', e.target.value)}
                                                        className="th-search-input"
                                                    />
                                                </div>
                                                <MultiSelectFilter 
                                                    title="Assignee"
                                                    options={getUniqueValues('assigned_to')}
                                                    selectedValues={columnFilters.assigned_to}
                                                    onChange={(val) => handleFilterChange('assigned_to', val)}
                                                />
                                            </div>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="th-header-wrapper">
                                            <span className="th-title">
                                                Status
                                            </span>
                                            <div className="th-actions">
                                                <div className={`th-search-container ${columnSearches.status ? 'has-value' : ''}`}>
                                                    <span className="th-search-icon"><SearchIcon /></span>
                                                    <input 
                                                        type="text" 
                                                        placeholder="Search..."
                                                        value={columnSearches.status}
                                                        onChange={(e) => handleSearchChange('status', e.target.value)}
                                                        className="th-search-input"
                                                    />
                                                </div>
                                                <MultiSelectFilter 
                                                    title="Status"
                                                    options={getUniqueValues('status')}
                                                    selectedValues={columnFilters.status}
                                                    onChange={(val) => handleFilterChange('status', val)}
                                                />
                                            </div>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="th-header-wrapper">
                                            <span className="th-title">
                                                Condition
                                            </span>
                                            <div className="th-actions">
                                                <div className={`th-search-container ${columnSearches.condition ? 'has-value' : ''}`}>
                                                    <span className="th-search-icon"><SearchIcon /></span>
                                                    <input 
                                                        type="text" 
                                                        placeholder="Search..."
                                                        value={columnSearches.condition}
                                                        onChange={(e) => handleSearchChange('condition', e.target.value)}
                                                        className="th-search-input"
                                                    />
                                                </div>
                                                <MultiSelectFilter 
                                                    title="Condition"
                                                    options={getUniqueValues('condition')}
                                                    selectedValues={columnFilters.condition}
                                                    onChange={(val) => handleFilterChange('condition', val)}
                                                />
                                            </div>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    Array.from({ length: pageSize }).map((_, idx) => (
                                        <tr key={`skeleton-${idx}`} className="skeleton-row">
                                            <td colSpan="6">
                                                <div className="skeleton-line-wrapper">
                                                    <div className="skeleton-pulse skeleton-avatar"></div>
                                                    <div className="skeleton-pulse skeleton-text width-40"></div>
                                                    <div className="skeleton-pulse skeleton-text width-15"></div>
                                                    <div className="skeleton-pulse skeleton-text width-15"></div>
                                                    <div className="skeleton-pulse skeleton-text width-10"></div>
                                                    <div className="skeleton-pulse skeleton-badge"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : paginatedDevices.length > 0 ? (
                                    paginatedDevices.map((device) => (
                                        <tr key={device.id} className="table-data-row">
                                            <td>
                                                <div className="device-cell-info">
                                                    
                                                    <span>{device.name}</span>
                                                </div>
                                            </td>
                                            <td>
                                                {device.type}
                                            </td>
                                            <td>{device.location}</td>
                                            <td>{device.assigned_to}</td>
                                            <td>{device.status}</td>
                                            <td>{device.condition}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="no-results-td">
                                            <div className="no-results-container">
                                                
                                                <h3><center>No devices found</center></h3>
                                                
                                                
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    
                    {!loading && totalItems > 0 && (
                        <div className="pagination-footer">
                            <div className="pagination-info">
                                Showing <strong>{startIdx}</strong> to <strong>{endIdx}</strong> of <strong>{totalItems}</strong> devices
                                {totalItems !== allDevices.length && ` (filtered from ${allDevices.length} total)`}
                            </div>
                            <div className="pagination-nav">
                                <button 
                                    className="page-nav-btn" 
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    ◀ Prev
                                </button>
                                
                                <div className="page-numbers">
                                    {Array.from({ length: totalPages }).map((_, idx) => {
                                        const pageNum = idx + 1
                                        return (
                                            <button 
                                                key={`page-${pageNum}`}
                                                className={`page-num-btn ${currentPage === pageNum ? 'active' : ''}`}
                                                onClick={() => setCurrentPage(pageNum)}
                                            >
                                                {pageNum}
                                            </button>
                                        )
                                    })}
                                </div>

                                <button 
                                    className="page-nav-btn" 
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                >
                                    Next ▶
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            
        </div>
    )
}

export default App

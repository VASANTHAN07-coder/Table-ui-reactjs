import { useState, useEffect, useRef } from 'react'

export function MultiSelectFilter({ title, options, selectedValues, onChange }) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const dropdownRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleToggleOption = (option) => {
        const isSelected = selectedValues.includes(option)
        let newSelected
        if (isSelected) {
            newSelected = selectedValues.filter(val => val !== option)
        } else {
            newSelected = [...selectedValues, option]
        }
        onChange(newSelected)
    }

    const handleClearAll = () => {
        onChange([])
    }

    const handleSelectAll = () => {
        onChange([...options])
    }

    const filteredOptions = options.filter(opt => 
        (opt || '').toString().toLowerCase().includes(searchTerm.toLowerCase())
    )

    const isAllSelected = options.length > 0 && selectedValues.length === options.length

    return (
        <div className="multiselect-dropdown" ref={dropdownRef}>
            <button 
                type="button"
                className={`multiselect-btn ${selectedValues.length > 0 ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                title={`Filter by ${title}`}
            >
                <svg className="filter-svg" width="12" height="12" viewBox="0 0 24 24" fill={selectedValues.length > 0 ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                {selectedValues.length > 0 && <span className="filter-count-badge">{selectedValues.length}</span>}
            </button>

            {isOpen && (
                <div className="multiselect-popover">
                    <div className="multiselect-search-wrapper">
                        <input 
                            type="text"
                            className="multiselect-search-input"
                            placeholder={`Search ${title}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    <div className="multiselect-actions">
                        {selectedValues.length > 0 ? (
                            <button type="button" className="multiselect-action-link" onClick={handleClearAll}>
                                Clear All
                            </button>
                        ) : null}
                        {!isAllSelected && options.length > 0 && (
                            <button 
                                type="button" 
                                className="multiselect-action-link" 
                                onClick={handleSelectAll}
                                style={{ marginLeft: selectedValues.length > 0 ? 'auto' : '0' }}
                            >
                                Select All
                            </button>
                        )}
                    </div>

                    <div className="multiselect-options-list">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => {
                                const isChecked = selectedValues.includes(option)
                                return (
                                    <label key={option} className="multiselect-option-label" onClick={(e) => e.stopPropagation()}>
                                        <input 
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => handleToggleOption(option)}
                                            className="multiselect-checkbox"
                                        />
                                        <span className="multiselect-option-text">{option}</span>
                                    </label>
                                )
                            })
                        ) : (
                            <div className="multiselect-no-options">No matches found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

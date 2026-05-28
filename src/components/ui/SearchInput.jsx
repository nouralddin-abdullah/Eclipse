import { Search } from 'lucide-react'

const SearchInput = ({ value, onChange, placeholder = 'Search...', className = '' }) => {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search
        size={18}
        className="absolute left-3 text-muted pointer-events-none"
      />
      <input
        id="search-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-surface border border-edge rounded-sm text-foreground placeholder:text-muted pl-10 pr-4 py-2.5 transition-colors duration-200 focus:border-edge-hover focus:outline-none"
      />
    </div>
  )
}

export default SearchInput

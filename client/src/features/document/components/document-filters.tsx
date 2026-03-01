import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface DocumentFiltersProps {
    searchQuery: string
    onSearchChange: (query: string) => void
    sortBy: 'recent' | 'alphabetical' | 'oldest'
    onSortChange: (sort: 'recent' | 'alphabetical' | 'oldest') => void
}

export default function DocumentFilters({ searchQuery, onSearchChange, sortBy, onSortChange }: DocumentFiltersProps) {
    return (
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 sm:max-w-md">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search documents, owners..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 text-sm text-foreground"
                />
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
                <select
                    value={sortBy}
                    onChange={(e) => onSortChange(e.target.value as 'recent' | 'alphabetical' | 'oldest')}
                    className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 cursor-pointer">
                    <option value="recent">Most Recent</option>
                    <option value="alphabetical">Alphabetical (A-Z)</option>
                    <option value="oldest">Oldest First</option>
                </select>
            </div>
        </div>
    )
}

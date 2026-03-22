"use client"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Filter, X } from "lucide-react"

export interface FilterOptions {
  search: string
  session?: string
  campus?: string
  sortBy?: string
}

interface FilterBarProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  totalCount: number
  filteredCount: number
  showSessionFilter?: boolean
  showCampusFilter?: boolean
  showSortBy?: boolean
  searchPlaceholder?: string
  sessionOptions?: { value: string; label: string }[]
  campusOptions?: { value: string; label: string }[]
  sortOptions?: { value: string; label: string }[]
}

export function FilterBar({
  filters,
  onFiltersChange,
  totalCount,
  filteredCount,
  showSessionFilter = false,
  showCampusFilter = false,
  showSortBy = true,
  searchPlaceholder = "Search...",
  sessionOptions = [],
  campusOptions = [],
  sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
  ],
}: FilterBarProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value })
  }

  const handleSessionChange = (value: string) => {
    onFiltersChange({ ...filters, session: value })
  }

  const handleCampusChange = (value: string) => {
    onFiltersChange({ ...filters, campus: value })
  }

  const handleSortChange = (value: string) => {
    onFiltersChange({ ...filters, sortBy: value })
  }

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      session: "all",
      campus: "all",
      sortBy: "newest",
    })
  }

  const hasActiveFilters =
    filters.search ||
    (filters.session && filters.session !== "all") ||
    (filters.campus && filters.campus !== "all")

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Filters</span>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Session Filter */}
        {showSessionFilter && sessionOptions.length > 0 && (
          <Select
            value={filters.session || "all"}
            onValueChange={handleSessionChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Session" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sessions</SelectItem>
              {sessionOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Campus Filter */}
        {showCampusFilter && campusOptions.length > 0 && (
          <Select
            value={filters.campus || "all"}
            onValueChange={handleCampusChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Campus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campuses</SelectItem>
              {campusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Sort By */}
        {showSortBy && (
          <Select
            value={filters.sortBy || "newest"}
            onValueChange={handleSortChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filteredCount} of {totalCount} items
      </div>
    </div>
  )
}

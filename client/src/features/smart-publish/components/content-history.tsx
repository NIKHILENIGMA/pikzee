import { ChevronRight, Search, UploadCloud } from 'lucide-react'
import { useState, type FC } from 'react'
import { Link } from 'react-router'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

import { useWorkspaceContext } from '@/features/workspace/hooks/use-workspace-context'
import { useUploadHistory } from '../api/get-upload-history'
import Loader from '@/components/loader/loader'

const ContentHistory: FC = () => {
    const { id: workspaceId } = useWorkspaceContext()
    const [searchQuery, setSearchQuery] = useState('')
    const [platformFilter, setPlatformFilter] = useState('all')

    const { data: historyItemsResponse, isLoading } = useUploadHistory({ workspaceId })
    const historyItems = historyItemsResponse?.data || []

    const filteredHistory = historyItems.filter((item) => {
        const matchesSearch =
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
        const matchesPlatform = platformFilter === 'all' || item.platform.toLowerCase() === platformFilter.toLowerCase()
        return matchesSearch && matchesPlatform
    })

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader />
            </div>
        )
    }

    if (historyItems.length === 0) {
        return (
            <section className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-20 text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                    <UploadCloud className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">No content published yet</h2>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                    Upload your first video to see your history and track your performance across platforms.
                </p>
                <Button
                    asChild
                    className="mt-8">
                    <Link to="/media-manager/upload">Upload Content</Link>
                </Button>
            </section>
        )
    }

    return (
        <section>
            <div className="mb-8">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">Content History</h2>
                <p className="mt-2 text-sm text-muted-foreground">Your recent published content across all platforms</p>
            </div>

            {/* Search and Filter */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search by title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select
                    value={platformFilter}
                    onValueChange={setPlatformFilter}>
                    <SelectTrigger className="w-full max-w-48">
                        <SelectValue placeholder="All Platforms" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Select Platform</SelectLabel>
                            <SelectItem value="all">All Platforms</SelectItem>
                            <SelectItem value="youtube">YouTube</SelectItem>
                            <SelectItem value="linkedin">LinkedIn</SelectItem>
                            <SelectItem value="twitter">Twitter</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            {/* History Items */}
            <div className="space-y-4">
                {filteredHistory.map((item) => (
                    <Card
                        key={item.id}
                        className="group overflow-hidden transition-all hover:shadow-md hover:border-primary/50">
                        <div className="flex gap-6 p-6">
                            {/* Thumbnail Placeholder */}
                            <div className="relative h-28 w-40 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
                                <div className="h-full w-full flex items-center justify-center">
                                    <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-primary to-secondary opacity-30" />
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary/40">{item.platform}</span>
                                </div>
                            </div>

                            {/* Content Details */}
                            <div className="flex flex-1 flex-col justify-between">
                                <div>
                                    <div className="mb-1 flex items-center gap-2">
                                        <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                            {item.title}
                                        </h3>
                                        <Badge
                                            variant="secondary"
                                            className="text-[10px] uppercase">
                                            {item.status}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                                </div>
                                <div className="flex items-center justify-between pt-2">
                                    <p className="text-xs text-muted-foreground">
                                        {item.status === 'PUBLISHED'
                                            ? `Published ${new Date(item.publishedAt || item.createdAt).toLocaleDateString()}`
                                            : `Created ${new Date(item.createdAt).toLocaleDateString()}`}
                                    </p>
                                    <Badge variant="outline">{item.platform}</Badge>
                                </div>
                            </div>

                            {/* Action */}
                            <div className="flex items-center">
                                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {filteredHistory.length === 0 && (
                <div className="rounded-lg border border-dashed border-border bg-muted/30 py-12 text-center">
                    <p className="text-muted-foreground">No content found matching your search and filter</p>
                </div>
            )}
        </section>
    )
}

export default ContentHistory

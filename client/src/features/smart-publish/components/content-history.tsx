import { ChevronRight, Search } from 'lucide-react'
import { useState, type FC } from 'react'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

import type { HistoryItem } from '../types/content'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ContentHistoryProps {
    historyItems: HistoryItem[]
}

const ContentHistory: FC<ContentHistoryProps> = ({ historyItems }) => {
    const [searchQuery, setSearchQuery] = useState('')
    const filteredHistory = historyItems.filter(
        (item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

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
                <Select>
                    <SelectTrigger className="w-full max-w-48">
                        <SelectValue placeholder="All Platforms" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>
                                Select Platform
                            </SelectLabel>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="youtube">YouTube</SelectItem>
                            <SelectItem value="linkedin">LinkedIn</SelectItem>
                            <SelectItem value="twitter">Twitter</SelectItem>
                            {/* <SelectItem value="tiktok">TikTok</SelectItem> */}
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
                            {/* Thumbnail */}
                            <div className="relative h-28 w-40 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
                                {item.thumbnail ? (
                                    <img
                                        src={item.thumbnail}
                                        alt={item.title}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center">
                                        <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-primary to-secondary opacity-30" />
                                    </div>
                                )}
                            </div>

                            {/* Content Details */}
                            <div className="flex flex-1 flex-col justify-between">
                                <div>
                                    <h3 className="mb-2 text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                                </div>
                                <div className="flex items-center justify-between pt-2">
                                    <p className="text-xs text-muted-foreground">Published {new Date(item.publishDate).toLocaleDateString()}</p>
                                    <Badge className={''}>
                                        <span className={''}>{item.platform}</span>
                                    </Badge>
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
                    <p className="text-muted-foreground">No content found matching your search</p>
                </div>
            )}
        </section>
    )
}

export default ContentHistory

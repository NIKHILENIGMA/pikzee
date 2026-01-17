import type { FC, ReactNode } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import type { SortOrder } from '../types'

interface SortFilterProps {
    children: ReactNode
    order: SortOrder
    onOrderChange: (order: SortOrder) => void
}

const SortFilter: FC<SortFilterProps> = ({ children, order, onOrderChange }) => {
    return (
        <Popover>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent
                align="start"
                className="w-44">
                <div>
                    <h4 className="text-sm font-medium mb-2">Sort by</h4>
                    <Select
                        value={order}
                        onValueChange={onOrderChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sort Order" />
                        </SelectTrigger>
                        <SelectContent className="p-2 w-52">
                            <SelectItem value="asc">A - Z</SelectItem>
                            <SelectItem value="desc">Z - A</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default SortFilter

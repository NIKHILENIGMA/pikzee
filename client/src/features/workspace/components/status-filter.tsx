import { type FC, type ReactNode } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface StatusFilterProps {
    children: ReactNode
    status: 'all' | 'active' | 'inactive'
    onStatusChange: (status: 'all' | 'active' | 'inactive') => void
}

const StatusFilter: FC<StatusFilterProps> = ({ children, status = 'all', onStatusChange }) => {
    return (
        <Popover>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent
                align="start"
                className="w-44">
                <div>
                    <h4 className="text-sm font-medium mb-2">Filter by</h4>
                    <Select
                        value={status}
                        onValueChange={onStatusChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Filter by Status" />
                        </SelectTrigger>
                        <SelectContent className="p-2 w-52">
                            <SelectItem value="all">All Projects</SelectItem>
                            <SelectItem value="active">Active Projects</SelectItem>
                            <SelectItem value="inactive">Inactive Projects</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default StatusFilter

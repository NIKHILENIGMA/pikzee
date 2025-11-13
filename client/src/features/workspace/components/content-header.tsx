import { MoreHorizontalIcon, User } from 'lucide-react'
import { type FC } from 'react'
import { useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'

interface ContentHeaderProps {
    name: string
    noOfProjects: number
    onShowMembers: () => void
    onSettingsOpen: () => void
    members?: {
        userId: string
        name: string
        email: string
        permission: string
        avatar?: string
    }[]
}

const ContentHeader: FC<ContentHeaderProps> = ({ name, noOfProjects, onShowMembers, members }) => {
    const navigate = useNavigate()
    const displayMembers = members && members.length > 0 ? members.slice(0, 3) : []

    return (
        <div className="w-full flex justify-between mb-4 font-medium text-xl">
            <div className="flex flex-col">
                <div className="text-2xl font-bold">{name}</div>
                <div className="text-sm text-muted-foreground">{noOfProjects} Projects</div>
            </div>
            <div className="flex items-center">
                {members && members.length > 0 ? (
                    <>
                        {displayMembers.map((member, index) => (
                            <div
                                key={member.userId}
                                className="w-7 h-7 rounded-full overflow-hidden border-2 border-border flex-shrink-0 cursor-pointer"
                                style={{
                                    zIndex: displayMembers.length - index,
                                    marginLeft: index === 0 ? 0 : -10
                                }}
                                onClick={onShowMembers}
                                title={member.name}>
                                {member.avatar ? (
                                    <img
                                        src={member.avatar || '/placeholder.svg'}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            // Fallback to initials if image fails
                                            const target = e.target as HTMLImageElement
                                            target.style.display = 'none'
                                            const parent = target.parentElement
                                            if (parent) {
                                                const initials = member.name
                                                    .split(' ')
                                                    .map((n) => n[0])
                                                    .join('')
                                                    .toUpperCase()
                                                parent.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-primary text-primary-foreground text-xs font-semibold">${initials}</div>`
                                            }
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground text-xs font-semibold">
                                        {member.name
                                            .split(' ')
                                            .map((n) => n[0])
                                            .join('')
                                            .toUpperCase()}
                                    </div>
                                )}
                            </div>
                        ))}
                    </>
                ) : (
                    <div
                        className="w-7 h-7 rounded-full bg-muted flex items-center justify-center border border-primary cursor-pointer hover:bg-muted/80 transition-colors"
                        onClick={onShowMembers}>
                        <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                )}

                <Button
                    variant={'link'}
                    onClick={() => navigate('/settings/workspace')}>
                    <MoreHorizontalIcon />
                </Button>
            </div>
        </div>
    )
}

export default ContentHeader

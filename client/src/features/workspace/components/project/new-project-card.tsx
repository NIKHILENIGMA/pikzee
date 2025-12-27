import { Plus } from 'lucide-react'

import { Card } from '@/components/ui/card'

import { CreateProjectDialog } from './create-project-dialog'

export function NewProjectCard() {
    return (
        <CreateProjectDialog>
            <Card className="bg-card border-border hover:border-border/50 transition-all cursor-pointer group">
                <div className="aspect-4/3 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#1a1d29] group-hover:bg-indigo-600/20 flex items-center justify-center transition-colors">
                        <Plus className="h-6 w-6 text-gray-400 group-hover:text-indigo-400 transition-colors" />
                    </div>
                    <p className="text-gray-400 group-hover:text-gray-300 mt-4 text-sm transition-colors">New Project</p>
                </div>
            </Card>
        </CreateProjectDialog>
    )
}

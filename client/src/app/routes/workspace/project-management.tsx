import { MoreHorizontal } from 'lucide-react'
import type { FC } from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import { SidebarNav } from '@/features/dashboard/components/project/sidebar-nav'
import { ToolbarChips } from '@/features/dashboard/components/project/toolbar-chips'
import { Topbar } from '@/features/dashboard/components/project/topbar'

const ProjectManagement: FC = () => {
    return (
        <div className="h-screen w-full bg-background text-foreground minimal-scrollbar">
            <Topbar />
            <div className="flex h-[calc(100dvh-56px)]">
                <SidebarNav />
                <main className="flex-1 overflow-y-auto">
                    <div className="border-b border-border">
                        <ToolbarChips />
                    </div>

                    <div className="px-14 py-2 flex items-center">
                        <Checkbox /> <span className="ml-2 text-sm text-foreground/80">5 Folders</span>
                    </div>
                    {/* Folder Section */}
                    <section className="px-14 py-10 grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div
                                className="relative w-full aspect-[627/470] rounded-b-md"
                                key={index}>
                                {/* Outer Folder Border */}
                                <svg
                                    className="w-full h-full block text-secondary/45 fill-current"
                                    viewBox="0 0 627 452"
                                    preserveAspectRatio="xMidYMid meet"
                                    role="img"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        fill="currentColor"
                                        strokeWidth="8"
                                        strokeLinejoin="round"
                                        d="M161.338 0C167.364 0 172.923 2.96731 177.081 7.32871C190.985 21.9122 210.602 31 232.342 31H608C618.493 31 627 39.5066 627 50V433C627 443.493 618.493 452 608 452H19C8.50657 452 0 443.493 0 433V19C0 8.50659 8.50659 0 19 0H161.338Z"
                                    />
                                </svg>

                                {/* Inner Folder Content */}
                                <div className="folder-content absolute inset-0 top-4.5 w-full h-full bg-secondary rounded-md shadow-2xl flex flex-col justify-between text-foreground">
                                    <div className="p-4 text-sm font-medium">
                                        <Checkbox className="peer" />
                                    </div>
                                    <div className="w-full mt-auto">
                                        <div className="w-full font-semibold px-4">
                                            <p className="text-md">Folder Name</p>
                                        </div>
                                        <div className="w-full flex justify-between items-center px-4 py-1.5">
                                            <p className="text-sm font-medium text-foreground/60">No Items 15</p>
                                            <MoreHorizontal />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>
                </main>
            </div>
        </div>
    )
}

export default ProjectManagement

{
    /* <div className="relative w-[16rem] h-48 rounded-b-2xl overflow-hidden">
    <div className="folder-extended"></div>
    <div className="folder-content absolute top-4.5 left-0 z-30 bg-accent px-2 py-1 rounded-md w-full h-full shadow-xl inset-shadow-sm"></div>
</div> */
}
{
    /* <div className="folder-content absolute top-4.5 left-0.5 z-
                            30 bg-secondary px-2 py-1 rounded-md w-full h-full shadow-background shadow-lg"></div> */
}
